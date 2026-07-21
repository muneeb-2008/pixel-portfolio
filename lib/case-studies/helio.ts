import { type CaseStudy, todo } from "./types";

/**
 * PLACEHOLDER PROJECT — identity is scaffolding from the homepage build.
 * Every narrative field below is a TODO until Muneeb supplies real content.
 */
export const helio: CaseStudy = {
  slug: "helio",
  title: "Helio",
  shortTitle: "Helio",
  category: "SaaS Product Design",
  industry: "Analytics",
  year: "2025",
  duration: todo("How long did the engagement run?"),
  role: "Product Design, UX, Design System",
  team: todo("Who else was involved, and what did they own?"),
  services: ["Product Design", "UX", "Design System"],
  client: todo(
    "Real client name, or an anonymised description if you cannot name them.",
  ),

  heroStatement:
    "Turning a data-heavy analytics platform into a calm, decision-first dashboard that teams actually act on.",
  shortSummary:
    "Dashboards fail when they show everything. This project was about deciding what earns a place on screen.",

  challenge: todo(
    "What was wrong with the existing dashboard, in concrete terms? What could users not do?",
  ),
  users: todo(
    "Which roles used this, and what decision was each one trying to make?",
  ),
  businessContext: todo(
    "Why did the business need this fixed — activation, churn, support load, a sales objection?",
  ),
  constraints: todo(
    "Technical and organisational limits: existing data model, query cost, legacy components, timeline.",
  ),
  responsibilities: todo("What you owned, and what you did not."),

  research: todo(
    "Method, detail, sample. Include analytics review and support-ticket analysis if that is what you had.",
  ),
  insights: todo(
    "The findings that changed the layout or the hierarchy. Include the evidence.",
  ),
  productPrinciples: todo(
    "The rules that governed what appears on a dashboard and what gets buried.",
  ),

  informationArchitecture: todo(
    "How the product is structured, and why data was grouped that way.",
  ),
  userFlows: todo("The main path from landing to acting on a number."),

  interactionDecisions: todo(
    "For each key decision — default view, filtering model, drill-down, empty states — record: problem, options, decision, rationale, trade-off, result.",
  ),

  designSystem: todo(
    "Tokens, type scale, chart and table components, and how consistency held up.",
  ),
  prototypes: todo("Prototype recordings with poster images and descriptions."),
  testing: todo("What you tested, findings, and the changes that followed."),
  developmentCollaboration: todo(
    "How the design was handed off, reviewed, and QA'd with engineering.",
  ),

  outcomes: todo("What changed for users and the business after launch."),
  metrics: todo(
    "Measured numbers with sources only. NOTE: the “+38% activation” on the homepage card is invented placeholder data and must be replaced or removed.",
  ),
  testimonial: todo("A real, attributed, publishable quote."),
  lessons: todo("What you would approach differently."),

  heroMedia: todo(
    "Real dashboard screen, 2400px+ wide, WebP/AVIF, with descriptive alt text.",
  ),
  gallery: todo(
    "Screens, states, and process artefacts — each with dimensions, alt text, and a caption explaining the decision.",
  ),

  beforeAfter: todo(
    "Before/after of the dashboard, if you have the original. Both images plus a sentence on what changed and why.",
  ),

  theme: {
    accent: "#38bdf8",
    accentSoft: "rgba(56, 189, 248, 0.12)",
    density: "balanced",
    mediaFrame: "inset",
    diagram: "linear",
    rhythm: "systematic",
  },

  seo: {
    title: "Helio — analytics dashboard case study",
    description:
      "Redesigning a data-heavy analytics platform into a decision-first dashboard: hierarchy, defaults, and what earns a place on screen.",
    ogHeadline: "Making a data-heavy dashboard decision-first",
  },

  published: true,
};
