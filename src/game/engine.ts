import type { AnimFrame, Character, Dir, Gem, Npc, Villager, WorldData } from "@/game/types";
import {
  buildMinimap,
  buildObjects,
  buildStaticWorld,
  drawWaterTile,
  MINI,
  spriteCanvas,
  WorldColors,
  type WorldObject,
} from "@/game/render";

export type Trigger = {
  id: string;
  /** world-px centre of the interaction spot */
  cx: number;
  cy: number;
  type: "project" | "about" | "contact" | "villager";
  payload?: string;
};

export type InputKey = "up" | "down" | "left" | "right";

export type EngineCallbacks = {
  onTrigger: (t: Trigger) => void;
  /** nearest interactable changed (null = nothing in reach) */
  onNear?: (t: Trigger | null) => void;
  onPickup?: (gemId: string) => void;
  onStep?: () => void;
  /** boot progress 0..1 while assets build */
  onLoad?: (p: number) => void;
};

export type EngineContent = {
  world: WorldData;
  character: Character;
  gems: Gem[];
  villagers: Villager[];
  npcs: Npc[];
};

const T = 16;
const SPEED = 76; // world px / sec
const NPC_SPEED = 26;
const ENTER_R = 11; // walk-in radius (px) around a door's front spot
const REACH_R = 26; // Enter / A interaction radius
const HINT_R = REACH_R; // the prompt only shows where Enter actually works
const SLIDE = 7; // px of corner forgiveness when bumping an edge
const GEM_R = 10;

type Actor = {
  x: number;
  y: number;
  dir: Dir;
  step: AnimFrame;
  animT: number;
  walkPhase: number;
  moving: boolean;
};

type Walker = Actor & {
  v: Villager;
  npc: Npc;
  tx: number; // wander target (world px)
  ty: number;
  wait: number;
};

type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number };

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private world: WorldData;
  private character: Character;
  private content: EngineContent;
  private cb: EngineCallbacks;

  private staticCanvas!: HTMLCanvasElement;
  private objects: WorldObject[] = [];
  private pixelFont = "monospace";
  private solid: boolean[][] = [];
  private triggers: Trigger[] = [];

  private minimap: HTMLCanvasElement | null = null;
  private miniBase: HTMLCanvasElement | null = null;
  private visited = new Set<string>();
  private collected = new Set<string>();
  private talked = new Set<string>();

  private walkers: Walker[] = [];
  private particles: Particle[] = [];
  private clouds: { x: number; y: number; w: number; h: number; v: number }[] = [];

  input: Record<InputKey, boolean> = { up: false, down: false, left: false, right: false };
  private player: Actor & { idleBreath: 0 | 1 } = {
    x: 0,
    y: 0,
    dir: "down",
    moving: false,
    step: 0,
    animT: 0,
    walkPhase: 0,
    idleBreath: 0,
  };
  private cam = { x: 0, y: 0 };
  private camSnapped = false;
  private scale = 3;
  private raf = 0;
  private last = 0;
  private time = 0;
  private stepT = 0;
  private paused = false;
  private attract = false;
  private attractT = 0;
  private disarmed: string | null = null;
  private near: Trigger | null = null;
  private ready = false;
  private reduceMotion = false;

  constructor(canvas: HTMLCanvasElement, content: EngineContent, cb: EngineCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.content = content;
    this.world = content.world;
    this.character = content.character;
    this.cb = cb;
    this.player.x = this.world.spawn.tx * T;
    this.player.y = this.world.spawn.ty * T;
    this.reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.buildGrid();
    this.spawnWalkers();
    const W = this.world.cols * T;
    const H = this.world.rows * T;
    this.clouds = [0, 1, 2, 3].map((i) => ({
      x: (i * W) / 4 + i * 37,
      y: ((i * 173) % H) + 40,
      w: 150 + (i % 2) * 60,
      h: 56 + (i % 3) * 14,
      v: 5 + i * 1.5,
    }));
  }

  /** Build assets (reporting progress), then run the loop. Safe to call once. */
  async start() {
    if (this.ready) return;
    const report = (p: number) => this.cb.onLoad?.(p);
    report(0.05);
    if (typeof document !== "undefined" && "fonts" in document) {
      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }
    }
    report(0.3);
    await nextFrame();
    this.pixelFont = this.resolvePixelFont();
    this.staticCanvas = buildStaticWorld(this.world);
    report(0.55);
    await nextFrame();
    this.objects = buildObjects(this.world);
    report(0.8);
    await nextFrame();
    // prewarm every sprite frame so the first steps never hitch
    const looks = [
      { palette: this.character.palette, hat: "none" as const },
      ...this.content.npcs.map((n) => ({ palette: n.palette, hat: n.hat })),
    ];
    for (const l of looks)
      for (const d of ["down", "up", "left", "right"] as Dir[])
        for (const f of [0, 1, 2, 3] as AnimFrame[]) spriteCanvas(l.palette, d, f, l.hat);
    this.resize();
    report(1);
    this.ready = true;
    this.last = performance.now();
    this.loop(this.last);
  }

  /** Canvas can't parse CSS var(); resolve the real family from a .pixel probe. */
  private resolvePixelFont(): string {
    try {
      const probe = document.createElement("span");
      probe.className = "pixel";
      probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
      probe.textContent = ".";
      document.body.appendChild(probe);
      const fam = getComputedStyle(probe).fontFamily;
      document.body.removeChild(probe);
      return fam && fam.trim() ? fam : "monospace";
    } catch {
      return "monospace";
    }
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }

  setPaused(p: boolean) {
    this.paused = p;
    this.clearInput();
    if (!p) this.last = performance.now();
  }

  /** New Game: player back to spawn, villagers home, effects cleared. */
  reset() {
    this.player.x = this.world.spawn.tx * T;
    this.player.y = this.world.spawn.ty * T;
    this.player.dir = "down";
    this.player.step = 0;
    this.spawnWalkers();
    this.particles = [];
    this.disarmed = null;
    this.near = null;
    this.cb.onNear?.(null);
    this.camSnapped = false;
    this.clearInput();
  }

  /** Title-screen mode: the camera drifts around town, the player idles. */
  setAttract(on: boolean) {
    this.attract = on;
    this.camSnapped = false;
    this.clearInput();
  }

  setInput(key: InputKey, on: boolean) {
    this.input[key] = on;
  }

  clearInput() {
    this.input = { up: false, down: false, left: false, right: false };
  }

  /** Enter / Space / A: use whatever is within reach, regardless of facing. */
  interact(): boolean {
    if (this.paused || this.attract || !this.ready) return false;
    const hit = this.nearestTrigger();
    if (!hit || hit.d > REACH_R) return false;
    this.fire(hit.t);
    return true;
  }

  setProgress(p: { visited: Iterable<string>; gems: Iterable<string>; talked: Iterable<string> }) {
    this.visited = new Set(p.visited);
    this.collected = new Set(p.gems);
    this.talked = new Set(p.talked);
    this.miniBase = null; // rebuilt lazily on the next frame
  }

  attachMinimap(canvas: HTMLCanvasElement | null) {
    this.minimap = canvas;
    if (canvas) {
      canvas.width = this.world.cols * MINI;
      canvas.height = this.world.rows * MINI;
    }
  }

  /** Player position in CSS px (for the iris transition's focal point). */
  playerScreen(): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const k = rect.width / this.canvas.width;
    return {
      x: rect.left + (this.player.x + 8 - this.cam.x) * this.scale * k,
      y: rect.top + (this.player.y + 12 - this.cam.y) * this.scale * k,
    };
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(320, Math.floor(rect.width * dpr));
    const h = Math.max(240, Math.floor(rect.height * dpr));
    this.canvas.width = w;
    this.canvas.height = h;
    // integer scale: aim for ~24×14 tiles so a whole district reads at once —
    // narrow phones get ~13 wide so sprites and signs stay a comfortable size
    const narrow = rect.width < 640;
    const s = Math.max(2, Math.floor(Math.min(w / (T * (narrow ? 13 : 24)), h / (T * (narrow ? 12 : 14)))));
    this.scale = s;
    this.ctx.imageSmoothingEnabled = false;
    this.camSnapped = false;
  }

  /* ------------------------------------------------------------ setup */

  private buildGrid() {
    const { cols, rows } = this.world;
    this.solid = Array.from({ length: cols }, () => Array<boolean>(rows).fill(false));
    const set = (tx: number, ty: number) => {
      if (tx >= 0 && tx < cols && ty >= 0 && ty < rows) this.solid[tx][ty] = true;
    };
    for (let x = 0; x < cols; x++)
      for (let y = 0; y < rows; y++)
        if (x < 2 || y < 2 || x >= cols - 2 || y >= rows - 2) set(x, y);
    const fillRect = (r: { tx?: number; ty?: number; x?: number; y?: number; w: number; h: number }) => {
      const bx = r.tx ?? r.x ?? 0;
      const by = r.ty ?? r.y ?? 0;
      for (let x = bx; x < bx + r.w; x++) for (let y = by; y < by + r.h; y++) set(x, y);
    };
    this.world.buildings.forEach((b) => fillRect(b));
    fillRect(this.world.about);
    this.world.water.forEach((w) => fillRect(w));
    this.world.trees.forEach((t) => set(t.x, t.y));
    this.world.signs.forEach((s) => set(s.tx, s.ty));
    set(this.world.mailbox.tx, this.world.mailbox.ty);

    // triggers: the spot just in front of each door, centred on the drawn door
    const front = (tx: number, ty: number, w: number, h: number) => ({ cx: (tx + w / 2) * T, cy: (ty + h) * T + 6 });
    this.world.buildings.forEach((b) =>
      this.triggers.push({ id: b.id, ...front(b.tx, b.ty, b.w, b.h), type: "project", payload: b.projectId }),
    );
    const a = this.world.about;
    this.triggers.push({ id: "about", ...front(a.tx, a.ty, a.w, a.h), type: "about" });
    const m = this.world.mailbox;
    this.triggers.push({ id: "contact", ...front(m.tx, m.ty, 1, 1), type: "contact" });
  }

  private spawnWalkers() {
    this.walkers = this.content.villagers.flatMap((v) => {
      const npc = this.content.npcs.find((n) => n.id === v.npc);
      if (!npc) return [];
      const x = v.home.tx * T;
      const y = v.home.ty * T - 6;
      return [{ v, npc, x, y, tx: x, ty: y, wait: 1 + Math.random() * 2, dir: "down" as Dir, step: 0 as AnimFrame, animT: 0, walkPhase: 0, moving: false }];
    });
  }

  /* ------------------------------------------------------------ collision */

  private isSolidAt(wx: number, wy: number): boolean {
    const tx = Math.floor(wx / T);
    const ty = Math.floor(wy / T);
    if (tx < 0 || ty < 0 || tx >= this.world.cols || ty >= this.world.rows) return true;
    return this.solid[tx][ty];
  }

  // feet hitbox (shared by player + villagers)
  /** Player-only: villagers are solid to the player (they step aside on their own). */
  private blockedByWalker(x: number, y: number): boolean {
    const fx = x + 7.5;
    const fy = y + 18;
    return this.walkers.some((w) => Math.abs(this.feet(w).x - fx) < 9 && Math.abs(this.feet(w).y - fy) < 5);
  }

  private canMove(a: Actor, x: number, y: number): boolean {
    if (!this.canBeAt(x, y)) return false;
    if (a !== this.player) return true;
    // never trap the player if they already overlap someone
    return !this.blockedByWalker(x, y) || this.blockedByWalker(a.x, a.y);
  }

  private canBeAt(x: number, y: number): boolean {
    const l = x + 4;
    const r = x + 11;
    const t = y + 15;
    const b = y + 21;
    return !(this.isSolidAt(l, t) || this.isSolidAt(r, t) || this.isSolidAt(l, b) || this.isSolidAt(r, b));
  }

  private feet(a: { x: number; y: number } = this.player) {
    return { x: a.x + 7.5, y: a.y + 18 };
  }

  /** Doors + villagers (villagers move, so their spots are computed live). */
  private candidates(): Trigger[] {
    const live = this.walkers.map((w) => {
      const f = this.feet(w);
      return { id: w.v.id, cx: f.x, cy: f.y, type: "villager" as const, payload: w.v.id };
    });
    return [...this.triggers, ...live];
  }

  private nearestTrigger(): { t: Trigger; d: number } | null {
    const f = this.feet();
    let best: { t: Trigger; d: number } | null = null;
    for (const t of this.candidates()) {
      const d = Math.hypot(t.cx - f.x, t.cy - f.y);
      if (!best || d < best.d) best = { t, d };
    }
    return best;
  }

  private fire(t: Trigger) {
    this.disarmed = t.id;
    if (t.type === "villager") {
      // the villager turns to face you
      const w = this.walkers.find((x) => x.v.id === t.payload);
      if (w) {
        const dx = this.player.x - w.x;
        const dy = this.player.y - w.y;
        w.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
        w.moving = false;
        w.step = 0;
        w.wait = 2.5;
      }
    }
    this.setPaused(true);
    this.cb.onTrigger(t);
  }

  /** Move along one axis; if blocked, slide round a corner that's only a few px off. */
  private moveAxis(a: Actor, dx: number, dy: number, step: number, slide = true): boolean {
    if (this.canMove(a, a.x + dx, a.y + dy)) {
      a.x += dx;
      a.y += dy;
      return true;
    }
    if (!slide) return false;
    const ux = dy !== 0 ? 1 : 0; // perpendicular unit vector
    const uy = dx !== 0 ? 1 : 0;
    for (let k = 1; k <= SLIDE; k++) {
      for (const sgn of [-1, 1]) {
        if (!this.canMove(a, a.x + sgn * k * ux + dx, a.y + sgn * k * uy + dy)) continue;
        const n = Math.min(step, k);
        const nx = a.x + sgn * n * ux;
        const ny = a.y + sgn * n * uy;
        if (this.canMove(a, nx, ny)) {
          a.x = nx;
          a.y = ny;
        }
        return true;
      }
    }
    return false;
  }

  private animate(a: Actor, dt: number, moving: boolean) {
    a.moving = moving;
    if (moving) {
      // 4-beat walk: stride-left → contact → stride-right → contact
      a.animT += dt;
      if (a.animT >= 0.13) {
        a.animT -= 0.13;
        a.walkPhase = (a.walkPhase + 1) % 4;
      }
      const WALK: AnimFrame[] = [1, 0, 3, 0];
      a.step = WALK[a.walkPhase];
    } else {
      a.walkPhase = 0;
      a.step = 0;
    }
  }

  /* ------------------------------------------------------------ update */

  private update(dt: number) {
    const p = this.player;
    const inx = (this.input.right ? 1 : 0) - (this.input.left ? 1 : 0);
    const iny = (this.input.down ? 1 : 0) - (this.input.up ? 1 : 0);
    let vx = inx;
    let vy = iny;
    const moving = inx !== 0 || iny !== 0;
    if (vx !== 0 && vy !== 0) {
      const inv = 1 / Math.sqrt(2);
      vx *= inv;
      vy *= inv;
    }
    if (moving) {
      if (Math.abs(iny) >= Math.abs(inx)) p.dir = iny > 0 ? "down" : "up";
      else p.dir = inx > 0 ? "right" : "left";
    }

    const step = SPEED * dt;
    const bx = p.x;
    const by = p.y;
    if (vx && vy) {
      if (this.canMove(p, p.x + vx * step, p.y)) p.x += vx * step;
      if (this.canMove(p, p.x, p.y + vy * step)) p.y += vy * step;
    } else if (vx) this.moveAxis(p, vx * step, 0, step);
    else if (vy) this.moveAxis(p, 0, vy * step, step);
    const actuallyMoved = Math.abs(p.x - bx) + Math.abs(p.y - by) > 0.01;

    this.animate(p, dt, moving);
    if (!moving) {
      p.animT += dt;
      if (p.animT >= 0.6) {
        p.animT -= 0.6;
        p.idleBreath = p.idleBreath ? 0 : 1;
      }
      p.step = this.reduceMotion ? 0 : p.idleBreath ? 2 : 0;
    }

    // footsteps: dust puff + a soft tick
    if (actuallyMoved) {
      this.stepT += dt;
      if (this.stepT > 0.26) {
        this.stepT = 0;
        this.cb.onStep?.();
        if (!this.reduceMotion) {
          const f = this.feet();
          for (let i = 0; i < 3; i++)
            this.particles.push({ x: f.x + (Math.random() - 0.5) * 6, y: f.y + 2, vx: (Math.random() - 0.5) * 10, vy: -6 - Math.random() * 8, life: 0, max: 0.45, color: "#e8d3a8", size: 1 + (i % 2) });
        }
      }
    }

    // gems
    const f = this.feet();
    for (const g of this.content.gems) {
      if (this.collected.has(g.id)) continue;
      const gx = g.tx * T + 8;
      const gy = g.ty * T + 10;
      if (Math.hypot(gx - f.x, gy - f.y) < GEM_R) {
        this.collected.add(g.id);
        this.miniBase = null;
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          this.particles.push({ x: gx, y: gy - 4, vx: Math.cos(a) * 40, vy: Math.sin(a) * 40 - 10, life: 0, max: 0.6, color: i % 2 ? g.color : "#ffffff", size: 2 });
        }
        this.cb.onPickup?.(g.id);
      }
    }

    // proximity: re-arm, notify, walk-in
    const hit = this.nearestTrigger();
    if (this.disarmed && (!hit || hit.t.id !== this.disarmed || hit.d > HINT_R)) this.disarmed = null;

    const nearNow = hit && hit.d <= HINT_R ? hit.t : null;
    if (nearNow?.id !== this.near?.id) {
      this.near = nearNow;
      this.cb.onNear?.(nearNow);
    }

    // Walking *into* a door (pressing up at its front spot) enters it. Strolling
    // past along the road never does — Enter / A covers deliberate interaction.
    if (hit && hit.t.type !== "villager" && !this.disarmed && hit.d <= ENTER_R && this.input.up && p.dir === "up") {
      this.fire(hit.t);
    }
  }

  private updateWalkers(dt: number) {
    const pf = this.feet();
    for (const w of this.walkers) {
      const wf = this.feet(w);
      // stop and look at the player when they come close
      if (!this.attract && Math.hypot(wf.x - pf.x, wf.y - pf.y) < 20) {
        const dx = pf.x - wf.x;
        const dy = pf.y - wf.y;
        w.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
        this.animate(w, dt, false);
        continue;
      }
      if (w.wait > 0) {
        w.wait -= dt;
        this.animate(w, dt, false);
        if (w.wait <= 0) {
          // pick a new nearby target inside the wander box
          const r = w.v.range * T;
          w.tx = w.v.home.tx * T + (Math.random() * 2 - 1) * r;
          w.ty = w.v.home.ty * T - 6 + (Math.random() * 2 - 1) * r;
        }
        continue;
      }
      const dx = w.tx - w.x;
      const dy = w.ty - w.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 2) {
        w.wait = 1.2 + Math.random() * 2.5;
        continue;
      }
      const step = NPC_SPEED * dt;
      // move on the dominant axis first — reads as grid-like, RPG-style walking
      const horiz = Math.abs(dx) > Math.abs(dy);
      const ok = horiz
        ? this.moveAxis(w, Math.sign(dx) * Math.min(step, Math.abs(dx)), 0, step, false)
        : this.moveAxis(w, 0, Math.sign(dy) * Math.min(step, Math.abs(dy)), step, false);
      w.dir = horiz ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      this.animate(w, dt, ok);
      if (!ok) w.wait = 0.6 + Math.random();
    }
  }

  private updateParticles(dt: number) {
    for (const pt of this.particles) {
      pt.life += dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vy += 30 * dt;
    }
    this.particles = this.particles.filter((pt) => pt.life < pt.max);
  }

  private updateClouds(dt: number) {
    if (this.reduceMotion) return;
    const W = this.world.cols * T;
    for (const c of this.clouds) {
      c.x += c.v * dt;
      if (c.x > W + c.w) c.x = -c.w;
    }
  }

  /* ------------------------------------------------------------ render */

  private drawText(t: { text: string; x: number; y: number; size: number; color: string }, camX: number, camY: number) {
    const s = this.scale;
    const ctx = this.ctx;
    // Silkscreen is designed on an 8px grid — snap to it for crisp glyphs
    const size = Math.max(8, Math.floor((t.size * s * 1.25) / 8) * 8);
    ctx.font = `${size}px ${this.pixelFont}`;
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, Math.round((t.x - camX) * s), Math.round((t.y - camY) * s));
  }

  private cameraTarget(viewW: number, viewH: number) {
    const worldW = this.world.cols * T;
    const worldH = this.world.rows * T;
    const clampCam = (v: number, max: number) => (max < 0 ? max / 2 : Math.max(0, Math.min(max, v)));
    let fx = this.player.x + 8;
    let fy = this.player.y + 11;
    if (this.attract) {
      // slow lissajous drift across the whole town
      const t = this.attractT * 0.05;
      fx = worldW / 2 + Math.sin(t) * (worldW * 0.3);
      fy = worldH / 2 + Math.sin(t * 1.7) * (worldH * 0.22);
    }
    return { x: clampCam(fx - viewW / 2, worldW - viewW), y: clampCam(fy - viewH / 2, worldH - viewH) };
  }

  private render() {
    const ctx = this.ctx;
    const s = this.scale;
    const viewW = this.canvas.width / s;
    const viewH = this.canvas.height / s;

    const target = this.cameraTarget(viewW, viewH);
    if (this.reduceMotion || !this.camSnapped) {
      this.cam.x = target.x;
      this.cam.y = target.y;
      this.camSnapped = true;
    } else {
      const k = this.attract ? 0.04 : 0.12;
      this.cam.x += (target.x - this.cam.x) * k;
      this.cam.y += (target.y - this.cam.y) * k;
    }
    const camX = Math.round(this.cam.x);
    const camY = Math.round(this.cam.y);
    const sx = (wx: number) => Math.round((wx - camX) * s);
    const sy = (wy: number) => Math.round((wy - camY) * s);

    ctx.fillStyle = WorldColors.forestDark;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // static ground (visible region)
    ctx.drawImage(this.staticCanvas, camX, camY, viewW, viewH, 0, 0, viewW * s, viewH * s);

    // animated water on top of visible water tiles
    const frame = this.reduceMotion ? 0 : Math.floor(this.time * 1.6) % 2;
    for (const w of this.world.water) {
      for (let x = w.x; x < w.x + w.w; x++) {
        for (let y = w.y; y < w.y + w.h; y++) {
          const px = (x * T - camX) * s;
          const py = (y * T - camY) * s;
          if (px < -T * s || py < -T * s || px > this.canvas.width || py > this.canvas.height) continue;
          drawWaterTile(ctx, px, py, s, frame + x + y);
        }
      }
    }

    // doorway glow on the nearest interactable (doors only)
    const near = this.attract ? null : this.near;
    const door = near && near.type !== "villager" ? near : null;
    const glowX = door ? sx(door.cx - 8) : 0;
    const glowY = door ? sy(door.cy - 10) : 0;
    if (door) {
      const pulse = this.reduceMotion ? 0.5 : 0.5 + 0.5 * Math.sin(this.time * 5);
      ctx.globalAlpha = 0.25 + pulse * 0.25;
      ctx.fillStyle = "#ffe29a";
      ctx.fillRect(glowX, glowY, T * s, T * s);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#f0b94a";
      ctx.lineWidth = s;
      ctx.strokeRect(glowX + s / 2, glowY + s / 2, T * s - s, T * s - s);
    }

    // gems (on the ground layer, bobbing + glinting)
    for (const g of this.content.gems) {
      if (this.collected.has(g.id)) continue;
      const bob = this.reduceMotion ? 0 : Math.round(Math.sin(this.time * 3 + g.tx) * 1.5);
      const gx = g.tx * T + 4;
      const gy = g.ty * T + 3 + bob;
      if (gx + 8 < camX || gx > camX + viewW || gy + 12 < camY || gy > camY + viewH) continue;
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(sx(gx + 1), sy(g.ty * T + 13), 6 * s, 2 * s);
      // 8×9 faceted gem
      const rows: [number, number][] = [[2, 4], [1, 6], [0, 8], [0, 8], [1, 6], [2, 4], [3, 2]];
      rows.forEach(([o, w], i) => {
        ctx.fillStyle = "#120c09";
        ctx.fillRect(sx(gx + o - 0.5), sy(gy + i), (w + 1) * s, s);
      });
      rows.forEach(([o, w], i) => {
        ctx.fillStyle = i < 2 ? "#ffffff" : g.color;
        ctx.fillRect(sx(gx + o), sy(gy + i), w * s, s);
      });
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(sx(gx + 4), sy(gy + 2), 3 * s, 4 * s);
      if (!this.reduceMotion && Math.floor(this.time * 2 + g.tx) % 5 === 0) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(sx(gx + 6), sy(gy - 3), s, 3 * s);
        ctx.fillRect(sx(gx + 5), sy(gy - 2), 3 * s, s);
      }
    }

    // depth-sorted objects + actors (painter's algorithm on footprint bottom)
    const inView = (o: { x: number; y: number; w: number; h: number }) =>
      o.x + o.w > camX && o.x < camX + viewW && o.y + o.h > camY && o.y < camY + viewH;
    const list: { base: number; draw: () => void }[] = [];
    for (const o of this.objects) {
      if (!inView(o)) continue;
      list.push({
        base: o.baseY,
        draw: () => {
          ctx.drawImage(o.canvas, sx(o.x), sy(o.y), o.w * s, o.h * s);
          if (!o.texts.length) return;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          for (const t of o.texts) this.drawText(t, camX, camY);
        },
      });
    }
    const drawActor = (a: Actor, pal: Character["palette"], hat: Npc["hat"]) => {
      const px = sx(a.x);
      const py = sy(a.y);
      ctx.fillStyle = WorldColors.shadow;
      ctx.fillRect(px + 4 * s, py + 19 * s, 8 * s, 3 * s);
      const spr = spriteCanvas(pal, a.dir, a.step, hat);
      ctx.drawImage(spr, px, py, spr.width * s, spr.height * s);
    };
    for (const w of this.walkers) {
      if (!inView({ x: w.x, y: w.y - 12, w: 16, h: 34 })) continue;
      list.push({
        base: w.y + 21,
        draw: () => {
          drawActor(w, w.npc.palette, w.npc.hat);
          // "!" bubble over villagers you haven't met yet
          if (!this.talked.has(w.v.id) && !this.attract) {
            const bob = this.reduceMotion ? 0 : Math.round(Math.sin(this.time * 4) * 1);
            const bxp = w.x + 5;
            const byp = w.y - 11 + bob;
            ctx.fillStyle = "#120c09";
            ctx.fillRect(sx(bxp - 1), sy(byp - 1), 8 * s, 10 * s);
            ctx.fillStyle = "#fff";
            ctx.fillRect(sx(bxp), sy(byp), 6 * s, 8 * s);
            ctx.fillStyle = "#e46a4b";
            ctx.fillRect(sx(bxp + 2), sy(byp + 1), 2 * s, 4 * s);
            ctx.fillRect(sx(bxp + 2), sy(byp + 6), 2 * s, s);
          }
        },
      });
    }
    list.push({ base: this.player.y + 21, draw: () => drawActor(this.player, this.character.palette, "none") });
    list.sort((a, b) => a.base - b.base).forEach((d) => d.draw());

    // particles
    for (const pt of this.particles) {
      ctx.globalAlpha = 1 - pt.life / pt.max;
      ctx.fillStyle = pt.color;
      ctx.fillRect(sx(pt.x), sy(pt.y), pt.size * s, pt.size * s);
    }
    ctx.globalAlpha = 1;

    // drifting cloud shadows — stepped in 2-art-px rows so edges stay on the pixel grid
    if (!this.reduceMotion) {
      ctx.fillStyle = "rgba(20, 30, 50, 0.09)";
      for (const c of this.clouds) {
        if (c.x + c.w < camX || c.x - c.w > camX + viewW) continue;
        const blob = (cx: number, cy: number, rx: number, ry: number) => {
          for (let dy = -ry; dy < ry; dy += 2) {
            const k = 1 - ((dy + 1) / ry) ** 2;
            if (k <= 0) continue;
            const hw = Math.round((rx * Math.sqrt(k)) / 2) * 2;
            ctx.fillRect(sx(Math.round(cx / 2) * 2 - hw), sy(Math.round((cy + dy) / 2) * 2), hw * 2 * s, 2 * s);
          }
        };
        blob(c.x, c.y, c.w / 2, c.h / 2);
        blob(c.x + c.w * 0.3, c.y - c.h * 0.25, c.w / 3, c.h / 2.4);
      }
    }

    // bobbing marker above the door glow (last, so nothing hides it)
    if (door) {
      const bob = this.reduceMotion ? 0 : Math.round(Math.sin(this.time * 4) * 2) * s;
      ctx.fillStyle = "#120c09";
      ctx.fillRect(glowX + 4 * s, glowY - 10 * s + bob, 8 * s, 7 * s);
      ctx.fillStyle = "#f0b94a";
      ctx.fillRect(glowX + 5 * s, glowY - 9 * s + bob, 6 * s, 2 * s);
      ctx.fillRect(glowX + 6 * s, glowY - 7 * s + bob, 4 * s, s);
      ctx.fillRect(glowX + 7 * s, glowY - 6 * s + bob, 2 * s, s);
    }

    this.renderMinimap(camX, camY, viewW, viewH);
  }

  private renderMinimap(camX: number, camY: number, viewW: number, viewH: number) {
    const mm = this.minimap;
    if (!mm) return;
    if (!this.miniBase) this.miniBase = buildMinimap(this.world, this.visited);
    const m = mm.getContext("2d")!;
    m.imageSmoothingEnabled = false;
    m.drawImage(this.miniBase, 0, 0);
    const k = MINI / T;
    // remaining gems as tiny sparkles
    for (const g of this.content.gems) {
      if (this.collected.has(g.id)) continue;
      m.fillStyle = g.color;
      m.fillRect(g.tx * MINI, g.ty * MINI, 2, 2);
    }
    // villagers
    m.fillStyle = "#f6ead2";
    for (const w of this.walkers) m.fillRect(Math.round(this.feet(w).x * k) - 1, Math.round(this.feet(w).y * k) - 1, 2, 2);
    // viewport frame
    m.strokeStyle = "rgba(255,226,154,0.9)";
    m.lineWidth = 1;
    m.strokeRect(Math.round(camX * k) + 0.5, Math.round(camY * k) + 0.5, Math.round(viewW * k) - 1, Math.round(viewH * k) - 1);
    // player
    const f = this.feet();
    const blink = this.reduceMotion || Math.floor(this.time * 3) % 2 === 0;
    m.fillStyle = "#120c09";
    m.fillRect(Math.round(f.x * k) - 3, Math.round(f.y * k) - 3, 6, 6);
    m.fillStyle = blink ? "#ffffff" : "#f0b94a";
    m.fillRect(Math.round(f.x * k) - 2, Math.round(f.y * k) - 2, 4, 4);
  }

  private loop = (now: number) => {
    this.raf = requestAnimationFrame(this.loop);
    if (!this.ready) return;
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > 0.05) dt = 0.05;
    this.time += dt;
    if (this.attract) {
      this.attractT += dt;
      this.updateWalkers(dt);
    } else if (!this.paused) {
      this.update(dt);
      this.updateWalkers(dt);
    }
    this.updateParticles(dt);
    this.updateClouds(dt);
    this.render();
  };
}
