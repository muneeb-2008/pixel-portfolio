import type { Gem } from "@/game/types";

/**
 * Hidden gems — each tucked directly behind a tree, under its canopy, so you
 * only spot one by walking around the back (a glint appears when you're close).
 * The minimap deliberately doesn't show them.
 */
export const gems: Gem[] = [
  { id: "gem-1", tx: 15, ty: 3, color: "#e46a4b" },
  { id: "gem-2", tx: 4, ty: 14, color: "#7cc8e0" },
  { id: "gem-3", tx: 14, ty: 30, color: "#f0b94a" },
  { id: "gem-4", tx: 20, ty: 8, color: "#b98ae8" },
  { id: "gem-5", tx: 50, ty: 3, color: "#8fcf5e" },
  { id: "gem-6", tx: 38, ty: 14, color: "#e88fc0" },
  { id: "gem-7", tx: 50, ty: 23, color: "#7cc8e0" },
  { id: "gem-8", tx: 34, ty: 24, color: "#f0b94a" },
];
