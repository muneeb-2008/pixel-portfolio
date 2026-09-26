import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muneeb Qureshi — Pixel Portfolio",
    short_name: "Muneeb",
    description: "Product Designer · UI/UX Designer · Framer Developer — explore a pixel-art portfolio world.",
    start_url: ".",
    display: "fullscreen",
    orientation: "any",
    background_color: "#120d0b",
    theme_color: "#120d0b",
    icons: [{ src: "apple-icon.png", sizes: "192x192", type: "image/png" }],
  };
}
