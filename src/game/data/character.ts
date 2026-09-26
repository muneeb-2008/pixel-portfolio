import type { Character } from "@/game/types";

/**
 * The player character (you). Skill levels are self-assessed — tweak freely.
 */
export const character: Character = {
  name: "Muneeb Qureshi",
  title: "Product Designer · UI/UX Designer · Framer Developer",
  tagline: "Building better digital experiences.",
  intro: [
    "I design digital products, websites, and brand systems that turn ideas into clear experiences.",
    "Currently designing at Xtarc and exploring the intersection of design, technology, AI, and motion.",
  ],
  profile: [
    { label: "Name", value: "Muneeb Qureshi" },
    { label: "Role", value: "Product Designer" },
    { label: "Specialization", value: "UI/UX · Product Design · Framer · Brand Design" },
    { label: "Current guild", value: "Xtarc" },
    { label: "Loadout", value: "Figma · Framer · AI · Motion · Design Systems" },
    { label: "Current quest", value: "Building better digital experiences." },
  ],
  palette: {
    skin: "#f0c088",
    hair: "#3a2a1a",
    shirt: "#2068cc", // brand-accent hero
    pants: "#38424f",
    shoes: "#20242c",
    outline: "#141019",
  },
  stats: [
    {
      key: "uiux",
      label: "UI / UX Design",
      level: 9,
      max: 10,
      headline: "Design that makes sense.",
      blurb: "User flows, interfaces, responsive layouts, prototypes, design systems, and product experiences.",
      klass: "Product Designer",
    },
    {
      key: "product",
      label: "Product Design",
      level: 9,
      max: 10,
      headline: "From idea to interface.",
      blurb: "I turn product requirements into structured experiences that are easy to understand and use.",
      klass: "Product Design",
    },
    {
      key: "framer",
      label: "Framer Development",
      level: 9,
      max: 10,
      headline: "Design it. Build it. Ship it.",
      blurb: "I turn Figma designs into responsive websites with interactions, animations, CMS, and polished details.",
      klass: "Framer Developer",
    },
    {
      key: "brand",
      label: "Brand Design",
      level: 8,
      max: 10,
      headline: "Make it recognizable.",
      blurb: "Visual identities, typography, color systems, landing pages, and brand applications built around a clear direction.",
      klass: "Brand Designer",
    },
    {
      key: "ai",
      label: "AI Workflows",
      level: 8,
      max: 10,
      headline: "Design with AI in the loop.",
      blurb: "I use AI to speed up exploration, generate ideas, build faster, and improve creative workflows.",
      klass: "AI Workflow",
    },
    {
      key: "motion",
      label: "Motion & Interaction",
      level: 8,
      max: 10,
      headline: "Static is not the whole experience.",
      blurb: "I use motion and interaction to guide attention, explain ideas, and make digital experiences feel alive.",
      klass: "Interaction Designer",
    },
  ],
};
