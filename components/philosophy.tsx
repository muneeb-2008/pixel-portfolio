import { philosophy } from "@/lib/content";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function Philosophy() {
  return (
    <SectionShell id="philosophy" aria-labelledby="philosophy-heading">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <Eyebrow>{philosophy.eyebrow}</Eyebrow>
            <h2
              id="philosophy-heading"
              className="text-h2 mt-5 text-balance"
            >
              {philosophy.heading}
            </h2>
          </div>
        </Reveal>

        <div>
          {philosophy.principles.map((p, i) => (
            <Reveal key={p.index} delay={(i % 2) * 0.06}>
              <div className="group grid grid-cols-[auto_1fr] gap-x-6 border-t border-border py-7">
                <span className="font-mono text-sm text-faint transition-colors duration-300 group-hover:text-accent">
                  {p.index}
                </span>
                <div>
                  <h3 className="text-h3">{p.title}</h3>
                  <p className="measure mt-3 leading-relaxed text-muted">
                    {p.body}
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
