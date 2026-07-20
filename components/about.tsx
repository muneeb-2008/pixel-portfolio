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
      className="border-y border-border bg-surface/40"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        {/* Portrait placeholder */}
        <Reveal>
          <div className="md:sticky md:top-28">
            <div
              className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-border"
              style={{
                background:
                  "color-mix(in oklab, var(--accent) 12%, var(--surface))",
              }}
            >
              <span className="font-serif-italic text-7xl text-foreground/80">
                MQ
              </span>
              <span className="absolute bottom-4 left-4 rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint backdrop-blur">
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
            <p className="mt-6 text-balance text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              {about.lead}
            </p>
            <div className="mt-8 space-y-5 text-pretty leading-relaxed text-muted md:text-lg">
              {about.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
