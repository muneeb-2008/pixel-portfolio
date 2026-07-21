# 05 — Redesign audit (dark → INTELLIGENCE IN MOTION)

What exists, what is being removed, and what replaces it. The Next.js setup,
content structure, demo project and working functionality are all kept.

## Duplication investigation

The brief flagged possible repeated hero output. **Measured against the built
page — there is no duplication bug.**

| Probe | 1440×900 | 390×844 |
|---|---|---|
| `h1` | 1 | 1 |
| `header` / `nav` / `main` | 1 / 1 / 1 | 1 / 1 / 1 |
| `main > section` | 5 | 5 |
| Section ids | hero, work, decision-lens, about, contact | same |

Two real causes for the appearance of repetition:

1. **Screenshot naming.** Each breakpoint was captured twice — `-hero.png`
   (viewport) and `-full.png` (full page, which opens with the hero). Browsing
   the folder shows the hero twice per size.
2. **Repeated copy (real).** `site.positioning` opens with *"I design how
   people understand, control, and trust intelligent products"* — the same
   opening words as the headline, rendered a few lines above it. The phrase
   occurs twice in body text while `h1` count stays 1. **Fixed in this
   redesign** by rewriting the positioning line.

## Tokens removed

| Removed | Was | Replaced by |
|---|---|---|
| `--bg` `#0B0C0E` | Near-black ground | `--bg` `#FFFFFF` |
| `--bg-raised` `#101216` | Raised dark surface | `--surface` `#F4FAFE` |
| `--bg-sunken` `#08090B` | Darker scene ground | `--blue-field` `rgba(135,206,250,.16)` |
| `--ink` `#F2F0EA` | Warm off-white text | `--ink` `#101820` |
| `--ink-2` `#979A9F` / `--ink-3` `#6B6E73` | Grey-on-black | `--ink-2` `#62717B` (3-level ramp collapsed to 2 — `--ink-3` was failing contrast on light) |
| `--signal` `#4B6BDC` | Indigo accent | `--blue` `#87CEFA` + `--blue-strong` `#4FAFE8` |
| `--line` `rgba(242,240,234,.14)` | Light-on-dark hairline | `--line` `rgba(16,24,32,.12)` |
| `.grain` fixed noise overlay | Film grain over everything | Removed — brief prohibits noise covering the site |
| `color-scheme: dark` | — | `light` |

## Treatments removed

- **Dark interface panels.** `clarity-canvas` rendered on `--bg-raised` with
  light-on-dark text — the "dark wireframe" problem. Rebuilt as a white
  product surface.
- **Uniform section rhythm.** Every scene used `.shell` + `--scene-y` +
  `border-t`, producing the stacked-document silhouette. Replaced with
  per-scene silhouettes (full-bleed blue environment, offset grids, oversized
  cropped interfaces).
- **Repeated horizontal separators.** `<hr class="rule">` between every band.
  Removed; structure now comes from blue grid lines and surface changes.
- **Mono everywhere.** `.label-micro` was used for every piece of metadata.
  Restricted to product metadata, interface labels, decision annotations and
  system states.
- **Accent on a headline word.** "control" was tinted in the hero. Removed —
  blue is now reserved for interactive and product logic.
- **Tab-strip Decision Lens.** The segmented selector above a static canvas is
  replaced by a real pointer lens over a single interface.
- **Body text below 18px.** `--t-body` floor raised to 18px desktop / 16px
  mobile.

## Kept

- Next.js 16 App Router, TypeScript, Tailwind v4, `src/`, `@/*`
- `src/content/site.ts` and `projects.ts` — same shape, copy revised
- Clarity AI demo project and the three decision states
- The eight decision fragments as the organising motif
- Skip link, landmarks, heading order, reduced-motion policy, 44px targets

## Added

- **GSAP 3.15 + ScrollTrigger** — explicitly requested, used only for the hero
  assembly and the featured-project transformation. All entrance animation
  uses `gsap.from()` so content remains visible if JS fails.
- Neutral sans for body (Inter) alongside the display grotesk.
- Fine blue grid field, blue connector lines, annotated interface variant.
