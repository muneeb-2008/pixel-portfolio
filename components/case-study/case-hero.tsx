import Link from "next/link";
import { type CaseStudy, resolve, todoNote } from "@/lib/case-studies";
import { Reveal } from "@/components/ui/reveal";
import { ContentTodo, MediaTodo } from "./content-todo";
import { Figure } from "./media";

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.18em] text-faint">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}

/** Compact value that falls back to a short pending marker. */
function PendingValue({ value }: { value: unknown }) {
  const note = todoNote(value);
  if (note) {
    return <span className="text-faint italic">To be added</span>;
  }
  return <>{String(value)}</>;
}

export function CaseHero({ study }: { study: CaseStudy }) {
  const heroMedia = resolve(study.heroMedia);
  const heroMediaNote = todoNote(study.heroMedia);
  const outcomes = resolve(study.outcomes);
  const outcomeNote = todoNote(study.outcomes);
  const frame = study.theme.mediaFrame;

  const media = heroMedia ? (
    <Figure
      item={heroMedia}
      priority
      sizes={frame === "inset" ? "(min-width: 1024px) 45vw, 100vw" : "100vw"}
    />
  ) : (
    <MediaTodo
      note={heroMediaNote ?? "Hero interface asset."}
      ratio={frame === "inset" ? "4/3" : "16/9"}
    />
  );

  const titleBlock = (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-faint">
          <li>
            <Link
              href="/work"
              className="link-underline inline-flex min-h-6 items-center transition-colors hover:text-foreground"
            >
              Work
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-muted">{study.shortTitle}</li>
        </ol>
      </nav>

      <p className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-accent">
        {study.category} · {study.industry}
      </p>

      <h1 className="text-display mt-4 text-balance">{study.title}</h1>

      <p className="measure mt-6 text-lg leading-relaxed text-muted md:text-xl">
        {study.heroStatement}
      </p>
    </>
  );

  const metaBlock = (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
      <MetaItem label="Role" value={study.role} />
      <MetaItem
        label="Duration"
        value={<PendingValue value={study.duration} />}
      />
      <MetaItem label="Year" value={study.year} />
      <MetaItem label="Client" value={<PendingValue value={study.client} />} />
    </dl>
  );

  const outcomeBlock = outcomes ? (
    <div className="rounded-2xl border border-border bg-surface/40 p-6">
      <p className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.18em] text-faint">
        Outcome
      </p>
      <p className="mt-2 text-pretty leading-relaxed text-foreground">
        {outcomes[0]}
      </p>
    </div>
  ) : (
    <ContentTodo
      label="Outcome needed"
      note={outcomeNote ?? "The headline result of this project."}
    />
  );

  return (
    <header className="relative overflow-hidden">
      {/* Scoped accent glow — corner, never a centred blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-56 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, var(--accent-soft), transparent 66%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-28 sm:px-8 lg:px-16 lg:pt-36">
        {frame === "inset" ? (
          /* Asymmetric split — text left, media inset right */
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <Reveal>
              <div>
                {titleBlock}
                <div className="mt-10">{metaBlock}</div>
                <div className="mt-8 max-w-md">{outcomeBlock}</div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>{media}</Reveal>
          </div>
        ) : frame === "stacked" ? (
          /* Editorial stack — title, rule, meta rail, then media */
          <>
            <Reveal>
              <div className="max-w-4xl">{titleBlock}</div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-12 grid grid-cols-1 gap-8 border-y border-border py-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                {metaBlock}
                {outcomeBlock}
              </div>
            </Reveal>
            <Reveal delay={0.14} className="mt-12">
              {media}
            </Reveal>
          </>
        ) : (
          /* Bleed — oversized title, context, then full-width media.
             Context sits above the media so the first viewport still
             answers role / year / outcome. */
          <>
            <Reveal>
              <div className="max-w-4xl">{titleBlock}</div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-10 grid grid-cols-1 gap-8 border-t border-border pt-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                {metaBlock}
                {outcomeBlock}
              </div>
            </Reveal>
            <Reveal delay={0.14} className="mt-12">
              {media}
            </Reveal>
          </>
        )}
      </div>
    </header>
  );
}
