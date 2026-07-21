# 11 — Case Study QA Report

**Date:** 2026-07-20 · **Build:** Next.js 16.2.10 (Turbopack) · **Tested against:** production build (`next build` + `next start`), not dev.

---

## Summary

| Area | Result |
|---|---|
| Production build | ✅ Pass |
| TypeScript | ✅ Pass (strict) |
| ESLint | ✅ Clean |
| Routes (8 + 404) | ✅ All correct |
| Responsive (8 viewports) | ✅ Zero horizontal overflow |
| Console / hydration errors | ✅ None |
| Heading order & landmarks | ✅ Correct |
| Touch targets (WCAG 2.2 AA) | ✅ Pass after fix |
| SEO / structured data | ✅ Complete |
| Screenshots reviewed | ✅ 9 captured and reviewed |

**Three real defects were found and fixed during QA.** See [Defects](#defects-found-and-fixed).

---

## Commands run

```bash
npm run lint          # clean
npm run build         # 14 static pages, 0 errors
npm run start -- -p 3100
node shot.mjs         # CDP screenshot capture (scratchpad)
```

---

## Routes

| Route | Status |
|---|---|
| `/` | 200 |
| `/work` | 200 |
| `/work/lumen-ai` | 200 (SSG) |
| `/work/helio` | 200 (SSG) |
| `/work/northwind` | 200 (SSG) |
| `/work/atlas` | **404 (correct — unpublished)** |
| `/work/[slug]/opengraph-image` | 200 · unique PNG per project |
| `/robots.txt`, `/sitemap.xml` | 200 |

Direct load / refresh verified for every route (fetched independently, not via client navigation). Previous/next wiring wraps correctly:

```
lumen-ai → next: helio     · prev: northwind
helio    → next: northwind · prev: lumen-ai
northwind→ next: lumen-ai  · prev: helio
```

---

## Responsive

Measured on `/work/lumen-ai` (the longest page). `overflowX` is `scrollWidth − innerWidth`.

| Viewport | overflowX | h1 size |
|---|---|---|
| 1600 × 1000 | 0 | 108px |
| 1440 × 900 | 0 | 108px |
| 1280 × 800 | 0 | 108px |
| 1024 × 768 | 0 | 90.9px |
| 768 × 1024 | 0 | 73.0px |
| 430 × 932 | 0 | 49.3px |
| 390 × 844 | 0 | 46.5px |
| 360 × 800 | 0 | 44.4px |

Mobile behaviour confirmed by screenshot: scenes recompose vertically, the hero metadata becomes a 2×2 grid, captions stay with their media, the bottom nav pill fits (194px at 360px wide), and no pinned/scroll-jacked behaviour exists to remove.

---

## Accessibility

| Check | Result |
|---|---|
| One `h1` per page | ✅ (project title) |
| Heading skips | ✅ 0 |
| Landmarks | ✅ `header`, `nav`, `main`, `article`, `footer` |
| List semantics | ✅ 0 invalid `ol`/`ul` children |
| Skip link | ✅ first focusable, visible on focus |
| Focus states | ✅ 2px accent outline, 3px offset (global `:focus-visible`) |
| Touch targets ≥ 24px | ✅ after fix (only the sr-only skip link is smaller — exempt) |
| Minimum font size | ✅ 12px on mobile (was 10px) |
| Contrast | ✅ `#FAFAFA`/`#0A0A0A` ≈ 19:1; muted ≈ 9:1; per-project accents all light-on-dark |
| Reduced motion | ✅ Lenis disabled, loader skipped, reveals fall back to static |
| Content without JS | ✅ after fix (see D2) |
| Hover-only content | ✅ none — all information is in the DOM |
| Lightbox | ✅ `role="dialog"`, `aria-modal`, focus trap, Escape, arrow keys, focus restored |

---

## Defects found and fixed

### D1 — Loader could permanently cover the site *(critical)*
**Found by:** screenshot review — the capture showed the loader frozen at 0% covering the whole page.
**Cause:** loader dismissal depended on a `requestAnimationFrame` callback (added earlier only to satisfy a lint rule). Where rAF is throttled or never runs, the overlay never leaves and **the entire site is unreachable**.
**Fix:** three layers —
1. `queueMicrotask` instead of rAF for the skip path (microtasks always run).
2. A `setTimeout` failsafe that dismisses the intro regardless of frames.
3. `if (reduce) return null` — a render-time guarantee, not a callback.

### D2 — All content invisible without JavaScript *(major)*
**Found by:** inspecting built HTML — **21 elements** shipped with `style="opacity:0;transform:translateY(24px)"` because Motion server-renders `initial`.
**Cause:** scroll reveals depend on JS to become visible.
**Fix:** `<noscript>` fallback in the root layout forcing `opacity:1` and hiding the loader. Satisfies "all content must remain visible without animation."

### D3 — Hero context below the fold on the bleed layout *(minor)*
**Found by:** screenshot review of `/work/lumen-ai`.
**Cause:** the full-width media pushed role / duration / year / outcome out of the first viewport, contradicting Step 5.
**Fix:** metadata and outcome now sit above the media in the bleed composition.

### D4 — Accessibility polish *(minor, found by audit)*
- 8 standalone links were 16–20px tall → now `min-h-6` (WCAG 2.2 SC 2.5.8).
- 15 instances of 10px metadata → `text-xs sm:text-[11px]` (12px mobile / 11px desktop).
- List items were wrapped in reveal `<div>`s, breaking `ol > li` semantics → added `RevealLi` (renders a real `<li>`).

---

## Art direction check

Shared across all three: typography, navigation, grid, spacing, motion quality, accessibility.

| Project | Accent | Media frame | Diagram | Rhythm | Density |
|---|---|---|---|---|---|
| Lumen AI | `#a78bfa` violet | bleed | layered | cinematic | airy |
| Helio | `#38bdf8` blue | inset | linear | systematic | balanced |
| Northwind | `#34d399` green | stacked | branching | editorial | balanced |

Accents are scoped to the `<article>` via CSS variables, so the site's cyan identity is preserved in the nav and footer. Verified in the DOM: `--accent` resolves per project.

The `/work` index rotates three preview compositions (bleed feature / asymmetric split / editorial text-led) rather than a uniform card grid.

---

## Narrative verification

All 22 beats render in order, as distinct scenes with story-led headings rather than repeated section labels:

`hero → context → problem → users → constraints → role → research → insights → principles → structure (IA + flows) → decisions → ai-behaviour* → interface → design-system → prototype → testing → build → outcome → lessons → next project`

\* AI behaviour appears only on Lumen AI (18 sections); Helio and Northwind correctly render 17.

---

## SEO

| Item | Result |
|---|---|
| Unique title / description | ✅ per project |
| Canonical | ✅ `https://muneebqureshi.design/work/<slug>` |
| Open Graph + Twitter | ✅ `summary_large_image` |
| Project-specific social image | ✅ generated per project, tinted with its accent |
| `CreativeWork` structured data | ✅ with `creator` Person |
| Descriptive URLs | ✅ `/work/<slug>` |
| Internal links | ✅ homepage cards → studies, `/work` index, prev/next, breadcrumb |
| **Indexing** | 🔒 `noindex` while TODOs remain, and excluded from sitemap — intentional |

---

## Screenshots reviewed

`work-index`, `lumen-ai`, `helio`, `northwind` at 1280×900 and 390×844, plus one full-page capture. Captured via CDP with real timing (hydration + loader + reveals settled).

Reviewing them is what surfaced **D1** and **D3** — the DOM checks alone would not have caught either.

> Note: the in-app browser pane's screenshot action times out on this site (Lenis's animation loop keeps it from reaching idle), so capture was done with headless Chrome over the DevTools Protocol instead.

---

## Not covered

- **Lighthouse scores** — need a deployed URL or a local Lighthouse run; not measured here. Code follows the performance rules (transform/opacity-only animation, explicit media dimensions, self-hosted subsetted font, lazy loading).
- **Automated test suite** — none exists in this project; QA was manual plus scripted DOM assertions.
- **Real image loading / layout shift** — cannot be verified until real assets land. The media system reserves space via explicit `width`/`height`, so CLS should stay at 0.
- **Cross-browser** — verified in Chromium only. Safari/Firefox unverified.
