import type { Metadata } from "next";

export const metadata: Metadata = { title: "Custom Stitching" };

export default function CustomStitchingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
