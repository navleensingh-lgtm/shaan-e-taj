import { ImageResponse } from "next/og";
import { BrandIconArt } from "@/lib/brand-icon-art";

export const alt = "Shaan-e-Taj — Luxury Indian Couture";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<BrandIconArt variant="opengraph" />, { ...size });
}
