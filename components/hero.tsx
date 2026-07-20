"use client";

import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/lib/content";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowUpRight, ArrowRight } from "@/components/ui/icons";
import { EASE } from "@/lib/motion";

export function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  };
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: EASE },
    },
  };

  return (
    <section className="relative overflow-hidden">
      {/* Soft accent glow — the only decoration, kept restrained. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-18%] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,var(--accent-soft),transparent_62%)] blur-2xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {profile.availabilityLabel}
            </span>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-faint"
          >
            {profile.heroEyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-5 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {profile.heroHeadline.map((seg, i) =>
              seg.accent ? (
                <span key={i} className="font-serif-italic">
                  {seg.text}
                </span>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted md:text-lg"
          >
            {profile.heroSub}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <MagneticButton href={`mailto:${profile.email}`}>
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
            <MagneticButton href="#work" variant="ghost">
              View selected work
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.dl
          variants={item}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.55 }}
          className="mt-16 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3"
        >
          {profile.heroStats.map((stat) => (
            <div key={stat.label} className="bg-background p-5">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-2xl font-semibold tracking-tight md:text-3xl">
                {stat.value}
              </dd>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </motion.dl>

        {/* Works-with row */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-faint"
        >
          <span className="font-mono text-xs uppercase tracking-[0.18em]">
            Working with
          </span>
          {profile.worksWith.map((w, i) => (
            <span key={w} className="flex items-center gap-3">
              {i > 0 && <span className="text-border-strong">·</span>}
              <span className="text-muted">{w}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
