import { type CaseStudy, todo } from "./types";

/**
 * PLACEHOLDER PROJECT — identity is scaffolding from the homepage build.
 * Every narrative field below is a TODO until Muneeb supplies real content.
 * See docs/10-case-study-todo.md.
 */
export const lumenAi: CaseStudy = {
  slug: "lumen-ai",
  title: "Lumen AI",
  shortTitle: "Lumen",
  category: "AI Product Design",
  industry: "AI writing tools",
  year: "2025",
  duration: todo("How long did the engagement run? e.g. “14 weeks, 2025”"),
  role: "Product Design, UI, Motion",
  team: todo(
    "Who else was on the team, and what did they own? e.g. “1 PM, 3 engineers, 1 ML engineer”",
  ),
  services: ["Product Design", "UI Design", "Interaction", "Motion"],
  client: todo(
    "Real client or product name. Confirm you have permission to publish it — otherwise anonymise (“a Series A writing tool”).",
  ),

  heroStatement:
    "An AI writing workspace designed to keep humans confidently in control of the output.",
  shortSummary:
    "Generative tools are easy to demo and hard to trust. This project focused on the seam between model output and human judgement.",

  challenge: todo(
    "What was actually broken? Describe the problem in one paragraph — what users could not do, and what that cost the business.",
  ),
  users: todo(
    "Who are the user groups and what does each one need? e.g. [{ group: 'Marketing writers', need: 'Draft fast without losing their voice' }]",
  ),
  businessContext: todo(
    "What pressure was the business under — funding round, churn, a competitor launch, a support cost? Why did this need solving now?",
  ),
  constraints: todo(
    "What limited the design? e.g. model latency, token cost, an existing design system, a 6-week deadline, one front-end engineer.",
  ),
  responsibilities: todo(
    "What did YOU own end to end, and what did you not? Be specific and honest — this is what hiring managers read most carefully.",
  ),

  research: todo(
    "What research actually happened? Method, detail, and sample size. If none was possible, say so and describe what you used instead (support tickets, analytics, competitor teardowns).",
  ),
  insights: todo(
    "The 2–4 findings that changed the design. Each needs a title and the evidence behind it. Not observations — things that redirected a decision.",
  ),
  productPrinciples: todo(
    "The rules you designed against, e.g. “The model never edits without a visible diff.” 3–5 principles, each with the reasoning.",
  ),

  informationArchitecture: todo(
    "Top-level structure and what sits under each area.",
  ),
  userFlows: todo(
    "The 1–2 flows that carry the product. Steps in order, with the decision points marked.",
  ),

  interactionDecisions: todo(
    "The core of this page. For each major interaction: the problem, the options considered, the decision, why, the trade-off it introduced, and what resulted. 3–5 decisions.",
  ),

  aiBehaviour: todo(
    "Document how the AI behaves, so it reads as a designed system rather than magic: user intent · AI input · AI output · how confidence is communicated · loading behaviour · error states · human control · editing and approval · explainability · feedback loops · privacy · failure recovery · responsible automation.",
  ),

  designSystem: todo(
    "What system did you build or inherit? Type scale, tokens, key components, and how it stayed coherent as the product grew.",
  ),
  prototypes: todo(
    "Prototype recordings (MP4 + poster image + a text description for accessibility). Export at 1280px wide, compressed, no audio.",
  ),
  testing: todo(
    "What did you test, with whom, what did you learn, and what changed as a result?",
  ),
  developmentCollaboration: todo(
    "How did design and engineering work together — handoff, review, QA, what you built yourself?",
  ),

  outcomes: todo(
    "What changed after launch, in plain language. Qualitative outcomes are fine and honest.",
  ),
  metrics: todo(
    "Real, measured numbers only — each with a source (analytics, the client, a study). Leave empty rather than estimate. NOTE: the “2.1× faster drafting” on the homepage card is invented placeholder data and must be replaced or removed.",
  ),
  testimonial: todo(
    "A real, attributed quote you have permission to publish.",
  ),
  lessons: todo(
    "What you would do differently. Specific and self-aware — generic reflection reads as filler.",
  ),

  heroMedia: todo(
    "Hero interface asset — a real screen, not a mockup frame. 2400×1600 or wider, WebP/AVIF, with descriptive alt text.",
  ),
  gallery: todo(
    "Interface screens, annotated states, and process artefacts. Each needs width, height, alt text, and a caption explaining the decision it shows.",
  ),

  theme: {
    accent: "#a78bfa",
    accentSoft: "rgba(167, 139, 250, 0.12)",
    density: "airy",
    mediaFrame: "bleed",
    diagram: "layered",
    rhythm: "cinematic",
  },

  seo: {
    title: "Lumen AI — AI writing workspace case study",
    description:
      "How an AI writing workspace was designed to keep people in control of generated output — intent, confidence, editing, and recovery.",
    ogHeadline: "Keeping humans in control of AI output",
  },

  published: true,
};
