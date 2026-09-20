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
}

/**
 * High-performance viewport-aware video player.
 * Automatically pauses video when out of viewport to preserve CPU/battery/bandwidth.
 * Avoids concurrent autoplay strain using native IntersectionObserver.
 */
export function ViewportVideo({
  src,
  poster,
  className = "w-full h-full object-cover",
  aspectRatio,
  playsInline = true,
  muted = true,
  loop = true,
}: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Play safely handling browser autoplay policies
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                /* autoplay was prevented or interrupted */
              });
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${aspectRatio ? aspectRatio : "h-full w-full"}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline={playsInline}
        muted={muted}
        loop={loop}
        preload="metadata"
        onLoadedData={() => setIsLoaded(true)}
        className={`${className} transition-opacity duration-700 ${
          isLoaded || !poster ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
