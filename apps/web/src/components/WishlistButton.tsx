"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { apiFetch } from "@/lib/api-client";

export function WishlistButton({ productId }: { productId: string }) {
  const { status } = useSession();
  const [saved, setSaved] = useState(false);

  async function toggle() {
    if (status !== "authenticated") {
      window.location.href = "/login?callbackUrl=" + encodeURIComponent(window.location.pathname);
      return;
    }
    if (saved) {
      await apiFetch(`/wishlist/${productId}`, { method: "DELETE" });
      setSaved(false);
    } else {
      await apiFetch(`/wishlist/${productId}`, { method: "POST" });
      setSaved(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-sm border border-brand-border px-3 py-2.5 text-sm"
      aria-label="Add to wishlist"
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
