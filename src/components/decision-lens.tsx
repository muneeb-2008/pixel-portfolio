"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { lensScenario, type LensStateId } from "@/content/projects";
import { ClarityCanvas, canvasDescription } from "@/components/demo/clarity-canvas";

type Anchor = "answer" | "confidence" | "sources" | "controls";

const LENS_R = 165;

/**
 * THE DECISION LENS — the signature interaction.
 *
 * One product surface is rendered twice, stacked in the same grid cell: the
 * plain interface, and an identical copy with the product decisions marked.
 * The marked copy is clipped to a lens that follows the pointer, so moving
 * across the interface literally uncovers the decisions beneath it.
 *
 * Because both layers are the same component, they align exactly at every
 * width. Selecting a state transforms both.
 *
 * Nothing depends on hover: touch and keyboard users get a draggable reveal
 * (a real range input), and reduced-motion users get the whole layer revealed.
 */
export function DecisionLens() {
  const [stateId, setStateId] = useState<LensStateId>("hidden");
  const [pointerLens, setPointerLens] = useState(false);
  const [revealAll, setRevealAll] = useState(true);
  const [wipe, setWipe] = useState(55);
  const [activeAnchor, setActiveAnchor] = useState<Anchor | null>(null);
  const [inView, setInView] = useState(true);

  const stageRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const groupName = useId();

  const state =
    lensScenario.states.find((s) => s.id === stateId) ?? lensScenario.states[0];

  /* Pointer lens for fine pointers only; everyone else drags or sees it all */
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const enabled = fine.matches && !calm.matches;
      setPointerLens(enabled);
      setRevealAll(calm.matches);
    };
    const raf = requestAnimationFrame(sync);
    fine.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(raf);
      fine.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  /* Stop pointer work while the scene is off-screen */
  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "150px",
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!pointerLens || revealAll || !inView) return;
      const cx = event.clientX;
      const cy = event.clientY;
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const stage = stageRef.current;
        if (!stage) return;
        const rect = stage.getBoundingClientRect();
        const x = cx - rect.left;
        const y = cy - rect.top;

        if (revealRef.current) {
          revealRef.current.style.clipPath = `circle(${LENS_R}px at ${x}px ${y}px)`;
        }

        let nearest: Anchor | null = null;
        let best = Number.POSITIVE_INFINITY;
        stage.querySelectorAll<HTMLElement>("[data-region]").forEach((region) => {
          const r = region.getBoundingClientRect();
          if (r.height === 0) return;
          const centre = r.top + r.height / 2 - rect.top;
          const d = Math.abs(centre - y);
          if (d < best) {
            best = d;
            nearest = region.dataset.region as Anchor;
          }
        });
        setActiveAnchor(nearest);
      });
    },
    [pointerLens, revealAll, inView],
  );

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );

  /* One clip expression drives every mode */
  const clipPath = revealAll
    ? "none"
    : pointerLens
      ? `circle(${LENS_R}px at 50% 40%)`
      : `inset(0 ${100 - wipe}% 0 0)`;

  const isActive = (a: Anchor) => revealAll || activeAnchor === a;
  const showHandle = !revealAll && !pointerLens;

  return (
    <section
      id="decision-lens"
      aria-labelledby="lens-heading"
      className="relative overflow-hidden py-[var(--s-24)]"
      style={{ background: "var(--bg)" }}
    >
      <div className="shell">
        {/* Scene head — offset, not centred */}
        <div className="grid-editorial items-end gap-y-[var(--s-4)]">
          <div className="col-span-full lg:col-span-7">
            <p className="label">
              <span style={{ color: "var(--blue-ink)" }}>02</span> — Signature
              interaction
            </p>
            <h2 id="lens-heading" className="t-h2 mt-[var(--s-4)]">
              {lensScenario.heading}
            </h2>
          </div>
          <p className="measure col-span-full lg:col-span-4 lg:col-start-9" style={{ color: "var(--ink-2)" }}>
            {lensScenario.intro}
          </p>
        </div>

        {/* State selector — a segmented rule, never cards */}
        <fieldset className="mt-[var(--s-12)] border-0 p-0">
          <legend className="label">Choose a product decision state</legend>
          <div
            className="mt-[var(--s-4)] flex flex-col sm:flex-row"
            style={{ borderTop: "1px solid var(--line)" }}
          >
            {lensScenario.states.map((s) => {
              const checked = s.id === stateId;
              return (
                <label
                  key={s.id}
                  className="relative flex flex-1 cursor-pointer items-baseline gap-[var(--s-3)] py-[var(--s-4)] pr-[var(--s-6)] transition-colors duration-[var(--dur)]"
                  style={{ borderBottom: "1px solid var(--line-soft)" }}
                >
                  <input
                    type="radio"
                    name={groupName}
                    value={s.id}
                    checked={checked}
                    onChange={() => setStateId(s.id)}
                    className="absolute h-px w-px overflow-hidden opacity-0"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -top-px h-[2px] origin-left transition-transform duration-[var(--dur)] ease-[var(--ease-out)]"
                    style={{
                      background: "var(--blue-strong)",
                      transform: checked ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--t-label)",
                      color: checked ? "var(--blue-ink)" : "var(--ink-2)",
                    }}
                  >
                    {s.index}
                  </span>
                  <span
                    className="font-display transition-colors duration-[var(--dur)]"
                    style={{
                      fontSize: "var(--t-h3)",
                      letterSpacing: "-0.018em",
                      color: checked ? "var(--ink)" : "var(--ink-2)",
                    }}
                  >
                    {s.title}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid-editorial mt-[var(--s-8)] items-start gap-y-[var(--s-8)]">
          {/* The stage */}
          <div className="col-span-full lg:col-span-8">
            <div className="mb-[var(--s-3)] flex flex-wrap items-center justify-between gap-[var(--s-3)]">
              <p className="label" aria-live="polite">
                {revealAll
                  ? "All product decisions shown"
                  : pointerLens
                    ? "Move the lens across the interface"
                    : "Drag to reveal the decisions"}
              </p>
              <label className="inline-flex min-h-11 cursor-pointer items-center gap-[var(--s-2)]">
                <input
                  type="checkbox"
                  checked={revealAll}
                  onChange={(e) => setRevealAll(e.target.checked)}
                  className="h-4 w-4"
                  style={{ accentColor: "var(--blue-strong)" }}
                />
                <span className="label">Reveal all</span>
              </label>
            </div>

            <div
              ref={stageRef}
              onPointerMove={onPointerMove}
              onPointerLeave={() => setActiveAnchor(null)}
              className="relative grid [&>*]:col-start-1 [&>*]:row-start-1"
              style={{
                cursor: pointerLens && !revealAll ? "crosshair" : "auto",
                /* Reserved so state 01 doesn't collapse the scene and the
                   page never jumps between states */
                minHeight: "clamp(300px, 40vh, 430px)",
              }}
            >
              {/* Base: the interface as the visitor first meets it */}
              <ClarityCanvas state={state} />

              {/* Reveal: the same interface with its decisions marked */}
              <div
                ref={revealRef}
                aria-hidden
                style={{
                  clipPath,
                  transition: revealAll
                    ? "clip-path var(--dur-slow) var(--ease-out)"
                    : undefined,
                }}
              >
                <ClarityCanvas state={state} annotated />
              </div>

              {/* Drag handle for touch / keyboard */}
              {showHandle && (
                <div className="pointer-events-none relative">
                  <div
                    aria-hidden
                    className="absolute inset-y-0 w-[2px]"
                    style={{ left: `${wipe}%`, background: "var(--blue-strong)" }}
                  />
                </div>
              )}
            </div>

            <p className="sr-only">{canvasDescription(state)}</p>

            {/* Real control, not a hover affordance */}
            {showHandle && (
              <label className="mt-[var(--s-4)] block">
                <span className="label">Reveal product decisions</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={wipe}
                  onChange={(e) => setWipe(Number(e.target.value))}
                  className="mt-[var(--s-2)] w-full"
                  style={{ accentColor: "var(--blue-strong)" }}
                />
              </label>
            )}
          </div>

          {/* Annotations — always in the DOM, never hover-only */}
          <div className="col-span-full lg:col-span-3 lg:col-start-10">
            <p
              className="pt-[var(--s-3)]"
              style={{
                borderTop: "1px solid var(--line)",
                color: "var(--ink)",
                fontSize: "var(--t-small)",
              }}
            >
              {state.summary}
            </p>

            <p className="label mt-[var(--s-8)]">Product decisions</p>
            <ul className="mt-[var(--s-4)] flex flex-col gap-[var(--s-4)]">
              {state.annotations.map((a) => (
                <li
                  key={a.label}
                  className="annotation transition-opacity duration-[var(--dur)]"
                  style={{
                    opacity: isActive(a.anchor) ? 1 : 0.45,
                    borderLeftColor: isActive(a.anchor)
                      ? "var(--blue-strong)"
                      : "var(--line)",
                  }}
                >
                  <strong>{a.label}</strong>
                  {a.body}
                </li>
              ))}
            </ul>

            <div
              className="mt-[var(--s-8)] pt-[var(--s-4)]"
              style={{ borderTop: "1px solid var(--line)" }}
            >
              <p className="label">
                {state.id === "designed" ? "Trade-off" : "What it costs"}
              </p>
              <p
                className="mt-[var(--s-2)]"
                style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}
              >
                {state.cost}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
