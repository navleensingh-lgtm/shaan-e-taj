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

function r2Hostname(): string | null {
  const r2Public = process.env.R2_PUBLIC_URL;
  const r2Account = process.env.R2_ACCOUNT_ID;
  const r2Bucket = process.env.R2_BUCKET_NAME;
  if (r2Public) {
    try {
      return new URL(r2Public).hostname;
    } catch {
      // fallthrough
    }
  }
  if (r2Account && r2Bucket) {
    return `${r2Bucket}.${r2Account}.r2.dev`;
  }
  return null;
}

const r2Host = r2Hostname();

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      ...(sbHost ? [{ protocol: "https" as const, hostname: sbHost }] : []),
      { protocol: "https", hostname: "api.telegram.org" },
      { protocol: "https", hostname: "*.telegram.org" },
      { protocol: "https", hostname: "i.ytimg.com" },
      ...(r2Host ? [{ protocol: "https" as const, hostname: r2Host }] : []),
    ],
    unoptimized: true,
  },
};

export default nextConfig;
