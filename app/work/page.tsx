import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { caseStudies, type CaseStudy, resolve, todoNote } from "@/lib/case-studies";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRight } from "@/components/ui/icons";
import { MediaTodo } from "@/components/case-study/content-todo";
import { Figure } from "@/components/case-study/media";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected product design case studies by Muneeb Qureshi — AI product interfaces, SaaS dashboards, and fintech onboarding, told as product decisions rather than screens.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work — Muneeb Qureshi",
    description:
      "Selected product design case studies: AI product interfaces, SaaS dashboards, and fintech onboarding.",
    url: "/work",
  },
};

/** Preview media, or an honest placeholder at the right ratio. */
function PreviewMedia({
  study,
  ratio,
  sizes,
}: {
  study: CaseStudy;
  ratio: string;
  sizes: string;
}) {
  const media = resolve(study.heroMedia);
  if (media) return <Figure item={media} sizes={sizes} />;
  return (
    <MediaTodo
      note={todoNote(study.heroMedia) ?? "Preview image."}
      ratio={ratio}
    />
  );
}

function Meta({ study }: { study: CaseStudy }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
      <span className="text-accent">{study.category}</span> · {study.industry} ·{" "}
      {study.year}
    </p>
  );
}

function Services({ study }: { study: CaseStudy }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {study.services.map((s) => (
        <li
          key={s}
          className="rounded-full border border-border px-3.5 py-1.5 text-xs text-muted"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

function ReadLink({ study }: { study: CaseStudy }) {
  if (!study.published) {
    return (
      <p className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-faint">
        <span className="h-1.5 w-1.5 rounded-full bg-faint" aria-hidden />
        Case study in progress
      </p>
    );
  }
  return (
    <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground">
      Read the case study
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </span>
  );
}

/**
 * Three compositions, rotated so no two neighbouring projects read the same:
 * 0 — bleed feature, 1 — asymmetric split, 2 — editorial text-led.
 */
function ProjectPreview({ study, index }: { study: CaseStudy; index: number }) {
  const composition = index % 3;
  const themeVars = {
    "--accent": study.theme.accent,
    "--accent-soft": study.theme.accentSoft,
  } as CSSProperties;

  const body = (
    <>
      <Meta study={study} />
      <h2 className="text-h1 mt-4 text-balance transition-colors duration-500 group-hover:text-accent">
        {study.title}
      </h2>
      <p className="measure mt-5 text-lg leading-relaxed text-muted">
        {study.heroStatement}
      </p>
      <p className="measure mt-3 leading-relaxed text-faint">
        {study.shortSummary}
      </p>
      <Services study={study} />
      <ReadLink study={study} />
    </>
  );

  const inner =
    composition === 0 ? (
      <div>
        <div className="max-w-3xl">{body}</div>
        <div className="mt-12">
          <PreviewMedia study={study} ratio="16/9" sizes="100vw" />
        </div>
      </div>
    ) : composition === 1 ? (
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>{body}</div>
        <PreviewMedia
          study={study}
          ratio="4/3"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>{body}</div>
        <div className="lg:pt-16">
          <PreviewMedia
            study={study}
            ratio="3/4"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
      </div>
    );

  return (
    <Reveal style={themeVars} className="border-t border-border py-16 md:py-24">
      {study.published ? (
        <article className="group">
          <Link href={`/work/${study.slug}`} className="block">
            {inner}
          </Link>
        </article>
      ) : (
        <article className="opacity-75">{inner}</article>
      )}
    </Reveal>
  );
}

export default function WorkIndexPage() {
  const categories = [...new Set(caseStudies.map((c) => c.category))];

  return (
    <>
      {/* Introduction */}
      <section className="mx-auto w-full max-w-[1440px] px-6 pb-8 pt-32 sm:px-8 lg:px-16 lg:pt-40">
        <Reveal>
          <Eyebrow>Selected work</Eyebrow>
          <h1 className="text-display mt-6 max-w-[18ch] text-balance">
            Product decisions, not screenshots.
          </h1>
          <p className="measure mt-8 text-lg leading-relaxed text-muted">
            Each of these is written as a product story — the problem, the
            constraints, the options I weighed, the trade-offs I accepted, and
            what changed as a result. Where a project involved AI, it also
            covers how the system communicates confidence and keeps people in
            control.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2">
            <dt className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
              Categories
            </dt>
            {categories.map((c) => (
              <dd
                key={c}
                className="rounded-full border border-border px-3.5 py-1.5 text-xs text-muted"
              >
                {c}
              </dd>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Projects */}
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 sm:px-8 lg:px-16">
        {caseStudies.map((study, i) => (
          <ProjectPreview key={study.slug} study={study} index={i} />
        ))}
      </div>
    </>
  );
}
