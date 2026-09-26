import type { Gem } from "@/game/types";

/**
 * Hidden gems — tucked into corners, behind trees and by the pond so that
 * exploring every district pays off. Positions are grass tiles (tile coords).
 */
export const gems: Gem[] = [
  { id: "gem-1", tx: 16, ty: 8, color: "#e46a4b" },
  { id: "gem-2", tx: 3, ty: 33, color: "#7cc8e0" },
  { id: "gem-3", tx: 33, ty: 4, color: "#f0b94a" },
  { id: "gem-4", tx: 20, ty: 4, color: "#b98ae8" },
  { id: "gem-5", tx: 50, ty: 15, color: "#8fcf5e" },
  { id: "gem-6", tx: 37, ty: 33, color: "#e88fc0" },
  { id: "gem-7", tx: 51, ty: 33, color: "#7cc8e0" },
  { id: "gem-8", tx: 33, ty: 24, color: "#f0b94a" },
];
