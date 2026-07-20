import { philosophy } from "@/lib/content";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function Philosophy() {
  return (
    <SectionShell id="philosophy">
      <Reveal>
        <div className="max-w-3xl">
          <Eyebrow>{philosophy.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-4xl md:text-5xl">
            {philosophy.heading}
          </h2>
        </div>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 md:gap-y-14">
        {philosophy.principles.map((p, i) => (
          <Reveal key={p.index} delay={(i % 2) * 0.08}>
            <div className="border-t border-border pt-6">
              <span className="font-mono text-sm text-accent">{p.index}</span>
              <h3 className="mt-4 text-xl font-medium tracking-tight md:text-2xl">
                {p.title}
              </h3>
              <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted">
                {p.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
