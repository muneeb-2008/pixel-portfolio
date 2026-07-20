import { cn } from "@/lib/utils";

/**
 * Consistent section scaffold: full-bleed <section> + centered content
 * column with shared max-width and horizontal padding. Vertical rhythm is
 * passed in via containerClassName so sections can vary spacing.
 */
export function SectionShell({
  id,
  children,
  className,
  containerClassName,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-6 md:px-8",
          containerClassName ?? "py-24 md:py-32",
        )}
      >
        {children}
      </div>
    </section>
  );
}
