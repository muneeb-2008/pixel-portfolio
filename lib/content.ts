/**
 * Single source of truth for all site content.
 * Swap the placeholder projects, testimonials, experience, and social
 * links below for the real ones — no component code needs to change.
 */

export type HeadlineSegment = { text: string; accent?: boolean };

export type SocialLink = {
  label: string;
  handle: string;
  href: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  year: string;
  role: string;
  tags: string[];
  metric: { value: string; label: string };
  /** Hue (0–360) used to tint the placeholder cover. */
  hue: number;
};

export type Capability = {
  group: string;
  caption: string;
  items: string[];
};

export type Principle = {
  index: string;
  title: string;
  body: string;
};

export type ProcessStep = {
  step: string;
  title: string;
  body: string;
};

export type ExperienceItem = {
  period: string;
  role: string;
  org: string;
  blurb: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
};

/* NOTE: LinkedIn / X / Dribbble URLs below are placeholders — replace the
   href values with the real profiles. Email is live. */
export const socials: SocialLink[] = [
  {
    label: "Email",
    handle: "muneebqureshi411@gmail.com",
    href: "mailto:muneebqureshi411@gmail.com",
  },
  {
    label: "LinkedIn",
    handle: "in/muneebqureshi",
    href: "https://www.linkedin.com/",
  },
  { label: "X", handle: "@muneebqureshi", href: "https://x.com/" },
  { label: "Dribbble", handle: "muneebqureshi", href: "https://dribbble.com/" },
];

export const profile = {
  name: "Muneeb Qureshi",
  role: "Product Designer",
  roles: ["Product Designer", "UI/UX Designer", "Framer Developer"],
  location: "Karachi, Pakistan",
  email: "muneebqureshi411@gmail.com",
  available: true,
  availabilityLabel: "Available for select projects",
  brandStatement:
    "I design digital products, websites, and design systems that help businesses create better user experiences and stronger products.",
  metaDescription:
    "Muneeb Qureshi is a product designer and Framer developer in Karachi, designing premium digital products, websites, and design systems — from strategy to a shipped, systemised interface.",
  heroEyebrow: "Product Designer · UI/UX · Framer",
  heroHeadline: [
    { text: "Designing digital products" },
    { text: "that feel " },
    { text: "effortless", accent: true },
    { text: " — and" },
    { text: "perform like systems." },
  ] satisfies HeadlineSegment[],
  /** Grouped by visual line for the line-by-line reveal. */
  heroHeadlineLines: [
    [{ text: "Designing digital products" }],
    [{ text: "that feel " }, { text: "effortless", accent: true }],
    [{ text: "— and perform like systems." }],
  ] satisfies HeadlineSegment[][],
  heroSub:
    "I'm Muneeb — a product designer and Framer developer in Karachi. I help startups and SaaS teams turn complex problems into clear, premium experiences, from strategy to a shipped interface.",
  heroStats: [
    { value: "6+", label: "Years designing products" },
    { value: "40+", label: "Products & features shipped" },
    { value: "12", label: "Industries served" },
  ],
  worksWith: ["Startups", "SaaS", "AI products", "Product teams", "Agencies"],
  socials,
};

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
];

export const work = {
  eyebrow: "Selected work",
  heading: "A few problems, solved through product thinking.",
  note: "Placeholder case studies — swap for your real projects in lib/content.ts.",
};

export const projects: Project[] = [
  {
    slug: "helio",
    name: "Helio",
    tagline:
      "Turning a data-heavy analytics platform into a calm, decision-first dashboard that teams actually act on.",
    category: "SaaS · Product Design",
    year: "2025",
    role: "Product Design, UX, Design System",
    tags: ["Product Design", "UX", "Design System"],
    metric: { value: "+38%", label: "activation" },
    hue: 190,
  },
  {
    slug: "lumen-ai",
    name: "Lumen AI",
    tagline:
      "An AI writing workspace designed to keep humans confidently in control of the output.",
    category: "AI · Product Design",
    year: "2025",
    role: "Product Design, UI, Motion",
    tags: ["Product Design", "UI Design", "Motion"],
    metric: { value: "2.1×", label: "faster drafting" },
    hue: 265,
  },
  {
    slug: "northwind",
    name: "Northwind",
    tagline:
      "Rebuilding a fintech onboarding flow to cut drop-off and earn trust in the first minute.",
    category: "Fintech · UX",
    year: "2024",
    role: "UX, UI, Prototyping",
    tags: ["UX Design", "UI Design", "Prototyping"],
    metric: { value: "−41%", label: "onboarding drop-off" },
    hue: 150,
  },
  {
    slug: "atlas",
    name: "Atlas Design System",
    tagline:
      "A scalable design system unifying five products under one confident visual language.",
    category: "Design System · Framer",
    year: "2024",
    role: "Design Systems, Framer, Branding",
    tags: ["Design System", "Framer", "Branding"],
    metric: { value: "5", label: "products unified" },
    hue: 25,
  },
];

export const capabilities = {
  eyebrow: "Capabilities",
  heading: "From product strategy to a shipped, systemised interface.",
  groups: [
    {
      group: "Primary focus",
      caption: "The core of every engagement.",
      items: ["Product Design", "UI Design", "UX Design"],
    },
    {
      group: "Core capabilities",
      caption: "Building and shipping the whole experience.",
      items: [
        "Framer Development",
        "Website Design",
        "Design Systems",
        "Branding",
      ],
    },
    {
      group: "Supporting craft",
      caption: "The details that make it feel premium.",
      items: [
        "Motion Design",
        "Responsive Design",
        "Prototyping",
        "AI-assisted Workflow",
      ],
    },
  ] satisfies Capability[],
};

export const philosophy = {
  eyebrow: "Product thinking",
  heading: "Good design should feel effortless — and be anything but accidental.",
  principles: [
    {
      index: "01",
      title: "Every decision has a purpose.",
      body: "Nothing on the screen is there by accident. If an element can't justify its place, it doesn't ship.",
    },
    {
      index: "02",
      title: "Clarity over decoration.",
      body: "Interfaces should explain themselves. I remove anything that competes with the user's understanding.",
    },
    {
      index: "03",
      title: "Motion guides attention.",
      body: "Animation is a wayfinding tool, not ornament — it directs the eye and makes change legible.",
    },
    {
      index: "04",
      title: "Whitespace is a material.",
      body: "Space gives content room to breathe and signals confidence. Restraint is what reads as premium.",
    },
    {
      index: "05",
      title: "Typography carries hierarchy.",
      body: "Type does the structural heavy lifting — rhythm, weight, and scale before any color or line.",
    },
    {
      index: "06",
      title: "Systems over screens.",
      body: "Great products come from consistent, scalable systems — not a collection of beautiful one-off screens.",
    },
  ] satisfies Principle[],
};

export const process = {
  eyebrow: "How I work",
  heading: "A clear path from problem to shipped product.",
  steps: [
    {
      step: "01",
      title: "Discover",
      body: "Understand the business, the users, and the real problem before touching a single pixel.",
    },
    {
      step: "02",
      title: "Define",
      body: "Shape strategy, structure, and priorities into a direction everyone can align behind.",
    },
    {
      step: "03",
      title: "Design",
      body: "Craft interfaces, systems, and interactions with intent — and obsessive attention to detail.",
    },
    {
      step: "04",
      title: "Deliver",
      body: "Prototype, refine, and ship — built in Framer or handed off engineering-ready.",
    },
  ] satisfies ProcessStep[],
};

export const experience = {
  eyebrow: "Experience",
  heading: "Six years shaping products across industries.",
  /* Companies are placeholders — replace with real roles. */
  items: [
    {
      period: "2023 — Now",
      role: "Senior Product Designer",
      org: "Independent / Contract",
      blurb:
        "Designing SaaS and AI products end-to-end for startups and scale-ups — strategy, UX, UI, and Framer build.",
    },
    {
      period: "2021 — 2023",
      role: "Product Designer",
      org: "Studio (placeholder)",
      blurb:
        "Led UX and UI for web apps and marketing sites across fintech and SaaS, from research to handoff.",
    },
    {
      period: "2019 — 2021",
      role: "UI/UX Designer",
      org: "Agency (placeholder)",
      blurb:
        "Shipped design systems and responsive interfaces for early-stage products and their brands.",
    },
    {
      period: "2018 — 2019",
      role: "Visual & Brand Designer",
      org: "Freelance",
      blurb:
        "Built brand identities and high-converting landing pages for founders and small teams.",
    },
  ] satisfies ExperienceItem[],
};

export const testimonials = {
  eyebrow: "Kind words",
  heading: "What teams say about working together.",
  /* Placeholder quotes — replace with real, attributed testimonials. */
  items: [
    {
      quote:
        "Muneeb thinks like a product owner, not just a designer. He shipped a clarity we didn't know we were missing.",
      name: "Founder",
      title: "Early-stage SaaS",
    },
    {
      quote:
        "The most detail-obsessed designer we've worked with. Every interaction felt considered and intentional.",
      name: "Head of Product",
      title: "Fintech",
    },
    {
      quote:
        "He turned a vague idea into a system our engineers could build in days, not weeks.",
      name: "CTO",
      title: "AI startup",
    },
    {
      quote:
        "A rare mix of strategy, craft, and speed. The kind of designer you want in the room early.",
      name: "Design Lead",
      title: "Product agency",
    },
  ] satisfies Testimonial[],
};

export const about = {
  eyebrow: "About",
  lead: "I design digital products, websites, design systems, and brand identities that pair business strategy with an exceptional user experience.",
  paragraphs: [
    "Based in Karachi, I work with startups, SaaS companies, and product teams to solve complex product problems through thoughtful UX, clean interfaces, and scalable systems.",
    "I care about the thinking behind the pixels: how a product is positioned, how a flow removes friction, how a system stays coherent as it grows. Design should feel effortless, communicate clearly, and support measurable business outcomes.",
    "I move fluidly across strategy, design, and implementation — prototyping and building in Framer, and folding AI-assisted workflows into my process to get from idea to polished interface faster, without losing craft.",
  ],
  focus:
    "Currently focused on AI product interfaces and design systems for early-stage teams.",
};

export const contact = {
  eyebrow: "Contact",
  heading: [
    { text: "Let's build something " },
    { text: "worth shipping", accent: true },
    { text: "." },
  ] satisfies HeadlineSegment[],
  body: "Have a product, website, or design system in mind? Tell me about it — I read every message.",
};
