import type { CSSProperties } from "react";

/** A single shimmering placeholder block (YouTube-style). */
export function Skeleton({
  className,
  style,
  radius = "var(--r)",
}: {
  className?: string;
  style?: CSSProperties;
  radius?: string;
}) {
  return (
    <div className={`skeleton ${className ?? ""}`} style={{ borderRadius: radius, ...style }} />
  );
}

/** A few lines of placeholder text. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          radius="var(--r-full)"
          style={{ width: i === lines - 1 ? "62%" : "100%" }}
        />
      ))}
    </div>
  );
}
