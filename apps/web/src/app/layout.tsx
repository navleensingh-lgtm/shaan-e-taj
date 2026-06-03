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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shaanetaj.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.pageTitle,
    template: siteConfig.pageTitleTemplate,
  },
  description: siteConfig.description,
  applicationName: siteConfig.brand,
  authors: [{ name: siteConfig.brand }],
  creator: siteConfig.brand,
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    siteName: siteConfig.brand,
    locale: "en_IN",
    type: "website",
    title: siteConfig.pageTitle,
    description: siteConfig.description,
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteConfig.pageTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.pageTitle,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
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
