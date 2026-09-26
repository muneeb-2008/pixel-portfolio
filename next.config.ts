import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages. The game runs entirely in the browser, so the
 * whole site is plain HTML/JS/CSS in `out/`. On a project site
 * (https://<user>.github.io/<repo>/) the deploy workflow sets PAGES_BASE_PATH
 * to "/<repo>" so assets resolve under that sub-path; locally it stays "".
 */
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // plain <img> tags don't get basePath automatically — expose it to the client
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
