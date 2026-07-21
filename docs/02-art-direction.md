# 02 — Art direction

## Concept: INTELLIGENCE IN MOTION

A bright product environment where information, interfaces and decisions
respond to the visitor. The argument is made with a working interface rather
than with prose: the same AI answer appears in every scene, and what changes is
how much of the system's reasoning a person can see, question and correct.

The organising motif is **eight decision labels** (USER INTENT, CONFIDENCE,
CONTROL, CONTEXT, APPROVAL, RECOVERY, FEEDBACK, PRIVACY). They enter the hero
scattered and settle into a rail; by the contact scene they are a measured
row across the blue field.

## Colour

| Token | Value | Role |
|---|---|---|
| `--bg` | `#FFFFFF` | Main ground |
| `--surface` | `#F4FAFE` | The featured-project environment |
| `--blue` | `#87CEFA` | Brand signal — surfaces, rules, the contact field |
| `--blue-strong` | `#4FAFE8` | Interaction — active edges, meters, controls |
| `--blue-ink` | `#1668A3` | **Blue that carries text** |
| `--ink` | `#101820` | Deep text, 18.3:1 on white |
| `--ink-2` | `#62717B` | Secondary text, 5.1:1 on white |
| `--line` | `rgba(16,24,32,.12)` | Structural borders |
| `--blue-field` / `--blue-selected` | 16% / 32% | Soft surfaces, selected state |

**A contrast constraint shaped the system.** `#87CEFA` is only **1.7:1** on
white and `#4FAFE8` is **2.5:1** — neither can legally carry text. So the brand
blue is used exclusively as *surface, rule, meter and indicator*, and
`--blue-ink` (5.9:1) is the only blue applied to type. That constraint is why
the site reads as blue without ever being a "childish blue website".

Blue is never applied to a headline word. It marks interactive state, selection,
interface feedback, navigation position, and connections between a label and
the region it describes.

## Typography

- **Display: Space Grotesk** — headlines, the product-surface voice.
- **Body: Inter** — everything read at length. Floor of **18px desktop /
  16px mobile**.
- **Mono: JetBrains Mono** — restricted to product metadata, interface labels,
  decision annotations and system states. It is no longer the site's texture.

The hero headline is expressive through scale and masked line entry, not
through colouring a word.

## Composition — a different silhouette per scene

| Scene | Silhouette |
|---|---|
| Hero | Headline holds the left 58%; the product surface is absolutely placed, passes behind the longest line and crops past the right gutter. Decision rail beneath the copy. |
| Featured project | Pale blue full-bleed environment. Narrative beats in a narrow left column; an oversized white surface sticks beside them and transforms as they pass. |
| Decision Lens | Segmented rule of states, then one stage: the surface plus an identical annotated copy clipped to a moving lens, with an annotation margin. |
| About | Statement indented off the grid's left edge, supporting copy on an uneven 3/4/3 → 4/4 arrangement held by blue rules. |
| Contact | Full-bleed `#87CEFA`. Aligned label row, oversized statement, an interactive contact line, structural rules that drift under the pointer. |

Depth comes from a fine blue grid, cropped interfaces, layered surfaces and
soft blue fields — not from shadows. Elevation is used only where a layer must
separate from the one beneath it.

## What is avoided

Heavy shadows, large rounded cards, repeated content boxes, gradient
backgrounds, glassmorphism, mono labels everywhere, weak grey text, equal-width
columns, repeated horizontal separators, excessive uppercase, a black footer,
and any universal card component. Radius runs 0–16px by purpose: 4px controls,
8px interface regions, 16px the product surface itself.

## Motion

GSAP drives two sequences only — the hero assembly (masked headline lines,
surface, connectors, labels settling from scattered positions) and the
featured-project transformation (ScrollTrigger stepping the interface from bare
answer → uncertainty shown → designed, plus a drifting grid). Everything else
is a CSS transition.

Every entrance is authored with `gsap.fromTo()` and explicit end values plus
`clearProps` — a bare `from()` can leave an element pinned at `opacity: 0` if
it is interrupted, which is exactly the bug that hid the hero labels during
review. Native scrolling is preserved: `position: sticky`, never a pinned
hijack.
