import type { Project } from "@/lib/content";
import { Pill } from "@/components/ui/pill";
import { ArrowUpRight } from "@/components/ui/icons";

export function WorkCard({ project }: { project: Project }) {
  const accent = `hsl(${project.hue} 65% 55%)`;

  return (
    <article className="group">
      {/* Placeholder cover — theme-adaptive tint + faint product frame */}
      <div
        className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-border transition-all duration-500 group-hover:border-border-strong group-hover:shadow-[var(--shadow-lift)]"
        style={{
          background: `color-mix(in oklab, ${accent} 16%, var(--surface))`,
        }}
      >
        {/* Faint UI window */}
        <div className="absolute inset-x-6 bottom-[-1px] top-9 origin-bottom rounded-t-xl border border-border/70 bg-background/70 backdrop-blur-sm transition-transform duration-500 ease-out group-hover:-translate-y-1.5 sm:inset-x-8 sm:top-11">
          <div className="flex items-center gap-1.5 border-b border-border/70 px-4 py-3">
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
          <span className="text-sm font-semibold tracking-tight">
            {project.metric.value}
          </span>
          <span className="text-xs text-muted">{project.metric.label}</span>
        </div>

        {/* Hover affordance */}
        <div className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-all duration-300 group-hover:opacity-100 sm:right-5 sm:top-5">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      {/* Meta */}
      <div className="mt-5">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-faint">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h3 className="mt-2.5 text-xl font-medium tracking-tight md:text-2xl">
          {project.name}
        </h3>
        <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted md:text-base">
          {project.tagline}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      </div>
    </article>
  );
}
