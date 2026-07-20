"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { profile } from "@/lib/content";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowUpRight, ArrowRight } from "@/components/ui/icons";
import { useAnchorScroll } from "@/lib/use-anchor-scroll";
import { EASE, lineParent, lineChild } from "@/lib/motion";

export function Hero() {
  const reduce = useReducedMotion();
  const onAnchor = useAnchorScroll();
  const ref = useRef<HTMLElement>(null);
  const [start, setStart] = useState(false);

  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const sx = useSpring(mx, { stiffness: 120, damping: 24, mass: 1 });
  const sy = useSpring(my, { stiffness: 120, damping: 24, mass: 1 });

  useEffect(() => {
    const w = window as unknown as { __loaderDone?: boolean };
    const on = () => setStart(true);
    // Already finished before this mounted (deferred to avoid a sync
    // setState in the effect body).
    if (w.__loaderDone) {
      const raf = requestAnimationFrame(on);
      return () => cancelAnimationFrame(raf);
    }
    window.addEventListener("loader:done", on);
    const fallback = setTimeout(on, 2600);
    return () => {
      window.removeEventListener("loader:done", on);
      clearTimeout(fallback);
    };
  }, []);

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left - 320);
    my.set(e.clientY - r.top - 320);
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Cursor spotlight (pointer devices only) */}
      {!reduce && (
        <motion.div
          aria-hidden
          style={{ x: sx, y: sy }}
          className="pointer-events-none absolute left-0 top-0 h-[40rem] w-[40rem] rounded-full opacity-70 blur-[90px]"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, var(--accent-soft), transparent 60%)",
            }}
          />
        </motion.div>
      )}

      {/* Off-canvas accent glow — corner, not a centered blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-52 -top-40 h-[38rem] w-[38rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, var(--accent-soft), transparent 66%)",
        }}
      />
      {/* Faint baseline hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-32 sm:px-8 lg:px-16 lg:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={start ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1.5 text-xs font-medium text-muted"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {profile.availabilityLabel}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={start ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="text-eyebrow mt-8"
        >
          {profile.heroEyebrow}
        </motion.p>

        <motion.h1
          variants={lineParent}
          initial="hidden"
          animate={start ? "visible" : "hidden"}
          className="text-display mt-5 max-w-[16ch] text-balance"
        >
          {profile.heroHeadlineLines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.1em]">
              <motion.span variants={lineChild} className="block">
                {line.map((seg, j) =>
                  seg.accent ? (
                    <span key={j} className="text-accent">
                      {seg.text}
                    </span>
                  ) : (
                    <span key={j}>{seg.text}</span>
                  ),
                )}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={start ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          className="measure mt-8 text-lg leading-relaxed text-muted"
        >
          {profile.heroSub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={start ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <MagneticButton href={`mailto:${profile.email}`}>
            Start a project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </MagneticButton>
          <MagneticButton
            href="#work"
            variant="ghost"
            onClick={(e) => onAnchor(e, "#work")}
          >
            View selected work
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </MagneticButton>
        </motion.div>

        {/* Stats */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={start ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
          className="mt-16 flex flex-wrap gap-x-10 gap-y-6 border-t border-border pt-8"
        >
          {profile.heroStats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                {stat.value}
              </dd>
              <p className="mt-1 text-sm text-faint">{stat.label}</p>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#work"
        onClick={(e) => onAnchor(e, "#work")}
        aria-label="Scroll to work"
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1, ease: EASE }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-faint md:flex"
      >
        <span className="text-eyebrow">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-border">
          {!reduce && (
            <motion.span
              className="absolute left-0 top-0 h-4 w-full bg-accent"
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </span>
      </motion.a>
    </section>
  );
}
