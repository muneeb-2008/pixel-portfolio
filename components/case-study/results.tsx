import type { Metric, Quote } from "@/lib/case-studies";
import { Reveal } from "@/components/ui/reveal";

/**
 * Measured results. Every number carries its source — an unsourced metric
 * is indistinguishable from a guess.
 */
export function Metrics({ items }: { items: Metric[] }) {
  return (
    <dl className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((m, i) => (
        <Reveal
          key={m.label}
          delay={i * 0.06}
          className="border-t border-border pt-6"
        >
          <dt className="text-pretty leading-relaxed text-foreground">
            {m.label}
          </dt>
          <dd className="mt-3">
            <span className="block font-display text-4xl font-semibold tracking-tight text-accent md:text-5xl">
              {m.value}
            </span>
            {m.source && (
              <span className="mt-2 block font-mono text-xs sm:text-[11px] uppercase tracking-[0.16em] text-faint">
                Source: {m.source}
              </span>
            )}
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}

export function TestimonialBlock({ quote }: { quote: Quote }) {
  return (
    <Reveal>
      <figure className="mt-12 max-w-3xl">
        <span aria-hidden className="font-display text-5xl leading-none text-accent">
          &ldquo;
        </span>
        <blockquote className="mt-3 text-pretty text-xl leading-relaxed text-foreground md:text-2xl">
          {quote.quote}
        </blockquote>
        <figcaption className="mt-6 text-sm">
          <span className="font-medium text-foreground">{quote.name}</span>
          <span className="text-faint"> — {quote.title}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}
