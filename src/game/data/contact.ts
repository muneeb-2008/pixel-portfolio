import type { Palette, HatKind } from "@/game/types";

/** Contact — "The Exit". The mailbox in the town square opens this. */
export const contact = {
  heading: "Let's build something.",
  lines: [
    "You made it this far.",
    "That probably means you found something interesting.",
    "I'm always open to interesting products, websites, collaborations, and creative work.",
  ],
  email: "muneebqureshi411@gmail.com",
  links: [{ label: "LinkedIn", url: "https://www.linkedin.com/in/muneeb-qureshi-b4a38337b" }],
};

/** Portrait for NPC-less narration (kept for any future innkeeper lines). */
export const innkeeperPortrait: { palette: Palette; hat: HatKind } = {
  palette: {
    skin: "#eab88a",
    hair: "#7a5230",
    shirt: "#8a5a3a",
    pants: "#4a3728",
    shoes: "#2a1f16",
    outline: "#14100a",
  },
  hat: "none",
};
