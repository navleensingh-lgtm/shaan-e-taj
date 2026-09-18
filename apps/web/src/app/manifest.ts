import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brand,
    short_name: siteConfig.brand,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#a0705a",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
