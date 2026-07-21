"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredProject, lensScenario } from "@/content/projects";
import { ClarityCanvas, canvasDescription } from "@/components/demo/clarity-canvas";

/**
 * Clarity AI — a cinematic light project scene.
 *
 * A pale blue environment holds one oversized white product surface that
 * crops past the right gutter. The surface is sticky (native `position:
 * sticky`, not a pinned scroll hijack) while the narrative beats pass it, and
 * it transforms from the bare answer to the designed one as they do.
 */
export function FeaturedProject() {
  const p = featuredProject;
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(2);

  const beats = [
    {
      k: "01",
      label: "The problem",
      body: p.challenge,
      note: "The answer arrives with no way to check it.",
    },
    {
      k: "02",
      label: "The product decision",
      body: p.decision,
      note: "Confidence is attributed, then evidence is put within reach.",
    },
    {
      k: "03",
      label: "Human control",
      body: "Editing, approval and an undo path are designed before the happy path — so a wrong answer is recoverable rather than shipped.",
      note: "Nothing consequential happens without a person.",
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
      // The surface builds itself as the beats pass
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 62%",
        end: "bottom 65%",
        onUpdate: (self) => {
          const pr = self.progress;
          setStep(pr < 0.3 ? 0 : pr < 0.62 ? 1 : 2);
        },
      });

      // Background grid drifts — depth without parallax theatrics
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          yPercent: 6,
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
      /* overflow-x-clip, never overflow-hidden: `hidden` makes this element a
         scroll container and silently disables the sticky surface inside. */
      className="relative overflow-x-clip"
      style={{ background: "var(--surface)" }}
    >
      <div
        ref={gridRef}
        aria-hidden
        className="blue-grid pointer-events-none absolute inset-0 -top-[6%] h-[112%]"
        style={{ opacity: 0.6 }}
      />

      {/* Introduction */}
      <div className="shell relative pt-[var(--s-24)]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <p className="label">
            <span style={{ color: "var(--blue-ink)" }}>01</span> — Selected work
          </p>
          <p className="label">Demo project</p>
        </div>

        <h2 id="work-heading" className="t-display mt-[var(--s-4)]">
          {p.name}
        </h2>

        <dl className="mt-[var(--s-8)] flex flex-wrap gap-x-[var(--s-16)] gap-y-[var(--s-4)]">
          {[
            { k: "Product type", v: p.productType },
            { k: "Role", v: p.role },
            { k: "Year", v: p.year },
          ].map((m) => (
            <div key={m.k}>
              <dt className="label">{m.k}</dt>
              <dd
                className="mt-[var(--s-1)]"
                style={{ fontSize: "var(--t-small)", color: "var(--ink)" }}
              >
                {m.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Narrative beside a sticky, transforming surface */}
      <div className="shell relative mt-[var(--s-16)] pb-[var(--s-24)]">
        {/* items-stretch (not start) so the surface column spans the full row
            height — otherwise the sticky element has almost no range and the
            interface scrolls away, leaving the beats stranded. */}
        <div className="grid-editorial items-stretch gap-y-[var(--s-12)]">
          {/* Beats — tall enough to give the sticky surface something to hold against */}
          <div className="col-span-full lg:col-span-4">
            {/* Gap + trailing padding set the sticky surface's travel: the
                column must outlast the surface or it unpins mid-story. */}
            <ol className="flex flex-col gap-[var(--s-24)] lg:gap-[40vh] lg:pb-[26vh]">
              {beats.map((b) => (
                <li key={b.k}>
                  <p className="label">
                    <span style={{ color: "var(--blue-ink)" }}>{b.k}</span> —{" "}
                    {b.label}
                  </p>
                  <p
                    className="measure mt-[var(--s-3)]"
                    style={{ color: "var(--ink)", fontSize: "var(--t-lead)", lineHeight: 1.45 }}
                  >
                    {b.body}
                  </p>
                  <p
                    className="measure mt-[var(--s-3)] pl-[var(--s-3)]"
                    style={{
                      borderLeft: "2px solid var(--blue)",
                      color: "var(--ink-2)",
                      fontSize: "var(--t-small)",
                    }}
                  >
                    {b.note}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Oversized surface, cropping past the right gutter */}
          <div className="col-span-full lg:col-span-8 lg:col-start-5 lg:self-stretch">
            <div className="lg:sticky lg:top-[12vh]">
              <div className="mb-[var(--s-3)] flex items-center gap-[var(--s-3)]">
                <span className="label">Interface</span>
                <span
                  aria-hidden
                  className="h-px flex-1"
                  style={{ background: "var(--blue-line)" }}
                />
                <span className="label" style={{ color: "var(--blue-ink)" }}>
                  {["Bare answer", "Uncertainty shown", "Designed"][step]}
                </span>
              </div>

              <div style={{ marginRight: "calc(var(--gutter) * -1.4)" }}>
                <ClarityCanvas state={state} />
                <p className="sr-only">{canvasDescription(state)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo outcome — explicitly labelled, never a fabricated metric */}
        <div
          className="mt-[var(--s-24)] grid-editorial items-start gap-y-[var(--s-4)] pt-[var(--s-8)]"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <p className="label col-span-full lg:col-span-3" style={{ color: "var(--blue-ink)" }}>
            Demo outcome
          </p>
          <p
            className="col-span-full lg:col-span-8"
            style={{
              fontSize: "var(--t-h2)",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              fontFamily: "var(--font-display)",
            }}
          >
            {p.outcome}
          </p>
          <a
            href={p.href}
            className="group col-span-full mt-[var(--s-2)] inline-flex min-h-11 items-center gap-2 no-underline lg:col-span-8"
            style={{ color: "var(--ink)" }}
          >
            <span
              className="border-b-2 pb-[3px]"
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
