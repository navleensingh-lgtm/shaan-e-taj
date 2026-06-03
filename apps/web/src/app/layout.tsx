import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Providers } from "@/components/Providers";
import { siteConfig } from "@/lib/site-config";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shaanetaj.com"
  ),
  title: `${siteConfig.brand} | ${siteConfig.tagline} — Jalandhar`,
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.brand,
    locale: "en_IN",
    type: "website",
    title: `${siteConfig.brand} — Taj Fashion Jalandhar`,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>
          <SiteNav />
          <main className="pt-[68px]">{children}</main>
          <SiteFooter />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
