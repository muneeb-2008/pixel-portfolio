import type { Villager } from "@/game/types";

/**
 * Wandering villagers. They reuse an NPC's look (see npcs.ts), stroll around
 * their home tile, and share tips when you talk to them (Enter / A nearby).
 * Lines are PLACEHOLDER flavour — edit freely.
 */
export const villagers: Villager[] = [
  {
    id: "v-pip",
    npc: "pip",
    home: { tx: 27, ty: 23 },
    range: 3,
    lines: [
      "Welcome to town, traveler! Every building here holds a project.",
      "Lost? Your Quest Log (L) lists every one — you can open them from there too.",
      "Psst… 8 gems are hidden around town — each one tucked behind a tree. Walk round the back and watch for a glint.",
    ],
  },
  {
    id: "v-mara",
    npc: "mara",
    home: { tx: 9, ty: 15 },
    range: 2,
    lines: [
      "The Design District. Every storefront here was drawn by hand, pixel by pixel.",
      "Visit all three buildings and the district earns its stamp.",
    ],
  },
  {
    id: "v-bolt",
    npc: "bolt",
    home: { tx: 44, ty: 16 },
    range: 3,
    lines: [
      "Dev District! Code, tools, automations — the works.",
      "Heard there are gems behind the trees out east. I'm too busy delivering to look.",
    ],
  },
  {
    id: "v-tom",
    npc: "tom",
    home: { tx: 29, ty: 10 },
    range: 2,
    lines: [
      "Hmph. The Agency Hall. Client work, end to end.",
      "Seen everything? Then drop a letter in the mailbox by the square.",
    ],
  },
];
