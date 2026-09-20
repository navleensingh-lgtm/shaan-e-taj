"use client";

import { useState } from "react";
import Image from "next/image";

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  thumbnailUrl: string;
}

export function YouTubeFacade({ videoId, title, thumbnailUrl }: YouTubeFacadeProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <div
      onClick={() => setIsPlaying(true)}
      className="group relative h-full w-full cursor-pointer bg-brand-text select-none overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setIsPlaying(true);
      }}
      aria-label={`Play ${title}`}
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        className="object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
        sizes="(max-width: 1024px) 100vw, 800px"
      />
      {/* Dark luxury tint */}
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-black/30 transition-opacity group-hover:opacity-75" />

      {/* Tactile gold play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-rose/90 text-white shadow-xl backdrop-blur-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-rose">
          <span className="ml-1 text-2xl text-ivory">▶</span>
        </div>
      </div>

      <div className="absolute bottom-3 inset-x-4 flex justify-between items-center text-[10px] uppercase tracking-wider text-ivory/90 bg-espresso/60 px-3 py-1.5 rounded-xs backdrop-blur-xs border border-white/10">
        <span className="font-light truncate mr-2">{title}</span>
        <span className="text-gold font-medium shrink-0">Click to Play</span>
      </div>
    </div>
  );
}
