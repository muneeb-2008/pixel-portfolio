import { type CaseStudy, todo } from "./types";

/**
 * PLACEHOLDER PROJECT — identity is scaffolding from the homepage build.
 * Every narrative field below is a TODO until Muneeb supplies real content.
 */
export const northwind: CaseStudy = {
  slug: "northwind",
  title: "Northwind",
  shortTitle: "Northwind",
  category: "Fintech UX",
  industry: "Financial services",
  year: "2024",
  duration: todo("How long did the engagement run?"),
  role: "UX, UI, Prototyping",
  team: todo("Who else was involved, and what did they own?"),
  services: ["UX Design", "UI Design", "Prototyping"],
  client: todo(
    "Real client name, or an anonymised description. Fintech clients often require anonymisation — check before publishing.",
  ),

  heroStatement:
    "Rebuilding a fintech onboarding flow to cut drop-off and earn trust in the first minute.",
  shortSummary:
    "Onboarding is where a financial product asks for the most and has earned the least. This was a study in sequencing trust.",

  challenge: todo(
    "Where exactly did people drop out, and what were they being asked to do at that moment?",
  ),
  users: todo(
    "Who was signing up, what were they anxious about, and what did they need to see to continue?",
  ),
  businessContext: todo(
    "What did the drop-off cost, and what regulatory or commercial pressure shaped the work?",
  ),
  constraints: todo(
    "KYC/compliance requirements, required fields, third-party verification, platform limits.",
  ),
  responsibilities: todo("What you owned, and what you did not."),

  research: todo(
    "Funnel analysis, session recordings, interviews, support themes — whatever you actually had.",
  ),
  insights: todo(
    "What explained the drop-off. Include the evidence, not just the conclusion.",
  ),
  productPrinciples: todo(
    "The rules for asking: what to request when, and what to justify before requesting it.",
  ),

  informationArchitecture: todo("How the flow and its supporting screens were structured."),
  userFlows: todo(
    "The onboarding path step by step, with branches for verification failure and drop-out recovery.",
  ),

  interactionDecisions: todo(
    "For each decision — step order, progressive disclosure, error handling, document capture — record: problem, options, decision, rationale, trade-off, result.",
  ),

  designSystem: todo(
    "Form components, validation patterns, error states, and how they stayed consistent.",
  ),
  prototypes: todo("Prototype recordings with poster images and descriptions."),
  testing: todo(
    "Usability tests on the flow: participants, findings, and what changed.",
  ),
  developmentCollaboration: todo(
    "How the flow was specified, handed off, and QA'd — especially edge cases.",
  ),

  outcomes: todo("What changed for users and the business after launch."),
  metrics: todo(
    "Measured numbers with sources only. NOTE: the “−41% onboarding drop-off” on the homepage card is invented placeholder data and must be replaced or removed.",
  ),
  testimonial: todo("A real, attributed, publishable quote."),
  lessons: todo("What you would approach differently."),

  heroMedia: todo(
    "Real onboarding screen, 2400px+ wide, WebP/AVIF, with descriptive alt text.",
  ),
  gallery: todo(
    "Flow screens, error and edge states, and process artefacts — each with dimensions, alt text, and a decision-led caption.",
  ),

  beforeAfter: todo(
    "Before/after of the onboarding step that changed most, plus a sentence on what changed and why.",
  ),

  theme: {
    accent: "#34d399",
    accentSoft: "rgba(52, 211, 153, 0.12)",
    density: "balanced",
    mediaFrame: "stacked",
    diagram: "branching",
    rhythm: "editorial",
  },

  seo: {
    title: "Northwind — fintech onboarding case study",
    description:
      "Rebuilding a fintech onboarding flow to reduce drop-off: sequencing trust, progressive disclosure, and designing for verification failure.",
    ogHeadline: "Sequencing trust in fintech onboarding",
  },

  published: true,
};
