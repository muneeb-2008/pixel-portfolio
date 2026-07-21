import { type CaseStudy, isTodo } from "./types";
import { lumenAi } from "./lumen-ai";
import { helio } from "./helio";
import { northwind } from "./northwind";
import { atlas } from "./atlas";

export * from "./types";

/** Display order across /work and prev/next navigation. */
export const caseStudies: CaseStudy[] = [lumenAi, helio, northwind, atlas];

export const publishedCaseStudies = caseStudies.filter((c) => c.published);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return publishedCaseStudies.find((c) => c.slug === slug);
}

/** Previous / next published study, wrapping at the ends. */
export function getAdjacent(slug: string) {
  const list = publishedCaseStudies;
  const i = list.findIndex((c) => c.slug === slug);
  if (i === -1) return { previous: undefined, next: undefined };
  return {
    previous: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}

/** How many top-level fields are still awaiting real content. */
export function pendingCount(study: CaseStudy): number {
  return Object.values(study).filter(isTodo).length;
}

/**
 * True while any field is still a TODO. Used to keep unfinished studies
 * out of search results and the sitemap — placeholder narrative should
 * never be indexed as if it were real work.
 */
export function hasPendingContent(study: CaseStudy): boolean {
  return pendingCount(study) > 0;
}
