import type { MetadataRoute } from "next";
import { hasPendingContent, publishedCaseStudies } from "@/lib/case-studies";

const BASE_URL = "https://muneebqureshi.design";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  /* Studies still carrying TODO content are noindex, so they stay out
     of the sitemap until real content lands. */
  const studies = publishedCaseStudies
    .filter((study) => !hasPendingContent(study))
    .map((study) => ({
      url: `${BASE_URL}/work/${study.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...studies,
  ];
}
