"use client";

import { useState } from "react";
import Image from "next/image";
import { videoEmbed } from "@/lib/product-media";

export type GalleryImage = {
  url: string;
  isPrimary?: boolean;
  sortOrder?: number;
  alt?: string | null;
};

export type GalleryMedia = {
  url: string;
  kind?: string;
};

interface LuxuryProductGalleryProps {
  images: GalleryImage[];
  media?: GalleryMedia[];
  productName: string;
}

type SlideItem =
  | { type: "image"; url: string; alt?: string | null }
  | { type: "video"; url: string; kind?: string };

export function LuxuryProductGallery({
  images,
  media = [],
  productName,
}: LuxuryProductGalleryProps) {
  const sortedImages = [...images].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  // Build combined unified slides (images first, videos next)
  const slides: SlideItem[] = [
    ...sortedImages.map((img) => ({ type: "image" as const, url: img.url, alt: img.alt })),
    ...media.map((m) => ({ type: "video" as const, url: m.url, kind: m.kind })),
  ];

  const primaryIndex = Math.max(
    0,
    sortedImages.findIndex((i) => i.isPrimary)
  );

  const [activeIndex, setActiveIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!slides.length) {
    return (
      <div className="flex aspect-[3/4] w-full items-center justify-center rounded-sm border border-brand-border bg-ivory-2 text-sm text-brand-subtle">
        No product media available
      </div>
    );
  }

  const currentSlide = slides[activeIndex] || slides[0];

  function showPrev() {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsZoomed(false);
  }

  function showNext() {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) showNext();
      else showPrev();
    }
    setTouchStartX(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Primary Stage */}
      <div
        className="group relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-brand-border bg-ivory-2 select-none shadow-2xs"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentSlide.type === "image" ? (
          <div
            className={`relative h-full w-full cursor-zoom-in transition-transform duration-300 ${
              isZoomed ? "scale-150 cursor-zoom-out" : "scale-100"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={currentSlide.url}
              alt={currentSlide.alt || `${productName} — view ${activeIndex + 1}`}
              fill
              className="object-cover"
              priority={activeIndex === 0}
              unoptimized={currentSlide.url.startsWith("data:")}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-black">
            {(() => {
              const embed = videoEmbed(currentSlide.url);
              if (embed.type === "video") {
                return (
                  <video
                    src={embed.src}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain"
                  />
                );
              }
              if (embed.type === "instagram") {
                return (
                  <div className="flex h-full flex-col">
                    <iframe
                      src={embed.src}
                      title="Instagram Reel"
                      className="min-h-0 flex-1 border-0"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                      loading="lazy"
                    />
                    <a
                      href={embed.canonicalUrl ?? currentSlide.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black/80 py-2 text-center text-[10px] uppercase tracking-wider text-white/80 hover:text-white"
                    >
                      Open on Instagram ↗
                    </a>
                  </div>
                );
              }
              return (
                <iframe
                  src={embed.src}
                  title={`${productName} video`}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              );
            })()}
          </div>
        )}

        {/* Counter Badge */}
        {slides.length > 1 && (
          <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium tracking-wider text-white backdrop-blur-xs">
            {activeIndex + 1} / {slides.length}
          </div>
        )}

        {/* Media Kind Badge */}
        {currentSlide.type === "video" && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white backdrop-blur-xs">
            <span>▶ Video</span>
          </div>
        )}

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous media"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-brand-text shadow-sm backdrop-blur-xs transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next media"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-brand-text shadow-sm backdrop-blur-xs transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {slides.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5">
          {slides.map((slide, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  setIsZoomed(false);
                }}
                aria-label={`View slide ${idx + 1}`}
                className={`relative aspect-[3/4] h-20 shrink-0 overflow-hidden rounded-xs transition-all focus:outline-none ${
                  isSelected
                    ? "ring-2 ring-rose ring-offset-1 opacity-100 shadow-xs border-transparent"
                    : "opacity-70 hover:opacity-100 border border-brand-border/70"
                }`}
              >
                {slide.type === "image" ? (
                  <Image
                    src={slide.url}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={slide.url.startsWith("data:")}
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-white">
                    <span className="text-xs">▶</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
