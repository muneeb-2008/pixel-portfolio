import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const alt = "Muneeb Qureshi — Product Designer & Framer Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
              background: "#6ae8ff",
            }}
          />
          <div style={{ color: "#a1a1aa", fontSize: 28, letterSpacing: 2 }}>
            {profile.location.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#fafafa",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              color: "#6ae8ff",
              fontSize: 44,
              marginTop: 16,
              fontWeight: 500,
            }}
          >
            {profile.roles.join("  ·  ")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            color: "#8a8a93",
            fontSize: 30,
            maxWidth: 900,
          }}
        >
          Designing premium digital products, websites, and design systems.
        </div>
      </div>
    ),
    { ...size },
  );
}
