import type { Npc } from "@/game/types";

/**
 * NPC pool. One is chosen at random each time a project door is entered, so
 * encounters feel varied. `{project}` in a line is replaced with the project
 * title at runtime. Dialogue is PLACEHOLDER flavour text — edit freely.
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
      "Oh! A visitor! Welcome, welcome.",
      "This here is “{project}”. Took ages, that one.",
      "Go on — take a proper look inside!",
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
      "You seek the story behind “{project}”?",
      "Every pixel here was placed with intent.",
      "Study it well, traveler.",
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
      "Fast! You want the quick version of “{project}”?",
      "Great work, shipped on time. Boom.",
      "Details are inside — gotta run!",
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
      "Hmph. So you found “{project}”.",
      "Solid craft. I don't say that often.",
      "…Well? The door's open. In you go.",
    ],
  },
];
