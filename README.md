# Muneeb Qureshi — Portfolio

A premium, single-page portfolio for **Muneeb Qureshi** — Product Designer, UI/UX Designer, and Framer Developer. Built to feel like a modern software product: minimal, typographic, purposeful motion, light + dark themes.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Motion (Framer Motion)**, and **next-themes**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build` (production build), `npm run start` (serve the build), `npm run lint`.

## Editing content

**All copy and case studies live in one file: [`lib/content.ts`](lib/content.ts).** Change the site by editing that file — no component code needs to change.

- `profile` — name, roles, location, email, hero headline/sub, availability, stats, social links.
- `projects` — the case-study cards (currently realistic **placeholders**). Swap `name`, `tagline`, `metric`, `tags`, etc. for your real work. `hue` (0–360) tints each card's placeholder cover.
- `capabilities`, `philosophy`, `process`, `about`, `contact` — the remaining sections.

> ⚠️ The LinkedIn / X / Dribbble URLs in `socials` are placeholders — replace the `href` values. Email is live.

### Adding real images

Drop assets into [`public/`](public) and reference them from a section component (e.g. swap the placeholder cover in [`components/work-card.tsx`](components/work-card.tsx) or the portrait block in [`components/about.tsx`](components/about.tsx) for a `next/image`).

## Design system

Colors, spacing, and radii are CSS variables in [`app/globals.css`](app/globals.css). Change the single accent by editing `--accent` (light) and its `.dark` counterpart — it propagates everywhere. Fonts (Geist + Instrument Serif) are configured in [`app/layout.tsx`](app/layout.tsx).

## Structure

```
app/            layout (fonts, theme, metadata), page (section order), globals.css
components/     one file per section (hero, work, capabilities, philosophy, process, about, contact, footer, nav)
components/ui/  reusable primitives (Reveal, SectionShell, MagneticButton, ThemeToggle, Pill, Eyebrow, icons)
lib/            content.ts (all copy), motion.ts (animation variants), utils.ts
```

## Deploy

Deploy-agnostic. For Vercel: push to a Git repo and import it — no config needed. Update `metadataBase` in `app/layout.tsx` to your real domain.
