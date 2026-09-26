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
      "Psst… there are 8 gems hidden around town. I've only ever found one.",
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
      "Heard there's a gem down by the pond. Can't swim, though.",
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
