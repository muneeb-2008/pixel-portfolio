"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import type { Project } from "@/lib/content";
import { Pill } from "@/components/ui/pill";
import { ArrowUpRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** Placeholder cover with 3D tilt + faint product frame. */
function Cover({ project }: { project: Project }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 18, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 220, damping: 18, mass: 0.6 });
  const accent = `hsl(${project.hue} 70% 60%)`;

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    ry.set(dx * 7);
    rx.set(-dy * 6);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-border transition-colors duration-500 group-hover:border-border-strong"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `color-mix(in oklab, ${accent} 22%, var(--surface))`,
        }}
      />
      {/* Faint product window */}
      <div className="absolute inset-x-6 bottom-[-1px] top-9 rounded-t-xl border border-border bg-background/60 backdrop-blur-sm transition-transform duration-500 ease-out group-hover:-translate-y-1.5 sm:inset-x-8 sm:top-11">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-foreground/15" />
          <span className="h-2 w-2 rounded-full bg-foreground/15" />
          <span className="h-2 w-2 rounded-full bg-foreground/15" />
        </div>
        <div className="space-y-2.5 p-4">
          <div className="h-2 w-2/5 rounded-full" style={{ background: accent }} />
          <div className="h-2 w-full rounded-full bg-foreground/10" />
          <div className="h-2 w-5/6 rounded-full bg-foreground/10" />
          <div className="h-2 w-2/3 rounded-full bg-foreground/10" />
        </div>
      </div>

      {/* Metric chip */}
      <div className="absolute left-4 top-4 z-10 flex items-baseline gap-1.5 rounded-full border border-border bg-background/85 px-3 py-1.5 backdrop-blur sm:left-5 sm:top-5">
        <span className="font-display text-sm font-semibold tracking-tight text-accent">
          {project.metric.value}
        </span>
        <span className="text-xs text-muted">{project.metric.label}</span>
      </div>

      {/* Hover affordance */}
      <div className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-contrast opacity-0 transition-all duration-300 group-hover:opacity-100 sm:right-5 sm:top-5">
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </motion.div>
  );
}

function Meta({ project, index }: { project: Project; index: string }) {
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-faint">
        <span>{project.category}</span>
        <span>
          {index} · {project.year}
        </span>
      </div>
      <h3 className="text-h3 mt-3">{project.name}</h3>
      <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted">
        {project.tagline}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
      </div>
    </div>
  );
}

export function WorkCard({
  project,
  index,
  layout = "default",
  className,
}: {
  project: Project;
  index: string;
  layout?: "default" | "feature";
  className?: string;
}) {
  if (layout === "feature") {
    return (
      <article
        className={cn(
          "group grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12",
          className,
        )}
      >
        <Cover project={project} />
        <Meta project={project} index={index} />
      </article>
    );
  }
  return (
    <article className={cn("group", className)}>
      <Cover project={project} />
      <div className="mt-6">
        <Meta project={project} index={index} />
      </div>
    </article>
  );
}
