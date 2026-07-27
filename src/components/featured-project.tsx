"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredProject, lensScenario } from "@/content/projects";
import { ClarityCanvas, canvasDescription } from "@/components/demo/clarity-canvas";

/**
 * Clarity AI — a cinematic light project scene.
 *
 * A near-white environment holds one oversized product surface that crops
 * past the right gutter. The surface is sticky (native `position: sticky`,
 * not a pinned scroll hijack) while the narrative passes it, transforming
 * from the bare answer to the designed one.
 *
 * Refinement pass: dropped the "INTERFACE — DESIGNED" rule row, the
 * per-beat annotation lines and the three-column metadata block. Grouping
 * is spacing now, not rules.
 */
export function FeaturedProject() {
  const p = featuredProject;
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(2);

  const beats = [
    { k: "01", label: "The problem", body: p.challenge },
    { k: "02", label: "The product decision", body: p.decision },
    {
      k: "03",
      label: "Human control",
      body: "Editing, approval and an undo path are designed before the happy path — so a wrong answer is recoverable rather than shipped.",
    },
  ];

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (calm.matches) {
      const raf = requestAnimationFrame(() => setStep(2));
      return () => cancelAnimationFrame(raf);
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 62%",
        end: "bottom 65%",
        onUpdate: (self) => {
          const pr = self.progress;
          setStep(pr < 0.3 ? 0 : pr < 0.62 ? 1 : 2);
        },
      });

      if (gridRef.current) {
        gsap.to(gridRef.current, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const state = lensScenario.states[step] ?? lensScenario.states[2];

  return (
    <section
      ref={rootRef}
      id="work"
      aria-labelledby="work-heading"
      /* overflow-x-clip, never overflow-hidden: `hidden` makes this a scroll
         container and silently disables the sticky surface inside. */
      className="relative overflow-x-clip"
      style={{ background: "var(--surface)" }}
    >
      {/* Grid confined to the interface side */}
      <div
        ref={gridRef}
        aria-hidden
        className="grid-panel pointer-events-none absolute right-0 top-0 hidden h-full w-[64%] lg:block"
      />

      {/* Introduction — one label, one title */}
      <div className="shell relative" style={{ paddingTop: "var(--scene-y)" }}>
        <p className="label">Selected work</p>
        <h2 id="work-heading" className="t-display mt-[var(--s-6)]">
          {p.name}
        </h2>
        <p
          className="measure-wide mt-[var(--s-8)]"
          style={{ color: "var(--ink-2)", fontSize: "var(--t-lead)" }}
        >
          {p.productType} · {p.year} — {p.role}
        </p>
      </div>

      {/* Narrative beside a sticky, transforming surface */}
      <div
        className="shell relative"
        style={{ marginTop: "var(--s-32)", paddingBottom: "var(--scene-y)" }}
      >
        <div className="grid-editorial items-stretch gap-y-[var(--s-16)]">
          {/* Beats — the column must outlast the surface or it unpins */}
          <div className="col-span-full lg:col-span-4">
            <ol className="flex flex-col gap-[var(--s-32)] lg:gap-[40vh] lg:pb-[26vh]">
              {beats.map((b) => (
                <li key={b.k}>
                  <p className="label">{b.label}</p>
                  <p
                    className="measure mt-[var(--s-4)]"
                    style={{
                      color: "var(--ink)",
                      fontSize: "var(--t-lead)",
                      lineHeight: 1.45,
                    }}
                  >
                    {b.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Oversized surface, cropping past the right gutter */}
          <div className="col-span-full lg:col-span-8 lg:col-start-5 lg:self-stretch">
            <div className="lg:sticky lg:top-[12vh]">
              <div style={{ marginRight: "calc(var(--gutter) * -1.3)" }}>
                <ClarityCanvas state={state} />
                <p className="sr-only">{canvasDescription(state)}</p>
              </div>
              <p className="label mt-[var(--s-4)]">
                {["Bare answer", "Uncertainty shown", "Designed"][step]}
              </p>
            </div>
          </div>
        </div>

        {/* Demo outcome — explicitly labelled, never a fabricated metric */}
        <div className="mt-[var(--s-40)] lg:w-[72%]">
          <p className="label" style={{ color: "var(--blue-ink)" }}>
            Demo outcome
          </p>
          <p className="t-h2 mt-[var(--s-6)]">{p.outcome}</p>
          <a
            href={p.href}
            className="group mt-[var(--s-8)] inline-flex min-h-11 items-center gap-2 no-underline"
            style={{ color: "var(--ink)", fontSize: "var(--t-lead)" }}
          >
            <span
              className="border-b-2 pb-[4px]"
              style={{ borderColor: "var(--blue-strong)" }}
            >
              {p.hrefLabel}
            </span>
            <span
              aria-hidden
              className="transition-transform duration-[var(--dur)] ease-[var(--ease-out)] group-hover:translate-x-1"
              style={{ color: "var(--blue-ink)" }}
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
