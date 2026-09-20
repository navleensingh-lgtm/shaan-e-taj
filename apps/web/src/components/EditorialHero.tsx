"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { ViewportVideo } from "./ViewportVideo";

interface EditorialHeroProps {
  videoUrl?: string;
  fallbackImageUrl?: string;
}

export function EditorialHero({ videoUrl, fallbackImageUrl }: EditorialHeroProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-68px)] items-center justify-center overflow-hidden bg-espresso text-ivory">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {videoUrl ? (
          <ViewportVideo
            src={videoUrl}
            poster={fallbackImageUrl}
            className="h-full w-full object-cover opacity-45 filter brightness-95 contrast-105"
          />
        ) : fallbackImageUrl ? (
          <div
            className="h-full w-full bg-cover bg-center opacity-40 transition-transform duration-1000 scale-100 group-hover:scale-105"
            style={{ backgroundImage: `url(${fallbackImageUrl})` }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1b120c] via-espresso to-[#24170f]" />
        )}

        {/* Luxury Vignettes & Depth Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-transparent to-espresso/50" />
        <div className="absolute inset-0 bg-radial from-transparent via-espresso/30 to-espresso/80" />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-3xl px-6 py-20 text-center sm:px-8">
        {/* Subtle Gold Accent Divider */}
        <div className="mx-auto mb-6 flex items-center justify-center gap-3 animate-editorial-reveal">
          <span className="h-px w-10 bg-gold" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-gold font-medium">
            {siteConfig.legalName} · Jalandhar
          </span>
          <span className="h-px w-10 bg-gold" />
        </div>

        {/* Editorial Heading */}
        <h1 className="serif animate-editorial-reveal animation-delay-100 text-4xl sm:text-6xl md:text-7xl font-light leading-[1.12] text-ivory tracking-tight">
          Couture Defined by
          <br />
          <span className="italic font-serif text-gold-light">Artisanal Royalty</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-xl animate-editorial-reveal animation-delay-200 text-xs sm:text-sm leading-relaxed text-ivory/80 font-light">
          {siteConfig.description}
        </p>

        {/* Tactile CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-editorial-reveal animation-delay-300">
          <Link
            href="/new-arrivals"
            className="btn-luxury-primary group rounded-xs px-9 py-4 text-[11px] uppercase tracking-[0.22em] font-medium"
          >
            <span>Explore Collection</span>
            <span className="arrow-shift ml-2 text-gold">→</span>
          </Link>

          <Link
            href="/custom-stitching"
            className="btn-luxury-outline rounded-xs border-gold/40 text-ivory hover:border-gold hover:bg-gold/10 px-9 py-4 text-[11px] uppercase tracking-[0.22em] font-medium"
          >
            Custom Stitching
          </Link>
        </div>

        {/* Subtle Heritage Tag */}
        <p className="mt-12 text-[9px] uppercase tracking-[0.25em] text-ivory/50">
          Pan-India & Worldwide Express Delivery · Handcrafted in Punjab
        </p>
      </div>
    </section>
  );
}
