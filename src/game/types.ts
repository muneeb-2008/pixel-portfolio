export type Vec = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type Dir = "down" | "up" | "left" | "right";
export type ZoneKind = "design" | "dev" | "agency" | "hub";

/** Animation frame: 0 = idle-neutral, 2 = idle-breath, 1/3 = walk strides. */
export type AnimFrame = 0 | 1 | 2 | 3;

/** Distinct building exteriors so each project's storefront matches its vibe. */
export type BuildingSkin = "shop" | "store" | "studio" | "tower" | "workshop";

/** Colour set for a pixel character — palette-swapped per NPC. */
export type Palette = {
  skin: string;
  hair: string;
  shirt: string;
  pants: string;
  shoes: string;
  outline: string;
};

export type HatKind = "none" | "cap" | "wizard" | "band";

export type Stat = {
  key: string;
  label: string;
  level: number; // 0..max
  max: number;
  /** one-line hook, e.g. "Design that makes sense." */
  headline: string;
  blurb: string;
  /** RPG class this skill unlocks, e.g. "Product Designer" */
  klass: string;
};

export type Character = {
  name: string;
  title: string;
  tagline: string;
  /** hero copy shown on the title screen */
  intro: string[];
  /** "Player profile" rows on the character sheet */
  profile: { label: string; value: string }[];
  palette: Palette;
  stats: Stat[];
};

export type Npc = {
  id: string;
  name: string;
  role: string;
  palette: Palette;
  hat: HatKind;
  /** Dialogue lines. `{project}` is replaced with the project title. */
  lines: string[];
};

export type Project = {
  id: string;
  zone: ZoneKind;
  title: string;
  kind: string;
  /** paragraphs of the write-up */
  body: string[];
  /** 16:9 images under /public (first = cover); [] = styled empty slot */
  gallery: string[];
  tags: string[];
  /** external case study / site */
  link?: { label: string; url: string };
  /** two short lines painted on the building's sign plate */
  banner: [string, string];
  /** optional case-study sections — each renders only when filled in */
  caseStudy?: {
    role?: string;
    problem?: string;
    process?: string[];
    decision?: string;
    outcome?: string;
  };
};

export type Building = {
  id: string;
  projectId: string;
  style: ZoneKind; // roof palette (keeps districts colour-cohesive)
  skin: BuildingSkin; // exterior shape/details matching the project vibe
  tx: number;
  ty: number;
  w: number;
  h: number;
};

export type Sign = { tx: number; ty: number; label: string; sub?: string };

/** A hidden gem the player can pick up by walking over it. */
export type Gem = { id: string; tx: number; ty: number; color: string };

/** A villager who wanders a small patch of town and can be talked to. */
export type Villager = {
  id: string;
  npc: string; // Npc id — reuses that NPC's look
  home: { tx: number; ty: number };
  range: number; // tiles they may wander from home
  lines: string[];
};
export type Zone = { id: string; name: string; kind: ZoneKind; rect: Rect };

export type WorldData = {
  cols: number;
  rows: number;
  tile: number;
  spawn: { tx: number; ty: number };
  zones: Zone[];
  paths: Rect[];
  water: Rect[];
  trees: Vec[];
  flowers: Vec[];
  buildings: Building[];
  signs: Sign[];
  about: { tx: number; ty: number; w: number; h: number };
  mailbox: { tx: number; ty: number };
};
