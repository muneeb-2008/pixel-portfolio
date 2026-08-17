import { Skeleton } from "@/components/loader/skeleton";

/**
 * Page-level skeleton (YouTube-style shimmer) shown while the home route
 * loads or during navigation back to it. Mirrors the real layout so the swap
 * to content feels seamless.
 */
export default function HomeLoading() {
  return (
    <div className="shell" style={{ paddingTop: "var(--s-32)" }} aria-hidden>
      {/* hero */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-[9vw] min-h-16 w-[70%]" />
        <Skeleton className="h-[9vw] min-h-16 w-[85%]" />
        <Skeleton className="h-[9vw] min-h-16 w-[55%]" />
      </div>
      <div className="mt-10 flex gap-4">
        <Skeleton className="h-12 w-40" radius="var(--r-full)" />
        <Skeleton className="h-12 w-32" radius="var(--r-full)" />
      </div>

      {/* projects grid — video-card style */}
      <div
        className="mt-[var(--s-32)] grid grid-cols-1 gap-x-[var(--gutter)] gap-y-16 md:grid-cols-2"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="aspect-[4/3] w-full" radius="var(--r-lg)" />
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-1/2" radius="var(--r-full)" />
              <Skeleton className="h-4 w-16" radius="var(--r-full)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
