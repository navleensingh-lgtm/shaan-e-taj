import type { NextConfig } from "next";

function supabaseHostname(): string | null {
  const url = process.env.SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const sbHost = supabaseHostname();

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  turbopack: {
    root: "../..",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      ...(sbHost ? [{ protocol: "https" as const, hostname: sbHost }] : []),
      { protocol: "https", hostname: "api.telegram.org" },
      { protocol: "https", hostname: "*.telegram.org" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
