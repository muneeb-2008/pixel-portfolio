import { testimonials } from "@/lib/content";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

/** Alternating column spans → asymmetric quote wall. */
const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export function Testimonials() {
  return (
    <SectionShell id="testimonials" aria-labelledby="testimonials-heading">
      <Reveal>
        <div className="max-w-3xl">
          <Eyebrow>{testimonials.eyebrow}</Eyebrow>
          <h2 id="testimonials-heading" className="text-h2 mt-5 text-balance">
            {testimonials.heading}
          </h2>
        </div>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {testimonials.items.map((t, i) => (
          <Reveal
            key={t.name + i}
            delay={(i % 2) * 0.08}
            className={spans[i % spans.length]}
          >
            <figure className="flex h-full flex-col justify-between rounded-2xl border border-border bg-surface/40 p-8 transition-colors duration-500 hover:border-border-strong">
              <span
                aria-hidden
                className="font-display text-5xl leading-none text-accent"
              >
                &ldquo;
              </span>
              <blockquote className="mt-4 text-pretty text-lg leading-relaxed text-foreground md:text-xl">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 text-sm">
                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/5 ring-1 ring-border" />
                <span>
                  <span className="font-medium text-foreground">{t.name}</span>
                  <span className="text-faint"> — {t.title}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
