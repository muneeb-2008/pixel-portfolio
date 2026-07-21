import Link from "next/link";
import type { CaseStudy } from "@/lib/case-studies";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { profile } from "@/lib/content";

export function NextProject({
  previous,
  next,
}: {
  previous?: CaseStudy;
  next?: CaseStudy;
}) {
  return (
    <section
      aria-labelledby="next-project-heading"
      className="border-t border-border"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 py-24 sm:px-8 md:py-32 lg:px-16">
        {next && (
          <Reveal>
            <Link href={`/work/${next.slug}`} className="group block">
              <p
                id="next-project-heading"
                className="font-mono text-xs uppercase tracking-[0.22em] text-faint"
              >
                Next project
              </p>
              <h2 className="text-display mt-5 flex flex-wrap items-center gap-x-6 text-balance transition-colors duration-500 group-hover:text-accent">
                {next.title}
                <ArrowRight className="h-[0.5em] w-[0.5em] shrink-0 transition-transform duration-500 group-hover:translate-x-3" />
              </h2>
              <p className="measure mt-6 text-lg leading-relaxed text-muted">
                {next.heroStatement}
              </p>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                {next.category} · {next.year}
              </p>
            </Link>
          </Reveal>
        )}

        <Reveal delay={0.08}>
          <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              {previous && (
                <Link
                  href={`/work/${previous.slug}`}
                  className="link-underline inline-flex min-h-6 items-center text-muted transition-colors hover:text-foreground"
                >
                  ← {previous.title}
                </Link>
              )}
              <Link
                href="/work"
                className="link-underline inline-flex min-h-6 items-center text-muted transition-colors hover:text-foreground"
              >
                All work
              </Link>
            </div>

            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
