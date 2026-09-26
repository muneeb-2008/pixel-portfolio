/**
 * Muneeb's room inside the Traveler's Rest — a Pokémon FireRed-style interior.
 * 12×9 tiles: wallpapered back wall, plank floor, bookshelf, desk + PC,
 * trophy cabinet, bed, plants, rug, and a door mat to leave.
 */
export const RT = 16;
export const ROOM_COLS = 12;
export const ROOM_ROWS = 9;

export type Hotspot = {
  id: "pc" | "books" | "trophies" | "bed" | "window";
  /** world-px centre of the spot the player stands on to use it */
  x: number;
  y: number;
  label: string;
  verb: string;
};

export const HOTSPOTS: Hotspot[] = [
  { id: "pc", x: 9 * RT, y: 3 * RT + 8, label: "Computer · About me", verb: "Use" },
  { id: "books", x: 1 * RT, y: 3 * RT + 8, label: "Bookshelf · Loadout", verb: "Read" },
  { id: "trophies", x: 6 * RT, y: 3 * RT + 8, label: "Trophy cabinet", verb: "Look" },
  { id: "bed", x: 9 * RT + 4, y: 6 * RT + 4, label: "Bed", verb: "Rest" },
  { id: "window", x: 3 * RT, y: 3 * RT + 8, label: "Window", verb: "Look" },
];

/** Solid tiles (walls + furniture footprints). */
export function roomSolid(): boolean[][] {
  const g = Array.from({ length: ROOM_COLS }, () => Array<boolean>(ROOM_ROWS).fill(false));
  const set = (x: number, y: number) => {
    if (x >= 0 && x < ROOM_COLS && y >= 0 && y < ROOM_ROWS) g[x][y] = true;
  };
  for (let x = 0; x < ROOM_COLS; x++) {
    set(x, 0);
    set(x, 1);
  }
  [0, 1, 4, 5, 6, 8, 9, 11].forEach((x) => set(x, 2)); // shelf, plant, cabinet, desk, plant
  for (let x = 10; x <= 11; x++) for (let y = 5; y <= 7; y++) set(x, y); // bed
  return g;
}

export const ROOM_SPAWN = { x: 5.5 * RT - 8, y: 7 * RT - 14 };
/** Standing on the door mat (bottom row, centre) leaves the house. */
export const isOnMat = (feetX: number, feetY: number) => feetY > 8 * RT + 2 && feetX > 4.5 * RT && feetX < 7.5 * RT;

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

/** Paint the static room into a 192×144 canvas. */
export function buildRoom(night: boolean): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = ROOM_COLS * RT;
  cv.height = ROOM_ROWS * RT;
  const c = cv.getContext("2d")!;
  c.imageSmoothingEnabled = false;
  const W = cv.width;

  // ---- floor: warm planks with staggered seams
  px(c, 0, 2 * RT, W, 7 * RT, "#b9855a");
  for (let y = 2 * RT; y < 9 * RT; y += 6) {
    px(c, 0, y, W, 1, "#9a6a43");
    for (let x = (y / 6) % 2 ? 0 : 12; x < W; x += 24) px(c, x, y, 1, 6, "#9a6a43");
  }
  for (let i = 0; i < 40; i++) px(c, (i * 53) % W, 2 * RT + ((i * 37) % (7 * RT)), 2, 1, "#c99468");

  // ---- back wall: striped wallpaper, trim, baseboard
  px(c, 0, 0, W, 2 * RT, "#e8d9b8");
  for (let x = 2; x < W; x += 8) px(c, x, 3, 3, 2 * RT - 6, "#dccaa2");
  px(c, 0, 0, W, 3, "#8a5a3a");
  px(c, 0, 2 * RT - 4, W, 4, "#8a5a3a");
  px(c, 0, 2 * RT - 4, W, 1, "#a8744c");
  px(c, 0, 2 * RT, W, 2, "rgba(40,20,10,0.25)"); // contact shadow

  // ---- window (sky follows day/night)
  const wx = 2 * RT + 2;
  px(c, wx - 2, 4, 28, 20, "#5a3a22");
  px(c, wx, 6, 24, 16, night ? "#1b2350" : "#8fd0f5");
  if (night) {
    px(c, wx + 16, 8, 4, 4, "#fff4c8"); // moon
    px(c, wx + 17, 8, 3, 3, "#1b2350");
    [[3, 9], [8, 14], [12, 8], [20, 17], [5, 18]].forEach(([sx, sy]) => px(c, wx + sx, sy, 1, 1, "#ffffff"));
  } else {
    px(c, wx + 3, 10, 8, 3, "#ffffff"); // cloud
    px(c, wx + 5, 8, 5, 2, "#ffffff");
    px(c, wx + 14, 15, 6, 2, "#ffffff");
  }
  px(c, wx + 11, 6, 2, 16, "#5a3a22");
  px(c, wx, 13, 24, 2, "#5a3a22");
  px(c, wx - 3, 24, 30, 3, "#7d5228"); // sill
  px(c, wx - 4, 4, 3, 20, "#c84a3a"); // curtains
  px(c, wx + 25, 4, 3, 20, "#c84a3a");

  // ---- framed poster: the player's portrait pixel art
  const pxX = 5 * RT + 4;
  px(c, pxX, 5, 22, 18, "#2b201a");
  px(c, pxX + 2, 7, 18, 14, "#f0b94a");
  px(c, pxX + 8, 9, 6, 5, "#f0c088"); // head
  px(c, pxX + 8, 9, 6, 2, "#3a2a1a"); // hair
  px(c, pxX + 7, 14, 8, 6, "#2068cc"); // shirt
  // clock
  px(c, 10 * RT + 4, 6, 12, 12, "#2b201a");
  px(c, 10 * RT + 5, 7, 10, 10, "#f6ead2");
  px(c, 10 * RT + 10, 8, 1, 5, "#2b201a");
  px(c, 10 * RT + 10, 12, 3, 1, "#2b201a");

  // ---- bookshelf (tiles 0–1, rising up the wall)
  const bx = 2;
  px(c, bx - 1, 6, 30, 42, "#3a2616");
  px(c, bx, 7, 28, 40, "#8a5a3a");
  const bookCols = ["#c84a3a", "#2068cc", "#f0b94a", "#5f7f4a", "#b98ae8", "#e88fc0", "#7cc8e0", "#e0735c"];
  for (let shelf = 0; shelf < 3; shelf++) {
    const sy = 9 + shelf * 12;
    px(c, bx + 1, sy + 10, 26, 2, "#5e3a22");
    let x = bx + 2;
    let k = shelf * 3;
    while (x < bx + 25) {
      const bw = 2 + ((k * 7) % 3);
      const bh = 7 + ((k * 5) % 3);
      px(c, x, sy + 10 - bh, bw, bh, bookCols[k % bookCols.length]);
      px(c, x, sy + 10 - bh, bw, 1, "rgba(255,255,255,0.35)");
      x += bw + 1;
      k++;
    }
  }

  // ---- plants
  const plant = (x: number) => {
    px(c, x + 4, 2 * RT + 8, 8, 7, "#a85a36");
    px(c, x + 4, 2 * RT + 8, 8, 2, "#c8744a");
    px(c, x + 2, 2 * RT - 4, 12, 12, "#2f6b30");
    px(c, x + 4, 2 * RT - 8, 8, 6, "#4f9a45");
    px(c, x + 6, 2 * RT - 10, 3, 4, "#63b455");
  };
  plant(4 * RT);
  plant(11 * RT);

  // ---- trophy cabinet (tiles 5–6)
  const tx = 5 * RT + 1;
  px(c, tx - 1, 2 * RT - 8, 32, 24, "#3a2616");
  px(c, tx, 2 * RT - 7, 30, 22, "#7d5228");
  px(c, tx + 2, 2 * RT - 5, 26, 8, "#23303e");
  px(c, tx + 2, 2 * RT + 5, 26, 8, "#5e3a22");
  [[5, "#f0b94a"], [13, "#cdd6e0"], [21, "#c8744a"]].forEach(([ox, col]) => {
    px(c, tx + (ox as number), 2 * RT - 4, 4, 4, col as string); // cup
    px(c, tx + (ox as number) + 1, 2 * RT, 2, 2, col as string); // stem
  });

  // ---- desk + PC (tiles 8–9)
  const dx = 8 * RT;
  px(c, dx - 1, 2 * RT - 2, 34, 18, "#3a2616");
  px(c, dx, 2 * RT - 1, 32, 6, "#a9743f"); // desktop
  px(c, dx, 2 * RT + 5, 32, 10, "#7d5228");
  px(c, dx + 2, 2 * RT + 6, 12, 8, "#6a4a2e"); // drawer
  px(c, dx + 7, 2 * RT + 9, 3, 1, "#f0b94a");
  // monitor
  px(c, dx + 12, 2 * RT - 18, 18, 14, "#1a1a22");
  px(c, dx + 14, 2 * RT - 16, 14, 10, night ? "#2a6b8a" : "#3f8fb5");
  px(c, dx + 15, 2 * RT - 15, 6, 1, "#f0b94a");
  px(c, dx + 15, 2 * RT - 13, 10, 1, "#cfe8f5");
  px(c, dx + 15, 2 * RT - 11, 8, 1, "#cfe8f5");
  px(c, dx + 19, 2 * RT - 4, 4, 3, "#1a1a22"); // stand
  px(c, dx + 13, 2 * RT - 2, 16, 2, "#2a2a32"); // keyboard
  px(c, dx + 3, 2 * RT - 6, 6, 5, "#f0b94a"); // desk lamp
  px(c, dx + 5, 2 * RT - 1, 2, 1, "#2a2a32");
  // chair
  px(c, dx + 12, 3 * RT + 2, 10, 8, "#c84a3a");
  px(c, dx + 12, 3 * RT + 2, 10, 2, "#e0735c");

  // ---- rug
  px(c, 3 * RT, 4 * RT + 4, 5 * RT, 3 * RT - 4, "#2b4a7a");
  px(c, 3 * RT + 3, 4 * RT + 7, 5 * RT - 6, 3 * RT - 10, "#3a64a3");
  for (let x = 3 * RT + 6; x < 8 * RT - 6; x += 8) px(c, x, 5 * RT + 6, 4, 4, "#f0b94a");

  // ---- bed (tiles 10–11, rows 5–7)
  const by = 5 * RT;
  const bxx = 10 * RT;
  px(c, bxx - 1, by - 1, 34, 3 * RT + 2, "#3a2616");
  px(c, bxx, by, 32, 8, "#8a5a3a"); // headboard
  px(c, bxx + 2, by + 8, 28, 3 * RT - 10, "#f6ead2"); // sheet
  px(c, bxx + 4, by + 9, 24, 7, "#ffffff"); // pillow
  px(c, bxx + 2, by + 20, 28, 3 * RT - 22, "#2068cc"); // blanket
  px(c, bxx + 2, by + 20, 28, 2, "#4a90e2");

  // ---- door mat (exit)
  px(c, 5 * RT - 4, 8 * RT + 4, 2 * RT + 8, 12, "#7a3a2a");
  px(c, 5 * RT - 2, 8 * RT + 6, 2 * RT + 4, 8, "#a8543a");
  return cv;
}

/** Night light sources inside the room (desk lamp, monitor). */
export const ROOM_LIGHTS = [
  { x: 8 * RT + 6, y: 2 * RT - 4, r: 46 },
  { x: 8 * RT + 21, y: 2 * RT - 11, r: 34 },
  { x: 3 * RT + 2, y: 14, r: 30 },
];
