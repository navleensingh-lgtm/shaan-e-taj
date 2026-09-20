"use client";

import { useEffect, useRef, useState } from "react";

interface ViewportVideoProps {
  src: string;
  poster?: string;
  className?: string;
  aspectRatio?: string;
  playsInline?: boolean;
  muted?: boolean;
  loop?: boolean;
  priority?: boolean;
}

/**
 * High-performance viewport-aware video player.
 * Progressive enhancement:
 * - Poster/placeholder renders immediately without network delay.
 * - Video element is lazily mounted when within viewport or idle.
 * - Respects prefers-reduced-motion.
 * - Video gracefully fades in over poster once ready to play without flashing.
 */
export function ViewportVideo({
  src,
  poster,
  className = "w-full h-full object-cover",
  aspectRatio,
  playsInline = true,
  muted = true,
  loop = true,
  priority = false,
}: ViewportVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(priority);
  const [isPlaying, setIsPlaying] = useState(false);

  // 1. Defer video load until container is near viewport or idle
  useEffect(() => {
    if (shouldLoadVideo) return;

    const el = containerRef.current;
    if (!el) return;

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setShouldLoadVideo(true);
            observer.disconnect();
          }
        },
        { rootMargin: "200px" } // trigger slightly before entering view
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      // Fallback
      setShouldLoadVideo(true);
    }
  }, [shouldLoadVideo]);

  // 2. Control play/pause based on active viewport intersection
  useEffect(() => {
    if (!shouldLoadVideo) return;

    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => setIsPlaying(true))
                .catch(() => {
                  /* autoplay prevented or interrupted */
                });
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoadVideo]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${aspectRatio ? aspectRatio : "h-full w-full"}`}
    >
      {/* Instant fallback/poster background */}
      {poster && (
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{ backgroundImage: `url(${poster})` }}
          aria-hidden="true"
        />
      )}

      {/* Lazily mounted video element */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          src={src}
          playsInline={playsInline}
          muted={muted}
          loop={loop}
          preload={priority ? "auto" : "metadata"}
          onPlaying={() => setIsPlaying(true)}
          className={`${className} transition-opacity duration-1000 ${
            isPlaying ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
