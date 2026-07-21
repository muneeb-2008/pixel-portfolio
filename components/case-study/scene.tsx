import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import type { ProjectTheme } from "@/lib/case-studies";

/** Vertical rhythm varies per project; the grid and spacing scale do not. */
const densityPadding: Record<ProjectTheme["density"], string> = {
  airy: "py-28 md:py-40 lg:py-48",
  balanced: "py-24 md:py-32 lg:py-40",
  dense: "py-20 md:py-28 lg:py-32",
};

/**
 * Shared scaffold for every storytelling scene: the container, the numbered
 * marker, and the heading. Each scene supplies its own composition inside.
 */
export function Scene({
  id,
  step,
  eyebrow,
  title,
  lede,
  density = "balanced",
  bordered = false,
  className,
  children,
}: {
  id: string;
  /** Narrative position, e.g. "03" — an anchor, not decoration. */
  step?: string;
  eyebrow?: string;
  title?: string;
  lede?: string;
  density?: ProjectTheme["density"];
  bordered?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      aria-label={title ? undefined : eyebrow}
      className={cn(
        "scroll-mt-24",
        bordered && "border-t border-border",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-16",
          densityPadding[density],
        )}
      >
        {(eyebrow || title) && (
          <Reveal>
            <div className="max-w-3xl">
              {(step || eyebrow) && (
                <p className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.22em] text-faint">
                  {step && <span className="text-accent">{step}</span>}
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 id={headingId} className="text-h2 mt-5 text-balance">
                  {title}
                </h2>
              )}
              {lede && (
                <p className="measure mt-5 text-lg leading-relaxed text-muted">
                  {lede}
                </p>
              )}
            </div>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
