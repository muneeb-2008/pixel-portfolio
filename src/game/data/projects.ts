import type { Project } from "@/game/types";

/**
 * PLACEHOLDER projects — one per building. Every title / blurb / image is a
 * placeholder for you to replace in a second pass. `image: ""` renders an
 * empty "image slot" in the project panel; drop in a URL (e.g. "/work/x.png")
 * to show real art.
 */
export const projects: Project[] = [
  // --- Design District ---
  {
    id: "design-1",
    zone: "design",
    title: "PLACEHOLDER — Design Project 1",
    kind: "UI / UX · Product",
    year: "20XX",
    blurb:
      "Placeholder description. A short line or two about the design work behind this project goes here.",
    image: "",
    tags: ["UI/UX", "Product"],
  },
  {
    id: "design-2",
    zone: "design",
    title: "PLACEHOLDER — Design Project 2",
    kind: "Brand · Identity",
    year: "20XX",
    blurb: "Placeholder description. Swap this for the real brand/identity story.",
    image: "",
    tags: ["Brand", "Identity"],
  },
  {
    id: "design-3",
    zone: "design",
    title: "PLACEHOLDER — Design Project 3",
    kind: "Web · Framer",
    year: "20XX",
    blurb: "Placeholder description. Replace with a real Framer/web build write-up.",
    image: "",
    tags: ["Framer", "Web"],
  },

  // --- Development District ---
  {
    id: "dev-1",
    zone: "dev",
    title: "PLACEHOLDER — Dev Project 1",
    kind: "Vibecoding · App",
    year: "20XX",
    blurb: "Placeholder description. A quick note on what you built and shipped.",
    image: "",
    tags: ["Vibecoding", "App"],
  },
  {
    id: "dev-2",
    zone: "dev",
    title: "PLACEHOLDER — Dev Project 2",
    kind: "Frontend · Tooling",
    year: "20XX",
    blurb: "Placeholder description. Replace with the real engineering details.",
    image: "",
    tags: ["Frontend", "Tooling"],
  },
  {
    id: "dev-3",
    zone: "dev",
    title: "PLACEHOLDER — Dev Project 3",
    kind: "AI · Automation",
    year: "20XX",
    blurb: "Placeholder description. Swap for a real AI/automation project.",
    image: "",
    tags: ["AI", "Automation"],
  },

  // --- Agency Hall ---
  {
    id: "agency-1",
    zone: "agency",
    title: "PLACEHOLDER — Agency Project 1",
    kind: "Agency · Full Delivery",
    year: "20XX",
    blurb:
      "Placeholder description. A client engagement you led end-to-end as the agency.",
    image: "",
    tags: ["Agency", "Client"],
  },
  {
    id: "agency-2",
    zone: "agency",
    title: "PLACEHOLDER — Agency Project 2",
    kind: "Agency · Ad Campaign",
    year: "20XX",
    blurb: "Placeholder description. A campaign or retainer the studio ran.",
    image: "",
    tags: ["Ads", "Campaign"],
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
