import type { Insight, Principle, ResearchActivity } from "@/lib/case-studies";
import { Reveal } from "@/components/ui/reveal";
import { RevealLi } from "@/components/ui/reveal-item";

/** What was actually done to learn — method, detail, sample. */
export function ResearchActivities({ items }: { items: ResearchActivity[] }) {
  return (
    <ul className="mt-10 divide-y divide-border border-y border-border">
      {items.map((item, i) => (
        <RevealLi
          key={item.method}
          delay={i * 0.05}
          className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8"
        >
          <div>
            <p className="text-h3">{item.method}</p>
            {item.sample && (
              <p className="mt-1 font-mono text-xs text-accent">
                {item.sample}
              </p>
            )}
          </div>
          <p className="text-pretty leading-relaxed text-muted">
            {item.detail}
          </p>
        </RevealLi>
      ))}
    </ul>
  );
}

/**
 * Findings that redirected the design. Staggered so the set reads as
 * fragments resolving into signal rather than a uniform grid.
 */
export function Insights({ items }: { items: Insight[] }) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
      {items.map((insight, i) => (
        <Reveal
          key={insight.title}
          delay={i * 0.08}
          className={
            i % 2 === 0
              ? "lg:col-span-7"
              : "lg:col-span-5 lg:mt-10"
          }
        >
          <article className="h-full rounded-2xl border border-border bg-surface/40 p-7">
            <p className="font-mono text-xs text-accent">
              Insight {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="text-h3 mt-4 text-balance">{insight.title}</h3>
            <p className="mt-4 text-pretty leading-relaxed text-muted">
              {insight.body}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/** The rules the product was designed against. */
export function Principles({ items }: { items: Principle[] }) {
  return (
    <ol className="mt-12">
      {items.map((p, i) => (
        <RevealLi
          key={p.title}
          delay={i * 0.05}
          className="grid grid-cols-1 gap-3 border-t border-border py-8 lg:grid-cols-[6rem_1fr_1fr] lg:gap-10"
        >
          <span className="font-mono text-sm text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="text-h3 text-balance">{p.title}</h3>
          <p className="text-pretty leading-relaxed text-muted">{p.body}</p>
        </RevealLi>
      ))}
    </ol>
  );
}
