import Link from "next/link";
import type { CSSProperties } from "react";
import { projects } from "@/content/projects";
import { Reveal } from "@/components/ui/reveal";
import { Cover } from "@/components/ui/cover";
import { ArrowUpRight } from "@/components/ui/icons";

/* Literal class strings so Tailwind detects them; asymmetric editorial rhythm. */
const PLACEMENT = [
  "lg:col-span-7",
  "lg:col-span-5 lg:col-start-8 lg:mt-32",
  "lg:col-span-5",
  "lg:col-span-6 lg:col-start-7 lg:mt-16",
  "lg:col-span-6",
  "lg:col-span-5 lg:col-start-8 lg:mt-32",
];
const RATIO = ["4/3", "3/4", "4/3", "16/11", "4/3", "3/4"];

export function Projects() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="shell scroll-mt-24"
      style={{ paddingBlock: "var(--scene-y)" }}
    >
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label">Selected work</p>
            <h2 id="work-heading" className="t-display mt-[var(--s-6)]">
              Recent projects
            </h2>
          </div>
          <p className="label">{projects.length} projects · 2023—2025</p>
        </div>
      </Reveal>

      <div className="mt-[var(--s-24)] grid grid-cols-1 gap-x-[var(--gutter)] gap-y-16 lg:grid-cols-12">
        {projects.map((p, i) => (
          <Reveal
            key={p.slug}
            className={`col-span-full ${PLACEMENT[i]}`}
            style={{ ["--accent" as string]: p.accent } as CSSProperties}
          >
            <Link href={`/work/${p.slug}`} className="group block" data-cursor>
              <div className="media" style={{ aspectRatio: RATIO[i] }}>
                <Cover project={p} className="h-full" />
              </div>

              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <h3 className="t-h3 flex items-center gap-3">
                    <span className="label !text-ink-3">{p.index}</span>
                    <span className="link-sweep">{p.title}</span>
                  </h3>
                  <p className="mt-1.5 text-ink-2" style={{ fontSize: "var(--t-small)" }}>
                    {p.tagline}
                  </p>
                </div>
                <span
                  className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white"
                  aria-hidden
                >
                  <ArrowUpRight />
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3 text-ink-3" style={{ fontSize: "var(--t-small)" }}>
                <span>{p.category}</span>
                <span aria-hidden>·</span>
                <span>{p.year}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
