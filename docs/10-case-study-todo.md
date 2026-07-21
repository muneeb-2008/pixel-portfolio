# 10 — Case Study Content TODO

**Purpose:** everything Muneeb needs to supply to turn the case study system from scaffolding into real work.

Nothing in the pages is invented. Every unfilled field renders a visible **"Content needed"** marker with a specific prompt. Fill the field in `lib/case-studies/<slug>.ts` and the marker disappears — no component code changes.

---

## How the TODO system works

```ts
// lib/case-studies/types.ts
todo("What pressure was the business under?")   // → renders a visible marker
```

- **`todo(...)`** → a visible, dashed "Content needed" block with your prompt.
- **Real value** → renders the designed component.
- **`undefined`** → the scene is skipped entirely (no empty sections).

Helpers: `resolve()` (real content or `null`), `todoNote()`, `hasPendingContent()`, `pendingCount()`.

---

## ⚠️ Publishing gate (important)

While **any** field is still a TODO, that case study is:

- served with **`<meta name="robots" content="noindex, follow">`**
- **excluded from `sitemap.xml`**

This is deliberate — placeholder narrative must never be indexed as real work. Both switch on automatically once the TODOs are gone. Verify with `curl` after filling content.

---

## ⚠️ Invented metrics still on the homepage

The homepage project cards display **fabricated** metrics from the original build. They are **not** repeated in the case studies (metrics there are TODO), but they are still visible on `/`:

| Project | Fake metric on homepage card | Action |
|---|---|---|
| Helio | `+38% activation` | Replace with a measured number, or remove |
| Lumen AI | `2.1× faster drafting` | Replace or remove |
| Northwind | `−41% onboarding drop-off` | Replace or remove |
| Atlas | `5 products unified` | Verify or remove |

They live in `projects[].metric` in [`lib/content.ts`](../lib/content.ts). I left the homepage untouched because the brief said not to redesign it — **but these should not go live as-is.**

---

## Per-project content needed

All three published studies need the same 20 fields. Each has a specific prompt in the data file.

### Identity & framing
| Field | What's needed |
|---|---|
| `client` | Real name, or an anonymised description ("a Series A fintech"). **Confirm permission to publish.** |
| `duration` | e.g. "14 weeks, 2025" |
| `team` | Who else, and what they owned |

### The story
| Field | What's needed |
|---|---|
| `businessContext` | The pressure the business was under, and why now |
| `challenge` | What users couldn't do, and what it cost |
| `users` | Each group and the need they carry in |
| `constraints` | Technical, regulatory, timeline, team limits |
| `responsibilities` | What you owned — **and what you didn't** |

### Discovery
| Field | What's needed |
|---|---|
| `research` | Method, detail, sample size. If no formal research, say what you used instead (tickets, analytics, teardowns) |
| `insights` | The 2–4 findings that *changed a decision*, with evidence |
| `productPrinciples` | The rules you designed against, with reasoning |

### Structure & decisions
| Field | What's needed |
|---|---|
| `informationArchitecture` | Top-level areas and what sits under each |
| `userFlows` | Steps in order, with decision points and failure branches |
| `interactionDecisions` | **The most important field.** Per decision: problem · options · decision · why · trade-off · result |
| `aiBehaviour` *(Lumen only)* | 13 fields: intent · input · output · confidence · loading · errors · control · editing · explainability · feedback · privacy · recovery · automation |

### Craft & result
| Field | What's needed |
|---|---|
| `designSystem` | Summary, tokens, components, typography |
| `testing` | Method, participants, finding, **what changed** |
| `developmentCollaboration` | Handoff, review, QA, what you built |
| `outcomes` | What changed, in plain language (qualitative is fine) |
| `metrics` | **Measured numbers only, each with a `source`.** Leave empty rather than estimate |
| `testimonial` | Real, attributed, with permission |
| `lessons` | Specific and self-aware |

---

## Media needed

No project imagery exists yet — `public/` contains only default Next.js SVGs. Every media slot renders a **"Media needed"** frame at the correct aspect ratio.

| Slot | Spec |
|---|---|
| `heroMedia` | Real interface screen, 2400px+ wide. **Not a browser mockup in a rounded card** |
| `gallery` | Screens, states, process artefacts. Each needs `width`, `height`, `alt`, and a **decision-led caption** |
| `beforeAfter` | Both images + one sentence on what changed and why |
| `prototypes` | MP4 + `poster` + `description` (text alternative). Compressed, no audio |

**Requirements enforced by the media system:** WebP/AVIF preferred, explicit `width`/`height` (prevents layout shift), lazy loading except the hero, descriptive alt text, captions in `<figcaption>`, no autoplay-with-sound. The lightbox (keyboard + Escape) activates automatically once `gallery` has items.

---

## Fourth project

`atlas` is listed on `/work` as **"Case study in progress"** with no link and no route. Fill its fields and set `published: true` — the route, static params, and social image generate automatically.

---

## Suggested order

1. **`interactionDecisions`** for one project — it carries the most weight with hiring managers.
2. `challenge`, `businessContext`, `responsibilities` — the framing.
3. `heroMedia` + `gallery` — the pages are text-heavy without imagery.
4. `outcomes`; `metrics` only if you can source them.
5. Replace the homepage fake metrics.
6. Repeat for projects 2 and 3, then unlock Atlas.
