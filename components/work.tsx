import Link from "next/link";
import { projects, work } from "@/lib/content";
import { getCaseStudy } from "@/lib/case-studies";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight } from "@/components/ui/icons";
import { WorkCard } from "@/components/work-card";

/** Only link projects that have a published case study. */
const caseStudyHref = (slug: string) =>
  getCaseStudy(slug) ? `/work/${slug}` : undefined;

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
        <WorkCard
          project={feature}
          index="01"
          layout="feature"
          href={caseStudyHref(feature.slug)}
        />
      </Reveal>

      {/* Remaining — asymmetric spans */}
      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 lg:mt-24 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <WorkCard
            project={rest[0]}
            index="02"
            href={caseStudyHref(rest[0].slug)}
          />
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.08}>
          <WorkCard
            project={rest[1]}
            index="03"
            href={caseStudyHref(rest[1].slug)}
          />
        </Reveal>
        <Reveal className="lg:col-span-8 lg:col-start-4">
          <WorkCard
            project={rest[2]}
            index="04"
            href={caseStudyHref(rest[2].slug)}
          />
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
        >
          View all work
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </SectionShell>
  );
}
