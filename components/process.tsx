import { process } from "@/lib/content";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function Process() {
  return (
    <SectionShell id="process">
      <Reveal>
        <div className="max-w-3xl">
          <Eyebrow>{process.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-4xl md:text-5xl">
            {process.heading}
          </h2>
        </div>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {process.steps.map((step, i) => (
          <Reveal key={step.step} delay={i * 0.08}>
            <div className="group h-full">
              <div className="h-px w-full bg-border transition-colors duration-300 group-hover:bg-accent" />
              <span className="mt-5 block font-mono text-sm text-accent">
                {step.step}
              </span>
              <h3 className="mt-3 text-lg font-medium tracking-tight md:text-xl">
                {step.title}
              </h3>
              <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
