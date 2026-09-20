import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig, whatsAppLink } from "@/lib/site-config";
import { getPublicStoreSettings, getAboutCmsSettings } from "@/lib/store-settings";
import { SocialLinks } from "@/components/SocialLinks";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us · Heritage & Atelier Craftsmanship",
  description:
    "Discover the story of Shaan-e-Taj — born in Jalandhar, Punjab in 2015. Explore our artisanal zardozi, made-to-measure tailoring, and bespoke bridal heritage.",
};

export default async function AboutPage() {
  const [settings, cms] = await Promise.all([
    getPublicStoreSettings(),
    getAboutCmsSettings(),
  ]);

  // Fallback to siteSettings address / phone if available
  const addressLine = settings?.storeAddressLine1
    ? `${settings.storeAddressLine1}, ${settings.storeAddressLine2 ? settings.storeAddressLine2 + ", " : ""}${settings.storeLandmark || "Jalandhar, Punjab"} ${settings.storePincode || "144005"}`
    : cms.boutiqueVisit.address;

  const weekdayHours = settings?.storeHoursWeekdays || cms.boutiqueVisit.hoursWeekdays;
  const sundayHours = settings?.storeHoursSunday || cms.boutiqueVisit.hoursSunday;
  const mapUrl = settings?.storeMapUrl || cms.boutiqueVisit.mapUrl;
  const whatsappNumber = settings?.whatsappNumber || siteConfig.whatsapp;

  const boutiqueVisitMsg = whatsAppLink("Hello Taj Fashion, I would like to schedule a personal appointment at your Jalandhar boutique.");

  return (
    <div className="min-h-screen bg-[#faf8f5] text-brand-text selection:bg-gold/20 selection:text-espresso">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-brand-border/60 bg-espresso text-ivory px-5 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src={cms.hero.imageUrl}
            alt="Shaan-e-Taj Atelier Craftsmanship"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        {/* Editorial Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/60 to-espresso/80 z-1" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-gold/15 blur-3xl pointer-events-none z-2" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold font-medium">
              {cms.hero.eyebrow}
            </p>
            <span className="h-px w-8 bg-gold" />
          </div>

          <h1 className="serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.12]">
            {cms.hero.heading}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-ivory/85 font-light leading-relaxed">
            {cms.hero.subheading}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#story"
              className="btn-luxury-outline-light inline-flex min-h-[44px] items-center justify-center rounded-xs px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-medium text-ivory border-white/30 hover:border-gold hover:text-white"
            >
              Explore Our Story ↓
            </a>
            <Link
              href="/catalog"
              className="btn-luxury-gold inline-flex min-h-[44px] items-center justify-center rounded-xs px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#140d09]"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY (JALANDHAR ROOTS) */}
      <section id="story" className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Visual Column */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xs border border-brand-border/80 shadow-xl bg-ivory-2">
              <Image
                src={cms.story.imageUrl}
                alt="Shaan-e-Taj Heritage in Jalandhar"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 inset-x-6 text-center text-ivory pointer-events-none">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
                  Atelier Taj Fashion · Gulmarg Ave, Jalandhar
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-rose" />
              <p className="text-[11px] uppercase tracking-[0.3em] text-rose font-semibold">
                {cms.story.eyebrow}
              </p>
            </div>

            <h2 className="serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-espresso">
              {cms.story.heading}
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-brand-muted font-light leading-relaxed">
              <p>{cms.story.paragraph1}</p>
              <p>{cms.story.paragraph2}</p>
            </div>

            {/* Editorial Pull Quote */}
            <div className="border-l-2 border-gold pl-6 py-2 my-6">
              <p className="serif text-lg sm:text-xl italic text-espresso/90 leading-relaxed font-normal">
                “{cms.story.quote}”
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-gold-dark font-medium">
                — Taj Fashion Atelier Philosophy
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/custom-stitching"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-rose hover:text-espresso transition"
              >
                Learn about our custom measurements <span className="arrow-shift">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CRAFTSMANSHIP SECTION */}
      <section className="bg-espresso text-ivory py-24 sm:py-32 px-5 lg:px-8 border-y border-brand-border/40">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 justify-center">
              <span className="h-px w-6 bg-gold" />
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold font-medium">
                {cms.craftsmanship.eyebrow}
              </p>
              <span className="h-px w-6 bg-gold" />
            </div>
            <h2 className="serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
              {cms.craftsmanship.heading}
            </h2>
            <p className="text-sm sm:text-base text-ivory/80 font-light leading-relaxed">
              {cms.craftsmanship.description}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {cms.craftsmanship.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xs border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-gold/60 hover:bg-white/10"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xs mb-6 border border-white/10">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gold serif text-lg font-normal">0{idx + 1}</span>
                  <span className="h-px w-4 bg-gold/40" />
                </div>
                <h3 className="serif text-xl sm:text-2xl font-normal text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-ivory/70 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FROM JALANDHAR TO THE WORLD */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-rose" />
              <p className="text-[11px] uppercase tracking-[0.3em] text-rose font-semibold">
                {cms.jalandharToWorld.eyebrow}
              </p>
            </div>

            <h2 className="serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-espresso">
              {cms.jalandharToWorld.heading}
            </h2>

            <p className="text-sm sm:text-base text-brand-muted font-light leading-relaxed">
              {cms.jalandharToWorld.description}
            </p>

            {/* Stats Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-brand-border">
              {cms.jalandharToWorld.stats.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="serif text-3xl sm:text-4xl font-normal text-rose">{item.stat}</p>
                  <p className="text-[10px] uppercase tracking-wider text-brand-muted font-semibold">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={boutiqueVisitMsg}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury-rose inline-flex min-h-[44px] items-center justify-center rounded-xs px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-semibold text-white shadow-md"
              >
                <span>WhatsApp Worldwide Consultation</span>
                <span className="ml-2 font-bold">↗</span>
              </a>
              <Link
                href="/shipping"
                className="btn-luxury-outline inline-flex min-h-[44px] items-center justify-center rounded-xs px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-medium"
              >
                Shipping & Delivery
              </Link>
            </div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xs border border-brand-border/80 shadow-2xl bg-ivory-2">
              <Image
                src={cms.jalandharToWorld.imageUrl}
                alt="Shaan-e-Taj Global Brides"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 inset-x-6 text-center text-ivory pointer-events-none">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
                  Connecting Punjabi Heritage to Global Homes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE SHAAN-E-TAJ EXPERIENCE (4 VALUE BLOCKS) */}
      <section className="bg-ivory-2 py-24 sm:py-32 px-5 lg:px-8 border-t border-brand-border/60">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 justify-center">
              <span className="h-px w-6 bg-rose" />
              <p className="text-[11px] uppercase tracking-[0.3em] text-rose font-semibold">
                {cms.experience.eyebrow}
              </p>
              <span className="h-px w-6 bg-rose" />
            </div>
            <h2 className="serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso">
              {cms.experience.heading}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cms.experience.blocks.map((block) => (
              <div
                key={block.number}
                className="rounded-xs border border-brand-border/80 bg-white p-8 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-gold/60"
              >
                <span className="serif text-3xl font-normal text-gold block mb-4">
                  {block.number}
                </span>
                <h3 className="serif text-xl font-medium text-espresso mb-2">
                  {block.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted font-light leading-relaxed">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CUSTOM STITCHING CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="relative overflow-hidden rounded-xs border border-brand-border/80 bg-espresso text-ivory p-8 sm:p-14 lg:p-16 shadow-2xl">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-gold" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
                {cms.customStitchingCta.eyebrow}
              </p>
            </div>
            <h2 className="serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight">
              {cms.customStitchingCta.heading}
            </h2>
            <p className="text-xs sm:text-sm text-ivory/80 font-light leading-relaxed">
              {cms.customStitchingCta.description}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={cms.customStitchingCta.primaryCtaHref || "/contact"}
                className="btn-luxury-gold inline-flex min-h-[44px] items-center justify-center rounded-xs px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#140d09] shadow-lg"
              >
                <span>{cms.customStitchingCta.primaryCtaText}</span>
              </Link>
              <Link
                href={cms.customStitchingCta.secondaryCtaHref || "/custom-stitching"}
                className="btn-luxury-outline-light inline-flex min-h-[44px] items-center justify-center rounded-xs px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-medium"
              >
                <span>{cms.customStitchingCta.secondaryCtaText} →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VISIT THE JALANDHAR BOUTIQUE */}
      <section className="bg-white border-y border-brand-border/80 py-24 sm:py-32 px-5 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-rose" />
                <p className="text-[11px] uppercase tracking-[0.3em] text-rose font-semibold">
                  {cms.boutiqueVisit.eyebrow}
                </p>
              </div>

              <h2 className="serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso leading-tight">
                {cms.boutiqueVisit.heading}
              </h2>

              <p className="text-sm sm:text-base text-brand-muted font-light leading-relaxed">
                {cms.boutiqueVisit.description}
              </p>

              <div className="rounded-xs border border-brand-border bg-ivory-2 p-6 space-y-3">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-muted">
                  Boutique Location
                </p>
                <p className="text-base font-medium text-espresso">{addressLine}</p>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-muted">
                  <p>
                    <strong className="text-brand-text">Weekdays:</strong> {weekdayHours}
                  </p>
                  <p>
                    <strong className="text-brand-text">Sundays:</strong> {sundayHours}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury-rose inline-flex min-h-[44px] items-center justify-center rounded-xs px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-semibold text-white shadow-md"
                >
                  <span>Get Directions on Google Maps</span>
                  <span className="ml-2 font-bold">↗</span>
                </a>
                <a
                  href={boutiqueVisitMsg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury-outline inline-flex min-h-[44px] items-center justify-center rounded-xs px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-medium text-espresso"
                >
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden rounded-xs border border-brand-border/80 shadow-xl bg-ivory-2">
                <Image
                  src={cms.boutiqueVisit.imageUrl}
                  alt="Taj Fashion Jalandhar Boutique Salon"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 inset-x-4 text-center text-ivory pointer-events-none">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
                    120, Gulmarg Avenue · Ladhewali · Jalandhar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL BRAND CTA & SOCIAL MEDIA */}
      <section className="mx-auto max-w-5xl px-5 py-24 sm:py-32 text-center space-y-6">
        <p className="text-[11px] uppercase tracking-[0.35em] text-gold-dark font-medium">
          Heritage · Craft · Grace
        </p>

        <h2 className="serif text-3xl sm:text-4xl md:text-5xl font-normal text-espresso leading-tight">
          {cms.finalCta.heading}
        </h2>

        <p className="max-w-xl mx-auto text-sm sm:text-base text-brand-muted font-light leading-relaxed">
          {cms.finalCta.subtitle}
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={cms.finalCta.primaryCtaHref || "/collections"}
            className="btn-luxury-gold inline-flex min-h-[44px] items-center justify-center rounded-xs px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#140d09] shadow-lg"
          >
            <span>{cms.finalCta.primaryCtaText}</span>
          </Link>
          <Link
            href={cms.finalCta.secondaryCtaHref || "/contact"}
            className="btn-luxury-outline inline-flex min-h-[44px] items-center justify-center rounded-xs px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] font-medium text-espresso"
          >
            <span>{cms.finalCta.secondaryCtaText}</span>
          </Link>
        </div>

        <div className="mt-16 border-t border-brand-border/60 pt-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-muted">
            Follow Our Jalandhar Atelier
          </p>
          <div className="mt-4 flex justify-center">
            <SocialLinks className="gap-6 text-sm text-brand-muted hover:text-espresso" />
          </div>
        </div>
      </section>
    </div>
  );
}
