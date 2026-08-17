import { Skeleton, SkeletonText } from "@/components/loader/skeleton";

/** Skeleton for a project detail page, shown during navigation. */
export default function ProjectLoading() {
  return (
    <div className="shell" style={{ paddingTop: "var(--s-32)" }} aria-hidden>
      <Skeleton className="h-4 w-24" radius="var(--r-full)" />
      <div className="mt-8 flex flex-col gap-4">
        <Skeleton className="h-[7vw] min-h-14 w-[60%]" />
        <Skeleton className="h-6 w-[40%]" radius="var(--r-full)" />
      </div>

      <Skeleton className="mt-16 aspect-[16/9] w-full" radius="var(--r-xl)" />

      <div className="mt-16 grid grid-cols-1 gap-x-[var(--gutter)] gap-y-8 md:grid-cols-12">
        <div className="md:col-span-4 flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-16" radius="var(--r-full)" />
              <Skeleton className="h-4 w-28" radius="var(--r-full)" />
            </div>
          ))}
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <SkeletonText lines={5} />
        </div>
      </div>
    </div>
  );
}
