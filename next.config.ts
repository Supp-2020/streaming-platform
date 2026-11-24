import type { NextConfig } from "next";

// Must match your GitHub repo name for GitHub Pages. Empty in development.
const basePath = process.env.NODE_ENV === "production" ? "/streaming-platform" : "";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages.
  output: "export",
  basePath: basePath || undefined,
  // Lets plain <img> tags (thumbnails) prefix the base path themselves.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
