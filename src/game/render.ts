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

/** Filled pixel circle, row by row. */
function disc(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, c: string) {
  for (let dy = -r; dy <= r; dy++) {
    const half = Math.round(Math.sqrt(Math.max(0, r * r - dy * dy)) - 0.25);
    px(ctx, cx - half, cy + dy, half * 2 + 1, 1, c);
  }
}

/**
 * Trees — ~2× the player's height, two species so the town doesn't look
 * copy-pasted: a clustered round oak and a tiered pine (picked per tile).
 * The trunk sits in its tile; the crown rises above.
 */
function tree(ctx: CanvasRenderingContext2D, gx: number, gy: number) {
  const bx = gx * T;
  const by = gy * T;
  const pine = hash(gx * 3, gy * 7) > 0.62;
  // ground shadow
  px(ctx, bx + 1, by + 13, 14, 3, C.shadow);
  px(ctx, bx + 3, by + 12, 10, 1, C.shadow);

  if (pine) {
    px(ctx, bx + 6, by + 6, 4, 9, "#1a1208");
    px(ctx, bx + 7, by + 6, 2, 9, "#6a3f1e");
    const tiers: [number, number, number][] = [
      [by - 16, 3, 9], // [top y, top half-width, height]
      [by - 9, 5, 9],
      [by - 2, 7, 9],
    ];
    tiers.forEach(([ty, hw0, th]) => {
      for (let i = 0; i < th; i++) {
        const hw = Math.round(hw0 * (i / (th - 1)) + 1);
        px(ctx, bx + 8 - hw - 1, ty + i, hw * 2 + 2, 1, "#17301b");
        px(ctx, bx + 8 - hw, ty + i, hw * 2, 1, "#2f6b38");
        px(ctx, bx + 8 - hw, ty + i, Math.max(1, Math.round(hw * 0.7)), 1, "#3f8a45");
      }
      px(ctx, bx + 8 - hw0 - 1, ty + th - 1, (hw0 + 1) * 2 + 1, 1, "#17301b");
    });
    px(ctx, bx + 7, by - 17, 2, 2, "#17301b");
    px(ctx, bx + 6, by - 10, 1, 1, "#6fbf62");
    px(ctx, bx + 5, by - 3, 1, 1, "#6fbf62");
    px(ctx, bx + 4, by + 4, 1, 1, "#6fbf62");
    return;
  }

  // oak trunk with bark + roots
  px(ctx, bx + 5, by + 2, 6, 13, "#1a1208");
  px(ctx, bx + 6, by + 2, 4, 13, C.trunk);
  px(ctx, bx + 6, by + 2, 1, 13, "#96602f");
  px(ctx, bx + 8, by + 6, 1, 3, "#5c3518");
  px(ctx, bx + 4, by + 14, 8, 1, "#1a1208");
  px(ctx, bx + 4, by + 13, 2, 1, C.trunk);
  px(ctx, bx + 10, by + 13, 2, 1, C.trunk);
  // crown: three overlapping clusters, outline → shade → mid → light
  const clusters: [number, number, number][] = [
    [bx + 4, by - 4, 6],
    [bx + 12, by - 4, 6],
    [bx + 8, by - 9, 7],
  ];
  clusters.forEach(([x, y, r]) => disc(ctx, x, y, r + 1, "#1f3d22"));
  clusters.forEach(([x, y, r]) => disc(ctx, x, y, r, C.treeDark));
  clusters.forEach(([x, y, r]) => disc(ctx, x - 1, y - 1, r - 2, C.treeGreen));
  disc(ctx, bx + 6, by - 12, 2, C.treeLite);
  disc(ctx, bx + 2, by - 6, 1, C.treeLite);
  // dithered leaf texture + a couple of berries
  for (let i = 0; i < 10; i++) {
    const hx = bx + 1 + Math.floor(hash(gx + i, gy) * 14);
    const hy = by - 14 + Math.floor(hash(gy + i, gx) * 14);
    px(ctx, hx, hy, 1, 1, i % 2 ? "#7fcb6a" : "#2f6b30");
  }
  if (hash(gx, gy + 5) > 0.55) {
    px(ctx, bx + 11, by - 6, 1, 1, "#e0533b");
    px(ctx, bx + 4, by - 2, 1, 1, "#e0533b");
  }
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
export type LightRect = { x: number; y: number; w: number; h: number };

/** Night lights an object emits: lit window panes + radial light sources (world px). */
export type ObjectLights = { windows: LightRect[]; glows: { x: number; y: number; r: number }[] };

function bShadow(ctx: CanvasRenderingContext2D, bx: number, by: number, w: number, h: number) {
  px(ctx, bx + 3, by + h - 1, w - 2, 4, C.shadow);
  px(ctx, bx + w - 2, by + 34, 3, h - 33, C.shadow);
}

function bWalls(ctx: CanvasRenderingContext2D, bx: number, by: number, w: number, h: number, top: number, tint = C.wall, material: "plaster" | "brick" | "wood" = "plaster") {
  const x0 = bx + 4;
  const ww = w - 8;
  const wh = by + h - top;
  px(ctx, x0 - 1, top, ww + 2, wh, "#3a2616"); // outline
  px(ctx, x0, top, ww, wh - 1, tint);
  px(ctx, x0, top, 2, wh - 1, C.wallShade); // left light edge
  px(ctx, x0 + ww - 3, top, 3, wh - 1, C.wallDark); // right shade
  if (material === "plaster") for (let yy = top + 4; yy < by + h - 5; yy += 3) px(ctx, x0 + 2, yy, ww - 5, 1, C.wallShade);
  if (material === "brick")
    for (let yy = top + 2, r = 0; yy < by + h - 4; yy += 3, r++) {
      px(ctx, x0, yy, ww, 1, C.brickDark);
      for (let xx = x0 + (r % 2 ? 2 : 5); xx < x0 + ww - 1; xx += 6) px(ctx, xx, yy - 2, 1, 2, C.brickDark);
    }
  if (material === "wood") for (let xx = x0 + 3; xx < x0 + ww - 2; xx += 4) px(ctx, xx, top + 1, 1, wh - 5, "#b08a55");
  // stone footing
  px(ctx, x0 - 1, by + h - 4, ww + 2, 3, "#8c7a64");
  for (let xx = x0 + 1; xx < x0 + ww; xx += 5) px(ctx, xx, by + h - 4, 1, 3, "#6e5e4c");
  px(ctx, x0 - 1, by + h - 4, ww + 2, 1, "#a8967e");
}

function bDoor(ctx: CanvasRenderingContext2D, bx: number, by: number, w: number, h: number, wide = false) {
  const dw = wide ? 18 : 10;
  const dh = wide ? 15 : 14;
  const dx = bx + Math.floor(w / 2) - Math.floor(dw / 2);
  const dy = by + h - dh - 3;
  px(ctx, dx - 2, dy - 2, dw + 4, dh + 2, "#3a2616"); // frame outline
  px(ctx, dx - 1, dy - 1, dw + 2, dh + 1, C.woodDark);
  px(ctx, dx, dy, dw, dh, C.door);
  px(ctx, dx, dy, dw, 2, C.doorLite);
  if (wide) {
    for (let i = 1; i < 5; i++) px(ctx, dx, dy + i * 3, dw, 1, C.doorLite);
  } else {
    px(ctx, dx + 2, dy + 3, dw - 4, 4, "#5e3219"); // panel
    px(ctx, dx + 2, dy + 8, dw - 4, 4, "#5e3219");
    px(ctx, dx + dw - 3, dy + 7, 1, 2, C.win); // knob
  }
  px(ctx, dx - 3, by + h - 3, dw + 6, 2, "#9a8870"); // step
}

/** Framed window with mullions + sill; returns the glass rect for night lighting. */
function bWindow(ctx: CanvasRenderingContext2D, x: number, y: number, w = 10, h = 8, shutters = false): LightRect {
  px(ctx, x - 1, y - 1, w + 2, h + 2, "#3a2616");
  px(ctx, x, y, w, h, "#9cc9ef");
  px(ctx, x, y, w, 2, "#c8e3f7"); // sky reflection
  px(ctx, x + 1, y + 2, 2, 2, "#e6f3fc");
  px(ctx, x + Math.floor(w / 2), y, 1, h, C.winFrame);
  px(ctx, x, y + Math.floor(h / 2), w, 1, C.winFrame);
  px(ctx, x - 2, y + h + 1, w + 4, 2, C.woodDark); // sill
  px(ctx, x - 2, y + h + 1, w + 4, 1, C.wood);
  if (shutters) {
    px(ctx, x - 4, y - 1, 3, h + 2, "#5f7f4a");
    px(ctx, x + w + 1, y - 1, 3, h + 2, "#5f7f4a");
    px(ctx, x - 4, y + 2, 3, 1, "#4a6639");
    px(ctx, x + w + 1, y + 2, 3, 1, "#4a6639");
  }
  return { x, y, w, h };
}

/**
 * Pokémon-style front-facing roof: rows widen toward the eave, brick-bond
 * shingles, a light ridge cap, shaded side facets and a deep eave shadow.
 */
function bRoof(
  ctx: CanvasRenderingContext2D,
  bx: number,
  top: number,
  w: number,
  roofH: number,
  roof: string,
  roofDark: string,
  roofLite: string,
  kind: "hip" | "gable" = "hip",
) {
  const inset0 = kind === "gable" ? Math.floor(w / 2) - 3 : 8;
  for (let i = 0; i < roofH; i++) {
    const t = i / (roofH - 1);
    const inset = Math.round(inset0 * (1 - t));
    const x = bx + inset;
    const ww = w - inset * 2;
    px(ctx, x - 1, top + i, ww + 2, 1, "#2a1a10"); // outline
    px(ctx, x, top + i, ww, 1, roof);
    // side facets: darker on the right, lighter on the left for volume
    px(ctx, x, top + i, Math.max(2, Math.round(ww * 0.12)), 1, roofLite);
    px(ctx, x + ww - Math.max(3, Math.round(ww * 0.18)), top + i, Math.max(3, Math.round(ww * 0.18)), 1, roofDark);
    // shingle courses every 4 rows, staggered joints
    if (i > 1 && i % 4 === 0) {
      px(ctx, x, top + i, ww, 1, roofDark);
      const off = (i / 4) % 2 ? 3 : 0;
      for (let xx = x + off; xx < x + ww; xx += 6) px(ctx, xx, top + i + 1, 1, 3, roofDark);
    }
  }
  // ridge cap
  const rx = bx + inset0;
  const rw = w - inset0 * 2;
  px(ctx, rx - 1, top - 1, rw + 2, 2, "#2a1a10");
  px(ctx, rx, top, rw, 1, roofLite);
  // eave: overhang lip + deep shadow on the wall below
  px(ctx, bx - 1, top + roofH - 1, w + 2, 2, "#2a1a10");
  px(ctx, bx, top + roofH - 1, w, 1, roofDark);
  px(ctx, bx + 4, top + roofH + 1, w - 8, 2, "rgba(40,20,10,0.35)");
}

function bChimney(ctx: CanvasRenderingContext2D, x: number, y: number) {
  px(ctx, x - 1, y - 1, 8, 12, "#2a1a10");
  px(ctx, x, y, 6, 11, C.brick);
  px(ctx, x, y + 3, 6, 1, C.brickDark);
  px(ctx, x, y + 7, 6, 1, C.brickDark);
  px(ctx, x - 1, y - 2, 8, 2, "#5a4a3c");
}

const ROOF_LITE: Record<string, string> = { design: "#e8876a", dev: "#4fb2b2", agency: "#e6c35e", hub: "#e0a86e" };

/**
 * One building — `skin` selects the exterior, `style` tints the roof by district.
 * Returns the glass rects of its windows so the engine can light them at night.
 */
export function drawBuilding(
  ctx: CanvasRenderingContext2D,
  gx: number,
  gy: number,
  wTiles: number,
  hTiles: number,
  style: string,
  skin: BuildingSkin,
): LightRect[] {
  const bx = gx * T;
  const by = gy * T;
  const w = wTiles * T;
  const h = hTiles * T;
  const cx = bx + Math.floor(w / 2);
  const [roof, roofDark] = ROOF[style] ?? ROOF.hub;
  const roofLite = ROOF_LITE[style] ?? ROOF_LITE.hub;
  const wins: LightRect[] = [];
  bShadow(ctx, bx, by, w, h);

  // every house: walls from y+30, roof over the top ~half
  const wallTop = by + 30;
  const winY = wallTop + 6;

  if (skin === "studio") {
    // modern studio: low hip roof with an accent fascia, wide glass frontage
    bWalls(ctx, bx, by, w, h, wallTop, "#ece7d9");
    bRoof(ctx, bx, by + 8, w, 24, roof, roofDark, roofLite, "hip");
    px(ctx, bx + 2, by + 31, w - 4, 1, C.accent);
    px(ctx, bx + 7, winY - 1, 16, 12, "#3a2616");
    wins.push({ x: bx + 8, y: winY, w: 14, h: 10 });
    px(ctx, bx + 8, winY, 14, 10, C.glass);
    px(ctx, bx + 8, winY, 14, 2, "#c8e3f7");
    px(ctx, bx + 12, winY, 1, 10, C.glassDark);
    px(ctx, bx + 17, winY, 1, 10, C.glassDark);
    wins.push(bWindow(ctx, bx + w - 20, winY, 10, 8));
    bDoor(ctx, bx, by, w, h);
  } else if (skin === "store") {
    // boutique: hip roof + chimney, striped awning over a display window
    bWalls(ctx, bx, by, w, h, wallTop);
    bChimney(ctx, bx + w - 18, by + 4);
    bRoof(ctx, bx, by + 6, w, 26, roof, roofDark, roofLite, "hip");
    wins.push(bWindow(ctx, bx + 9, winY + 3, 12, 9));
    wins.push(bWindow(ctx, bx + w - 21, winY + 3, 12, 9));
    const ay = winY - 2;
    for (let i = 0; i < 16; i += 4) {
      px(ctx, bx + 7 + i, ay, 2, 3, C.awning);
      px(ctx, bx + 9 + i, ay, 2, 3, "#f4efe2");
      px(ctx, bx + w - 23 + i, ay, 2, 3, C.awning);
      px(ctx, bx + w - 21 + i, ay, 2, 3, "#f4efe2");
    }
    bDoor(ctx, bx, by, w, h);
  } else if (skin === "shop") {
    // cottage shop: tall gable roof, shuttered windows, hanging sign
    bWalls(ctx, bx, by, w, h, wallTop, C.wall, "wood");
    bRoof(ctx, bx, by + 2, w, 30, roof, roofDark, roofLite, "gable");
    wins.push(bWindow(ctx, bx + 10, winY + 1, 9, 8, true));
    wins.push(bWindow(ctx, bx + w - 19, winY + 1, 9, 8, true));
    px(ctx, cx - 3, by + 18, 7, 7, "#3a2616"); // attic window
    px(ctx, cx - 2, by + 19, 5, 5, "#9cc9ef");
    wins.push({ x: cx - 2, y: by + 19, w: 5, h: 5 });
    px(ctx, bx + w - 12, wallTop + 3, 8, 1, C.woodDark); // sign bracket
    px(ctx, bx + w - 9, wallTop + 4, 6, 5, C.wood);
    px(ctx, bx + w - 9, wallTop + 4, 6, 1, C.woodDark);
    bDoor(ctx, bx, by, w, h);
  } else if (skin === "tower") {
    // agency HQ: steep gable, flag on the peak, two floors of windows
    bWalls(ctx, bx, by, w, h, wallTop - 4, "#f2e4c4");
    bRoof(ctx, bx, by - 2, w, 30, roof, roofDark, roofLite, "gable");
    px(ctx, cx, by - 10, 1, 9, C.woodDark);
    px(ctx, cx + 1, by - 10, 6, 4, C.accent);
    px(ctx, cx + 1, by - 7, 4, 1, "#a8392c");
    wins.push(bWindow(ctx, bx + 9, wallTop, 8, 6));
    wins.push(bWindow(ctx, bx + w - 17, wallTop, 8, 6));
    wins.push(bWindow(ctx, bx + 9, wallTop + 12, 8, 6));
    wins.push(bWindow(ctx, bx + w - 17, wallTop + 12, 8, 6));
    bDoor(ctx, bx, by, w, h);
  } else {
    // maker workshop: brick walls, hip roof with skylight, garage door
    bWalls(ctx, bx, by, w, h, wallTop, C.brick, "brick");
    bChimney(ctx, bx + 10, by + 4);
    bRoof(ctx, bx, by + 6, w, 26, roof, roofDark, roofLite, "hip");
    px(ctx, cx - 5, by + 14, 10, 6, "#2a1a10"); // skylight
    px(ctx, cx - 4, by + 15, 8, 4, C.glass);
    wins.push({ x: cx - 4, y: by + 15, w: 8, h: 4 });
    wins.push(bWindow(ctx, bx + 8, winY, 8, 7));
    wins.push(bWindow(ctx, bx + w - 16, winY, 8, 7));
    bDoor(ctx, bx, by, w, h, true);
  }
  return wins;
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
  lights?: ObjectLights;
  /** building id, so a billboard can be repainted once its image loads */
  key?: string;
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

const BILL_W = 46; // billboard art size (16:9-ish, in art px)
const BILL_H = 26;

/**
 * Billboard above a building: a pixelated mockup of the project (so you can
 * see what's inside before entering) with the project name underneath.
 * Falls back to a two-line text plate when there's no image (yet).
 */
function billboard(ctx: CanvasRenderingContext2D, b: Building, lines: [string, string], img?: HTMLImageElement | null): WorldText[] {
  const cx = (b.tx + b.w / 2) * T;
  const roofTop = b.ty * T + (b.skin === "tower" ? -12 : 0);
  const fw = BILL_W + 4;
  const fh = BILL_H + 12;
  const lx = Math.round(cx - fw / 2);
  const ly = roofTop - fh - 1;
  // posts
  px(ctx, cx - 14, ly + fh - 1, 2, 6, "#2a1a10");
  px(ctx, cx + 12, ly + fh - 1, 2, 6, "#2a1a10");
  // frame
  px(ctx, lx - 1, ly - 1, fw + 2, fh + 2, "#1a120c");
  px(ctx, lx, ly, fw, fh, C.banner);
  px(ctx, lx, ly, fw, 1, C.bannerEdge);
  px(ctx, lx, ly + fh - 1, fw, 1, C.bannerEdge);
  if (img && img.complete && img.naturalWidth) {
    // downsample → nearest-neighbour upscale later = a pixel-art mockup
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, lx + 2, ly + 2, BILL_W, BILL_H);
    ctx.restore();
    px(ctx, lx + 2, ly + 2, BILL_W, 1, "rgba(255,255,255,0.25)"); // glass sheen
    return [{ text: lines[0], x: cx, y: ly + BILL_H + 7, size: 6, color: C.accent3 }];
  }
  // text-only plate
  ctx.save();
  ctx.strokeStyle = "#c8913a";
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.strokeRect(lx + 2.5, ly + 2.5, fw - 5, fh - 5);
  ctx.restore();
  return [
    { text: lines[0], x: cx, y: ly + 14, size: 6, color: C.accent3 },
    { text: lines[1], x: cx, y: ly + 25, size: 3, color: "#cdb994" },
  ];
}

export function drawInn(ctx: CanvasRenderingContext2D, gx: number, gy: number, wTiles: number, hTiles: number): LightRect[] {
  const wins = drawBuilding(ctx, gx, gy, wTiles, hTiles, "hub", "shop");
  const bx = gx * T;
  const by = gy * T;
  // hanging lantern by the door
  px(ctx, bx + wTiles * T - 12, by + hTiles * T - 17, 1, 4, C.woodDark);
  px(ctx, bx + wTiles * T - 14, by + hTiles * T - 13, 5, 5, "#2a1a10");
  px(ctx, bx + wTiles * T - 13, by + hTiles * T - 12, 3, 3, C.win);
  return wins;
}

/** Arrow glyphs aren't in the pixel font — signs draw them as pixel art instead. */
type Arrow = "left" | "right" | "up" | null;
const ARROWS: Record<string, Arrow> = { "◀": "left", "▶": "right", "▲": "up", "<": "left", ">": "right", "^": "up" };
const ARROW_W = 7; // art px reserved for the arrow (+gap)
const signWidth = (label: string, arrow: Arrow) => Math.max(24, label.length * 7 + 10 + (arrow ? ARROW_W : 0));

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
  px(ctx, bxx - 1, by - 1, bw + 2, 14, C.woodDark); // frame
  px(ctx, bxx, by, bw, 12, C.wood); // board face
  px(ctx, bxx + 1, by, bw - 2, 1, "#c99a63"); // top highlight
  px(ctx, bxx + 1, by + 1, bw - 2, 10, "#3a230e"); // engraved dark inset
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

/** Iron street lamp (2 tiles tall); its head glows at night. */
function lamp(ctx: CanvasRenderingContext2D, gx: number, gy: number) {
  const bx = gx * T;
  const by = gy * T;
  px(ctx, bx + 4, by + 13, 8, 3, C.shadow);
  px(ctx, bx + 5, by + 12, 6, 3, "#2a2a30"); // base
  px(ctx, bx + 6, by + 11, 4, 1, "#3c3c46");
  px(ctx, bx + 7, by - 8, 2, 20, "#2a2a30"); // pole
  px(ctx, bx + 7, by - 8, 1, 20, "#4a4a56");
  px(ctx, bx + 4, by - 15, 8, 2, "#2a2a30"); // cap
  px(ctx, bx + 5, by - 13, 6, 6, "#2a2a30"); // housing
  px(ctx, bx + 6, by - 12, 4, 4, "#ffe7a3"); // glass
  px(ctx, bx + 6, by - 12, 1, 4, "#fff6d6");
  px(ctx, bx + 5, by - 7, 6, 1, "#2a2a30");
}

/** Lamp positions (tile coords) — beside the roads, never on them. */
export const LAMPS: { x: number; y: number }[] = [
  { x: 9, y: 17 }, { x: 16, y: 21 }, { x: 28, y: 15 }, { x: 33, y: 21 }, { x: 38, y: 21 },
  { x: 49, y: 17 }, { x: 24, y: 9 }, { x: 7, y: 23 }, { x: 43, y: 23 },
];

const LOGO_H = 44; // billboard headroom above a building

/** One building object (repainted when its billboard image arrives). */
export function buildBuildingObject(b: Building, banner: [string, string], img?: HTMLImageElement | null): WorldObject {
  let wins: LightRect[] = [];
  const o = makeObject(b.tx * T, b.ty * T - LOGO_H, b.w * T, b.h * T + LOGO_H + 4, (b.ty + b.h) * T, (ctx) => {
    wins = drawBuilding(ctx, b.tx, b.ty, b.w, b.h, b.style, b.skin);
    return billboard(ctx, b, banner, img);
  });
  const doorX = (b.tx + b.w / 2) * T;
  o.lights = { windows: wins, glows: [{ x: doorX, y: (b.ty + b.h) * T - 6, r: 22 }, ...wins.map((r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2, r: 18 }))] };
  o.key = b.id;
  return o;
}

/** Buildings, inn, trees, signs, lamps and mailbox as depth-sortable objects. */
export function buildObjects(world: WorldData, banners: Record<string, [string, string]> = {}): WorldObject[] {
  const objs: WorldObject[] = [];

  world.buildings.forEach((b) => objs.push(buildBuildingObject(b, banners[b.projectId] ?? ["PROJECT", ""])));

  const a = world.about;
  let innWins: LightRect[] = [];
  const inn = makeObject(a.tx * T, a.ty * T - 8, a.w * T, a.h * T + 12, (a.ty + a.h) * T, (ctx) => {
    innWins = drawInn(ctx, a.tx, a.ty, a.w, a.h);
  });
  inn.lights = {
    windows: innWins,
    glows: [
      { x: (a.tx + a.w / 2) * T, y: (a.ty + a.h) * T - 6, r: 26 },
      { x: (a.tx + a.w) * T - 11, y: (a.ty + a.h) * T - 11, r: 22 },
      ...innWins.map((r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2, r: 18 })),
    ],
  };
  objs.push(inn);

  world.trees.forEach((t) =>
    objs.push(makeObject(t.x * T - 2, t.y * T - 16, T + 4, T + 16, (t.y + 1) * T, (ctx) => tree(ctx, t.x, t.y))),
  );

  LAMPS.forEach((l) => {
    const o = makeObject(l.x * T, l.y * T - 16, T, T + 16, (l.y + 1) * T, (ctx) => lamp(ctx, l.x, l.y));
    o.lights = { windows: [{ x: l.x * T + 6, y: l.y * T - 12, w: 4, h: 4 }], glows: [{ x: l.x * T + 8, y: l.y * T - 6, r: 52 }] };
    objs.push(o);
  });

  world.signs.forEach((s) => {
    const arrow = s.sub ? (ARROWS[s.sub] ?? null) : null;
    const label = arrow || !s.sub ? s.label : `${s.sub} ${s.label}`;
    const bw = signWidth(label, arrow);
    const x = Math.floor(s.tx * T + 8 - bw / 2 - 1);
    objs.push(
      makeObject(x, s.ty * T - 2, bw + 4, T + 5, (s.ty + 1) * T, (ctx) => {
        sign(ctx, s.tx, s.ty, label, arrow);
        // text centred in the space right of the arrow
        const cx = s.tx * T + 8 + (arrow ? ARROW_W / 2 : 0);
        return [{ text: label, x: cx, y: s.ty * T + 6, size: 8, color: "#f6e7c6" }];
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
      grassTile(ctx, gx, gy, C.grass);
      if (world.paths.some((p) => inRect(tx, ty, p))) pathTile(ctx, gx, gy);
      if (world.water.some((p) => inRect(tx, ty, p))) drawWaterTile(ctx, gx, gy, 1, 0);
    }
  }

  // edges: paths get a darker rim + soft grass lip; the pond gets a sandy shore
  const isPath = (tx: number, ty: number) => world.paths.some((p) => inRect(tx, ty, p));
  const isWater = (tx: number, ty: number) => world.water.some((p) => inRect(tx, ty, p));
  for (let ty = 2; ty < world.rows - 2; ty++) {
    for (let tx = 2; tx < world.cols - 2; tx++) {
      const gx = tx * T;
      const gy = ty * T;
      if (isWater(tx, ty)) {
        if (!isWater(tx, ty - 1)) { px(ctx, gx, gy, T, 3, "#e3cf9c"); px(ctx, gx, gy + 3, T, 1, C.waterLite); }
        if (!isWater(tx, ty + 1)) px(ctx, gx, gy + T - 2, T, 2, "#3f8cc4");
        if (!isWater(tx - 1, ty)) px(ctx, gx, gy, 2, T, "#e3cf9c");
        if (!isWater(tx + 1, ty)) px(ctx, gx + T - 2, gy, 2, T, "#e3cf9c");
      } else if (isPath(tx, ty)) {
        const up = isPath(tx, ty - 1), dn = isPath(tx, ty + 1), lf = isPath(tx - 1, ty), rt = isPath(tx + 1, ty);
        if (!up) { px(ctx, gx, gy, T, 1, C.pathEdge); for (let x = gx + 1; x < gx + T; x += 4) px(ctx, x, gy, 2, 1, C.grassDark); }
        if (!dn) px(ctx, gx, gy + T - 1, T, 1, C.pathEdge);
        if (!lf) px(ctx, gx, gy, 1, T, C.pathEdge);
        if (!rt) px(ctx, gx + T - 1, gy, 1, T, C.pathEdge);
        // rounded outer corners
        if (!up && !lf) px(ctx, gx, gy, 2, 2, C.grass);
        if (!up && !rt) px(ctx, gx + T - 2, gy, 2, 2, C.grass);
        if (!dn && !lf) px(ctx, gx, gy + T - 2, 2, 2, C.grass);
        if (!dn && !rt) px(ctx, gx + T - 2, gy + T - 2, 2, 2, C.grass);
      }
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
