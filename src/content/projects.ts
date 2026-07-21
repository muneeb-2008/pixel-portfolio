/**
 * DEMO PROJECT CONTENT.
 *
 * Clarity AI is a fictional product written to demonstrate the art direction
 * and the Decision Lens. Nothing here is a real client, a real engagement, or
 * a measured result. Replace wholesale with real work — see
 * docs/03-content-todo.md and public/demo/clarity-ai/README.md.
 */

export type LensStateId = "hidden" | "visible" | "designed";

export type LensAnnotation = {
  /** Anchor the annotation to a region of the canvas. */
  anchor: "answer" | "confidence" | "sources" | "controls";
  label: string;
  body: string;
};

export type LensState = {
  id: LensStateId;
  index: string;
  title: string;
  summary: string;
  /** Which product decisions the interface exposes in this state. */
  shows: {
    confidence: boolean;
    sources: boolean;
    reasoning: boolean;
    editing: boolean;
    approval: boolean;
    recovery: boolean;
  };
  /** What this state costs the person using it. */
  cost: string;
  annotations: LensAnnotation[];
};

/** The generated answer stays constant across states — only the product decisions change. */
export const lensScenario = {
  heading: "A better AI answer starts with better product decisions.",
  intro:
    "One generated answer, three product decisions. The model output never changes — what changes is how much of the system's reasoning the person can see, question, and correct.",
  query: "What is driving churn in our mid-market segment this quarter?",
  answer:
    "Mid-market churn is driven primarily by onboarding friction in the first 30 days, with secondary pressure from missing SSO support in regulated accounts.",
  /** Deliberately low — the scenario is an answer the system is not sure about. */
  confidence: 41,
  sources: [
    { title: "Q3 churn export", meta: "Internal · 412 accounts", strength: "Strong" },
    { title: "Support tickets, Jul–Sep", meta: "Internal · 1,104 tickets", strength: "Partial" },
    { title: "Win/loss interviews", meta: "Internal · 9 calls", strength: "Weak" },
  ],
  reasoning:
    "Weighted onboarding drop-off against ticket themes. The SSO signal comes from 9 interviews only.",
  states: [
    {
      id: "hidden",
      index: "01",
      title: "Hidden uncertainty",
      summary:
        "The answer is delivered with the same confident tone whether the system is sure or guessing.",
      shows: {
        confidence: false,
        sources: false,
        reasoning: false,
        editing: false,
        approval: false,
        recovery: false,
      },
      cost: "The person cannot tell a strong answer from a weak one, so they either over-trust it or ignore the tool.",
      annotations: [
        {
          anchor: "answer",
          label: "No uncertainty signal",
          body: "A 41% answer and a 96% answer look identical. Confidence is a product decision, not a model output.",
        },
      ],
    },
    {
      id: "visible",
      index: "02",
      title: "Visible uncertainty",
      summary:
        "A confidence score appears. It is honest, but it hands the problem to the user without help.",
      shows: {
        confidence: true,
        sources: false,
        reasoning: false,
        editing: false,
        approval: false,
        recovery: false,
      },
      cost: "A number without evidence just moves the doubt. The person still cannot check the claim or act on it.",
      annotations: [
        {
          anchor: "confidence",
          label: "Score without guidance",
          body: "41% tells someone to worry. It does not tell them which part of the answer is weak or what to do next.",
        },
      ],
    },
    {
      id: "designed",
      index: "03",
      title: "Designed intelligence",
      summary:
        "Uncertainty is explained and attached to evidence, and the person keeps the final decision.",
      shows: {
        confidence: true,
        sources: true,
        reasoning: true,
        editing: true,
        approval: true,
        recovery: true,
      },
      cost: "More interface, and more to design. The trade: the answer becomes usable in a decision that carries consequences.",
      annotations: [
        {
          anchor: "confidence",
          label: "Uncertainty, explained",
          body: "The low score is attributed to the specific weak claim, not smeared across the whole answer.",
        },
        {
          anchor: "sources",
          label: "Evidence in reach",
          body: "Every claim traces to a source with its strength shown, so the person can audit the reasoning instead of trusting a summary.",
        },
        {
          anchor: "controls",
          label: "Human approval",
          body: "Nothing consequential happens automatically. Editing, approval, and an undo path keep the person in the decision.",
        },
      ],
    },
  ] satisfies LensState[],
};

export type FeaturedProject = {
  isDemo: true;
  slug: string;
  name: string;
  productType: string;
  year: string;
  role: string;
  challenge: string;
  decision: string;
  /** Labelled as a demo outcome — never presented as a measured result. */
  outcome: string;
  href: string;
  hrefLabel: string;
};

export const featuredProject: FeaturedProject = {
  isDemo: true,
  slug: "clarity-ai",
  name: "Clarity AI",
  productType: "AI Research Workspace",
  year: "2026",
  role: "Product strategy, UX, interaction design",
  challenge:
    "Professionals receive long AI-generated reports but struggle to understand sources, uncertainty, and recommended actions.",
  decision:
    "Reveal confidence, evidence, and approval controls directly beside the generated output — not buried in a settings panel or a footnote.",
  outcome:
    "The answer stops being a verdict and becomes something a person can question, correct, and sign off on.",
  /* TODO: point at /work/clarity-ai once full case studies are built. */
  href: "#decision-lens",
  hrefLabel: "Explore demo case",
};
