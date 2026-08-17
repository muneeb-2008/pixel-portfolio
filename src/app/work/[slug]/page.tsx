import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { getAdjacent, getProject, projects } from "@/content/projects";
import { Cover } from "@/components/ui/cover";
import { Reveal } from "@/components/ui/reveal";
import { Footer } from "@/components/sections/footer";
import { ArrowLeft, ArrowUpRight } from "@/components/ui/icons";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${p.category}`,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      type: "article",
      title: p.title,
      description: p.summary,
      url: `/work/${p.slug}`,
    },
  };
}

/** Composed placeholder media — no stock images. */
function GalleryBlock({
  ratio,
  label,
  accent,
}: {
  ratio: string;
  label: string;
  accent: string;
}) {
  return (
    <figure className="media relative" style={{ aspectRatio: ratio }}>
      <div
        className="h-full w-full"
        style={{
          background: `radial-gradient(130% 130% at 25% 0%, ${accent}22, transparent 62%),
                       radial-gradient(100% 100% at 100% 100%, ${accent}14, transparent 60%),
                       var(--bg-2)`,
        }}
      />
      <span
        aria-hidden
        className="absolute right-6 top-6 h-10 w-10 rounded-full"
        style={{ border: `1.5px solid ${accent}` }}
      />
      <figcaption className="label absolute bottom-5 left-6">{label}</figcaption>
    </figure>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const { next } = getAdjacent(slug);
  const scope = { ["--accent" as string]: p.accent } as CSSProperties;

  return (
    <div style={scope}>
      {/* ---- Arrival ---------------------------------------------------- */}
      <header className="shell" style={{ paddingTop: "var(--s-32)" }}>
        <Reveal>
          <Link
            href="/#work"
            className="link-sweep inline-flex items-center gap-2 text-ink-2 transition-colors hover:text-ink"
            style={{ fontSize: "var(--t-small)" }}
          >
            <ArrowLeft /> Back to work
          </Link>
        </Reveal>

        <Reveal className="mt-[var(--s-12)]">
          <h1 className="t-hero">{p.title}</h1>
        </Reveal>
        <Reveal className="mt-[var(--s-6)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="t-lead max-w-[26ch] text-ink-2">{p.tagline}.</p>
            <p className="label">
              {p.category} · {p.year}
            </p>
          </div>
        </Reveal>
      </header>

      {/* Full-bleed cover */}
      <Reveal className="mt-[var(--s-16)]" y={48}>
        <div
          className="media"
          style={{
            width: "min(100vw, var(--container))",
            marginInline: "auto",
            aspectRatio: "16/9",
            borderRadius: "var(--r-xl)",
          }}
        >
          <Cover project={p} className="h-full" />
        </div>
      </Reveal>

      {/* ---- Overview --------------------------------------------------- */}
      <section className="shell" style={{ paddingBlock: "var(--scene-y)" }}>
        <Reveal>
          <p className="label mb-[var(--s-8)]">Overview</p>
          <p className="t-h1 max-w-[20ch] font-display">{p.overview}</p>
        </Reveal>

        {/* Credits */}
        <Reveal className="mt-[var(--s-16)]">
          <dl className="grid grid-cols-2 gap-y-8 border-t border-line pt-8 md:grid-cols-4">
            {p.meta.map((m) => (
              <div key={m.label}>
                <dt className="label">{m.label}</dt>
                <dd className="mt-2 text-ink" style={{ fontSize: "var(--t-small)" }}>
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ---- Story: alternating media / text at scale ------------------- */}
      <div className="flex flex-col gap-[var(--scene-y)]">
        {p.sections.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <section key={s.heading} className="shell">
              <div className="grid-12 items-center gap-y-[var(--s-10)]">
                {/* text */}
                <Reveal
                  className={
                    flip
                      ? "col-span-full lg:col-span-4 lg:col-start-9"
                      : "col-span-full lg:col-span-4"
                  }
                >
                  <p className="label !text-[color:var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="t-h2 mt-[var(--s-5)]">{s.heading}</h2>
                  <p
                    className="mt-[var(--s-6)] text-ink-2"
                    style={{ fontSize: "var(--t-lead)", lineHeight: 1.5 }}
                  >
                    {s.body}
                  </p>
                </Reveal>

                {/* media */}
                <div
                  className={
                    flip
                      ? "col-span-full lg:col-span-7 lg:col-start-1 lg:row-start-1"
                      : "col-span-full lg:col-span-7 lg:col-start-6"
                  }
                >
                  {s.gallery && s.gallery.length > 0 ? (
                    <div
                      className={`grid gap-5 ${
                        s.gallery.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"
                      }`}
                    >
                      {s.gallery.map((g, gi) => (
                        <Reveal key={gi} delay={gi * 0.06}>
                          <GalleryBlock ratio={g.ratio} label={g.label} accent={p.accent} />
                        </Reveal>
                      ))}
                    </div>
                  ) : (
                    <Reveal>
                      <GalleryBlock ratio="16/10" label={s.heading} accent={p.accent} />
                    </Reveal>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ---- Outcome ---------------------------------------------------- */}
      <section className="shell" style={{ paddingBlock: "var(--scene-y)" }}>
        <Reveal>
          <p className="label !text-[color:var(--accent)]">Outcome</p>
          <p className="t-display mt-[var(--s-8)] max-w-[22ch]">{p.outcome}</p>
        </Reveal>
      </section>

      {/* ---- Next project: fills on hover ------------------------------- */}
      {next && (
        <Link
          href={`/work/${next.slug}`}
          data-cursor
          className="group relative block overflow-hidden border-t border-line"
          style={{ ["--accent" as string]: next.accent } as CSSProperties}
        >
          {/* accent fill sweeps up */}
          <span
            aria-hidden
            className="absolute inset-0 origin-bottom translate-y-full transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:translate-y-0"
            style={{ background: "var(--accent)" }}
          />
          <div
            className="shell relative flex flex-col gap-[var(--s-6)] transition-colors duration-500 group-hover:text-white"
            style={{ paddingBlock: "var(--s-24)" }}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="label transition-colors duration-500 group-hover:text-white/80">
                Next project
              </p>
              <span
                className="grid h-11 w-11 place-items-center rounded-full border border-line transition-all duration-500 group-hover:border-white/40 group-hover:text-white"
                aria-hidden
              >
                <ArrowUpRight />
              </span>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <h2 className="t-hero">{next.title}</h2>
              <p
                className="transition-colors duration-500 group-hover:text-white/85"
                style={{ fontSize: "var(--t-lead)", color: "var(--ink-2)" }}
              >
                {next.category} · {next.year}
              </p>
            </div>
          </div>
        </Link>
      )}

      <Footer />
    </div>
  );
}
