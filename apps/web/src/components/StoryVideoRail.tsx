"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { StoryVideoModal, type StoryItem } from "./StoryVideoModal";

interface StoryVideoRailProps {
  title?: string;
  subtitle?: string;
  items: StoryItem[];
}

export function StoryVideoRail({
  title = "Trending Now",
  subtitle = "Swipe to explore styling stories and real boutique movement from our Jalandhar atelier",
  items,
}: StoryVideoRailProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!items.length) return null;

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-brand-border/70 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-gold" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark font-medium">
              Shop The Look
            </p>
          </div>
          <h2 className="serif mt-2 text-3xl sm:text-4xl text-brand-text font-normal">
            {title}
          </h2>
          <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-brand-muted font-light">
            {subtitle}
          </p>
        </div>

        {/* Desktop Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll stories left"
            className="flex h-9 w-9 items-center justify-center rounded-xs border border-brand-border bg-white text-brand-text hover:border-gold hover:text-espresso transition active:scale-95 shadow-2xs"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll stories right"
            className="flex h-9 w-9 items-center justify-center rounded-xs border border-brand-border bg-white text-brand-text hover:border-gold hover:text-espresso transition active:scale-95 shadow-2xs"
          >
            →
          </button>
        </div>
      </div>

      {/* Horizontal Story Rail: Touch-Snap on Mobile, Smooth Row on Desktop */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            className="group relative flex-none w-[175px] sm:w-[220px] md:w-[240px] aspect-[9/16] cursor-pointer snap-start overflow-hidden rounded-xs border border-brand-border/80 bg-ivory-2 shadow-2xs transition-all duration-300 hover:border-gold hover:shadow-md active:scale-98 select-none"
          >
            {/* Poster Thumbnail (zero eager video download) */}
            <Image
              src={item.posterUrl}
              alt={item.productName}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 175px, 240px"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

            {/* Top Story Ring Badge */}
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 rounded-full bg-espresso/80 border border-gold/40 px-2 py-0.5 backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[8px] uppercase tracking-wider text-ivory font-medium">
                {item.isVideo ? "Reel" : "Look"}
              </span>
            </div>

            {/* Centered Play Indicator */}
            {item.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/25 backdrop-blur-xs border border-white/40 text-white transition-transform duration-300 group-hover:scale-110 group-hover:bg-rose/90">
                  <span className="text-sm sm:text-base ml-0.5">▶</span>
                </div>
              </div>
            )}

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3 inset-x-3 z-10 text-ivory">
              <p className="text-[8px] uppercase tracking-[0.2em] text-gold-light font-medium truncate">
                {item.fabric || "Bespoke Cut"}
              </p>
              <h3 className="serif text-xs sm:text-sm font-normal text-white line-clamp-1 group-hover:text-gold-light transition-colors">
                {item.productName}
              </h3>
              <p className="mt-0.5 text-[11px] font-semibold text-rose-light">
                ₹{(item.priceInPaise / 100).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Story Lightbox Modal */}
      {selectedIndex !== null && (
        <StoryVideoModal
          items={items}
          initialIndex={selectedIndex}
          isOpen={selectedIndex !== null}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </section>
  );
}
