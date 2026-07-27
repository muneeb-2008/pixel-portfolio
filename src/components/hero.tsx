"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { site } from "@/content/site";
import { lensScenario } from "@/content/projects";
import { ClarityCanvas, canvasDescription } from "@/components/demo/clarity-canvas";

/**
 * Hero — a headline and one product surface, given room.
 *
 * The refinement pass removed the eight-label decision rail and the
 * full-width grid: the motif now lives where it earns its place (the Decision
 * Lens annotations and the contact scene), and the grid is a scoped panel
 * behind the interface rather than wallpaper across the section.
 *
 * Motion uses fromTo with explicit end values and clearProps — a bare from()
 * can leave an element pinned at opacity 0 if interrupted, and content must
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
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-line-inner]",
        { yPercent: 108 },
        { yPercent: 0, duration: 0.72, stagger: 0.07, clearProps: "transform" },
      )
        .fromTo(
          "[data-surface]",
          { y: 32, scale: 0.985, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.7,
            clearProps: "opacity,scale",
          },
          "-=0.5",
        )
        .fromTo(
          "[data-hero-meta]",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, clearProps: "all" },
          "-=0.4",
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
          fieldRef.current.style.transform = `translate3d(${x - 380}px, ${y - 380}px, 0)`;
        }
        if (surfaceRef.current) {
          const dx = (x / r.width - 0.5) * 10;
          const dy = (y / r.height - 0.5) * 7;
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
      style={{ paddingTop: "var(--s-24)", paddingBottom: "var(--s-24)" }}
    >
      {/* Grid as a device: one panel on the interface side only */}
      <div
        aria-hidden
        className="grid-panel pointer-events-none absolute right-0 top-0 hidden h-[86%] w-[62%] lg:block"
      />

      {/* Soft blue field following the pointer */}
      {!reduced && (
        <div
          ref={fieldRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 hidden h-[760px] w-[760px] rounded-full lg:block"
          style={{
            background:
              "radial-gradient(circle at center, var(--blue-field), transparent 60%)",
          }}
        />
      )}

      <div className="shell relative">
        {/* A single restrained line of context */}
        <div
          data-hero-meta
          className="flex flex-wrap items-baseline gap-x-[var(--s-6)] gap-y-1"
        >
          <span className="label" style={{ color: "var(--ink)" }}>
            {site.role}
          </span>
          <span style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}>
            {site.hero.context}
          </span>
        </div>

        <div className="relative mt-[var(--s-16)] lg:min-h-[620px]">
          {/* Headline first in the DOM — on mobile this keeps it above the
              interface; on lg the surface is absolute so order is moot. */}
          <h1 id="hero-heading" className="t-display relative z-10 lg:w-[58%]">
            {site.hero.headline.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span data-line-inner className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div className="relative z-10 mt-[var(--s-12)] lg:w-[42%]">
            <p data-hero-meta className="measure" style={{ color: "var(--ink-2)" }}>
              {site.hero.support}
            </p>

            <div
              data-hero-meta
              className="mt-[var(--s-8)] flex flex-wrap items-center gap-x-[var(--s-8)] gap-y-[var(--s-3)]"
            >
              <a
                href={site.hero.primaryAction.href}
                className="group inline-flex min-h-11 items-center gap-2 no-underline"
                style={{ color: "var(--ink)", fontSize: "var(--t-lead)" }}
              >
                <span
                  className="border-b-2 pb-[4px]"
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

          {/* Product surface — absolute from lg so it overlaps the headline
              and crops past the gutter; below the CTA on mobile. */}
          <div
            data-surface
            ref={surfaceRef}
            className="relative z-0 mt-[var(--s-16)] lg:absolute lg:right-[calc(var(--gutter)*-1)] lg:top-[2%] lg:mt-0 lg:w-[40%]"
            style={{ willChange: "transform" }}
          >
            <div className="hidden lg:block">
              <ClarityCanvas state={designed} compact />
              <p className="sr-only">{canvasDescription(designed)}</p>
            </div>

            {/* Mobile / tablet: horizontal touch reveal of the product layers */}
            <div className="lg:hidden">
              <p className="label mb-[var(--s-4)]">Swipe to reveal decisions →</p>
              <div
                className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-[var(--s-4)] overflow-x-auto px-[var(--gutter)] pb-[var(--s-3)]"
                style={{ scrollbarWidth: "none" }}
              >
                <div className="w-[88%] shrink-0 snap-center">
                  <ClarityCanvas state={designed} compact />
                  <p className="sr-only">{canvasDescription(designed)}</p>
                </div>
                <div className="w-[88%] shrink-0 snap-center" aria-hidden>
                  <ClarityCanvas state={designed} compact annotated />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
