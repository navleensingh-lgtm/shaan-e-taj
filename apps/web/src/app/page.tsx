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
import { getPublicStoreSettings, getHomepageCmsSettings } from "@/lib/store-settings";
import { videoEmbed } from "@/lib/product-media";
import { fetchLatestInstagramReels } from "@/lib/instagram-service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Parallelize independent data requirements
  const [items, bestsellersResult, storeSettings, cms, instaData] = await Promise.all([
    getHomeNewArrivals(12),
    listProducts({ sortBy: "featured", limit: "4" }),
    getPublicStoreSettings(),
    getHomepageCmsSettings(),
    fetchLatestInstagramReels(8),
  ]);

  const bestsellers = bestsellersResult.items;

  // Build Story items: If live Instagram reels are returned, use them. Otherwise, use published product media.
  let storyItems: StoryItem[] = [];

  if (cms.shopTheLook.autoInstagramReels && instaData.reels.length > 0) {
    storyItems = instaData.reels.map((reel, idx) => ({
      id: reel.id,
      productSlug: "instagram-look",
      productName: reel.caption ? reel.caption.slice(0, 45) : `Bespoke Look #${idx + 1}`,
      priceInPaise: 450000,
      color: "Artisanal",
      fabric: "Silk / Georgette",
      mediaUrl: reel.mediaUrl,
      posterUrl: reel.thumbnailUrl || reel.mediaUrl,
      isVideo: true,
    }));
  } else {
    for (const p of items) {
      const poster =
        p.images?.[0]?.url ||
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80";
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
  }

  // Find any published product video to feature in hero or editorial campaign section
  let campaignVideoUrl: string | undefined;
  let heroFallbackImage: string | undefined = cms.hero.desktopImageUrl ?? undefined;

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

  const heroVideo = cms.hero.videoUrl || storeSettings.heroVideoUrl || campaignVideoUrl;
  const heroFallback = cms.hero.desktopImageUrl || heroFallbackImage;

  // Active occasion cards
  const occasionItems = cms.shopByOccasion.items.filter((x) => x.active !== false);

  // Active category cards
  const categoryItems = cms.shopByCategory.items.filter((x) => x.active !== false);

  // Define section renderer blocks to allow dynamic sequencing
  const sections: { key: string; order: number; enabled: boolean; render: () => React.ReactNode }[] = [
    {
      key: "hero",
      order: cms.hero.displayOrder ?? 1,
      enabled: cms.hero.enabled !== false,
      render: () => (
        <EditorialHero
          videoUrl={heroVideo ?? undefined}
          fallbackImageUrl={heroFallback ?? undefined}
          eyebrow={cms.hero.eyebrow}
          heading={cms.hero.heading}
          subheading={cms.hero.subheading}
          primaryCtaText={cms.hero.primaryCtaText}
          primaryCtaHref={cms.hero.primaryCtaHref}
          secondaryCtaText={cms.hero.secondaryCtaText}
          secondaryCtaHref={cms.hero.secondaryCtaHref}
        />
      ),
    },
    {
      key: "shopTheLook",
      order: cms.shopTheLook.displayOrder ?? 2,
      enabled: cms.shopTheLook.enabled !== false && storyItems.length > 0,
      render: () => (
        <StoryVideoRail
          title={cms.shopTheLook.title}
          subtitle={cms.shopTheLook.subtitle}
          items={storyItems}
        />
      ),
    },
    {
      key: "newArrivals",
      order: cms.newArrivals.displayOrder ?? 3,
      enabled: cms.newArrivals.enabled !== false,
      render: () => (
        <section key="new-arrivals" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-brand-border/70 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-gold" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark font-medium">
                  {cms.newArrivals.eyebrow}
                </p>
              </div>
              <h2 className="serif mt-2 text-3xl sm:text-4xl md:text-5xl text-brand-text font-normal">
                {cms.newArrivals.title}
              </h2>
              <p className="mt-2 max-w-lg text-xs sm:text-sm text-brand-muted font-light">
                {cms.newArrivals.subtitle}
              </p>
            </div>

            {items.length > 0 && (
              <Link
                href={cms.newArrivals.ctaHref || "/new-arrivals"}
                className="btn-luxury-outline group inline-flex items-center rounded-xs px-6 py-3 text-[10px] uppercase tracking-[0.18em] font-medium self-start md:self-auto"
              >
                <span>{cms.newArrivals.ctaText || "View All New Arrivals"}</span>
                <span className="arrow-shift ml-1.5 text-gold">→</span>
              </Link>
            )}
          </div>

          <ProductGrid
            products={items.slice(0, cms.newArrivals.limit || 8)}
            emptyMessage="New bespoke creations currently being crafted at our boutique. Explore our complete catalog."
          />
        </section>
      ),
    },
    {
      key: "shopByOccasion",
      order: cms.shopByOccasion.displayOrder ?? 4,
      enabled: cms.shopByOccasion.enabled !== false && occasionItems.length > 0,
      render: () => (
        <section key="occasions" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-px w-6 bg-gold" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark font-medium">
                {cms.shopByOccasion.eyebrow}
              </p>
              <span className="h-px w-6 bg-gold" />
            </div>
            <h2 className="serif text-3xl sm:text-4xl md:text-5xl text-brand-text font-normal">
              {cms.shopByOccasion.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-brand-muted font-light">
              {cms.shopByOccasion.subtitle}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {occasionItems.map((occ) => (
              <Link
                key={occ.id}
                href={occ.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xs border border-brand-border/80 bg-white shadow-2xs transition-all duration-500 hover:border-gold hover:shadow-xl active:scale-98"
              >
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
      ),
    },
    {
      key: "shopByCategory",
      order: cms.shopByCategory.displayOrder ?? 5,
      enabled: cms.shopByCategory.enabled !== false && categoryItems.length > 0,
      render: () => (
        <section key="categories" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 border-t border-brand-border/60">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-px w-6 bg-gold" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark font-medium">
                {cms.shopByCategory.eyebrow}
              </p>
              <span className="h-px w-6 bg-gold" />
            </div>
            <h2 className="serif text-3xl sm:text-4xl md:text-5xl text-brand-text font-normal">
              {cms.shopByCategory.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-brand-muted font-light">
              {cms.shopByCategory.subtitle}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoryItems.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xs border border-brand-border/80 bg-white shadow-2xs transition-all duration-500 hover:border-gold hover:shadow-xl active:scale-98"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory-2">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-transparent" />
                  <div className="absolute bottom-4 inset-x-4 text-ivory">
                    <h3 className="serif text-2xl font-normal text-white group-hover:text-gold-light transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/80 line-clamp-2 font-light">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-espresso font-medium border-t border-brand-border/50">
                  <span className="group-hover:text-gold transition-colors">Browse Category</span>
                  <span className="arrow-shift text-gold">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ),
    },
    {
      key: "bestsellers",
      order: cms.bestsellers.displayOrder ?? 6,
      enabled: cms.bestsellers.enabled !== false && bestsellers.length > 0,
      render: () => (
        <section key="bestsellers" className="bg-ivory-2/70 border-y border-brand-border/60 py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-brand-border/70 pb-6 mb-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-px w-6 bg-gold" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark font-medium">
                    {cms.bestsellers.eyebrow}
                  </p>
                </div>
                <h2 className="serif mt-2 text-3xl sm:text-4xl text-brand-text font-normal">
                  {cms.bestsellers.title}
                </h2>
                <p className="mt-1.5 max-w-lg text-xs sm:text-sm text-brand-muted font-light">
                  {cms.bestsellers.subtitle}
                </p>
              </div>

              <Link
                href={cms.bestsellers.ctaHref || "/collections"}
                className="btn-luxury-outline group inline-flex items-center rounded-xs px-6 py-3 text-[10px] uppercase tracking-[0.18em] font-medium self-start md:self-auto"
              >
                <span>{cms.bestsellers.ctaText || "View Full Catalog"}</span>
                <span className="arrow-shift ml-1.5 text-gold">→</span>
              </Link>
            </div>

            <ProductGrid products={bestsellers} />
          </div>
        </section>
      ),
    },
    {
      key: "bespokeCouture",
      order: cms.bespokeCouture.displayOrder ?? 7,
      enabled: cms.bespokeCouture.enabled !== false,
      render: () => (
        <section key="bespoke" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="relative overflow-hidden rounded-xs border border-brand-border/80 bg-espresso text-ivory p-8 sm:p-12 lg:p-16 shadow-xl">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-px w-6 bg-gold" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold-light font-medium">
                    {cms.bespokeCouture.eyebrow}
                  </p>
                </div>
                <h2 className="serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight">
                  {cms.bespokeCouture.heading}
                </h2>
                <p className="mt-4 text-xs sm:text-sm text-ivory/80 font-light leading-relaxed max-w-xl">
                  {cms.bespokeCouture.description}
                </p>

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/15">
                  {cms.bespokeCouture.features.map((f, i) => (
                    <div key={i}>
                      <p className="serif text-2xl text-gold font-normal">{f.stat}</p>
                      <p className="text-[10px] uppercase tracking-wider text-ivory/70 mt-1 font-medium">
                        {f.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* High Contrast CTAs with luxury gradient backdrop */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={cms.bespokeCouture.primaryCtaHref || "/contact"}
                    className="btn-luxury-gold inline-flex min-h-[44px] items-center justify-center rounded-xs px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-semibold shadow-lg text-[#140d09]"
                  >
                    <span>{cms.bespokeCouture.primaryCtaText || "Book Boutique Appointment"}</span>
                  </Link>
                  <Link
                    href={cms.bespokeCouture.secondaryCtaHref || "/custom-stitching"}
                    className="btn-luxury-outline-light inline-flex min-h-[44px] items-center justify-center rounded-xs px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-medium"
                  >
                    <span>{cms.bespokeCouture.secondaryCtaText || "Size & Measurement Guide →"}</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-[4/5] overflow-hidden rounded-xs border border-white/20 shadow-2xl">
                {cms.bespokeCouture.videoUrl ? (
                  <video
                    src={cms.bespokeCouture.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={cms.bespokeCouture.imageUrl}
                    alt="Shaan-e-Taj Master Tailoring"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 inset-x-4 text-center pointer-events-none">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
                    {cms.bespokeCouture.locationTag}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ),
    },
    {
      key: "testimonials",
      order: cms.testimonials.displayOrder ?? 8,
      enabled: cms.testimonials.enabled !== false && cms.testimonials.items.length > 0,
      render: () => (
        <section key="testimonials" className="bg-ivory-2 border-t border-brand-border/60 py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="h-px w-6 bg-gold" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark font-medium">
                  {cms.testimonials.eyebrow}
                </p>
                <span className="h-px w-6 bg-gold" />
              </div>
              <h2 className="serif text-3xl sm:text-4xl text-brand-text font-normal">
                {cms.testimonials.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-brand-muted font-light">
                {cms.testimonials.subtitle}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {cms.testimonials.items.map((t, idx) => (
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
      ),
    },
    {
      key: "youtube",
      order: cms.youtube.displayOrder ?? 9,
      enabled: cms.youtube.enabled !== false,
      render: () => (
        <section key="youtube" className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <YouTubeSection />
        </section>
      ),
    },
    {
      key: "boutiqueCta",
      order: cms.boutiqueCta.displayOrder ?? 10,
      enabled: cms.boutiqueCta.enabled !== false,
      render: () => (
        <section key="boutique-cta" className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
          <HomeOrderCTA />
        </section>
      ),
    },
  ];

  // Sort sections by their configured displayOrder and filter enabled ones
  const sortedSections = [...sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {/* 1. Refined Top Marquee */}
      <MarqueeTicker />

      {/* Render Dynamic CMS Sections in Admin-configured sequence */}
      {sortedSections.map((sec) => (
        <div key={sec.key}>{sec.render()}</div>
      ))}
    </>
  );
}
