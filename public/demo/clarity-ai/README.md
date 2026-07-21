# Clarity AI — demo assets

**This folder is for demo assets only. Nothing here represents real client work.**

Clarity AI is a fictional AI research workspace, written to demonstrate the
art direction and the Decision Lens interaction in the first concept. It has
no client, no engagement, and no measured results.

## Current state

The demo interface is **rendered in markup and CSS**, not stored as images —
see `src/components/demo/clarity-canvas.tsx`. That keeps the prototype light
(no image payload, no layout shift) and lets the same canvas transform between
the three decision states.

This folder is therefore empty of binaries by design.

## When real work replaces this

Drop real project media here, one folder per project:

```
public/demo/<project>/       →  public/work/<project>/
  cover.webp                    (2400px wide, WebP or AVIF)
  <screen>.webp                 interface screens
  <flow>.svg                    diagrams as SVG where possible
  <prototype>.mp4               H.264, no audio track, with a poster frame
```

Requirements for anything added here:

- WebP or AVIF for stills; never an uncompressed PNG screenshot
- Intrinsic `width` and `height` recorded so layout does not shift
- Descriptive alt text written per asset, not "screenshot"
- Video: poster image required, never autoplay with sound

## Replacing the content

Copy in `src/content/projects.ts`:

- `featuredProject` — the project record and its demo outcome
- `lensScenario` — the query, answer, confidence, sources, and the three states

Remove the `isDemo` flag and the "Demo project" / "Demo interface" labels once
real content lands. See `docs/03-content-todo.md`.
