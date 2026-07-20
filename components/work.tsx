import { projects, work } from "@/lib/content";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { WorkCard } from "@/components/work-card";

export function Work() {
  return (
    <SectionShell id="work">
      <Reveal>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>{work.eyebrow}</Eyebrow>
            <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-4xl md:text-5xl">
              {work.heading}
            </h2>
          </div>
          <p className="max-w-xs text-sm text-faint md:text-right">{work.note}</p>
        </div>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.08}>
            <WorkCard project={project} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
