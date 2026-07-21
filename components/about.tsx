import { about, profile } from "@/lib/content";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function About() {
  const facts = [
    { label: "Based in", value: profile.location },
    { label: "Focus", value: profile.roles.join(", ") },
    { label: "Availability", value: profile.availabilityLabel },
  ];

  return (
    <SectionShell
      id="about"
      aria-labelledby="about-heading"
      className="border-y border-border bg-surface/30"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        {/* Portrait placeholder */}
        <Reveal>
          <div className="md:sticky md:top-28">
            <div
              className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-border"
              style={{
                background:
                  "color-mix(in oklab, var(--accent) 14%, var(--surface))",
              }}
            >
              <span className="font-display text-7xl font-bold text-foreground/85">
                MQ
              </span>
              <span className="absolute bottom-4 left-4 rounded-full border border-border bg-background/70 px-3 py-1 font-mono text-xs sm:text-[11px] uppercase tracking-[0.14em] text-faint backdrop-blur">
                Portrait → /public
              </span>
            </div>

            <dl className="mt-6 space-y-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-baseline justify-between gap-6 border-t border-border pt-3"
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.14em] text-faint">
                    {fact.label}
                  </dt>
                  <dd className="text-right text-sm text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/* Bio */}
        <Reveal delay={0.08}>
          <div>
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <p
              id="about-heading"
              className="text-h3 mt-6 text-balance font-display font-medium"
            >
              {about.lead}
            </p>
            <div className="mt-8 space-y-5 leading-relaxed text-muted">
              {about.paragraphs.map((para, i) => (
                <p key={i} className="measure">
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-background/40 p-5">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <p className="text-sm text-foreground">{about.focus}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
