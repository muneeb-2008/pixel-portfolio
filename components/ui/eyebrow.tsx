import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.22em] text-faint",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      {children}
    </span>
  );
}
