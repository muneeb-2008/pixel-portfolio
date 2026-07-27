"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { lensScenario, type LensStateId } from "@/content/projects";
import { ClarityCanvas, canvasDescription } from "@/components/demo/clarity-canvas";

type Anchor = "answer" | "confidence" | "sources" | "controls";

const LENS_R = 180;

/**
 * THE DECISION LENS — the signature interaction.
 *
 * One product surface rendered twice, stacked in the same grid cell: the
 * plain interface, and an identical copy with the product decisions marked.
 * The marked copy is clipped to a lens that follows the pointer, so moving
 * across the interface uncovers the decisions beneath it.
 *
 * Refinement pass: the state selector lost its rules and grew, the
 * annotations lost their borders, and the scene gained room. The mechanics
 * are unchanged.
 *
 * Nothing depends on hover — touch and keyboard get a draggable reveal (a
 * real range input), and reduced-motion reveals the whole layer.
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

  const clipPath = revealAll
    ? "none"
    : pointerLens
      ? `circle(${LENS_R}px at 50% 40%)`
      : `inset(0 ${100 - wipe}% 0 0)`;

  /* Before the lens has selected anything, every annotation reads at full
     strength — dimming only makes sense once there is something to
     emphasise, and 40%-opacity body text fails contrast on arrival. */
  const isActive = (a: Anchor) =>
    revealAll || activeAnchor === null || activeAnchor === a;
  const showHandle = !revealAll && !pointerLens;

  return (
    <section
      id="decision-lens"
      aria-labelledby="lens-heading"
      className="relative overflow-hidden"
      style={{ paddingBlock: "var(--scene-y)" }}
    >
      <div className="shell">
        {/* Scene head */}
        <div className="lg:w-[64%]">
          <p className="label">Signature interaction</p>
          <h2 id="lens-heading" className="t-h1 mt-[var(--s-6)]">
            {lensScenario.heading}
          </h2>
          <p
            className="measure-wide mt-[var(--s-8)]"
            style={{ color: "var(--ink-2)", fontSize: "var(--t-lead)" }}
          >
            {lensScenario.intro}
          </p>
        </div>

        {/* State selector — large, ruleless, an underline marks the choice */}
        <fieldset className="mt-[var(--s-24)] border-0 p-0">
          <legend className="sr-only">Choose a product decision state</legend>
          <div className="flex flex-col gap-[var(--s-6)] sm:flex-row sm:gap-[var(--s-12)]">
            {lensScenario.states.map((s) => {
              const checked = s.id === stateId;
              return (
                <label key={s.id} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name={groupName}
                    value={s.id}
                    checked={checked}
                    onChange={() => setStateId(s.id)}
                    className="absolute h-px w-px overflow-hidden opacity-0"
                  />
                  <span
                    className="t-h3 block transition-colors duration-[var(--dur)]"
                    style={{ color: checked ? "var(--ink)" : "var(--ink-2)" }}
                  >
                    {s.title}
                  </span>
                  <span
                    aria-hidden
                    className="mt-[var(--s-3)] block h-[2px] origin-left transition-transform duration-[var(--dur)] ease-[var(--ease-out)]"
                    style={{
                      background: "var(--blue-strong)",
                      transform: checked ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid-editorial mt-[var(--s-16)] items-start gap-y-[var(--s-12)]">
          {/* The stage */}
          <div className="col-span-full lg:col-span-8">
            <div
              ref={stageRef}
              onPointerMove={onPointerMove}
              onPointerLeave={() => setActiveAnchor(null)}
              className="relative grid [&>*]:col-start-1 [&>*]:row-start-1"
              style={{
                cursor: pointerLens && !revealAll ? "crosshair" : "auto",
                /* Reserved so state 01 doesn't collapse the scene */
                minHeight: "clamp(300px, 40vh, 430px)",
              }}
            >
              <ClarityCanvas state={state} />

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

            {/* Quiet controls beneath the surface */}
            <div className="mt-[var(--s-6)] flex flex-wrap items-center justify-between gap-[var(--s-4)]">
              <p className="label" aria-live="polite">
                {revealAll
                  ? "All decisions shown"
                  : pointerLens
                    ? "Move the lens across the interface"
                    : "Drag to reveal"}
              </p>
              <label className="inline-flex min-h-11 cursor-pointer items-center gap-[var(--s-3)]">
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

            {showHandle && (
              <label className="mt-[var(--s-4)] block">
                <span className="sr-only">Reveal product decisions</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={wipe}
                  onChange={(e) => setWipe(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "var(--blue-strong)" }}
                />
              </label>
            )}
          </div>

          {/* Annotations — borderless, spacing does the grouping */}
          <div className="col-span-full lg:col-span-3 lg:col-start-10">
            <p
              style={{
                color: "var(--ink)",
                fontSize: "var(--t-lead)",
                lineHeight: 1.45,
              }}
            >
              {state.summary}
            </p>

            <ul className="mt-[var(--s-12)] flex flex-col gap-[var(--s-8)]">
              {state.annotations.map((a) => (
                <li
                  key={a.label}
                  className="annotation transition-opacity duration-[var(--dur)]"
                  style={{ opacity: isActive(a.anchor) ? 1 : 0.55 }}
                >
                  <strong>{a.label}</strong>
                  {a.body}
                </li>
              ))}
            </ul>

            <p
              className="mt-[var(--s-12)]"
              style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}
            >
              <span className="label block">
                {state.id === "designed" ? "Trade-off" : "What it costs"}
              </span>
              <span className="mt-[var(--s-3)] block">{state.cost}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
