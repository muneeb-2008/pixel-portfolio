import type { WorldData } from "@/game/types";

/**
 * The overworld map, in tile coordinates (16px tiles).
 * Buildings link to projects; a 2-tile forest border rings the map.
 * Everything is data — nudge these numbers to re-lay the world.
 */
export const world: WorldData = {
  cols: 54,
  rows: 38,
  tile: 16,
  spawn: { tx: 26, ty: 20 },

  zones: [
    { id: "design", name: "Design District", kind: "design", rect: { x: 2, y: 3, w: 16, h: 31 } },
    { id: "agency", name: "Agency Hall", kind: "agency", rect: { x: 19, y: 2, w: 16, h: 10 } },
    { id: "hub", name: "Town Square", kind: "hub", rect: { x: 19, y: 13, w: 16, h: 14 } },
    { id: "dev", name: "Development District", kind: "dev", rect: { x: 36, y: 3, w: 16, h: 31 } },
  ],

  // Walkable path tiles (purely visual — grass is walkable too)
  paths: [
    { x: 2, y: 18, w: 50, h: 3 }, // main boulevard
    { x: 25, y: 2, w: 3, h: 19 }, // agency ↕ hub spine
    { x: 19, y: 16, w: 16, h: 6 }, // hub plaza
    { x: 22, y: 7, w: 11, h: 2 }, // agency approach
    { x: 5, y: 10, w: 2, h: 9 },
    { x: 12, y: 10, w: 2, h: 9 },
    { x: 5, y: 21, w: 2, h: 10 }, // design-3: down the side…
    { x: 5, y: 29, w: 6, h: 2 }, // …then round to its south-facing door
    { x: 40, y: 10, w: 2, h: 9 },
    { x: 47, y: 10, w: 2, h: 9 },
    { x: 44, y: 21, w: 2, h: 8 }, // dev district: a lane down to the pond
  ],

  water: [{ x: 46, y: 30, w: 5, h: 4 }],

  // `skin` picks the exterior to match each project's vibe (all 5 skins used).
  buildings: [
    { id: "b-d1", projectId: "mortime-dashboard", style: "design", skin: "studio", tx: 4, ty: 6, w: 4, h: 4 },
    { id: "b-d2", projectId: "auton8", style: "design", skin: "store", tx: 11, ty: 6, w: 4, h: 4 },
    { id: "b-d3", projectId: "soal-labs", style: "design", skin: "shop", tx: 7, ty: 25, w: 4, h: 4 },
    { id: "b-v1", projectId: "pixel-portfolio", style: "dev", skin: "workshop", tx: 39, ty: 6, w: 4, h: 4 },
    { id: "b-v2", projectId: "design-build", style: "dev", skin: "studio", tx: 46, ty: 6, w: 4, h: 4 },
    { id: "b-a1", projectId: "mortime", style: "agency", skin: "tower", tx: 22, ty: 3, w: 4, h: 4 },
    { id: "b-a2", projectId: "xtarc", style: "agency", skin: "store", tx: 28, ty: 3, w: 4, h: 4 },
  ],

  about: { tx: 20, ty: 14, w: 4, h: 4 },
  mailbox: { tx: 31, ty: 17 },

  // Signs sit beside the roads, never on them, so they guide without blocking.
  signs: [
    { tx: 17, ty: 17, label: "DESIGN", sub: "◀" },
    { tx: 36, ty: 17, label: "DEV", sub: "▶" },
    { tx: 24, ty: 12, label: "AGENCY", sub: "▲" },
  ],

  trees: [
    // design
    { x: 3, y: 4 }, { x: 15, y: 4 }, { x: 4, y: 15 }, { x: 16, y: 12 },
    { x: 3, y: 23 }, { x: 15, y: 24 }, { x: 5, y: 32 }, { x: 14, y: 31 },
    // dev
    { x: 37, y: 4 }, { x: 50, y: 4 }, { x: 38, y: 15 }, { x: 50, y: 12 },
    { x: 37, y: 23 }, { x: 50, y: 24 }, { x: 38, y: 31 },
    // agency
    { x: 20, y: 9 }, { x: 33, y: 9 },
    // hub edges
    { x: 19, y: 25 }, { x: 34, y: 25 },
  ],

  flowers: [
    { x: 7, y: 17 }, { x: 29, y: 19 }, { x: 23, y: 21 },
    { x: 45, y: 17 }, { x: 10, y: 20 }, { x: 40, y: 20 }, { x: 30, y: 21 },
  ],
};
