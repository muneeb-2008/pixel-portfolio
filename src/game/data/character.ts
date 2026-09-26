import type { Character } from "@/game/types";

/**
 * The player character (you).
 * NAME / TITLE / TAGLINE are PLACEHOLDER — swap for your real details.
 * Stat labels are your real skill set; levels are PLACEHOLDER values.
 */
export const character: Character = {
  name: "YOUR NAME", // PLACEHOLDER
  title: "Designer · Developer · Agency Operator", // PLACEHOLDER
  tagline: "Level 99 generalist. Currently exploring the overworld.", // PLACEHOLDER
  palette: {
    skin: "#f0c088",
    hair: "#3a2a1a",
    shirt: "#2068cc", // brand-accent hero
    pants: "#38424f",
    shoes: "#20242c",
    outline: "#141019",
  },
  stats: [
    { key: "vibecoding", label: "Vibecoding", level: 9, max: 10, blurb: "Ship-first, flow-state building with AI copilots." },
    { key: "framer", label: "Framer Dev", level: 8, max: 10, blurb: "Production sites & interactions in Framer." },
    { key: "uiux", label: "UI / UX Design", level: 9, max: 10, blurb: "Interfaces people understand at a glance." },
    { key: "brand", label: "Brand Design", level: 8, max: 10, blurb: "Identity systems with a point of view." },
    { key: "ads", label: "Ad Creation", level: 7, max: 10, blurb: "Scroll-stopping creative that converts." },
    { key: "aivideo", label: "AI Video Gen", level: 7, max: 10, blurb: "Generative motion & video pipelines." },
  ],
};
