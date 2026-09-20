"use client";

import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { apiFetch } from "@/lib/api-client";

export function WishlistButton({ productId }: { productId: string }) {
  const { status } = useSession();
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      window.location.href = "/login?callbackUrl=" + encodeURIComponent(window.location.pathname);
      return;
    }

    // Instant optimistic UI toggle
    const nextSaved = !saved;
    setSaved(nextSaved);

    startTransition(async () => {
      try {
        if (nextSaved) {
          await apiFetch(`/wishlist/${productId}`, { method: "POST" });
        } else {
          await apiFetch(`/wishlist/${productId}`, { method: "DELETE" });
        }
      } catch {
        // Revert on error
        setSaved(!nextSaved);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`group relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer active:scale-90 shadow-2xs ${
        saved
          ? "border-rose bg-rose/90 text-white"
          : "border-brand-border/80 bg-white/95 text-brand-subtle hover:border-rose hover:text-rose backdrop-blur-xs"
      }`}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        className={`h-4 w-4 transition-transform duration-200 ${
          saved ? "scale-110 fill-current text-rose" : "stroke-current fill-none"
        }`}
        viewBox="0 0 24 24"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}

