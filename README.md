# Muneeb Qureshi — Portfolio

A premium, single-page portfolio for **Muneeb Qureshi** — Product Designer, UI/UX Designer, and Framer Developer. Dark, editorial, and motion-forward: built to feel like a modern software product.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Motion (Framer Motion)**, and **Lenis** smooth scroll.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build` (production build), `npm run start` (serve the build), `npm run lint`.

## Editing content

**All copy, case studies, testimonials, and experience live in one file: [`lib/content.ts`](lib/content.ts).** Change the site by editing that file — no component code needs to change.

- `profile` — name, roles, location, email, hero headline (line-by-line), sub, availability, stats, social links.
- `projects` — the case-study cards (realistic **placeholders**). Swap `name`, `tagline`, `metric`, `tags`, etc. `hue` (0–360) tints each card's placeholder cover.
- `capabilities`, `philosophy`, `process`, `experience`, `testimonials`, `about`, `contact` — the remaining sections.

> ⚠️ The LinkedIn / X / Dribbble URLs in `socials`, the `experience` companies, and the `testimonials` are placeholders — replace them with real content. Email is live.

### Adding real images

Drop assets into [`public/`](public) and reference them from a section component (e.g. swap the placeholder cover in [`components/work-card.tsx`](components/work-card.tsx) or the portrait block in [`components/about.tsx`](components/about.tsx) for a `next/image`).

## Design system

Dark-first, single cyan accent. All tokens are CSS variables in [`app/globals.css`](app/globals.css) — change `--accent` and it propagates everywhere. Fonts are configured in [`app/layout.tsx`](app/layout.tsx):

- **Display:** Sora (a stand-in for General Sans / Satoshi — drop the real files in via `next/font/local` when licensed)
- **Body:** Inter · **Mono:** JetBrains Mono

Editorial type is exposed as `.text-display / .text-h1 / .text-h2 / .text-h3 / .text-eyebrow`; premium interactions as `.fill-hover` and `.link-underline`. Motion presets (springs, easings, line-reveal variants) live in [`lib/motion.ts`](lib/motion.ts).

## Motion & accessibility

- A one-time **loader** ([`components/loader.tsx`](components/loader.tsx)) and **Lenis** smooth scroll ([`components/providers/smooth-scroll.tsx`](components/providers/smooth-scroll.tsx)).
- Everything respects `prefers-reduced-motion`: Lenis and the loader are disabled, and animations fall back to static.
- Semantic landmarks, one `h1`, skip link, visible focus rings, WCAG-AA contrast, 44px touch targets.

## SEO

Metadata + canonical in [`app/layout.tsx`](app/layout.tsx), JSON-LD `Person` schema, dynamic OG image ([`app/opengraph-image.tsx`](app/opengraph-image.tsx)), generated favicon ([`app/icon.tsx`](app/icon.tsx)), `robots.txt`, and `sitemap.xml`. Update the domain in `metadataBase`, `robots.ts`, and `sitemap.ts` before launch.

## Structure

```
app/            layout (fonts, providers, metadata, JSON-LD), page (section order),
                globals.css, robots.ts, sitemap.ts, opengraph-image.tsx, icon.tsx
components/      one file per section: nav, hero, work(+work-card), capabilities,
                philosophy, process, experience, testimonials, about, contact, footer, loader
components/ui/   reusable primitives (Reveal, SectionShell, MagneticButton, Pill, Eyebrow, icons)
components/providers/  smooth-scroll (Lenis)
lib/            content.ts (all copy), motion.ts (variants/springs), utils.ts, use-anchor-scroll.ts
```

## Deploy

Deploy-agnostic. For Vercel: push to a Git repo and import it — no config needed. Update the domain in `metadataBase` (`app/layout.tsx`), `app/robots.ts`, and `app/sitemap.ts`.
