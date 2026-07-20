import { projects, work } from "@/lib/content";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { WorkCard } from "@/components/work-card";

export function Work() {
  const [feature, ...rest] = projects;

  return (
    <SectionShell id="work" aria-labelledby="work-heading">
      <Reveal>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>{work.eyebrow}</Eyebrow>
            <h2 id="work-heading" className="text-h2 mt-5 text-balance">
              {work.heading}
            </h2>
          </div>
          <p className="max-w-[16rem] text-sm text-faint md:text-right">
            {work.note}
          </p>
        </div>
      </Reveal>

      {/* Feature project */}
      <Reveal className="mt-16" y={32}>
        <WorkCard project={feature} index="01" layout="feature" />
      </Reveal>

      {/* Remaining — asymmetric spans */}
      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 lg:mt-24 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <WorkCard project={rest[0]} index="02" />
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.08}>
          <WorkCard project={rest[1]} index="03" />
        </Reveal>
        <Reveal className="lg:col-span-8 lg:col-start-4">
          <WorkCard project={rest[2]} index="04" />
        </Reveal>
      </div>
    </SectionShell>
  );
}
