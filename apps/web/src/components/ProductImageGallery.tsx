"use client";

import { useState } from "react";
import Image from "next/image";

type ImageItem = {
  url: string;
  isPrimary?: boolean;
  sortOrder?: number;
};

interface ProductImageGalleryProps {
  images: ImageItem[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  // Sort images by sortOrder if available
  const sorted = [...images].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  
  // Find initial primary index, defaulting to 0
  const initialIndex = Math.max(
    0,
    sorted.findIndex((i) => i.isPrimary)
  );

  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!sorted.length) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded bg-ivory-2 text-sm text-brand-subtle">
        No product image available
      </div>
    );
  }

  const currentImage = sorted[activeIndex] || sorted[0];

  function showPrev() {
    setActiveIndex((prev) => (prev === 0 ? sorted.length - 1 : prev - 1));
  }

  function showNext() {
    setActiveIndex((prev) => (prev === sorted.length - 1 ? 0 : prev + 1));
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        showNext();
      } else {
        showPrev();
      }
    }
    setTouchStartX(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Large Image with Prev/Next Controls */}
      <div
        className="group relative aspect-[3/4] w-full overflow-hidden rounded bg-ivory-2 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={currentImage.url}
          alt={`${productName} - photo ${activeIndex + 1}`}
          fill
          className="object-cover transition duration-300"
          priority
          unoptimized={currentImage.url.startsWith("data:")}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Counter Badge */}
        {sorted.length > 1 && (
          <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium tracking-wider text-white backdrop-blur-xs">
            {activeIndex + 1} / {sorted.length}
          </div>
        )}

        {/* Navigation Arrows */}
        {sorted.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-brand-text shadow-sm backdrop-blur-xs transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-brand-text shadow-sm backdrop-blur-xs transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip Gallery */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          {sorted.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={`${img.url}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
                className={`relative aspect-[3/4] h-20 shrink-0 overflow-hidden rounded transition-all focus:outline-none ${
                  isSelected
                    ? "ring-2 ring-rose ring-offset-1 opacity-100 shadow-xs"
                    : "opacity-70 hover:opacity-100 border border-brand-border/60"
                }`}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={img.url.startsWith("data:")}
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
