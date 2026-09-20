"use client";

import Link from "next/link";
import { ViewportVideo } from "./ViewportVideo";

interface EditorialVideoSectionProps {
  videoUrl?: string;
  posterUrl?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function EditorialVideoSection({
  videoUrl,
  posterUrl,
  eyebrow = "ATELIER & CRAFTSMANSHIP",
  title = "The Art of Bespoke Indian Couture",
  subtitle = "From our Jalandhar atelier to patrons worldwide — hand-embroidered silhouettes crafted with timeless precision, regal zari work, and royal ease.",
  ctaText = "Explore The Collection",
  ctaHref = "/new-arrivals",
  secondaryCtaText = "Bespoke Stitching",
  secondaryCtaHref = "/custom-stitching",
}: EditorialVideoSectionProps) {
  return (
    <section className="relative my-20 w-full overflow-hidden bg-espresso text-ivory">
      {/* Background Media / Video */}
      <div className="absolute inset-0 z-0">
        {videoUrl ? (
          <ViewportVideo
            src={videoUrl}
            poster={posterUrl}
            className="h-full w-full object-cover opacity-35 filter brightness-90 contrast-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-espresso via-[#2c1a12] to-espresso opacity-90" />
        )}
        {/* Subtle royal vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-transparent to-espresso/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-espresso/40 to-espresso/90" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-28 text-center sm:px-8 sm:py-36">
        <div className="mx-auto mb-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gold" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-gold" />
        </div>

        <h2 className="serif text-3xl font-light tracking-wide text-ivory sm:text-5xl md:text-6xl leading-[1.15]">
          {title}
        </h2>

        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-xs sm:text-sm leading-relaxed text-ivory/80 font-light">
            {subtitle}
          </p>
        )}

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={ctaHref}
            className="btn-luxury-primary group rounded-xs px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] font-medium"
          >
            <span>{ctaText}</span>
            <span className="arrow-shift ml-2 text-gold">→</span>
          </Link>

          {secondaryCtaHref && (
            <Link
              href={secondaryCtaHref}
              className="btn-luxury-outline rounded-xs border-gold/40 text-ivory hover:border-gold hover:bg-gold/10 px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] font-medium"
            >
              {secondaryCtaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
