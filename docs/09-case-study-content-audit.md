# 09 — Case Study Content Audit

**Date:** 2026-07-20
**Scope:** All project content and assets available to build case study pages.
**Gate:** Per the build brief, page construction does not begin until this audit is reviewed.

---

## Executive summary

**There is currently no verified, real project content available to populate case studies.**

Every project that exists in the codebase or in prior portfolio versions is **fictional placeholder content**. The only genuinely real material found is a set of **raw client assets** (PDFs, images, proposals) that carry no case-study narrative, no research record, no measured outcomes, and no confirmed permission to publish.

Because the brief states *"Do not invent project details, metrics, testimonials, client names, or results,"* this audit cannot promote any placeholder into a case study, and cannot construct a narrative from raw client files.

**A content decision is required before pages are built.** See [Blocking questions](#blocking-questions).

---

## 1. What is in the repository today

| Item | Finding |
|---|---|
| Project records | 4, in [`lib/content.ts`](../lib/content.ts) |
| Project assets in `public/` | **None.** Only default Next.js SVGs (`file`, `globe`, `next`, `vercel`, `window`) |
| Case-study routes | None (`/work` is a homepage section anchor only) |
| `docs/` folder | Did not exist before this audit |
| Design system | Complete and stable — dark editorial, cyan accent, Sora/Inter/JetBrains Mono |

### The four existing projects

`Helio`, `Lumen AI`, `Northwind`, `Atlas Design System`.

These were authored as **realistic placeholders** during the homepage build. The file itself declares this — `work.note` reads *"Placeholder case studies — swap for your real projects."* Their metrics (`+38% activation`, `2.1× faster drafting`, `−41% onboarding drop-off`, `5 products unified`) are **invented numbers** and must not be presented as results.

---

## 2. Per-project field audit

Classification: **Available** · **Needs rewriting** · **Needs verification** · **Missing**

The four repo projects share an identical profile, so they are audited as a group. Only structural scaffolding exists.

| Field | Helio | Lumen AI | Northwind | Atlas |
|---|---|---|---|---|
| Project name | Needs verification¹ | Needs verification¹ | Needs verification¹ | Needs verification¹ |
| Industry | Needs verification | Needs verification | Needs verification | Needs verification |
| Product type | Needs verification | Needs verification | Needs verification | Needs verification |
| Client | **Missing** | **Missing** | **Missing** | **Missing** |
| Year | Needs verification | Needs verification | Needs verification | Needs verification |
| Role | Needs verification | Needs verification | Needs verification | Needs verification |
| Team | **Missing** | **Missing** | **Missing** | **Missing** |
| Duration | **Missing** | **Missing** | **Missing** | **Missing** |
| Problem | Needs rewriting² | Needs rewriting² | Needs rewriting² | Needs rewriting² |
| User group | **Missing** | **Missing** | **Missing** | **Missing** |
| Business goal | **Missing** | **Missing** | **Missing** | **Missing** |
| Main challenge | **Missing** | **Missing** | **Missing** | **Missing** |
| Research material | **Missing** | **Missing** | **Missing** | **Missing** |
| User flows | **Missing** | **Missing** | **Missing** | **Missing** |
| Wireframes | **Missing** | **Missing** | **Missing** | **Missing** |
| UI screens | **Missing** | **Missing** | **Missing** | **Missing** |
| Prototype assets | **Missing** | **Missing** | **Missing** | **Missing** |
| Design system assets | **Missing** | **Missing** | **Missing** | **Missing** |
| Results | **Missing** | **Missing** | **Missing** | **Missing** |
| Metrics | Invented — **discard**³ | Invented — **discard**³ | Invented — **discard**³ | Invented — **discard**³ |
| Testimonials | **Missing** | **Missing** | **Missing** | **Missing** |

¹ Fictional names invented during the homepage build.
² One-line taglines exist and read well, but describe an imaginary product.
³ These numbers are fabricated. Publishing them would misrepresent results.

**Net: 0 of 21 fields are "Available" for any project.**

---

## 3. Other content sources examined

### 3a. Previous portfolio build — `D:\Download\My portfolio muneeb\`

A static HTML portfolio containing `projects.html` and `case-study.html`.

Projects listed: **FinTrack** (mobile banking), **Bloom** (e-commerce redesign), **Zara HR** (SaaS dashboard), **Pulse** (health & wellness brand), **Oasis** (real estate platform), **Kaya** (food delivery app).

**Assessment:** These are also placeholders — generic product names in a familiar AI-generated pattern, with no client, no metrics, and a `case-study.html` built from generic section headers (*The Challenge / Research / The Solution / Design System / Final Screens*) rather than a specific project. **"Zara HR" borrows a real trademarked brand name** and should not be used. **Not usable.**

### 3b. Copy files — `portfolio_copy.txt`, `portfolio copy of my.txt`

Generic agency/portfolio marketing copy. The "Case Study Layout" block contains only unquantified claims (*"Increased engagement," "Higher conversion rates"*) with no project attached. Useful as tone reference; **contains no project facts.**

### 3c. Candidate real client assets — `D:\Download\`

These appear to be genuine client work, but are **raw deliverables only** — no narrative, research record, or measured outcome:

| Source | Files | Notes |
|---|---|---|
| `OCG Website pages PDF` | 19 | Company / Contact / Pricing / Services / Work pages |
| `OCG Carousel Images` + `OCG Social Media` | 16+ | Social/marketing assets |
| `Proposal` | 17 | Unidentified proposal set |
| `agon-agent_1-89a28d5c` | 20 | Possible AI agent product |
| `copyrank-app` | 3 | Possible SaaS product |
| `Campus Gate new` / `Campus Gate Stone` | 5 | Real estate / signage |
| `AUTON8 Proposal.pdf` | 1 | Proposal |
| `AnesthesiaOne_*.docx` | 2 | Marketing/social strategy |
| `CS_Flooring_Design_Audit.*` | 3 | Design audit |
| `Ask Sameer`, `CGR`, `Sameer carousel` | several | Brand/social work |

**Assessment: Unverified.** I cannot confirm these are Muneeb's work, that they may be published, or what the outcomes were. Each would need Muneeb to supply problem, role, decisions, and results. **Cannot be used without input.**

---

## 4. Notable asset finding — real display font available

`D:\Download\GeneralSans_Complete\` contains the full **General Sans** family (OTF, TTF, variable, WOFF2) **with an FFL license file**.

The design tokens doc specifies *"Display: General Sans / Satoshi."* The site currently substitutes **Sora** because General Sans is not on Google Fonts. These files allow the **real specified typeface** to be self-hosted via `next/font/local` — a genuine fidelity upgrade, independent of the case study work.

---

## 5. Creative direction discrepancy

The build brief names **"From Noise to Signal"** as the current creative direction and source of truth.

**This document/direction does not exist** in the repository, in `D:\Download`, or in any of the ten planning docs (01–10). A full-text search returned no matches anywhere.

The actual current direction — established across the ten planning docs and the shipped homepage — is the **dark editorial system**: `#0A0A0A` surfaces, single cyan `#6AE8FF` accent, General Sans/Satoshi (Sora stand-in) + Inter + JetBrains Mono, purposeful reduced-motion-aware motion, 1440 grid.

This is close in spirit to a "noise → signal" idea (the philosophy copy is built on *"Clarity over decoration"* and *"Systems over screens"*), so it may simply be Muneeb's name for the existing direction — **but I will not assume that.**

---

## 6. Recommended three projects

**Cannot be responsibly selected yet.** Ranking fictional projects by "strength" would be ranking fiction.

Two viable paths:

- **Path A — Real work.** Muneeb names 3 real projects and supplies problem / role / decisions / outcome for each. Produces genuine case studies. Requires his input.
- **Path B — System first.** Build the complete case study system now against the 3 existing project slugs, with every narrative field rendered as a **visible content TODO**. Produces a fully working, tested, production-built system that becomes real the moment content is dropped into the data file. Invents nothing.

Path B is buildable immediately and is what the brief prescribes for missing content. Path A produces the better portfolio.

---

## 7. Blocking questions

1. **Which three projects should the case studies feature** — real client work (and if so, which), or the existing placeholder slugs as TODO scaffolds?
2. **Where is "From Noise to Signal"** — should the existing dark editorial system be treated as the direction, or is there a document to share?

---

## Appendix — audit method

```
find . -type f -not -path "./node_modules/*"     # repo inventory
grep -ril "noise to signal" D:/Download .        # direction search → 0 matches
sed -n '/export const projects/,/^];/p' lib/content.ts
grep -oE "<h[1-4][^>]*>[^<]+</h[1-4]>" projects.html case-study.html
find "<candidate dirs>" -type f | wc -l          # asset counts
```
