import type { Project } from "@/game/types";

/**
 * One project per building. Images live in /public/work (1600×900 WebP).
 * `banner` is the two-line sign plate painted above each building.
 */
export const projects: Project[] = [
  // --- Design District ---
  {
    id: "mortime-dashboard",
    zone: "design",
    title: "Mortime AI Dashboard",
    kind: "AI Product Design · SaaS · Dashboard",
    body: [
      "A real-estate AI operations dashboard built to bring leads, conversations, calls, campaigns, appointments, and agent performance into one interface.",
      "The challenge was turning a complex automation system into a dashboard that feels clear, structured, and easy to navigate.",
    ],
    gallery: ["/work/dashboard-1.webp", "/work/dashboard-2.webp", "/work/dashboard-3.webp"],
    tags: ["Product Design", "UI/UX", "Dashboard", "AI"],
    link: { label: "View project", url: "https://xtarc.agency/projects/mortime-ai-dashboard" },
    banner: ["MORTIME", "AI DASHBOARD"],
  },
  {
    id: "auton8",
    zone: "design",
    title: "Auton8",
    kind: "Enterprise · Web Design · AI",
    body: [
      "A digital experience for an enterprise automation platform built for complex organizations.",
      "The website organizes a large product ecosystem into clear capability layers while combining product storytelling, responsive design, and an integrated AI assistant.",
    ],
    gallery: ["/work/auton8-1.webp", "/work/auton8-2.webp"],
    tags: ["UI/UX", "Web Design", "AI", "Webflow"],
    link: { label: "View project", url: "https://xtarc.agency/projects/auton8" },
    banner: ["AUTON8", "ENTERPRISE"],
  },
  {
    id: "soal-labs",
    zone: "design",
    title: "Soal Labs",
    kind: "Data & AI · Web Design · Webflow",
    body: [
      "A sophisticated website for a data and AI consultancy serving private-capital firms.",
      "The experience turns a highly technical offering into a structured digital story covering operations, AI maturity, data infrastructure, and modern workflows.",
    ],
    gallery: ["/work/soal-1.webp", "/work/soal-2.webp", "/work/soal-3.webp"],
    tags: ["Web Design", "UX", "Webflow", "AI"],
    link: { label: "View project", url: "https://xtarc.agency/projects/soal-labs" },
    banner: ["SOAL LABS", "DATA & AI"],
  },

  // --- Agency Hall ---
  {
    id: "mortime",
    zone: "agency",
    title: "Mortime",
    kind: "Real Estate AI · Website · Framer",
    body: [
      "A conversion-focused website for an AI communication system built for real-estate professionals.",
      "The experience explains complex AI services across WhatsApp, Messenger, voice, and email through focused content, product sections, visual workflows, and clear calls to action.",
    ],
    gallery: ["/work/mortime-1.webp", "/work/mortime-2.webp", "/work/mortime-3.webp"],
    tags: ["UI/UX", "Framer", "Web Design", "AI"],
    link: { label: "View project", url: "https://xtarc.agency/projects/mortime" },
    banner: ["MORTIME", "WEBSITE"],
  },
  {
    id: "xtarc",
    zone: "agency",
    title: "Xtarc Agency",
    kind: "Agency · Product Design · Web Development",
    body: [
      "The agency I work with.",
      "At Xtarc, I work across product design, websites, interfaces, branding, and AI-driven creative workflows.",
      "The work moves fast, but the goal stays the same: create digital experiences that look sharp, communicate clearly, and help businesses move forward.",
    ],
    gallery: ["/work/xtarc-1.webp"],
    tags: ["Product Design", "UI/UX", "Framer", "AI"],
    link: { label: "Visit Xtarc", url: "https://xtarc.agency/" },
    banner: ["XTARC", "AGENCY"],
  },

  // --- Development District ---
  {
    id: "pixel-portfolio",
    zone: "dev",
    title: "Pixel Portfolio",
    kind: "Creative Development · Personal Project",
    body: [
      "A portfolio experiment built around a pixel-art world.",
      "Instead of presenting my work as a traditional portfolio, I wanted the experience to feel like entering a small interactive game.",
      "The project combines portfolio storytelling, exploration, motion, and playful interactions while keeping the work itself at the center.",
    ],
    gallery: ["/work/pixel-1.webp"],
    tags: ["Creative Development", "UI", "Interaction", "AI"],
    link: { label: "Explore the code", url: "https://github.com/muneeb-2008/pixel-portfolio" },
    banner: ["PIXEL", "PORTFOLIO"],
  },
  {
    id: "design-build",
    zone: "dev",
    title: "Design → Build",
    kind: "Figma · Framer · Interaction",
    body: [
      "My usual workflow starts in Figma and moves into production through Framer.",
      "I use the design phase to solve the experience, then bring the system to life through responsive layouts, interactions, motion, and performance-focused implementation.",
    ],
    gallery: [],
    tags: ["Figma", "Framer", "UI/UX", "Motion"],
    banner: ["DESIGN", "TO BUILD"],
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
