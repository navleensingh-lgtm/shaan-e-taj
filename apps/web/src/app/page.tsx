import Link from "next/link";
import Image from "next/image";
import { ProductGrid } from "@/components/ProductGrid";
import { HomeOrderCTA } from "@/components/HomeOrderCTA";
import { YouTubeSection } from "@/components/YouTubeSection";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { EditorialHero } from "@/components/EditorialHero";
import { EditorialVideoSection } from "@/components/EditorialVideoSection";
import { StoryVideoRail } from "@/components/StoryVideoRail";
import type { StoryItem } from "@/components/StoryVideoModal";
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
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Party Wear",
    tag: "Celebrations",
    description: "Modern Punjabi & Pakistani silhouettes, shararas, and regal flowing cuts.",
    href: "/party-wear",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Festive Silks",
    tag: "Royal Heritage",
    description: "Rich Banarasi, georgette, and pure velvet celebratory suits.",
    href: "/festive",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Bespoke Tailoring",
    tag: "Custom Made",
    description: "Precision measurements crafted by master tailors in Jalandhar.",
    href: "/custom-stitching",
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&auto=format&fit=crop&q=80",
  },
];

const testimonials = [
  {
    quote:
      "My bridal lehenga was tailored to absolute perfection from thousands of miles away in Canada. The zardozi embroidery and fit took everyone’s breath away on my wedding day.",
    author: "Simran K.",
    location: "Vancouver, Canada",
    occasion: "Bridal Ensemble",
  },
  {
    quote:
      "The craftsmanship of Taj Fashion is unmatched. Ordered custom suits for my daughter's wedding events in the UK — arrived right on schedule, flawless stitching.",
    author: "Gurpreet B.",
    location: "Birmingham, UK",
    occasion: "Wedding Festivities",
  },
  {
    quote:
      "Visiting their Jalandhar boutique was a royal experience, and ordering via WhatsApp is just as seamless. Shaan-e-Taj truly honors Punjabi couture heritage.",
    author: "Harleen D.",
    location: "New Delhi, India",
    occasion: "Festive Silk & Shararas",
  },
];

export default async function HomePage() {
  // Parallelize independent data requirements
  const [items, bestsellersResult, storeSettings] = await Promise.all([
    getHomeNewArrivals(8),
    listProducts({ sortBy: "featured", limit: "4" }),
    getPublicStoreSettings(),
  ]);

  const bestsellers = bestsellersResult.items;

  // Build Story items from published products that have media or images
  const storyItems: StoryItem[] = [];
  for (const p of items) {
    const poster = p.images?.[0]?.url || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80";
    const vid = p.media && p.media.length > 0 ? p.media[0] : undefined;

    storyItems.push({
      id: p.id,
      productSlug: p.slug,
      productName: p.name,
      priceInPaise: p.priceInPaise,
      color: p.color,
      fabric: p.fabric,
      mediaUrl: vid ? vid.url : poster,
      posterUrl: poster,
      isVideo: !!vid,
    });
  }

  // Find any published product video to feature in hero or editorial campaign section from the fetched items
  let campaignVideoUrl: string | undefined;
  let heroFallbackImage: string | undefined;

  for (const p of items) {
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

  // Allow explicit hero video from store settings (supports YouTube & direct MP4), or fallback to product media
  const heroVideo = storeSettings.heroVideoUrl || campaignVideoUrl;

  return (
    <>
      {/* 1. Refined Top Marquee */}
      <MarqueeTicker />

      {/* 2. Cinematic Campaign Hero */}
      <EditorialHero
        videoUrl={heroVideo}
        fallbackImageUrl={heroFallbackImage}
      />

      {/* 3. Gold Accent Divider Marquee */}
      <MarqueeTicker variant="gold" />

      {/* 4. Instagram-Story / Reel Video Rail: Shop The Look */}
      {storyItems.length > 0 && (
        <StoryVideoRail
          title="Trending Looks & Real Movement"
          subtitle="Tap to view boutique motion, styling reels, and order bespoke cuts directly on WhatsApp"
          items={storyItems}
        />
      )}

      {/* 5. Curated New Arrivals */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
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

      {/* 6. Full-Width Editorial Atelier Campaign Section */}
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

      {/* 7. Curated Collections / Shop By Occasion with Visual Cards */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
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
              className="group relative flex flex-col justify-between overflow-hidden rounded-xs border border-brand-border/80 bg-white shadow-2xs transition-all duration-500 hover:border-gold hover:shadow-xl active:scale-98"
            >
              {/* Image Container with Zoom effect */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory-2">
                <Image
                  src={occ.image}
                  alt={occ.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-transparent" />
                <div className="absolute top-3.5 left-3.5">
                  <span className="inline-block rounded-xs bg-espresso/80 backdrop-blur-xs px-2.5 py-1 text-[9px] uppercase tracking-wider text-gold-light font-medium border border-gold/30">
                    {occ.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 inset-x-4 text-ivory">
                  <h3 className="serif text-2xl font-normal text-white group-hover:text-gold-light transition-colors">
                    {occ.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/80 line-clamp-2 font-light">
                    {occ.description}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-espresso font-medium border-t border-brand-border/50">
                <span className="group-hover:text-gold transition-colors">Explore Collection</span>
                <span className="arrow-shift text-gold">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. Signature Bestsellers Feature */}
      {bestsellers.length > 0 && (
        <section className="bg-ivory-2/70 border-y border-brand-border/60 py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-brand-border/70 pb-6 mb-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-px w-6 bg-gold" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark font-medium">Atelier Icons</p>
                </div>
                <h2 className="serif mt-2 text-3xl sm:text-4xl text-brand-text font-normal">
                  Signature Bestsellers
                </h2>
                <p className="mt-1.5 max-w-lg text-xs sm:text-sm text-brand-muted font-light">
                  Most coveted bespoke designs celebrated by our brides and worldwide patrons.
                </p>
              </div>

              <Link
                href="/collections"
                className="btn-luxury-outline group inline-flex items-center rounded-xs px-6 py-3 text-[10px] uppercase tracking-[0.18em] font-medium self-start md:self-auto"
              >
                <span>View Full Catalog</span>
                <span className="arrow-shift ml-1.5 text-gold">→</span>
              </Link>
            </div>

            <ProductGrid products={bestsellers} />
          </div>
        </section>
      )}

      {/* 9. Bespoke Atelier & Custom Stitching Spotlight */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="relative overflow-hidden rounded-xs border border-brand-border/80 bg-espresso text-ivory p-8 sm:p-12 lg:p-16 shadow-xl">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px w-6 bg-gold" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-light font-medium">Bespoke Couture Experience</p>
              </div>
              <h2 className="serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight">
                Crafted in Jalandhar. <br className="hidden sm:inline" />
                Tailored for Global Patrons.
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-ivory/80 font-light leading-relaxed max-w-xl">
                Every outfit can be stitched to your precise body measurements or delivered as premium unstitched fabric. Our master tailors consult with you directly on WhatsApp to customize necklines, sleeve lengths, dupattas, and linings.
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/15">
                <div>
                  <p className="serif text-2xl text-gold font-normal">100%</p>
                  <p className="text-[10px] uppercase tracking-wider text-ivory/70 mt-1 font-medium">Pure Handwork Zari</p>
                </div>
                <div>
                  <p className="serif text-2xl text-gold font-normal">Custom</p>
                  <p className="text-[10px] uppercase tracking-wider text-ivory/70 mt-1 font-medium">Made-to-Measure</p>
                </div>
                <div>
                  <p className="serif text-2xl text-gold font-normal">Global</p>
                  <p className="text-[10px] uppercase tracking-wider text-ivory/70 mt-1 font-medium">Worldwide Shipping</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/custom-stitching"
                  className="btn-luxury-gold inline-flex items-center rounded-xs px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] font-medium"
                >
                  <span>Size & Measurement Guide</span>
                  <span className="arrow-shift ml-1.5">→</span>
                </Link>
                <Link
                  href="/contact"
                  className="btn-luxury-outline text-white border-white/30 hover:border-gold hover:text-white inline-flex items-center rounded-xs px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] font-medium"
                >
                  <span>Book Boutique Appointment</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[4/5] overflow-hidden rounded-xs border border-white/20 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=900&auto=format&fit=crop&q=80"
                alt="Shaan-e-Taj Master Tailoring"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 inset-x-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">Atelier Taj Fashion</p>
                <p className="serif text-base text-white font-normal mt-0.5">Jalandhar, Punjab</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Patrons of Taj: Client Testimonials */}
      <section className="bg-ivory-2 border-t border-brand-border/60 py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-px w-6 bg-gold" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark font-medium">Voices of Elegance</p>
              <span className="h-px w-6 bg-gold" />
            </div>
            <h2 className="serif text-3xl sm:text-4xl text-brand-text font-normal">
              Patrons of Taj
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-brand-muted font-light">
              Trusted by brides and families across India, Canada, the United Kingdom, and the United States.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-xs border border-brand-border/80 bg-white p-7 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-gold text-lg mb-3">★★★★★</div>
                  <p className="serif text-sm sm:text-base italic text-brand-text/90 leading-relaxed font-normal">
                    “{t.quote}”
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-border/50">
                  <p className="serif text-sm font-medium text-espresso">{t.author}</p>
                  <p className="text-[10px] uppercase tracking-wider text-brand-muted mt-0.5">
                    {t.location} • <span className="text-gold-dark">{t.occasion}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. YouTube Channel Watch & Shop Section */}
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <YouTubeSection />
      </section>

      {/* 12. Boutique Ordering CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <HomeOrderCTA />
      </section>
    </>
  );
}


