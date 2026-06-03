import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";

export const dynamic = "force-dynamic";
import { HomeOrderCTA } from "@/components/HomeOrderCTA";
import { YouTubeSection } from "@/components/YouTubeSection";
import { SocialLinks } from "@/components/SocialLinks";
import { fetchProducts } from "@/lib/api";
import { siteConfig } from "@/lib/site-config";

export default async function HomePage() {
  const { items } = await fetchProducts({ isNewArrival: "true", limit: "6" });

  return (
    <>
      <section className="relative flex min-h-[calc(100vh-68px)] items-center justify-center overflow-hidden bg-gradient-to-br from-ivory to-ivory-2 px-5">
        <div className="pointer-events-none absolute right-[5%] top-[10%] h-80 w-80 rounded-full border border-gold/40 opacity-50" />
        <div className="pointer-events-none absolute bottom-[15%] left-[3%] h-52 w-52 rounded-full border border-rose-light/60 opacity-40" />
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
              className="rounded-sm bg-rose px-9 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white"
            >
              Explore Collection
            </Link>
            <Link
              href="/custom-stitching"
              className="rounded-sm border border-brand-border px-9 py-3.5 text-[11px] uppercase tracking-[0.2em]"
            >
              Custom Stitching
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-rose py-3 overflow-hidden">
        <p className="animate-pulse text-center text-[11px] uppercase tracking-[0.2em] text-white">
          Luxury Indian Couture · Hand Embroidered · Pan India Shipping
        </p>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Just Arrived</p>
        <h2 className="serif mt-3 text-4xl text-brand-text md:text-5xl">New Arrivals</h2>
        <ProductGrid products={items} emptyMessage="Products coming soon — add via Telegram or Admin." />
        <HomeOrderCTA />
        <YouTubeSection />
        <div className="mt-10 text-center">
          <Link
            href="/catalog"
            className="inline-block rounded-sm border border-brand-border px-8 py-3 text-[11px] uppercase tracking-[0.15em]"
          >
            View All Catalog
          </Link>
        </div>
      </section>
    </>
  );
}
