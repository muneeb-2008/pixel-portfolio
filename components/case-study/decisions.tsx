import type { DecisionRecord } from "@/lib/case-studies";
import { Reveal } from "@/components/ui/reveal";

function Field({
  label,
  children,
  accent = false,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.18em] text-faint">
        {label}
      </dt>
      <dd
        className={`mt-2 text-pretty leading-relaxed ${
          accent ? "text-foreground" : "text-muted"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

/**
 * Product reasoning, not screen description: what was wrong, what was
 * considered, what was chosen, why, what it cost, and what followed.
 */
export function DecisionRecords({ items }: { items: DecisionRecord[] }) {
  return (
    <div className="mt-12 space-y-6">
      {items.map((d, i) => (
        <Reveal key={d.id} delay={i * 0.05}>
          <article className="rounded-2xl border border-border bg-surface/40 p-7 md:p-9">
            <header className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="font-mono text-sm text-accent">
                Decision {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h3 text-balance">{d.title}</h3>
            </header>

            <dl className="mt-7 grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-2">
              <Field label="The problem">{d.problem}</Field>

              <div>
                <dt className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.18em] text-faint">
                  Options considered
                </dt>
                <dd className="mt-2">
                  <ul className="space-y-1.5">
                    {d.options.map((option) => (
                      <li
                        key={option}
                        className="flex items-start gap-2.5 text-pretty leading-relaxed text-muted"
                      >
                        <span
                          aria-hidden
                          className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-faint"
                        />
                        {option}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>

              <Field label="Decision" accent>
                {d.decision}
              </Field>
              <Field label="Why">{d.rationale}</Field>
            </dl>

            <div className="mt-7 grid grid-cols-1 gap-6 border-t border-border pt-6 lg:grid-cols-2 lg:gap-12">
              <div className="border-l-2 border-accent pl-4">
                <p className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.18em] text-accent">
                  Trade-off accepted
                </p>
                <p className="mt-2 text-pretty leading-relaxed text-muted">
                  {d.tradeoff}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.18em] text-faint">
                  What followed
                </p>
                <p className="mt-2 text-pretty leading-relaxed text-foreground">
                  {d.result}
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
