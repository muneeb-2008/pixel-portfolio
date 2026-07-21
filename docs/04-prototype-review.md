# 04 — Prototype review

Screenshots captured from the **production build** (`next start`) with headless
Chrome, reviewed, and revised. Five defects were found by looking at the
output that were not visible in the code.

Files in `docs/screenshots/`:

| File | View |
|---|---|
| `1440x900-hero.png` / `-full.png` | Desktop |
| `1280x800-hero.png` / `-full.png` | Laptop |
| `390x844-hero.png` / `-full.png` | Mobile |
| `sticky-1.png`, `sticky-2.png` | Featured project mid-scroll (sticky verification) |
| `reduced-motion.png` | `prefers-reduced-motion: reduce` |

---

## Defects found and fixed

**1. The hero decision labels were invisible.** A probe returned
`opacity: 0` on all six with an identity transform — the position tween had
finished but the opacity never resolved to 1. `gsap.from()` had left the inline
opacity pinned. Rewrote every entrance as `fromTo()` with explicit end values
and `clearProps`. Verified: all labels now report `opacity: 1`.

**2. Free-positioned labels collided.** Even once visible, percentage offsets
around the surface stacked them into an unreadable cluster. Replaced with a
deterministic aligned rail beneath the copy, which also filled the dead space
at the bottom-left of the hero. The scattered→aligned motion is preserved as an
entrance.

**3. `overflow: hidden` silently disabled the sticky surface.** The featured
project's surface unpinned almost immediately, stranding the narrative beats
next to an empty column. `overflow: hidden` makes an element a scroll
container, which kills `position: sticky` inside it. Switched to
`overflow-x: clip`, which crops horizontally without creating a scroll
container. Then measured the actual travel and extended the beats column
(`gap: 40vh`, `pb: 26vh`) so the surface stays pinned through all three beats.

Verified by scrolling the real page rather than trusting a screenshot:

| Scroll past `#work` | Sticky top | State label |
|---|---|---|
| +500px | 108px (pinned) | UNCERTAINTY SHOWN |
| +1100px | 108px (pinned) | DESIGNED |
| +1700px | releasing | DESIGNED |

> A full-page screenshot cannot verify sticky — stitched captures render sticky
> elements at their natural position, so the layout always looks gapped. The
> viewport captures above are the real check.

**4. On mobile the product interface rendered above the headline.** The surface
preceded the `h1` in the DOM; harmless on desktop where it is absolutely
positioned, wrong on mobile where it is in flow. Reordered to headline → copy →
CTA → interface, which also brings the CTA inside the first screen.

**5. The hero surface was sliced by the scene edge** and the CTA sat below the
fold. Raised the composition's reserved height and trimmed the scene padding.

## Duplication investigation

The brief flagged possible repeated hero output. **There is no duplication
bug** — measured at two widths:

| Probe | 1440×900 | 390×844 |
|---|---|---|
| `h1` / `header` / `nav` / `main` | 1 / 1 / 1 / 1 | 1 / 1 / 1 / 1 |
| `main > section` | 5 | 5 |
| Hero headline occurrences in text | **1** | **1** |

Two real causes for the appearance of repetition, both now resolved:

1. **Screenshot naming** — each breakpoint was captured twice, `-hero.png`
   (viewport) and `-full.png` (full page, which opens with the hero).
2. **Repeated copy (real)** — `site.positioning` opened with "I design how
   people…", the same words as the headline a few lines below it. The phrase
   occurred **twice** in body text. Replaced with a distinct context line;
   occurrences now measure **1**.

## Accessibility

| Check | Result |
|---|---|
| `h1` count | 1 |
| Heading sequence | `1,2,2,2,3,3,3,3,3,2` — no level skipped |
| Landmarks | `header`, `nav`, `main#main`, 5 labelled sections |
| Skip link | Present, visible on focus |
| Images without alt | 0 (no raster images on the page) |
| `aria-live` | 1 — announces the lens mode |
| State controls | 3 native radios, arrow-key navigable |
| Sub-24px targets | Only the 3 visually-hidden radios and the 16×16 checkbox; in both cases the **label** is the target (full-width rows / 44px) |

Contrast is designed, not assumed: `--ink` 18.3:1 and `--ink-2` 5.1:1 on white;
`#101820` on the `#87CEFA` contact field is 10.6:1. `#87CEFA` (1.7:1) and
`#4FAFE8` (2.5:1) are never used for text — `--blue-ink` (5.9:1) is.

**Reduced motion**, verified by emulating the media feature: "Reveal all
decisions" is forced on, every annotation renders at full opacity, the headline
is fully visible, and no residual transforms remain. The Decision Lens degrades
to a static comparison with nothing hover-dependent.

**Decision Lens**, verified by driving the controls: selecting state 03 grows
the stage from 2041 to 2499 characters and introduces model confidence,
evidence and the approval control.

## Review questions

| Question | Answer |
|---|---|
| Bright and interactive? | Yes — white ground, blue grid, a live product surface in every scene |
| `#87CEFA` used with restraint? | Yes — surfaces, rules, indicators and the contact field only; never on type |
| Hero has a meaningful visual experience? | Yes — overlapping surface, pointer-tracked blue field, assembling motion |
| Project interface polished? | Yes — confidence meter, evidence strengths, approval controls, all in markup |
| Decision Lens is the signature? | Yes — a real lens clipping between the surface and its annotated twin |
| Every scene a different composition? | Yes — five distinct silhouettes |
| Still a static editorial document? | No |
| Dark sections left? | None |
| Repeated rounded cards? | No universal card; radius 0–16px by purpose |
| Mobile has product visuals and interaction? | Yes — swipeable plain/annotated surfaces, draggable lens reveal |
| Text readable? | Body 18px desktop / 16px mobile |
| Duplicate sections? | No — measured |
| Horizontal overflow? | 0px at 1440, 1280 and 390 |

## Known gaps

- Chromium only; no Firefox or Safari available here. `overflow-x: clip` and
  the `mask-image` crops should be checked on Safari.
- No Lighthouse score — that needs a deployed URL.
- GSAP adds ~70KB gzipped for two sequences. Worth revisiting if the
  performance budget tightens.
