/**
 * Site-level content.
 *
 * PLACEHOLDER identity — every field marked TODO must be replaced before
 * launch. No real person is represented here.
 */

export const site = {
  // TODO: replace with the real name / studio.
  name: "Studio Atlas",
  owner: "Maya Sol", // TODO
  role: "Design & Interaction Studio",
  location: "Lisbon, PT", // TODO
  timezone: "Europe/Lisbon", // for the live clock in the nav
  email: "hello@studioatlas.dev", // TODO
  url: "https://studioatlas.dev", // TODO
  metaDescription:
    "Studio Atlas is a placeholder design & interaction studio — brand, product, and web design shown through demo case studies.",

  availability: {
    isDemo: true,
    label: "Available for projects — 2026",
  },

  nav: [
    { label: "Work", href: "/#work" },
    { label: "Playground", href: "/#playground" },
    { label: "Info", href: "/#info" },
    { label: "Contact", href: "/#contact" },
  ],

  hero: {
    // Rendered as masked lines; the breaks are the composition.
    lines: ["Design that", "moves with", "intent."],
    intro:
      "An independent studio crafting brands, products, and interfaces with a focus on motion, clarity, and detail.",
    scrollCue: "Selected work",
  },

  intro: {
    label: "Info",
    statement: "So — what do you actually do?",
    lead: "Depends who's asking.",
    // Interactive: pick a role, get the honest answer.
    roles: [
      {
        role: "A founder",
        answer:
          "A brand and a product that punch well above your stage — clear enough to raise on, sharp enough to launch with.",
      },
      {
        role: "A product manager",
        answer:
          "Interfaces your users understand without a manual, and a design partner who argues about the right things at the right time.",
      },
      {
        role: "An engineer",
        answer:
          "Design that's built to ship, not to admire — real states, real components, handed over the way you'd actually build it.",
      },
      {
        role: "A designer",
        answer:
          "Someone who sweats the 4px, names the tokens, and cares about the stuff nobody notices until it's missing.",
      },
      {
        role: "Everyone else",
        answer:
          "We make digital things — websites, apps, brands — feel considered, quick, and a little bit alive.",
      },
    ],
    services: [
      "Brand & Identity",
      "Product Design",
      "Web & Interaction",
      "Design Systems",
      "Motion",
      "Front-end",
    ],
  },

  playground: {
    label: "Playground",
    title: "Experiments, off-hours, and things we couldn't not make.",
    // Small looser tiles — CSS-composed, no stock images.
    items: [
      { title: "Elastic type", tag: "Motion", hue: 18 },
      { title: "Grid rituals", tag: "WebGL-free", hue: 210 },
      { title: "Cursor studies", tag: "Interaction", hue: 285 },
      { title: "Sound shapes", tag: "Audio", hue: 150 },
      { title: "Paper folds", tag: "3D CSS", hue: 42 },
      { title: "Slow scroll", tag: "Scroll", hue: 330 },
    ],
    marquee: [
      "Prototyping",
      "Art direction",
      "Micro-interactions",
      "Type systems",
      "Framer",
      "WebGL-free motion",
      "Design engineering",
    ],
  },

  cta: {
    label: "Contact",
    lines: ["Have something", "worth building?"],
    body: "Tell us about it. We reply to every serious enquiry within two days.",
  },

  socials: [
    { label: "Instagram", href: "https://instagram.com/", isPlaceholder: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/", isPlaceholder: true },
    { label: "X / Twitter", href: "https://x.com/", isPlaceholder: true },
    { label: "Are.na", href: "https://www.are.na/", isPlaceholder: true },
  ],
} as const;
