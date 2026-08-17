import type { ReactNode } from "react";

/**
 * A label that rolls: on hover of the parent `.group`, the text slides up and
 * an identical copy rolls in from below. Requires a parent with `group`.
 */
export function TextRoll({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block overflow-hidden align-bottom leading-[1.15]">
      <span className="block transition-transform duration-[420ms] ease-[var(--ease-out)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute left-0 top-full block transition-transform duration-[420ms] ease-[var(--ease-out)] group-hover:-translate-y-full group-focus-visible:-translate-y-full"
      >
        {children}
      </span>
    </span>
  );
}
