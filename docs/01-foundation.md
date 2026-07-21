# 01 — Foundation

The technical base for the **HUMAN CONTROL** concept. Everything here is
deliberately small: this is a first prototype, not a portfolio.

## Stack

| Choice | Version | Why |
|---|---|---|
| Next.js (App Router) | 16.2.10 | Server components by default; only three files ship JS |
| React | 19.2.4 | Ships with Next 16 |
| TypeScript | 5.x | Strict mode from the scaffold |
| Tailwind CSS | 4.x | Utility layer over the token system |
| ESLint | 9.x | `eslint-config-next` |

**Zero runtime dependencies were added.** No UI kit, no animation library, no
scroll library, no 3D. GSAP was not needed — the Decision Lens is a pointer
position written to a transform, and the state changes are CSS transitions.

## Structure

```
src/
  app/          layout.tsx · page.tsx · globals.css (all tokens)
  components/   nav · hero · fragment-field · featured-project
                decision-lens · contact
    demo/       clarity-canvas.tsx  (the demo interface, in markup)
  content/      site.ts · projects.ts   ← all copy lives here
public/
  demo/clarity-ai/README.md
docs/
```

Import alias `@/*` → `src/*`.

## Token system

All tokens are CSS custom properties in `src/app/globals.css`, exposed to
Tailwind through `@theme inline`. Nothing is hard-coded in a component.

- **Color** — `--bg` `#0B0C0E`, `--ink` `#F2F0EA`, `--ink-2` `#979A9F`,
  `--signal` `#4B6BDC`, `--line` `rgba(242,240,234,0.14)`, plus `--bg-raised`
  / `--bg-sunken` to separate scenes without borders.
- **Type** — fluid `clamp()` ramp: `--t-display` → `--t-micro`. The display
  size is capped at `5.75rem` so the three authored hero lines each hold on
  one line from 1024 up; the line breaks are the composition.
- **Spacing** — 4px base, `--s-1` … `--s-40`, plus `--scene-y` for section
  rhythm that is set per scene rather than uniformly.
- **Grid** — `--container` 1600px, fluid `--gutter`, 12 columns via
  `.grid-editorial`.
- **Radius** — `--r-xs` 2px to `--r-md` 6px. Restrained on purpose; there is
  no rounded card anywhere.
- **Motion** — `--dur-fast/–/-slow/-scene` and two easings.
- **Z-index** — named scale, no magic numbers.

## Reusable classes

`.shell` · `.grid-editorial` · `.rule` · `.t-display/-h1/-h2/-h3/-lead` ·
`.label` · `.label-micro` · `.measure` · `.annotation` · `.fragment` ·
`.skip-link`.

There is deliberately **no universal card component**. Each scene composes
from hairlines and the grid.

## Motion policy

- One arrival animation, staggered 70ms per element, **complete under 1s**.
  No loader; returning visitors see no introduction.
- `transform` and `opacity` only.
- The two scroll/pointer handlers are rAF-throttled and the Decision Lens
  stops tracking when off-screen (IntersectionObserver).
- `prefers-reduced-motion` strips animation globally, the fragment field
  renders in its aligned state, and the lens falls back to a static
  comparison with all annotations revealed.

## Performance notes

- Fonts self-hosted through `next/font` (Space Grotesk + JetBrains Mono),
  `display: swap`, no external requests.
- **No images at all** — the demo interface is markup and CSS, so there is no
  image payload and no layout shift from media.
- Only `nav`, `fragment-field` and `decision-lens` are client components;
  every other scene is a server component.
- The Decision Lens canvas has a reserved `min-height` so switching states
  does not shift the page.
