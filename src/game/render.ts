import type { AnimFrame, Building, BuildingSkin, Dir, HatKind, Palette, WorldData } from "@/game/types";

/* ==================================================================
 * Procedural pixel-art renderer. Everything is drawn in code at 1 art-px
 * per world-px; the engine blits scaled with image smoothing off.
 * ================================================================== */

export const SPRITE_W = 16;
export const SPRITE_H = 22;

const C = {
  grass: "#79b45a",
  grassDark: "#67a24c",
  grassLite: "#8cc668",
  path: "#d9bd8e",
  pathDark: "#c7a877",
  pathEdge: "#b8996a",
  water: "#57a6da",
  waterLite: "#8ccbef",
  waterDark: "#3f8cc4",
  forest: "#3f6b39",
  forestDark: "#335831",
  trunk: "#7a4a24",
  treeGreen: "#4f9a45",
  treeLite: "#63b455",
  treeDark: "#3d7a37",
  wall: "#efdcb4",
  wallShade: "#dcc596",
  wallDark: "#c9ad78",
  door: "#7a4428",
  doorLite: "#a8613a",
  win: "#ffe08a",
  winFrame: "#8a6a3a",
  wood: "#a9743f",
  woodDark: "#7d5228",
  accent: "#c84a3a",
  accent2: "#e0735c",
  accent3: "#ffe29a",
  brick: "#b0603a",
  brickDark: "#8f4a2b",
  glass: "#7fb2e6",
  glassDark: "#4a7fc0",
  awning: "#d94f43",
  banner: "#2b201a",
  bannerEdge: "#a8732a",
  inkDim: "#6f7c9a",
  flag: "#e0533b",
  shadow: "rgba(0,0,0,0.16)",
};

const ROOF: Record<string, [string, string]> = {
  design: ["#cf5f3e", "#a94a2e"],
  dev: ["#2f9090", "#237272"],
  agency: ["#caa23a", "#a4812a"],
  hub: ["#c98b4f", "#a56d38"],
};

/** Fill an integer pixel rect. */
function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

/** Deterministic 0..1 hash for tile speckle. */
function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/* ------------------------------------------------------------------ *
 * Character sprite
 * ------------------------------------------------------------------ */
/**
 * Draw the character facing `dir` on animation `frame`:
 *   0 = idle-neutral, 2 = idle-breath (torso settles 1px),
 *   1 = left-foot stride, 3 = right-foot stride (torso lifts 1px, arms swing).
 */
export function drawCharTo(
  ctx: CanvasRenderingContext2D,
  pal: Palette,
  dir: Dir,
  frame: AnimFrame = 0,
  hat: HatKind = "none",
) {
  const o = pal.outline;
  const face = dir;
  const side = dir === "left" || dir === "right";

  const bob = frame === 1 || frame === 3 ? -1 : frame === 2 ? 1 : 0; // upper-body lift/settle
  const stride = frame === 1 ? 1 : frame === 3 ? -1 : 0; // +1 left-foot leads, -1 right-foot leads

  // ---- legs / feet ----
  let lLegX = 4, rLegX = 9, lLegH = 4, rLegH = 4, lFootY = 20, rFootY = 20;
  if (stride !== 0) {
    if (!side) {
      // front / back: one leg reaches forward (lower), the other lifts
      if (stride > 0) { lLegH = 5; lFootY = 21; rLegH = 3; rFootY = 19; }
      else { rLegH = 5; rFootY = 21; lLegH = 3; lFootY = 19; }
    } else {
      // side: feet slide along the facing axis
      const fwd = dir === "right" ? 1 : -1;
      const front = stride > 0 ? 1 : -1;
      lLegX = 4 + fwd * front;
      rLegX = 9 - fwd * front;
      lFootY = front > 0 ? 21 : 19;
      rFootY = front > 0 ? 19 : 21;
    }
  }

  // silhouette / outline (upper body rides `bob`, legs anchored)
  px(ctx, 3, 2 + bob, 10, 15 - bob, o);
  px(ctx, lLegX, 16, 4, 6, o);
  px(ctx, rLegX, 16, 4, 6, o);

  // ---- head ----
  const hy = 3 + bob;
  px(ctx, 4, hy, 8, 7, pal.skin);
  px(ctx, 4, hy, 8, 2, pal.hair);
  if (face === "up") px(ctx, 4, hy, 8, 6, pal.hair);
  if (face === "left") px(ctx, 4, hy, 3, 6, pal.hair);
  if (face === "right") px(ctx, 9, hy, 3, 6, pal.hair);
  if (face === "down") {
    px(ctx, 6, hy + 3, 1, 2, o);
    px(ctx, 9, hy + 3, 1, 2, o);
  } else if (face === "left") {
    px(ctx, 5, hy + 3, 1, 2, o);
  } else if (face === "right") {
    px(ctx, 10, hy + 3, 1, 2, o);
  }

  // ---- torso + swinging arms ----
  const ty = 11 + bob;
  px(ctx, 4, ty, 8, 5 - bob, pal.shirt); // stretches to the hips when lifted
  const lArmY = ty + (stride > 0 ? 1 : stride < 0 ? -1 : 0);
  const rArmY = ty + (stride > 0 ? -1 : stride < 0 ? 1 : 0);
  px(ctx, 3, lArmY, 2, 4, pal.shirt);
  px(ctx, 11, rArmY, 2, 4, pal.shirt);
  px(ctx, 3, lArmY + 4, 2, 1, pal.skin);
  px(ctx, 11, rArmY + 4, 2, 1, pal.skin);

  // ---- legs / shoes ----
  px(ctx, lLegX, 16, 3, lLegH, pal.pants);
  px(ctx, rLegX, 16, 3, rLegH, pal.pants);
  px(ctx, lLegX, lFootY, 3, 2, pal.shoes);
  px(ctx, rLegX, rFootY, 3, 2, pal.shoes);

  // ---- hat (rides with the head) ----
  if (hat === "cap") {
    px(ctx, 3, hy - 2, 10, 2, pal.shirt);
    px(ctx, 3, hy, 4, 1, pal.shirt); // brim
    px(ctx, 3, hy - 3, 10, 1, o);
  } else if (hat === "band") {
    px(ctx, 4, hy + 1, 8, 1, C.flag);
  } else if (hat === "wizard") {
    px(ctx, 6, hy - 6, 4, 2, pal.shirt);
    px(ctx, 5, hy - 4, 6, 2, pal.shirt);
    px(ctx, 4, hy - 2, 8, 2, pal.shirt);
    px(ctx, 4, hy, 8, 1, C.win); // brim band
  }
}

const spriteCache = new Map<string, HTMLCanvasElement>();

export function spriteCanvas(pal: Palette, dir: Dir, frame: AnimFrame, hat: HatKind): HTMLCanvasElement {
  const key = `${pal.shirt}${pal.hair}${pal.skin}${dir}${frame}${hat}`;
  const cached = spriteCache.get(key);
  if (cached) return cached;
  const cv = document.createElement("canvas");
  cv.width = SPRITE_W;
  cv.height = SPRITE_H;
  const ctx = cv.getContext("2d")!;
  drawCharTo(ctx, pal, dir, frame, hat);
  spriteCache.set(key, cv);
  return cv;
}

/** For React overlays: paint a big crisp sprite into a target canvas. */
export function paintSprite(
  canvas: HTMLCanvasElement,
  pal: Palette,
  dir: Dir,
  frame: AnimFrame,
  hat: HatKind,
  scale: number,
) {
  const ctx = canvas.getContext("2d")!;
  canvas.width = SPRITE_W * scale;
  canvas.height = SPRITE_H * scale;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(spriteCanvas(pal, dir, frame, hat), 0, 0, canvas.width, canvas.height);
}

/* ------------------------------------------------------------------ *
 * World tiles + objects (drawn into the static offscreen at 1:1)
 * ------------------------------------------------------------------ */
const T = 16;

function grassTile(ctx: CanvasRenderingContext2D, gx: number, gy: number, tint: string) {
  px(ctx, gx, gy, T, T, tint);
  const h = hash(gx, gy);
  if (h > 0.72) px(ctx, gx + ((gx * 5) % 12), gy + ((gy * 7) % 12), 2, 2, C.grassDark);
  if (h < 0.2) px(ctx, gx + ((gx * 3) % 11) + 1, gy + ((gy * 11) % 11) + 1, 1, 1, C.grassLite);
  // grass tufts: little "^" blades so the field reads as texture, not flat fill
  const h2 = hash(gx + 31, gy + 17);
  if (h2 > 0.55) {
    const tx = gx + 2 + Math.floor(h2 * 9);
    const ty = gy + 3 + Math.floor(hash(gy, gx) * 9);
    px(ctx, tx, ty + 1, 1, 2, C.grassDark);
    px(ctx, tx + 1, ty, 1, 3, C.grassDark);
    px(ctx, tx + 2, ty + 1, 1, 2, C.grassDark);
    px(ctx, tx + 1, ty, 1, 1, C.grassLite);
  }
}

function pathTile(ctx: CanvasRenderingContext2D, gx: number, gy: number) {
  px(ctx, gx, gy, T, T, C.path);
  const h = hash(gx + 9, gy + 4);
  if (h > 0.6) px(ctx, gx + ((gx * 7) % 12), gy + ((gy * 5) % 12), 2, 1, C.pathDark);
}

export function drawWaterTile(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) {
  ctx.fillStyle = C.water;
  ctx.fillRect(x, y, T * s, T * s);
  ctx.fillStyle = C.waterLite;
  const off = (frame % 2) * 4 * s;
  ctx.fillRect(x + 2 * s + off * 0.1, y + 4 * s, 5 * s, 1 * s);
  ctx.fillStyle = C.waterDark;
  ctx.fillRect(x + 8 * s - off * 0.1, y + 10 * s, 5 * s, 1 * s);
}

/** A tall tree — ~2× the player's height. The trunk sits in its tile; the canopy rises above. */
function tree(ctx: CanvasRenderingContext2D, gx: number, gy: number) {
  const bx = gx * T;
  const by = gy * T;
  px(ctx, bx + 2, by + 13, 12, 3, C.shadow);
  px(ctx, bx + 3, by + 12, 10, 1, C.shadow);
  // trunk with a root flare
  px(ctx, bx + 6, by + 5, 4, 10, "#141019");
  px(ctx, bx + 7, by + 5, 2, 10, C.trunk);
  px(ctx, bx + 5, by + 14, 6, 1, "#141019");
  px(ctx, bx + 6, by + 13, 1, 1, C.trunk);
  px(ctx, bx + 9, by + 13, 1, 1, C.trunk);
  // canopy: stepped round crown, outline → dark → mid → highlight
  const rows: [number, number][] = [
    [5, 6], [3, 10], [2, 12], [1, 14], [1, 14], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [1, 14], [1, 14], [2, 12], [3, 10], [5, 6],
  ];
  const top = by - 12;
  rows.forEach(([o, w], i) => px(ctx, bx + o, top + i, w, 1, "#1f3d22"));
  rows.forEach(([o, w], i) => {
    if (w > 2) px(ctx, bx + o + 1, top + i + (i === 0 ? 1 : 0), w - 2, 1, C.treeDark);
  });
  rows.slice(1, -3).forEach(([o, w], i) => {
    if (w > 4) px(ctx, bx + o + 1, top + i + 1, w - 4, 1, C.treeGreen);
  });
  px(ctx, bx + 4, top + 3, 5, 2, C.treeLite);
  px(ctx, bx + 3, top + 5, 3, 2, C.treeLite);
  px(ctx, bx + 10, top + 8, 2, 1, C.treeLite);
  px(ctx, bx + 6, top + 10, 2, 1, C.treeLite);
}

function flower(ctx: CanvasRenderingContext2D, gx: number, gy: number) {
  const bx = gx * T;
  const by = gy * T;
  const cols = ["#f2b134", "#e0533b", "#e88fc0", "#ffffff"];
  const c = cols[Math.floor(hash(gx, gy) * cols.length) % cols.length];
  px(ctx, bx + 7, by + 9, 2, 4, C.treeDark);
  px(ctx, bx + 6, by + 7, 4, 3, c);
  px(ctx, bx + 7, by + 8, 2, 1, C.win);
}

/* -------- building parts (shared across skins) -------- */
function bShadow(ctx: CanvasRenderingContext2D, bx: number, by: number, w: number, h: number) {
  ctx.fillStyle = C.shadow;
  ctx.fillRect(bx + 2, by + h - 2, w - 2, 5);
}
function bWalls(ctx: CanvasRenderingContext2D, bx: number, by: number, w: number, h: number, top: number, tint = C.wall) {
  const wh = by + h - top;
  px(ctx, bx + 2, top, w - 4, wh, tint);
  px(ctx, bx + 2, top, 2, wh, C.wallShade);
  px(ctx, bx + w - 4, top, 2, wh, C.wallDark);
  px(ctx, bx + 2, by + h - 3, w - 4, 3, C.wallDark);
  // clapboard siding on plaster walls; stone footing on every wall
  if (tint === C.wall) for (let yy = top + 3; yy < by + h - 4; yy += 3) px(ctx, bx + 4, yy, w - 8, 1, C.wallShade);
  for (let xx = bx + 3; xx < bx + w - 4; xx += 5) px(ctx, xx, by + h - 3, 1, 3, "#a88c5c");
}
function bDoor(ctx: CanvasRenderingContext2D, bx: number, by: number, w: number, h: number, wide = false) {
  const dw = wide ? 14 : 6;
  const dh = wide ? 12 : 9;
  const dx = bx + Math.floor(w / 2) - Math.floor(dw / 2);
  const dy = by + h - dh - 1;
  px(ctx, dx - 1, dy - 1, dw + 2, dh + 1, C.woodDark);
  px(ctx, dx, dy, dw, dh, C.door);
  px(ctx, dx, dy, dw, 2, C.doorLite);
  if (wide) for (let i = 1; i < 4; i++) px(ctx, dx, dy + i * 3, dw, 1, C.doorLite);
  else px(ctx, dx + dw - 2, dy + 4, 1, 1, C.win); // knob
}
function bWindow(ctx: CanvasRenderingContext2D, x: number, y: number, w = 4, h = 4) {
  px(ctx, x, y, w, h, C.winFrame);
  px(ctx, x + 1, y + 1, w - 2, h - 2, C.win);
}
function roofRows(ctx: CanvasRenderingContext2D, bx: number, by: number, w: number, roofH: number, roof: string, roofDark: string, slope: number, eaves = true) {
  for (let i = 0; i < roofH; i++) {
    const inset = Math.floor((roofH - i) * slope);
    px(ctx, bx + inset, by + i, w - inset * 2, 1, i < 2 ? roofDark : roof);
  }
  if (eaves) px(ctx, bx, by + roofH - 1, w, 2, roofDark);
}

/** One building — `skin` selects the exterior, `style` tints the roof by district. */
export function drawBuilding(
  ctx: CanvasRenderingContext2D,
  gx: number,
  gy: number,
  wTiles: number,
  hTiles: number,
  style: string,
  skin: BuildingSkin,
) {
  const bx = gx * T;
  const by = gy * T;
  const w = wTiles * T;
  const h = hTiles * T;
  const cx = bx + Math.floor(w / 2);
  const [roof, roofDark] = ROOF[style] ?? ROOF.hub;
  bShadow(ctx, bx, by, w, h);

  if (skin === "studio") {
    // sleek studio: thin flat parapet, big glass frontage, accent trim
    const top = by + 6;
    bWalls(ctx, bx, by, w, h, top, "#ece7d9");
    px(ctx, bx + 1, by + 4, w - 2, 4, roofDark);
    px(ctx, bx + 1, by + 4, w - 2, 1, roof);
    px(ctx, bx + 2, by + 8, w - 4, 1, C.accent);
    px(ctx, bx + 6, top + 4, w - 12, h - 22, C.glassDark);
    px(ctx, bx + 7, top + 5, w - 14, h - 24, C.glass);
    px(ctx, bx + 7, top + 5, 3, h - 24, C.accent3);
    bDoor(ctx, bx, by, w, h);
  } else if (skin === "store") {
    // boutique storefront: pitched roof, striped awning, display window
    const roofH = 10;
    roofRows(ctx, bx, by, w, roofH, roof, roofDark, 0.5);
    const top = by + roofH;
    bWalls(ctx, bx, by, w, h, top);
    px(ctx, bx + 6, top + 6, w - 12, h - roofH - 12, C.glassDark);
    px(ctx, bx + 7, top + 7, w - 14, h - roofH - 14, C.glass);
    const ay = top + 4;
    for (let i = 0; i < w - 8; i += 4) {
      px(ctx, bx + 4 + i, ay, 2, 3, C.awning);
      px(ctx, bx + 6 + i, ay, 2, 3, "#f4efe2");
    }
    px(ctx, bx + 4, ay + 3, w - 8, 1, C.woodDark);
    bDoor(ctx, bx, by, w, h);
  } else if (skin === "shop") {
    // hardware shop: triangular gable, cross-frame window, hanging sign
    const roofH = 14;
    roofRows(ctx, bx, by, w, roofH, roof, roofDark, w / 2 / roofH, false);
    const top = by + roofH - 2;
    bWalls(ctx, bx, by, w, h, top);
    bWindow(ctx, bx + 5, top + 4, 5, 5);
    px(ctx, bx + 7, top + 4, 1, 5, C.winFrame);
    px(ctx, bx + 5, top + 6, 5, 1, C.winFrame);
    px(ctx, bx + w - 10, top + 3, 6, 1, C.woodDark); // bracket
    px(ctx, bx + w - 6, top + 4, 4, 4, C.wood);
    px(ctx, bx + w - 6, top + 4, 4, 1, C.woodDark);
    bDoor(ctx, bx, by, w, h);
  } else if (skin === "tower") {
    // agency tower: steep peak, banner flag, stacked windows
    const roofH = 16;
    roofRows(ctx, bx, by, w, roofH, roof, roofDark, 0.7, false);
    const top = by + roofH - 3;
    bWalls(ctx, bx, by, w, h, top);
    px(ctx, cx, by - 5, 1, 6, C.woodDark);
    px(ctx, cx + 1, by - 5, 4, 3, C.accent);
    bWindow(ctx, cx - 5, top + 4, 3, 4);
    bWindow(ctx, cx + 2, top + 4, 3, 4);
    bWindow(ctx, cx - 5, top + 11, 3, 4);
    bWindow(ctx, cx + 2, top + 11, 3, 4);
    bDoor(ctx, bx, by, w, h);
  } else {
    // workshop / maker: brick walls, pitched roof + skylight, garage door
    const roofH = 11;
    roofRows(ctx, bx, by, w, roofH, roof, roofDark, 0.5);
    const top = by + roofH;
    bWalls(ctx, bx, by, w, h, top, C.brick);
    for (let yy = top + 3; yy < by + h - 3; yy += 4) px(ctx, bx + 2, yy, w - 4, 1, C.brickDark);
    px(ctx, cx - 3, by + 3, 6, 3, C.glass);
    px(ctx, cx - 3, by + 3, 6, 1, C.glassDark);
    bDoor(ctx, bx, by, w, h, true);
  }
}

/* ------------------------------------------------------------------ *
 * World objects — each prerendered to its own small canvas so the engine
 * can depth-sort them against the player. Text is NOT baked in: it is
 * returned as specs and drawn at screen resolution so it stays crisp.
 * ------------------------------------------------------------------ */
export type WorldText = { text: string; x: number; y: number; size: number; color: string };
export type WorldObject = {
  x: number; // world-px bbox
  y: number;
  w: number;
  h: number;
  baseY: number; // world-px y of the footprint's bottom edge (sort key)
  canvas: HTMLCanvasElement;
  texts: WorldText[];
};

function makeObject(
  x: number,
  y: number,
  w: number,
  h: number,
  baseY: number,
  draw: (ctx: CanvasRenderingContext2D) => WorldText[] | void,
): WorldObject {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.translate(-x, -y);
  const texts = draw(ctx) || [];
  return { x, y, w, h, baseY, canvas: cv, texts };
}

/** Sign plate mounted above a building: project name + a short descriptor. */
function buildingLogo(ctx: CanvasRenderingContext2D, b: Building, lines: [string, string]): WorldText[] {
  const cx = (b.tx + b.w / 2) * T;
  const roofTop = b.ty * T;
  const bw = 56;
  const bh = 19;
  const lx = Math.round(cx - bw / 2);
  const ly = roofTop - bh - 2;
  // mounting posts
  px(ctx, cx - 8, roofTop - 3, 2, 4, C.woodDark);
  px(ctx, cx + 6, roofTop - 3, 2, 4, C.woodDark);
  // plate
  px(ctx, lx, ly, bw, bh, C.banner);
  px(ctx, lx, ly, bw, 1, C.bannerEdge);
  // dashed accent border
  ctx.save();
  ctx.strokeStyle = "#c8913a";
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.strokeRect(lx + 1.5, ly + 1.5, bw - 3, bh - 3);
  ctx.setLineDash([]);
  ctx.restore();
  return [
    { text: lines[0], x: cx, y: ly + 7, size: 6, color: C.accent3 },
    { text: lines[1], x: cx, y: ly + 14, size: 4, color: "#cdb994" },
  ];
}

export function drawInn(ctx: CanvasRenderingContext2D, gx: number, gy: number, wTiles: number, hTiles: number) {
  drawBuilding(ctx, gx, gy, wTiles, hTiles, "hub", "shop");
  const bx = gx * T;
  const by = gy * T;
  // hanging lantern by the door
  px(ctx, bx + wTiles * T - 6, by + hTiles * T - 12, 1, 4, C.woodDark);
  px(ctx, bx + wTiles * T - 7, by + hTiles * T - 8, 3, 3, C.win);
}

/** Arrow glyphs aren't in the pixel font — signs draw them as pixel art instead. */
type Arrow = "left" | "right" | "up" | null;
const ARROWS: Record<string, Arrow> = { "◀": "left", "▶": "right", "▲": "up", "<": "left", ">": "right", "^": "up" };
const ARROW_W = 7; // art px reserved for the arrow (+gap)
const signWidth = (label: string, arrow: Arrow) => Math.max(22, label.length * 6 + 10 + (arrow ? ARROW_W : 0));

function signArrow(ctx: CanvasRenderingContext2D, x: number, y: number, dir: Exclude<Arrow, null>) {
  const c = "#f6e7c6";
  // 5px pixel triangle, tip on the facing side
  for (let i = 0; i < 3; i++) {
    if (dir === "left") px(ctx, x + i, y + 2 - i, 1, 1 + i * 2, c);
    if (dir === "right") px(ctx, x + 4 - i, y + 2 - i, 1, 1 + i * 2, c);
    if (dir === "up") px(ctx, x + 2 - i, y + i + 1, 1 + i * 2, 1, c);
  }
}

function sign(ctx: CanvasRenderingContext2D, gx: number, gy: number, label: string, arrow: Arrow) {
  const bx = gx * T;
  const by = gy * T;
  ctx.fillStyle = C.shadow;
  ctx.fillRect(bx + 3, by + 15, 10, 3);
  px(ctx, bx + 7, by + 8, 2, 8, C.woodDark); // post
  // board with a recessed dark plate for high-contrast engraved text
  const bw = signWidth(label, arrow);
  const bxx = Math.round(bx + 8 - bw / 2);
  px(ctx, bxx - 1, by + 1, bw + 2, 11, C.woodDark); // frame
  px(ctx, bxx, by + 2, bw, 9, C.wood); // board face
  px(ctx, bxx + 1, by + 2, bw - 2, 1, "#c99a63"); // top highlight
  px(ctx, bxx + 1, by + 3, bw - 2, 7, "#3a230e"); // engraved dark inset
  if (arrow) signArrow(ctx, bxx + 4, by + 4, arrow);
}

function mailbox(ctx: CanvasRenderingContext2D, gx: number, gy: number) {
  const bx = gx * T;
  const by = gy * T;
  ctx.fillStyle = C.shadow;
  ctx.fillRect(bx + 4, by + 14, 8, 3);
  px(ctx, bx + 7, by + 8, 2, 7, C.woodDark); // post
  px(ctx, bx + 4, by + 4, 8, 6, C.accent); // box
  px(ctx, bx + 4, by + 4, 8, 2, C.accent2);
  px(ctx, bx + 5, by + 6, 6, 1, "#0e2f5c"); // slot
  px(ctx, bx + 12, by + 4, 1, 4, C.flag); // flag pole
  px(ctx, bx + 12, by + 4, 3, 2, C.flag); // flag
}

/** Buildings, inn, trees, signs and mailbox as depth-sortable objects. */
export function buildObjects(world: WorldData, banners: Record<string, [string, string]> = {}): WorldObject[] {
  const objs: WorldObject[] = [];
  const LOGO_H = 24; // banner + flag headroom above a building

  world.buildings.forEach((b) =>
    objs.push(
      makeObject(b.tx * T, b.ty * T - LOGO_H, b.w * T, b.h * T + LOGO_H + 4, (b.ty + b.h) * T, (ctx) => {
        drawBuilding(ctx, b.tx, b.ty, b.w, b.h, b.style, b.skin);
        return buildingLogo(ctx, b, banners[b.projectId] ?? ["PROJECT", ""]);
      }),
    ),
  );

  const a = world.about;
  objs.push(makeObject(a.tx * T, a.ty * T - 8, a.w * T, a.h * T + 12, (a.ty + a.h) * T, (ctx) => drawInn(ctx, a.tx, a.ty, a.w, a.h)));

  world.trees.forEach((t) =>
    objs.push(makeObject(t.x * T, t.y * T - 12, T, T + 12, (t.y + 1) * T, (ctx) => tree(ctx, t.x, t.y))),
  );

  world.signs.forEach((s) => {
    const arrow = s.sub ? (ARROWS[s.sub] ?? null) : null;
    const label = arrow || !s.sub ? s.label : `${s.sub} ${s.label}`;
    const bw = signWidth(label, arrow);
    const x = Math.floor(s.tx * T + 8 - bw / 2 - 1);
    objs.push(
      makeObject(x, s.ty * T, bw + 4, T + 3, (s.ty + 1) * T, (ctx) => {
        sign(ctx, s.tx, s.ty, label, arrow);
        // text centred in the space right of the arrow
        const cx = s.tx * T + 8 + (arrow ? ARROW_W / 2 : 0);
        return [{ text: label, x: cx, y: s.ty * T + 7, size: 6, color: "#f6e7c6" }];
      }),
    );
  });

  const m = world.mailbox;
  objs.push(makeObject(m.tx * T, m.ty * T, T + 3, T + 3, (m.ty + 1) * T, (ctx) => mailbox(ctx, m.tx, m.ty)));

  return objs;
}

/** Static ground layer: grass, paths, water, flowers and the forest border. */
export function buildStaticWorld(world: WorldData): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = world.cols * T;
  cv.height = world.rows * T;
  const ctx = cv.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  const inRect = (tx: number, ty: number, r: { x: number; y: number; w: number; h: number }) =>
    tx >= r.x && tx < r.x + r.w && ty >= r.y && ty < r.y + r.h;

  for (let ty = 0; ty < world.rows; ty++) {
    for (let tx = 0; tx < world.cols; tx++) {
      const gx = tx * T;
      const gy = ty * T;
      const border = tx < 2 || ty < 2 || tx >= world.cols - 2 || ty >= world.rows - 2;
      if (border) {
        px(ctx, gx, gy, T, T, hash(tx, ty) > 0.5 ? C.forest : C.forestDark);
        continue;
      }
      // one continuous meadow (per-zone tints read as hard rectangles); gentle
      // large-scale mottling keeps it from looking flat
      grassTile(ctx, gx, gy, hash(tx * 7, ty * 3) > 0.8 ? "#75b057" : C.grass);
      if (world.paths.some((p) => inRect(tx, ty, p))) pathTile(ctx, gx, gy);
      if (world.water.some((p) => inRect(tx, ty, p))) drawWaterTile(ctx, gx, gy, 1, 0);
    }
  }

  // border forest crowns for depth (the player can never reach these)
  for (let tx = 2; tx < world.cols - 2; tx += 1) {
    if (hash(tx, 1) > 0.45) tree(ctx, tx, 0);
    if (hash(tx, 99) > 0.45) tree(ctx, tx, world.rows - 2);
  }
  for (let ty = 2; ty < world.rows - 2; ty += 1) {
    if (hash(1, ty) > 0.5) tree(ctx, 0, ty);
    if (hash(88, ty) > 0.5) tree(ctx, world.cols - 2, ty);
  }

  world.flowers.forEach((f) => flower(ctx, f.x, f.y));
  return cv;
}

/* ------------------------------------------------------------------ *
 * Minimap — 3px per tile, static base; the engine overlays the player.
 * ------------------------------------------------------------------ */
export const MINI = 3;

export function buildMinimap(world: WorldData, visited: Set<string>): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = world.cols * MINI;
  cv.height = world.rows * MINI;
  const ctx = cv.getContext("2d")!;
  const r = (x: number, y: number, w: number, h: number, c: string) => px(ctx, x * MINI, y * MINI, w * MINI, h * MINI, c);
  r(0, 0, world.cols, world.rows, C.forestDark);
  r(2, 2, world.cols - 4, world.rows - 4, C.grass);
  world.paths.forEach((p) => r(p.x, p.y, p.w, p.h, C.path));
  world.water.forEach((p) => r(p.x, p.y, p.w, p.h, C.water));
  world.trees.forEach((t) => r(t.x, t.y, 1, 1, C.treeDark));
  const a = world.about;
  r(a.tx, a.ty, a.w, a.h, ROOF.hub[0]);
  world.buildings.forEach((b) => {
    const seen = visited.has(b.projectId);
    r(b.tx, b.ty, b.w, b.h, seen ? ROOF[b.style][0] : "#5b6478");
    if (seen) r(b.tx + 1, b.ty + 1, b.w - 2, b.h - 2, "#f4efe2");
  });
  r(world.mailbox.tx, world.mailbox.ty, 1, 1, C.accent);
  return cv;
}

export { C as WorldColors };
