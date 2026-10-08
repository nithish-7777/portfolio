import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets phones and other devices on the same Wi-Fi or hotspot load the dev server.
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.*.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
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
