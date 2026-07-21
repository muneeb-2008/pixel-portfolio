# 03 — Content TODO

Everything below is placeholder and must be replaced before this is shown to
a client. **Nothing on the site is a real project, a real result, or a real
endorsement.**

## Demo content — must be replaced

| Item | Where | Status |
|---|---|---|
| **Clarity AI** — entire project | `src/content/projects.ts` → `featuredProject` | Fictional. Product, challenge, decision and outcome are all invented. |
| **Demo scenario** — query, answer, 41% confidence, three sources | `src/content/projects.ts` → `lensScenario` | Fictional data written to demonstrate the interaction. |
| "Demo project" / "Demo interface" / "Demo outcome" labels | Featured project + `clarity-canvas.tsx` | Keep until real content lands — they are the honesty markers. |
| Demo assets folder | `public/demo/clarity-ai/README.md` | Empty by design; the interface is markup, not images. |

The demo outcome is deliberately **qualitative**. Do not replace it with a
percentage unless the number is real and you can name its source.

## Temporary personal details

| Item | Where | Action |
|---|---|---|
| **Availability** — "Open to select projects — 2026" | `site.availability` | Confirm or set `visible: false`. Marked `isDemo: true`. |
| **Email** — `muneebqureshi411@gmail.com` | `site.contact.email` | Confirm this is the address to publish publicly. |
| **LinkedIn** — points at `linkedin.com` | `site.contact.linkedin` | Placeholder. Marked `isPlaceholder: true`. Replace with the real profile. |
| **Domain** — `muneebqureshi.design` | `site.url` | Used for canonical + Open Graph. Confirm before deploy. |

## Missing assets

- **Portrait** — none anywhere on the site. Decide whether the concept wants
  one; the current art direction works without it.
- **Project media** — no screens, flows, wireframes or prototype recordings.
  The Clarity AI interface is rendered in markup as a stand-in.
- **Open Graph image** — not yet generated. Social shares currently fall back
  to text metadata only.
- **Favicon** — still the Next.js default in `src/app/favicon.ico`.

## Missing real outcomes

No measured result appears anywhere, which is correct for now. When real work
replaces the demo, each number needs a source (analytics, the client, a study)
recorded beside it — an unsourced metric reads as invented.

## Not built yet (intentionally out of scope)

Testimonials · full process section · experience timeline · services grid ·
skills section · blog · full case studies · multiple project cards · footer
columns · awards · client logos. These follow once the art direction is
approved.
