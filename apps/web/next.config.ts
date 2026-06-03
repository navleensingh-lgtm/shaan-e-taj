import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  turbopack: {
    root: "../..",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.cloudflarestorage.com" },
      { protocol: "https", hostname: "api.telegram.org" },
      { protocol: "https", hostname: "**.telegram.org" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
