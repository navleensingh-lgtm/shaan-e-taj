"use client";

import { useState } from "react";
import { videoEmbed } from "@/lib/product-media";

type MediaItem = { url: string; kind?: string };

function InstagramBlock({ src, openUrl }: { src: string; openUrl: string }) {
  const [blocked, setBlocked] = useState(false);

  if (blocked) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-white">
        <p className="text-sm text-white/90">This Reel cannot be played here due to Instagram restrictions.</p>
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm border border-white/40 px-4 py-2 text-[11px] uppercase tracking-wider text-white hover:bg-white/10"
        >
          Open on Instagram
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <iframe
        src={src}
        title="Instagram Reel"
        className="min-h-0 flex-1 border-0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        loading="lazy"
        onLoad={(e) => {
          try {
            const frame = e.currentTarget;
            if (!frame.contentWindow) setBlocked(true);
          } catch {
            /* cross-origin — expected */
          }
        }}
      />
      <a
        href={openUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-black/80 py-2 text-center text-[10px] uppercase tracking-wider text-white/80 hover:text-white"
      >
        Open on Instagram
      </a>
    </div>
  );
}

export function ProductMediaGallery({ media, productName }: { media: MediaItem[]; productName: string }) {
  if (!media.length) return null;

  return (
    <div className="mt-10">
      <h2 className="serif text-2xl">Product videos</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {media.map((item, index) => {
          const embed = videoEmbed(item.url);
          const key = `${item.url}-${index}`;
          return (
            <div key={key} className="aspect-[9/16] overflow-hidden rounded bg-black sm:aspect-video">
              {embed.type === "video" ? (
                <video
                  src={embed.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-contain"
                >
                  <track kind="captions" />
                </video>
              ) : embed.type === "instagram" ? (
                <InstagramBlock src={embed.src} openUrl={embed.canonicalUrl ?? item.url} />
              ) : (
                <iframe
                  src={embed.src}
                  title={`${productName} video ${index + 1}`}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
