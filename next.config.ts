import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages. basePath must match your GitHub repo name.
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/streaming-platform" : undefined,
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
