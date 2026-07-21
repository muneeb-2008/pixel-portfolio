/**
 * Case study content schema.
 *
 * Content that Muneeb has not supplied yet is marked with `todo("...")`
 * rather than invented. Components render a visible "content needed"
 * marker for TODOs, and skip sections that are absent entirely.
 */

/* ------------------------------------------------------------------ *
 * TODO system
 * ------------------------------------------------------------------ */

export type Todo = { readonly __todo: true; readonly note: string };

/** Mark a field as awaiting real content. The note is shown in the UI. */
export const todo = (note: string): Todo => ({ __todo: true, note });

export function isTodo(value: unknown): value is Todo {
  return typeof value === "object" && value !== null && "__todo" in value;
}

/** A field that may still be awaiting content. */
export type Pending<T> = T | Todo;

/** Narrow to real content — returns null for TODO or absent values. */
export function resolve<T>(value: Pending<T> | undefined): T | null {
  if (value === undefined || isTodo(value)) return null;
  return value;
}

/** The note attached to a TODO, or null when the value is real content. */
export function todoNote(value: unknown): string | null {
  return isTodo(value) ? value.note : null;
}

/** True when a list field has usable content. */
export function hasItems<T>(value: Pending<T[]> | undefined): boolean {
  const list = resolve(value);
  return Array.isArray(list) && list.length > 0;
}

/* ------------------------------------------------------------------ *
 * Content primitives
 * ------------------------------------------------------------------ */

export type Metric = {
  value: string;
  label: string;
  /** How it was measured — required to publish a number honestly. */
  source?: string;
};

export type Insight = { title: string; body: string };

export type Principle = { title: string; body: string };

export type Quote = { quote: string; name: string; title: string };

export type ResearchActivity = {
  method: string;
  detail: string;
  sample?: string;
};

/** A single product decision, told as reasoning rather than description. */
export type DecisionRecord = {
  id: string;
  title: string;
  /** What problem existed. */
  problem: string;
  /** What options were considered. */
  options: string[];
  /** Which decision was made. */
  decision: string;
  /** Why it was selected. */
  rationale: string;
  /** What trade-off it introduced. */
  tradeoff: string;
  /** What result followed. */
  result: string;
};

export type FlowStep = {
  label: string;
  detail?: string;
  /** Marks a decision point or alternate path. */
  branch?: string;
};

export type IaNode = { label: string; children?: string[] };

export type TestingRecord = {
  method: string;
  participants?: string;
  finding: string;
  change: string;
};

export type DesignSystemSpec = {
  summary: string;
  typography?: string;
  tokens?: { name: string; value: string }[];
  components?: string[];
};

export type CollaborationNote = { title: string; body: string };

/* ------------------------------------------------------------------ *
 * AI product design (Step 9) — never present AI as magic
 * ------------------------------------------------------------------ */

export type AiBehaviour = {
  userIntent: string;
  aiInput: string;
  aiOutput: string;
  confidence: string;
  loading: string;
  errors: string;
  humanControl: string;
  editing: string;
  explainability: string;
  feedback: string;
  privacy: string;
  failureRecovery: string;
  automation: string;
};

/* ------------------------------------------------------------------ *
 * Media
 * ------------------------------------------------------------------ */

export type MediaItem = {
  src: string;
  /** Descriptive alt text — required. */
  alt: string;
  caption?: string;
  width: number;
  height: number;
  /** Layout intent within the media system. */
  layout?: "full" | "inset" | "half";
};

export type VideoItem = {
  src: string;
  poster: string;
  caption: string;
  /** Text description for users who cannot play the video. */
  description: string;
};

export type BeforeAfter = {
  before: MediaItem;
  after: MediaItem;
  summary: string;
};

/* ------------------------------------------------------------------ *
 * Per-project art direction (Step 6)
 *
 * Shared across all projects: typography, navigation, grid, spacing,
 * motion quality, accessibility. Varied per project: the fields below.
 * ------------------------------------------------------------------ */

export type ProjectTheme = {
  /** Scoped accent — overrides --accent inside the article only. */
  accent: string;
  accentSoft: string;
  /** Vertical rhythm / whitespace. */
  density: "airy" | "balanced" | "dense";
  /** How media is framed. */
  mediaFrame: "bleed" | "inset" | "stacked";
  /** Diagram treatment for flows and IA. */
  diagram: "linear" | "branching" | "layered";
  /** Section cadence. */
  rhythm: "editorial" | "systematic" | "cinematic";
};

export type CaseStudySeo = {
  title: string;
  description: string;
  /** Headline drawn on the generated social image. */
  ogHeadline: string;
};

/* ------------------------------------------------------------------ *
 * The case study
 * ------------------------------------------------------------------ */

export type CaseStudy = {
  /* Identity */
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  industry: string;
  year: string;
  duration: Pending<string>;
  role: string;
  team: Pending<string[]>;
  services: string[];
  client: Pending<string>;

  /* Framing */
  heroStatement: string;
  shortSummary: string;

  /* Story */
  challenge: Pending<string>;
  users: Pending<{ group: string; need: string }[]>;
  businessContext: Pending<string>;
  constraints: Pending<string[]>;
  responsibilities: Pending<string[]>;

  /* Discovery */
  research: Pending<ResearchActivity[]>;
  insights: Pending<Insight[]>;
  productPrinciples: Pending<Principle[]>;

  /* Structure */
  informationArchitecture: Pending<IaNode[]>;
  userFlows: Pending<{ name: string; steps: FlowStep[] }[]>;

  /* Decisions */
  interactionDecisions: Pending<DecisionRecord[]>;
  aiBehaviour?: Pending<AiBehaviour>;

  /* Craft */
  designSystem: Pending<DesignSystemSpec>;
  prototypes: Pending<VideoItem[]>;
  testing: Pending<TestingRecord[]>;
  developmentCollaboration: Pending<CollaborationNote[]>;

  /* Result */
  outcomes: Pending<string[]>;
  metrics: Pending<Metric[]>;
  testimonial: Pending<Quote>;
  lessons: Pending<string[]>;

  /* Media */
  heroMedia: Pending<MediaItem>;
  gallery: Pending<MediaItem[]>;
  beforeAfter?: Pending<BeforeAfter>;

  /* Presentation */
  theme: ProjectTheme;
  seo: CaseStudySeo;

  /** Only published studies get a route. */
  published: boolean;
};
