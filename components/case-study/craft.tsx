import type {
  CollaborationNote,
  DesignSystemSpec,
  TestingRecord,
} from "@/lib/case-studies";
import { Reveal } from "@/components/ui/reveal";
import { RevealLi } from "@/components/ui/reveal-item";

export function DesignSystemOverview({ spec }: { spec: DesignSystemSpec }) {
  return (
    <div className="mt-10">
      <Reveal>
        <p className="measure text-lg leading-relaxed text-muted">
          {spec.summary}
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {spec.tokens && spec.tokens.length > 0 && (
          <Reveal className="lg:col-span-5">
            <section className="h-full rounded-2xl border border-border bg-surface/40 p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
                Tokens
              </h3>
              <dl className="mt-5 space-y-3">
                {spec.tokens.map((token) => (
                  <div
                    key={token.name}
                    className="flex items-baseline justify-between gap-4 border-b border-border pb-3 last:border-0"
                  >
                    <dt className="font-mono text-sm text-muted">
                      {token.name}
                    </dt>
                    <dd className="font-mono text-sm text-foreground">
                      {token.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>
        )}

        {spec.components && spec.components.length > 0 && (
          <Reveal delay={0.06} className="lg:col-span-7">
            <section className="h-full rounded-2xl border border-border bg-surface/40 p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
                Components
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {spec.components.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-border-strong px-4 py-2 text-sm text-foreground"
                  >
                    {c}
                  </li>
                ))}
              </ul>
              {spec.typography && (
                <p className="mt-6 border-t border-border pt-5 text-pretty leading-relaxed text-muted">
                  {spec.typography}
                </p>
              )}
            </section>
          </Reveal>
        )}
      </div>
    </div>
  );
}

/** What was tested, what it revealed, and what changed because of it. */
export function TestingResults({ items }: { items: TestingRecord[] }) {
  return (
    <ul className="mt-12 space-y-6">
      {items.map((t, i) => (
        <RevealLi
          key={t.method + i}
          delay={i * 0.05}
          className="rounded-2xl border border-border bg-surface/40 p-7"
        >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="text-h3">{t.method}</h3>
              {t.participants && (
                <span className="font-mono text-xs text-accent">
                  {t.participants}
                </span>
              )}
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-12">
              <div>
                <dt className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.18em] text-faint">
                  What we learned
                </dt>
                <dd className="mt-2 text-pretty leading-relaxed text-muted">
                  {t.finding}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.18em] text-faint">
                  What changed
                </dt>
                <dd className="mt-2 text-pretty leading-relaxed text-foreground">
                  {t.change}
                </dd>
              </div>
            </dl>
        </RevealLi>
      ))}
    </ul>
  );
}

export function Collaboration({ items }: { items: CollaborationNote[] }) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
      {items.map((note, i) => (
        <Reveal key={note.title} delay={i * 0.06}>
          <section className="h-full border-t border-border pt-6">
            <h3 className="text-h3">{note.title}</h3>
            <p className="mt-3 text-pretty leading-relaxed text-muted">
              {note.body}
            </p>
          </section>
        </Reveal>
      ))}
    </div>
  );
}
