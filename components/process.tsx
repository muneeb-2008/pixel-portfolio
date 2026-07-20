import { process } from "@/lib/content";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function Process() {
  return (
    <SectionShell
      id="process"
      aria-labelledby="process-heading"
      className="border-y border-border bg-surface/30"
    >
      <Reveal>
        <div className="max-w-3xl">
          <Eyebrow>{process.eyebrow}</Eyebrow>
          <h2 id="process-heading" className="text-h2 mt-5 text-balance">
            {process.heading}
          </h2>
        </div>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-8">
        {process.steps.map((step, i) => (
          <Reveal key={step.step} delay={i * 0.08}>
            <div className="group h-full">
              <div className="relative h-px w-full bg-border">
                <span className="absolute left-0 top-0 h-px w-0 bg-accent transition-[width] duration-500 ease-out group-hover:w-full" />
              </div>
              <span className="mt-5 block font-mono text-sm text-accent">
                {step.step}
              </span>
              <h3 className="text-h3 mt-3">{step.title}</h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
