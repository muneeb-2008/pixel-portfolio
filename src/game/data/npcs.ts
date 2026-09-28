import type { Npc } from "@/game/types";

/**
 * NPC pool. One is chosen at random each time a project door is entered, so
 * encounters feel varied. `{project}` in a line is replaced with the project
 * title at runtime.
 */
export const npcs: Npc[] = [
  {
    id: "pip",
    name: "Pip",
    role: "Town Guide",
    hat: "cap",
    palette: {
      skin: "#f2c79a",
      hair: "#b5651d",
      shirt: "#e0533b",
      pants: "#3a5a40",
      shoes: "#2b2018",
      outline: "#141019",
    },
    lines: [
      "Oh, a visitor. Welcome.",
      "This is “{project}”. Real client, real problem.",
      "Go on in. The whole story is inside.",
    ],
  },
  {
    id: "mara",
    name: "Mara",
    role: "The Archivist",
    hat: "wizard",
    palette: {
      skin: "#e8b98a",
      hair: "#d8d8e0",
      shirt: "#5b3a9e",
      pants: "#2c2740",
      shoes: "#1c1830",
      outline: "#120f18",
    },
    lines: [
      "Curious about “{project}”?",
      "The details matter here, but the problem mattered more.",
      "Take your time with it.",
    ],
  },
  {
    id: "bolt",
    name: "Bolt",
    role: "Courier",
    hat: "band",
    palette: {
      skin: "#c98a5a",
      hair: "#20242c",
      shirt: "#f2b134",
      pants: "#2b6ca3",
      shoes: "#20242c",
      outline: "#141019",
    },
    lines: [
      "Want the short version of “{project}”?",
      "Complex idea in, clear product out.",
      "The rest is inside. Have a look.",
    ],
  },
  {
    id: "tom",
    name: "Old Tom",
    role: "Gatekeeper",
    hat: "none",
    palette: {
      skin: "#d8a878",
      hair: "#c8c2b4",
      shirt: "#4a5b3a",
      pants: "#3a3226",
      shoes: "#241c14",
      outline: "#14100a",
    },
    lines: [
      "So you found “{project}”.",
      "Simple on the surface. A lot of thinking underneath.",
      "The door's open. In you go.",
    ],
  },
];
