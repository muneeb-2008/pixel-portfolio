import type { Villager } from "@/game/types";

/**
 * Wandering villagers. They reuse an NPC's look (see npcs.ts), stroll around
 * their home tile, and share tips when you talk to them (Enter / A nearby).
 * Lines point visitors toward the work, in Muneeb's voice.
 */
export const villagers: Villager[] = [
  {
    id: "v-pip",
    npc: "pip",
    home: { tx: 27, ty: 23 },
    range: 3,
    lines: [
      "Welcome in. Every building in this town holds a real project Muneeb worked on.",
      "Short on time? Press L for the Quest Log. Every project is listed there, no walking required.",
      "If you like exploring, 8 gems are hidden behind the trees. Walk around the back and watch for a glint.",
    ],
  },
  {
    id: "v-mara",
    npc: "mara",
    home: { tx: 9, ty: 15 },
    range: 2,
    lines: [
      "This is the Design District. Product work lives here: dashboards, platforms, complex systems made simple.",
      "Start with the Mortime AI Dashboard. It turned a messy automation system into one clear view.",
    ],
  },
  {
    id: "v-bolt",
    npc: "bolt",
    home: { tx: 44, ty: 16 },
    range: 3,
    lines: [
      "Dev District. This is where designs stop being mockups and become real, working sites.",
      "Figma first, Framer after. Solve the experience, then build it properly.",
    ],
  },
  {
    id: "v-tom",
    npc: "tom",
    home: { tx: 29, ty: 10 },
    range: 2,
    lines: [
      "The Agency Hall. Client work from Xtarc, end to end.",
      "Seen something you like? The mailbox by the square goes straight to Muneeb's inbox.",
    ],
  },
];
