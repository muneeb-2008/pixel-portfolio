/**
 * Site-level content.
 *
 * Items marked DEMO / TODO are placeholders for the concept and must be
 * replaced before launch. See docs/03-content-todo.md.
 */

export const site = {
  name: "Muneeb Qureshi",
  role: "AI Product Designer",
  url: "https://muneebqureshi.design", // TODO: confirm final domain
  metaDescription:
    "Muneeb Qureshi is an AI Product Designer. I design how people understand, control, and trust intelligent products — strategy, UX, interaction systems, and prototypes.",

  positioning:
    "I design how people understand, control, and trust intelligent products.",

  /* DEMO: availability is placeholder copy. Update or remove before launch. */
  availability: {
    isDemo: true,
    label: "Available — 2026",
    visible: true,
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    /* Authored breaks; they re-wrap responsively rather than being forced. */
    headline: ["I design how people", "understand and control", "intelligent products."],
    /* Sits beside the role label. Deliberately does NOT restate the headline —
       the previous build repeated its opening words a few lines above it. */
    context: "For AI startups, SaaS founders, and product teams.",
    support:
      "AI product strategy, UX, interaction systems, and prototypes designed around clarity, trust, and human judgment.",
    primaryAction: { label: "View selected work", href: "#work" },
    secondaryAction: { label: "Start a conversation", href: "#contact" },
  },

  /**
   * The recurring motif — the eight product decisions the Decision Lens
   * exposes. Scattered in the hero, aligned by the contact scene.
   */
  fragments: [
    "USER INTENT",
    "CONFIDENCE",
    "CONTROL",
    "CONTEXT",
    "APPROVAL",
    "RECOVERY",
    "FEEDBACK",
    "PRIVACY",
  ],

  about: {
    label: "About",
    statement:
      "I design the point where intelligent systems meet human judgment.",
    supporting: [
      {
        title: "AI product strategy",
        body: "Deciding what the system should attempt, what it should refuse, and where a person has to stay in the loop.",
      },
      {
        title: "Product interaction",
        body: "The mechanics of reviewing, correcting, and approving generated work without it becoming a second job.",
      },
      {
        title: "Trust",
        body: "Confidence that is attributed to a specific claim rather than smeared across an answer.",
      },
      {
        title: "User control",
        body: "Editing, approval, and recovery designed before the happy path, not bolted on after launch.",
      },
      {
        title: "Working with teams",
        body: "Embedded with founders, PMs, and engineers — shipping the decisions, not just the screens.",
      },
    ],
  },

  contact: {
    headline: ["Building an intelligent product?", "Let's design how people experience it."],
    email: "muneebqureshi411@gmail.com", // TODO: confirm the address to publish
    linkedin: {
      label: "LinkedIn",
      /* TODO: replace with the real profile URL. */
      href: "https://www.linkedin.com/",
      isPlaceholder: true,
    },
    location: "Karachi, Pakistan",
  },
} as const;
