import { type Pending, resolve, todoNote } from "@/lib/case-studies";
import { Reveal } from "@/components/ui/reveal";
import { RevealLi } from "@/components/ui/reveal-item";
import { ContentTodo } from "./content-todo";

/**
 * Renders real content, a visible TODO marker, or nothing at all.
 * This is the single place the "never invent, never render empty" rule lives.
 */
export function PendingContent<T>({
  value,
  label,
  children,
}: {
  value: Pending<T> | undefined;
  label?: string;
  children: (data: T) => React.ReactNode;
}) {
  const note = todoNote(value);
  if (note) return <ContentTodo note={note} label={label} />;
  const data = resolve(value);
  if (!data) return null;
  if (Array.isArray(data) && data.length === 0) return null;
  return <>{children(data)}</>;
}

/** Oversized single statement — used for the problem. */
export function Statement({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="text-h2 max-w-4xl text-balance font-display font-medium">
        {children}
      </p>
    </Reveal>
  );
}

/** Body paragraph at a comfortable measure. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="measure text-lg leading-relaxed text-muted">{children}</p>
    </Reveal>
  );
}

/** Numbered list of short statements — constraints, outcomes, lessons. */
export function ProseList({
  items,
  numbered = true,
}: {
  items: string[];
  numbered?: boolean;
}) {
  return (
    <ol className="mt-10 grid grid-cols-1 gap-x-12 md:grid-cols-2">
      {items.map((item, i) => (
        <RevealLi
          key={item}
          delay={(i % 2) * 0.06}
          className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-border py-6"
        >
          <span aria-hidden className="font-mono text-sm text-accent">
            {numbered ? String(i + 1).padStart(2, "0") : "—"}
          </span>
          <p className="text-pretty leading-relaxed text-muted">{item}</p>
        </RevealLi>
      ))}
    </ol>
  );
}

/** User groups and the need each one carries into the product. */
export function UserGroups({
  groups,
}: {
  groups: { group: string; need: string }[];
}) {
  return (
    <dl className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((g, i) => (
        <Reveal key={g.group} delay={i * 0.06}>
          <div className="h-full rounded-2xl border border-border bg-surface/40 p-6">
            <dt className="text-h3">{g.group}</dt>
            <dd className="mt-3 text-pretty leading-relaxed text-muted">
              {g.need}
            </dd>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}
