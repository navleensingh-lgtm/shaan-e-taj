import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: "../..",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "api.telegram.org" },
      { protocol: "https", hostname: "**.telegram.org" },
    ],
  },
};

export default nextConfig;
