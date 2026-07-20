import { cn } from "@/lib/utils";

/**
 * Consistent section scaffold: full-bleed <section> + centered content
 * column (max 1440) with shared horizontal padding. Vertical rhythm is
 * passed via containerClassName so sections can vary spacing.
 */
export function SectionShell({
  id,
  children,
  className,
  containerClassName,
  "aria-labelledby": ariaLabelledby,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  "aria-labelledby"?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn("scroll-mt-24", className)}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-16",
          containerClassName ?? "py-24 md:py-32 lg:py-40",
        )}
      >
        {children}
      </div>
    </section>
  );
}
