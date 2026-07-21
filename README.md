# Muneeb Qureshi — portfolio concept

**HUMAN CONTROL** — the first approved concept for an AI Product Designer
portfolio. This is a foundation and a creative prototype, not the finished
site.

Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4.
**No runtime dependencies were added** beyond the framework.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

`npm run build` · `npm run start` · `npm run lint` · `npx tsc --noEmit`

## What is built

Global foundation · navigation · hero · one demo featured project ·
the **Decision Lens** signature interaction · contact transition.

Deliberately **not** built yet: testimonials, process, experience, services,
skills, blog, full case studies, multiple projects, footer columns, awards,
client logos. Those follow once the art direction is approved.

## ⚠️ All project content is demo content

**Clarity AI is fictional.** There is no client, no engagement, and no
measured result anywhere on this site. The outcome is labelled "Demo outcome"
and stays qualitative on purpose.

Availability, the LinkedIn URL, and the domain are placeholders.
See [`docs/03-content-todo.md`](docs/03-content-todo.md).

## Editing

All copy lives in two files — no component needs changing:

- [`src/content/site.ts`](src/content/site.ts) — name, positioning, nav, hero,
  the eight decision fragments, about, contact
- [`src/content/projects.ts`](src/content/projects.ts) — the featured project
  and the Decision Lens scenario

Design tokens are CSS custom properties in
[`src/app/globals.css`](src/app/globals.css). Change `--signal` and the accent
updates everywhere.

## Docs

| | |
|---|---|
| [01-foundation.md](docs/01-foundation.md) | Stack, tokens, motion and performance policy |
| [02-art-direction.md](docs/02-art-direction.md) | The concept, type, colour, composition |
| [03-content-todo.md](docs/03-content-todo.md) | Everything that must be replaced |
| [04-prototype-review.md](docs/04-prototype-review.md) | Screenshot review, the fixes it forced, a11y results |
