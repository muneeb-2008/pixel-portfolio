import { ImageResponse } from "next/og";
import { getCaseStudy, publishedCaseStudies } from "@/lib/case-studies";

export const alt = "Case study by Muneeb Qureshi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return publishedCaseStudies.map((study) => ({ slug: study.slug }));
}

export default async function CaseStudyOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  const accent = study?.theme.accent ?? "#6ae8ff";
  const headline = study?.seo.ogHeadline ?? "Case study";
  const title = study?.title ?? "Muneeb Qureshi";
  const meta = study
    ? `${study.category} · ${study.year}`
    : "Product Designer";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: accent,
            }}
          />
          <div style={{ color: "#a1a1aa", fontSize: 26, letterSpacing: 2 }}>
            {meta.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: accent,
              fontSize: 34,
              fontWeight: 500,
              marginBottom: 20,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              color: "#fafafa",
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.1,
              maxWidth: 1000,
            }}
          >
            {headline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#8a8a93",
            fontSize: 26,
          }}
        >
          <div style={{ display: "flex" }}>Muneeb Qureshi</div>
          <div style={{ display: "flex" }}>Product Designer · Karachi</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
