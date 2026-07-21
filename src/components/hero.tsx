"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { site } from "@/content/site";
import { lensScenario } from "@/content/projects";
import { ClarityCanvas, canvasDescription } from "@/components/demo/clarity-canvas";

/**
 * Hero — an overlapping product composition, not text on an empty canvas.
 *
 * The headline holds the left of the grid while the product surface is
 * absolutely placed so it passes behind the longest headline line and crops
 * past the right gutter. The eight decision labels sit in a rail beneath the
 * copy: they enter scattered and settle into alignment, which is the same
 * motif the contact scene resolves.
 *
 * Motion uses fromTo with explicit end values and clearProps — a bare from()
 * can leave opacity pinned at 0 if it is ever interrupted, and content must
 * survive JS failing entirely.
 */
export function Hero() {
  const designed = lensScenario.states[2];
  const rootRef = useRef<HTMLElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (calm.matches) {
      const raf = requestAnimationFrame(() => setReduced(true));
      return () => cancelAnimationFrame(raf);
    }

    const ctx = gsap.context(() => {
      /* Settles inside ~1.1s — considered, but nothing still moving on arrival */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-line-inner]",
        { yPercent: 108 },
        { yPercent: 0, duration: 0.62, stagger: 0.06, clearProps: "transform" },
      )
        .fromTo(
          "[data-surface]",
          { y: 28, scale: 0.98, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.6, clearProps: "opacity,scale" },
          "-=0.42",
        )
        .fromTo(
          "[data-connector]",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.4, clearProps: "transform" },
          "-=0.32",
        )
        .fromTo(
          "[data-hero-meta]",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, clearProps: "all" },
          "-=0.34",
        )
        /* Labels arrive scattered and align */
        .fromTo(
          "[data-label]",
          {
            x: (i: number) => (i % 2 === 0 ? -18 : 18),
            y: (i: number) => (i % 3 === 0 ? 14 : -12),
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.035,
            clearProps: "all",
          },
          "-=0.3",
        );
    }, rootRef);

    /* Pointer depth — the blue field follows, the surface leans slightly */
    let active = fine.matches;
    const onMove = (e: PointerEvent) => {
      if (!active || frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const root = rootRef.current;
        if (!root) return;
        const r = root.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        if (fieldRef.current) {
          fieldRef.current.style.transform = `translate3d(${x - 340}px, ${y - 340}px, 0)`;
        }
        if (surfaceRef.current) {
          const dx = (x / r.width - 0.5) * 12;
          const dy = (y / r.height - 0.5) * 8;
          surfaceRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        }
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        active = fine.matches && entry.isIntersecting;
      },
      { rootMargin: "0px" },
    );
    if (rootRef.current) io.observe(rootRef.current);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      ctx.revert();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
      style={{ paddingTop: "var(--s-16)", paddingBottom: "var(--s-12)" }}
    >
      {/* Structural blue grid, faded toward the edges */}
      <div
        aria-hidden
        className="blue-grid pointer-events-none absolute inset-0"
        style={{
          opacity: 0.85,
          maskImage:
            "radial-gradient(ellipse 78% 62% at 62% 40%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 78% 62% at 62% 40%, #000 40%, transparent 100%)",
        }}
      />

      {/* Soft blue field following the pointer */}
      {!reduced && (
        <div
          ref={fieldRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 hidden h-[680px] w-[680px] rounded-full lg:block"
          style={{
            background:
              "radial-gradient(circle at center, var(--blue-field), transparent 62%)",
          }}
        />
      )}

      <div className="shell relative">
        {/* Role + context */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <p data-hero-meta className="label" style={{ color: "var(--ink)" }}>
            {site.role}
          </p>
          <p
            data-hero-meta
            style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}
          >
            {site.hero.context}
          </p>
        </div>

        {/* Composition: headline over an off-edge product surface */}
        <div className="relative mt-[var(--s-12)] lg:min-h-[660px]">
          {/* Headline first in the DOM. On large screens the surface below is
              absolutely positioned so order is irrelevant; on mobile this is
              what keeps the headline — not the interface — at the top. */}
          <h1 id="hero-heading" className="t-display relative z-10 lg:w-[58%]">
            {site.hero.headline.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span data-line-inner className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {/* Support + actions */}
          <div className="relative z-10 mt-[var(--s-8)] lg:w-[46%]">
            <p data-hero-meta className="measure" style={{ color: "var(--ink-2)" }}>
              {site.hero.support}
            </p>

            <div
              data-hero-meta
              className="mt-[var(--s-6)] flex flex-wrap items-center gap-x-[var(--s-8)] gap-y-[var(--s-3)]"
            >
              <a
                href={site.hero.primaryAction.href}
                className="group inline-flex min-h-11 items-center gap-2 no-underline"
                style={{ color: "var(--ink)", fontSize: "var(--t-lead)" }}
              >
                <span
                  className="border-b-2 pb-[3px]"
                  style={{ borderColor: "var(--blue-strong)" }}
                >
                  {site.hero.primaryAction.label}
                </span>
                <span
                  aria-hidden
                  className="transition-transform duration-[var(--dur)] ease-[var(--ease-out)] group-hover:translate-x-1"
                  style={{ color: "var(--blue-ink)" }}
                >
                  →
                </span>
              </a>
              <a
                href={site.hero.secondaryAction.href}
                className="inline-flex min-h-11 items-center no-underline"
                style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}
              >
                {site.hero.secondaryAction.label}
              </a>
            </div>
          </div>

          {/* Product surface. Absolute from lg up so it overlaps the headline
              and crops past the gutter; in flow below the CTA on mobile. */}
          <div
            data-surface
            ref={surfaceRef}
            className="relative z-0 mt-[var(--s-12)] lg:absolute lg:right-[calc(var(--gutter)*-1)] lg:top-[4%] lg:mt-0 lg:w-[46%]"
            style={{ willChange: "transform" }}
          >
            <div className="hidden lg:block">
              <ClarityCanvas state={designed} compact />
              <p className="sr-only">{canvasDescription(designed)}</p>
            </div>

            {/* Mobile / tablet: horizontal touch reveal of the product layers */}
            <div className="lg:hidden">
              <p className="label mb-[var(--s-3)]">
                Swipe to reveal the product decisions →
              </p>
              <div
                className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-[var(--s-4)] overflow-x-auto px-[var(--gutter)] pb-[var(--s-3)]"
                style={{ scrollbarWidth: "none" }}
              >
                <div className="w-[86%] shrink-0 snap-center">
                  <ClarityCanvas state={designed} compact />
                  <p className="sr-only">{canvasDescription(designed)}</p>
                </div>
                <div className="w-[86%] shrink-0 snap-center" aria-hidden>
                  <ClarityCanvas state={designed} compact annotated />
                </div>
              </div>
            </div>
          </div>

          {/* Decision rail — scattered on entry, aligned at rest. Deterministic
              layout: the labels can never collide the way free positioning did. */}
          <div className="relative z-10 mt-[var(--s-16)] lg:w-[52%]">
            <div className="flex items-center gap-[var(--s-3)]">
              <span className="label" style={{ color: "var(--blue-ink)" }}>
                Product decisions
              </span>
              <span
                data-connector
                aria-hidden
                className="connector h-px flex-1"
              />
            </div>
            <ul className="mt-[var(--s-4)] flex flex-wrap gap-x-[var(--s-6)] gap-y-[var(--s-2)]">
              {site.fragments.map((f) => (
                <li key={f} data-label className="fragment">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
