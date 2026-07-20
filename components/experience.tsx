import { experience } from "@/lib/content";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function Experience() {
  return (
    <SectionShell id="experience" aria-labelledby="experience-heading">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <Eyebrow>{experience.eyebrow}</Eyebrow>
            <h2
              id="experience-heading"
              className="text-h2 mt-5 text-balance"
            >
              {experience.heading}
            </h2>
          </div>
        </Reveal>

        <div>
          {experience.items.map((item, i) => (
            <Reveal key={item.period} delay={i * 0.06}>
              <div className="group grid grid-cols-1 gap-2 border-t border-border py-8 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <span className="font-mono text-sm text-faint">
                  {item.period}
                </span>
                <div>
                  <h3 className="text-h3 transition-colors duration-300 group-hover:text-accent">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-muted">
                    {item.org}
                  </p>
                  <p className="measure mt-3 leading-relaxed text-muted">
                    {item.blurb}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
