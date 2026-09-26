import { projects } from "@/game/data/projects";
import { gems } from "@/game/data/collectibles";
import { villagers } from "@/game/data/villagers";

/**
 * Save state + everything derived from it (XP, level, achievements).
 * Only facts are stored; XP and achievements are recomputed, so they can
 * never drift out of sync with what the player has actually done.
 */
export type Save = {
  visited: string[]; // project ids
  gems: string[];
  talked: string[]; // villager ids
  about: boolean;
  mail: boolean;
};

export const EMPTY_SAVE: Save = { visited: [], gems: [], talked: [], about: false, mail: false };

const KEY = "pixel-portfolio:save:v2";

export function loadSave(): Save {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_SAVE;
    const s = JSON.parse(raw) as Partial<Save>;
    return {
      visited: (s.visited ?? []).filter((id) => projects.some((p) => p.id === id)),
      gems: (s.gems ?? []).filter((id) => gems.some((g) => g.id === id)),
      talked: (s.talked ?? []).filter((id) => villagers.some((v) => v.id === id)),
      about: !!s.about,
      mail: !!s.mail,
    };
  } catch {
    return EMPTY_SAVE;
  }
}

export function writeSave(s: Save) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode — progress just won't persist */
  }
}

export const hasProgress = (s: Save) =>
  s.visited.length + s.gems.length + s.talked.length > 0 || s.about || s.mail;

/* ---------------- XP ---------------- */
export const XP = { project: 60, gem: 20, talk: 10, about: 30, mail: 30 } as const;
export const XP_PER_LEVEL = 100;

export function xpOf(s: Save) {
  return (
    s.visited.length * XP.project +
    s.gems.length * XP.gem +
    s.talked.length * XP.talk +
    (s.about ? XP.about : 0) +
    (s.mail ? XP.mail : 0)
  );
}

export function levelOf(xp: number) {
  return { level: Math.floor(xp / XP_PER_LEVEL) + 1, into: xp % XP_PER_LEVEL, need: XP_PER_LEVEL };
}

/* ---------------- achievements ---------------- */
export type Achievement = { id: string; name: string; desc: string; icon: string; test: (s: Save) => boolean };

const districtDone = (s: Save, zone: string) =>
  projects.filter((p) => p.zone === zone).every((p) => s.visited.includes(p.id));

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first", name: "First Steps", desc: "Discover your first project.", icon: "door", test: (s) => s.visited.length > 0 },
  { id: "design", name: "Design Scholar", desc: "Visit every Design District project.", icon: "brush", test: (s) => districtDone(s, "design") },
  { id: "dev", name: "Code Wrangler", desc: "Visit every Development District project.", icon: "gear", test: (s) => districtDone(s, "dev") },
  { id: "agency", name: "Agency Insider", desc: "Visit every Agency Hall project.", icon: "flag", test: (s) => districtDone(s, "agency") },
  { id: "gems", name: "Treasure Hunter", desc: `Find all ${gems.length} hidden gems.`, icon: "gem", test: (s) => s.gems.length === gems.length },
  { id: "talk", name: "Town Gossip", desc: "Chat with every villager.", icon: "chat", test: (s) => s.talked.length === villagers.length },
  { id: "about", name: "Know the Maker", desc: "Hear the innkeeper's story.", icon: "book", test: (s) => s.about },
  { id: "mail", name: "Pen Pal", desc: "Open the mailbox.", icon: "mail", test: (s) => s.mail },
  { id: "all", name: "Legend of the Town", desc: "Discover every project.", icon: "crown", test: (s) => s.visited.length === projects.length },
];

export const unlockedIds = (s: Save) => ACHIEVEMENTS.filter((a) => a.test(s)).map((a) => a.id);
