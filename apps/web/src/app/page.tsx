import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { HomeOrderCTA } from "@/components/HomeOrderCTA";
import { YouTubeSection } from "@/components/YouTubeSection";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { EditorialHero } from "@/components/EditorialHero";
import { EditorialVideoSection } from "@/components/EditorialVideoSection";
import { getHomeNewArrivals, listProducts } from "@/lib/products-server";
import { getPublicStoreSettings } from "@/lib/store-settings";
import { videoEmbed } from "@/lib/product-media";

export const dynamic = "force-dynamic";

const occasions = [
  {
    title: "Bridal Couture",
    tag: "The Big Day",
    description: "Intricate zardozi, gotta patti, and heavy handwork lehengas.",
    href: "/bridal",
  },
  {
    title: "Party Wear",
    tag: "Celebrations",
    description: "Modern Pakistani cuts, shararas, and regal flowing silhouettes.",
    href: "/party-wear",
  },
  {
    title: "Festive Silks",
    tag: "Royal Heritage",
    description: "Rich Banarasi, georgette, and pure velvet celebratory suits.",
    href: "/festive",
  },
  {
    title: "Bespoke Tailoring",
    tag: "Custom Made",
    description: "Precision measurements crafted by master tailors in Jalandhar.",
    href: "/custom-stitching",
  },
];

export default async function HomePage() {
  const items = await getHomeNewArrivals(8);
  const storeSettings = await getPublicStoreSettings();

  // Find any published product video to feature in hero or editorial campaign section
  const productsWithMedia = await listProducts({ limit: "12" });
  let campaignVideoUrl: string | undefined;
  let heroFallbackImage: string | undefined;

  for (const p of productsWithMedia.items) {
    if (!heroFallbackImage && p.images?.[0]?.url) {
      heroFallbackImage = p.images[0].url;
    }
    if (!campaignVideoUrl && p.media && p.media.length > 0) {
      const vid = p.media.find((m) => videoEmbed(m.url).type === "video");
      if (vid) {
        campaignVideoUrl = videoEmbed(vid.url).src;
      }
    }
  }

  return (
    <>
      {/* 1. Refined Top Marquee */}
      <MarqueeTicker />

      {/* 2. Cinematic Campaign Hero */}
      <EditorialHero
        videoUrl={campaignVideoUrl}
        fallbackImageUrl={heroFallbackImage}
      />

      {/* 3. Gold Accent Divider Marquee */}
      <MarqueeTicker variant="gold" />

      {/* 4. Curated New Arrivals */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-brand-border/70 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-gold" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark font-medium">Just Arrived</p>
            </div>
            <h2 className="serif mt-2 text-3xl sm:text-4xl md:text-5xl text-brand-text font-normal">
              New Arrivals
            </h2>
            <p className="mt-2 max-w-lg text-xs sm:text-sm text-brand-muted font-light">
              Handcrafted in our Punjab boutique — hover over pieces to view fabric movement and secondary looks.
            </p>
          </div>

          {items.length > 0 && (
            <Link
              href="/new-arrivals"
              className="btn-luxury-outline group inline-flex items-center rounded-xs px-6 py-3 text-[10px] uppercase tracking-[0.18em] font-medium self-start md:self-auto"
            >
              <span>View All New Arrivals</span>
              <span className="arrow-shift ml-1.5 text-gold">→</span>
            </Link>
          )}
        </div>

        <ProductGrid
          products={items}
          emptyMessage="New bespoke creations currently being crafted at our boutique. Explore our complete catalog."
        />
      </section>

      {/* 5. Full-Width Editorial Atelier Campaign Section */}
      <EditorialVideoSection
        videoUrl={campaignVideoUrl}
        posterUrl={heroFallbackImage}
        eyebrow="ROYAL PUNJABI HERITAGE"
        title="Bespoke Elegance, Tailored to Perfection"
        subtitle="Every thread, sequin, and zari detail at Shaan-e-Taj reflects decades of artisanal couture mastery. Experience true made-to-measure craftsmanship delivered to your doorstep worldwide."
        ctaText="Explore Collections"
        ctaHref="/collections"
        secondaryCtaText="Custom Measurement Guide"
        secondaryCtaHref="/custom-stitching"
      />

      {/* 6. Curated Collections / Shop By Occasion */}
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-6 bg-gold" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark font-medium">Curated Ensembles</p>
            <span className="h-px w-6 bg-gold" />
          </div>
          <h2 className="serif text-3xl sm:text-4xl md:text-5xl text-brand-text font-normal">
            Shop by Occasion
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-brand-muted font-light">
            Whether for your wedding day or royal celebrations, discover silhouettes tailored with precision.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((occ) => (
            <Link
              key={occ.href}
              href={occ.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xs border border-brand-border/80 bg-white p-7 shadow-2xs transition-all duration-300 hover:border-gold hover:shadow-md active:scale-98"
            >
              <div>
                <span className="inline-block rounded-xs bg-ivory-2 px-2.5 py-1 text-[9px] uppercase tracking-wider text-rose-dark font-medium border border-brand-border/60">
                  {occ.tag}
                </span>
                <h3 className="serif mt-4 text-2xl text-brand-text group-hover:text-espresso transition-colors">
                  {occ.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-brand-muted font-light">
                  {occ.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-brand-border/60 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-espresso font-medium">
                <span>Explore</span>
                <span className="arrow-shift text-gold">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. YouTube Channel Watch & Shop Section */}
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <YouTubeSection />
      </section>

      {/* 8. Boutique Ordering CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <HomeOrderCTA />
      </section>
    </>
  );
}

