import type { Palette, HatKind } from "@/game/types";

/** Contact "mailbox" content — PLACEHOLDER details to replace. */
export const contact = {
  heading: "Send a Letter",
  note: "Drop a message in the mailbox. (Placeholder form — wire it to your email or a form service.)",
  email: "you@example.com", // PLACEHOLDER
};

/** The innkeeper who narrates the About conversation. */
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
