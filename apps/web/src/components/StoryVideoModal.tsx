"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { videoEmbed } from "@/lib/product-media";
import { orderWhatsAppUrl } from "@/lib/whatsapp";
import { useCurrency } from "@/context/CurrencyContext";

export type StoryItem = {
  id: string;
  productSlug: string;
  productName: string;
  priceInPaise: number;
  color?: string | null;
  fabric?: string | null;
  mediaUrl: string;
  posterUrl: string;
  isVideo: boolean;
};

interface StoryVideoModalProps {
  items: StoryItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function StoryVideoModal({
  items,
  initialIndex,
  isOpen,
  onClose,
}: StoryVideoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Lock background body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!isOpen || !items.length) return null;

  const currentItem = items[currentIndex] || items[0];
  const embed = videoEmbed(currentItem.mediaUrl);
  const priceRupees = currentItem.priceInPaise / 100;

  function handleNext() {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsPlaying(true);
  }

  function handlePrev() {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsPlaying(true);
  }

  function togglePlay() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      void videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }

  const whatsappHref = orderWhatsAppUrl({
    name: currentItem.productName,
    slug: currentItem.productSlug,
    price: priceRupees,
    color: currentItem.color,
    fabric: currentItem.fabric,
    sku: currentItem.productSlug,
    stitchingType: "UNSTITCHED",
    totalPrice: priceRupees,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Story video viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300"
    >
      {/* Background click to close */}
      <div className="absolute inset-0 z-0" onClick={onClose} aria-hidden="true" />

      {/* Top Bar Floating Controls */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between text-white pointer-events-none">
        {/* Story Progress Indicators */}
        <div className="flex items-center gap-1.5 flex-1 max-w-xs sm:max-w-md pointer-events-auto">
          {items.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden"
            >
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  i === currentIndex ? "w-full bg-gold" : i < currentIndex ? "w-full" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close story viewer"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white border border-white/20 hover:bg-black/80 hover:border-gold active:scale-95 transition"
        >
          <span className="text-xl leading-none">✕</span>
        </button>
      </div>

      {/* Main Story Container: Portrait Card (max-w-sm sm:max-w-md) */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[420px] max-h-[92vh] mx-auto px-3 sm:px-0">
        <div className="relative w-full aspect-[9/16] overflow-hidden rounded-md bg-espresso shadow-2xl border border-white/15">
          {/* Media Player Layer */}
          {currentItem.isVideo ? (
            embed.type === "youtube" ? (
              <iframe
                src={`${embed.src}${embed.src.includes("?") ? "&" : "?"}autoplay=1`}
                title={currentItem.productName}
                className="h-full w-full border-0 object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : embed.type === "instagram" ? (
              <iframe
                src={embed.src}
                title={currentItem.productName}
                className="h-full w-full border-0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              />
            ) : (
              <div className="relative h-full w-full cursor-pointer" onClick={togglePlay}>
                <video
                  ref={videoRef}
                  src={embed.src}
                  poster={currentItem.posterUrl}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                  className="h-full w-full object-cover"
                />
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose/90 text-white text-2xl pl-1 shadow-lg">
                      ▶
                    </div>
                  </div>
                )}
                {/* Audio Mute Toggle Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white text-sm border border-white/20 hover:border-gold transition"
                  aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
              </div>
            )
          ) : (
            <Image
              src={currentItem.posterUrl}
              alt={currentItem.productName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
              priority
            />
          )}

          {/* Luxury Bottom Vignette */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

          {/* Attached Contextual Product Card */}
          <div className="absolute bottom-3 inset-x-3 z-20 rounded-xs border border-white/20 bg-espresso/90 p-3 text-ivory backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xs border border-white/10 bg-ivory-2">
                <Image
                  src={currentItem.posterUrl}
                  alt={currentItem.productName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-gold truncate">
                  {currentItem.fabric || "Luxury Couture"}
                </p>
                <h4 className="serif text-sm font-medium text-ivory truncate">
                  {currentItem.productName}
                </h4>
                <p className="text-xs font-semibold text-rose-light mt-0.5">
                  {formatPrice(currentItem.priceInPaise)}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-white/15">
              <Link
                href={`/product/${currentItem.productSlug}`}
                onClick={onClose}
                className="btn-luxury-primary flex-1 min-h-[36px] rounded-xs text-center text-[10px] uppercase tracking-[0.16em] font-medium"
              >
                <span>View Piece</span>
                <span className="arrow-shift ml-1 text-gold">→</span>
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury-whatsapp flex-1 min-h-[36px] rounded-xs text-center text-[10px] uppercase tracking-wider font-medium flex items-center justify-center gap-1"
              >
                <span className="text-xs">💬</span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Arrows (Prev / Next) */}
        {items.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-6 text-white text-xs">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1 text-ivory/80 hover:text-gold transition font-medium uppercase tracking-wider text-[11px]"
            >
              <span>←</span>
              <span>Previous</span>
            </button>
            <span className="text-white/40">•</span>
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 text-ivory/80 hover:text-gold transition font-medium uppercase tracking-wider text-[11px]"
            >
              <span>Next</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
