/**
 * PLACEHOLDER project content.
 *
 * All six projects are fictional, written to demonstrate the layout and the
 * detail-page template. No real client, engagement, or result is represented.
 * Covers are composed in CSS from each project's accent — no stock images.
 * Replace before launch.
 */

export type ProjectSection = {
  heading: string;
  body: string;
  /** Optional gallery: aspect ratios for composed placeholder media. */
  gallery?: { ratio: string; label: string }[];
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  role: string;
  client: string; // placeholder
  accent: string;
  summary: string;
  overview: string;
  meta: { label: string; value: string }[];
  sections: ProjectSection[];
  /** Qualitative — never a fabricated metric. */
  outcome: string;
};

export const projects: Project[] = [
  {
    slug: "aurora-banking",
    index: "01",
    title: "Aurora",
    tagline: "A calm banking app for people who hate banking apps",
    category: "Product · Brand",
    year: "2025",
    role: "Strategy, Product Design, Motion",
    client: "Aurora (demo)",
    accent: "#e8552b",
    summary:
      "Rethinking a mobile bank around clarity and confidence — from the balance you see first to the way money moves.",
    overview:
      "Aurora came to us with a familiar problem: a feature-rich app that people found stressful to open. We reframed the product around a single question — does this help someone feel in control of their money right now?",
    meta: [
      { label: "Role", value: "Strategy · Product · Motion" },
      { label: "Timeline", value: "14 weeks (demo)" },
      { label: "Team", value: "2 designers, 1 PM (demo)" },
      { label: "Year", value: "2025" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "The old app surfaced everything at once. Users opened it to check a balance and left overwhelmed. We audited every screen and cut the interface down to the decisions people actually make.",
        gallery: [
          { ratio: "3/4", label: "Home — before / after" },
          { ratio: "3/4", label: "Transfer flow" },
        ],
      },
      {
        heading: "The system",
        body: "A restrained type scale, generous spacing, and motion that explains where money goes rather than decorating the screen. Every state — loading, error, success — was designed, not left to chance.",
        gallery: [{ ratio: "16/10", label: "Design system overview" }],
      },
    ],
    outcome:
      "Demo outcome — the redesign reframes the product around control and clarity; a person can check a balance and act without friction.",
  },
  {
    slug: "meridian-os",
    index: "02",
    title: "Meridian",
    tagline: "An operating layer for distributed research teams",
    category: "Product · Design System",
    year: "2025",
    role: "Product Design, Design System",
    client: "Meridian (demo)",
    accent: "#2e6be6",
    summary:
      "A workspace that keeps fast-moving research legible — structure without slowing anyone down.",
    overview:
      "Meridian's teams generated more knowledge than they could organise. We designed a flexible structure that stays out of the way until it's needed, and a design system to keep it coherent as the product grows.",
    meta: [
      { label: "Role", value: "Product · Design System" },
      { label: "Timeline", value: "5 months (demo)" },
      { label: "Team", value: "3 designers (demo)" },
      { label: "Year", value: "2025" },
    ],
    sections: [
      {
        heading: "Structure that bends",
        body: "Rigid hierarchies break under real work. We designed containers that reshape to the task — a document, a board, a thread — sharing one underlying model so nothing is ever lost.",
        gallery: [{ ratio: "16/10", label: "Workspace shell" }],
      },
      {
        heading: "One system, many surfaces",
        body: "Tokens, components, and motion rules that scaled from a dense table to a focused reading view without a single one-off.",
        gallery: [
          { ratio: "1/1", label: "Tokens" },
          { ratio: "1/1", label: "Components" },
        ],
      },
    ],
    outcome:
      "Demo outcome — a coherent system that stays legible as the product and the team grow.",
  },
  {
    slug: "cadence-studio",
    index: "03",
    title: "Cadence",
    tagline: "Identity and site for a generative music studio",
    category: "Brand · Web",
    year: "2024",
    role: "Identity, Web, Motion",
    client: "Cadence (demo)",
    accent: "#6b4ce6",
    summary:
      "A visual language that behaves like the music it represents — structured, rhythmic, always moving.",
    overview:
      "Cadence needed an identity that felt alive without being noisy. We built a system where type, grid, and motion respond to a shared tempo, so the brand feels composed rather than decorated.",
    meta: [
      { label: "Role", value: "Identity · Web · Motion" },
      { label: "Timeline", value: "9 weeks (demo)" },
      { label: "Team", value: "2 designers (demo)" },
      { label: "Year", value: "2024" },
    ],
    sections: [
      {
        heading: "A brand with a pulse",
        body: "The logotype, layout grid, and transitions all derive from one rhythmic unit. Change the tempo and the whole system responds — a brand that can perform, not just sit still.",
        gallery: [{ ratio: "16/10", label: "Identity in motion" }],
      },
    ],
    outcome:
      "Demo outcome — an identity that reads as composed and alive across every surface.",
  },
  {
    slug: "field-notes",
    index: "04",
    title: "Field Notes",
    tagline: "A reading app that respects your attention",
    category: "Product",
    year: "2024",
    role: "Product Design",
    client: "Field Notes (demo)",
    accent: "#128c6e",
    summary:
      "Saving, reading, and remembering — designed to feel like a quiet library rather than another feed.",
    overview:
      "We designed Field Notes against the grain of engagement-maximising apps: no infinite scroll, no red dots, no pressure. Just a calm place to read and return to what matters.",
    meta: [
      { label: "Role", value: "Product Design" },
      { label: "Timeline", value: "11 weeks (demo)" },
      { label: "Team", value: "1 designer (demo)" },
      { label: "Year", value: "2024" },
    ],
    sections: [
      {
        heading: "Calm by default",
        body: "Typography does the heavy lifting. Reading settings, highlights, and a spatial library give the app depth without noise.",
        gallery: [
          { ratio: "3/4", label: "Reader" },
          { ratio: "3/4", label: "Library" },
        ],
      },
    ],
    outcome:
      "Demo outcome — a reading experience that gives attention back instead of taking it.",
  },
  {
    slug: "northwind-energy",
    index: "05",
    title: "Northwind",
    tagline: "Making home energy legible for everyone",
    category: "Product · Data",
    year: "2023",
    role: "Product, Data Viz",
    client: "Northwind (demo)",
    accent: "#c9962b",
    summary:
      "Turning raw meter data into decisions a household can actually act on.",
    overview:
      "Energy data is abundant and useless in equal measure. We designed a product that answers three questions — how much, why, and what now — and hides everything else until asked.",
    meta: [
      { label: "Role", value: "Product · Data Viz" },
      { label: "Timeline", value: "4 months (demo)" },
      { label: "Team", value: "2 designers (demo)" },
      { label: "Year", value: "2023" },
    ],
    sections: [
      {
        heading: "Decisions, not dashboards",
        body: "We resisted the dashboard reflex. Each view leads with a plain-language takeaway; the charts support it rather than replacing it.",
        gallery: [{ ratio: "16/10", label: "Insight views" }],
      },
    ],
    outcome:
      "Demo outcome — energy data reframed into clear, householder-friendly decisions.",
  },
  {
    slug: "atlas-type",
    index: "06",
    title: "Atlas Type",
    tagline: "A variable typeface and specimen site",
    category: "Type · Web",
    year: "2023",
    role: "Type Design, Web",
    client: "Self-initiated (demo)",
    accent: "#d23f87",
    summary:
      "An in-house variable typeface, released with an interactive specimen that lets you feel every axis.",
    overview:
      "A self-initiated project: a workhorse variable typeface and a specimen site where the type is the interface. Every interaction demonstrates a real capability of the font.",
    meta: [
      { label: "Role", value: "Type Design · Web" },
      { label: "Timeline", value: "Ongoing (demo)" },
      { label: "Team", value: "Studio Atlas (demo)" },
      { label: "Year", value: "2023" },
    ],
    sections: [
      {
        heading: "The type is the interface",
        body: "Weight, width, and optical size respond to the cursor and the viewport. The specimen doesn't describe the typeface — it lets you play it.",
        gallery: [{ ratio: "16/10", label: "Interactive specimen" }],
      },
    ],
    outcome:
      "Demo outcome — a specimen where reading and interacting are the same act.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacent(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}
