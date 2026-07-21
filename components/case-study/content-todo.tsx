import { cn } from "@/lib/utils";

/**
 * Visible marker for content Muneeb still needs to supply.
 *
 * Deliberately unmistakable: this is scaffolding, never mistaken for real
 * case study copy. Nothing here is invented — the note states exactly what
 * is needed. Remove by filling the field in lib/case-studies/<slug>.ts.
 */
export function ContentTodo({
  note,
  label = "Content needed",
  className,
}: {
  note: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-xl border border-dashed border-border-strong bg-surface/40 p-5",
        className,
      )}
    >
      <p className="flex items-center gap-2 font-mono text-xs sm:text-[11px] uppercase tracking-[0.18em] text-faint">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-faint"
        />
        {label}
      </p>
      <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted">
        {note}
      </p>
    </div>
  );
}

/** Placeholder frame for missing imagery, at a real aspect ratio. */
export function MediaTodo({
  note,
  ratio = "16/10",
  className,
}: {
  note: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      role="note"
      style={{ aspectRatio: ratio }}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border-strong bg-surface/30 p-8 text-center",
        className,
      )}
    >
      <span className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.18em] text-faint">
        Media needed
      </span>
      <p className="measure text-pretty text-sm leading-relaxed text-muted">
        {note}
      </p>
    </div>
  );
}
