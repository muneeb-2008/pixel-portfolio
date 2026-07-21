import { type CaseStudy, todo } from "./types";

/**
 * PLACEHOLDER PROJECT — listed on /work but not published as a case study.
 * Flip `published` to true once the narrative fields below are filled in;
 * a route and social image are generated automatically.
 */
const pending = todo("Awaiting content — see docs/10-case-study-todo.md");

export const atlas: CaseStudy = {
  slug: "atlas",
  title: "Atlas Design System",
  shortTitle: "Atlas",
  category: "Design Systems",
  industry: "Multi-product SaaS",
  year: "2024",
  duration: pending,
  role: "Design Systems, Framer, Branding",
  team: pending,
  services: ["Design System", "Framer", "Branding"],
  client: pending,

  heroStatement:
    "A scalable design system unifying five products under one confident visual language.",
  shortSummary:
    "Systems work is judged years later. This one was built to survive new products and new designers.",

  challenge: pending,
  users: pending,
  businessContext: pending,
  constraints: pending,
  responsibilities: pending,

  research: pending,
  insights: pending,
  productPrinciples: pending,

  informationArchitecture: pending,
  userFlows: pending,

  interactionDecisions: pending,

  designSystem: pending,
  prototypes: pending,
  testing: pending,
  developmentCollaboration: pending,

  outcomes: pending,
  metrics: todo(
    "Measured numbers with sources only. NOTE: the “5 products unified” on the homepage card is unverified placeholder data.",
  ),
  testimonial: pending,
  lessons: pending,

  heroMedia: pending,
  gallery: pending,

  theme: {
    accent: "#fb923c",
    accentSoft: "rgba(251, 146, 60, 0.12)",
    density: "dense",
    mediaFrame: "inset",
    diagram: "layered",
    rhythm: "systematic",
  },

  seo: {
    title: "Atlas — design system case study",
    description:
      "Building a design system to unify five products under one visual language.",
    ogHeadline: "One system, five products",
  },

  published: false,
};
