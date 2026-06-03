import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { HomeOrderCTA } from "@/components/HomeOrderCTA";
import { YouTubeSection } from "@/components/YouTubeSection";
import { SocialLinks } from "@/components/SocialLinks";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { HeroDecor } from "@/components/HeroDecor";
import { fetchProducts } from "@/lib/api";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

async function loadHomeProducts() {
  const featured = await fetchProducts({ isNewArrival: "true", limit: "8" });
  if (featured.items.length > 0) return featured.items;
  const latest = await fetchProducts({ limit: "8" });
  return latest.items;
}

export default async function HomePage() {
  const items = await loadHomeProducts();

  return (
    <>
      <MarqueeTicker />

      <section className="relative flex min-h-[calc(100vh-68px)] items-center justify-center overflow-hidden bg-gradient-to-br from-ivory via-ivory to-ivory-2 px-5">
        <HeroDecor />
        <div className="relative z-10 max-w-2xl text-center">
          <div className="mx-auto mb-5 h-px w-16 bg-gold" />
          <p className="text-[11px] uppercase tracking-[0.25em] text-rose">
            {siteConfig.legalName} · Luxury Couture Since {siteConfig.founded}
          </p>
          <h1 className="serif mt-5 text-5xl font-light leading-tight text-brand-text md:text-7xl">
            {siteConfig.brand}
            <br />
            <em className="text-rose-dark">Jalandhar</em>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-brand-subtle">
            {siteConfig.description}
          </p>
          <SocialLinks className="mt-6 justify-center" />
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/new-arrivals"
              className="rounded-sm bg-rose px-9 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-rose-dark"
            >
              Explore Collection
            </Link>
            <Link
              href="/custom-stitching"
              className="rounded-sm border border-brand-border px-9 py-3.5 text-[11px] uppercase tracking-[0.2em] transition hover:border-rose"
            >
              Custom Stitching
            </Link>
          </div>
        </div>
      </section>

      <MarqueeTicker variant="gold" />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Just Arrived</p>
        <h2 className="serif mt-3 text-4xl text-brand-text md:text-5xl">New Arrivals</h2>
        <p className="mt-2 max-w-lg text-sm text-brand-subtle">
          Handpicked pieces from our latest collection — browse, order on WhatsApp, or visit us in Jalandhar.
        </p>
        <ProductGrid products={items} emptyMessage="New pieces arriving soon. Visit our catalog or boutique." />
        {items.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/new-arrivals"
              className="inline-block rounded-sm border border-brand-border px-8 py-3 text-[11px] uppercase tracking-[0.15em] transition hover:border-rose"
            >
              View All New Arrivals
            </Link>
          </div>
        )}
        <HomeOrderCTA />
        <YouTubeSection />
        <div className="mt-10 text-center">
          <Link
            href="/catalog"
            className="inline-block rounded-sm border border-brand-border px-8 py-3 text-[11px] uppercase tracking-[0.15em] transition hover:border-rose"
          >
            View Full Catalog
          </Link>
        </div>
      </section>
    </>
  );
}
