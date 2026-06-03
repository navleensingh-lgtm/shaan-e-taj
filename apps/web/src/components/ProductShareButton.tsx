"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

type Props = {
  slug: string;
  name: string;
};

function productUrl(slug: string) {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shaanetaj.com");
  return `${base}/product/${slug}`;
}

export function ProductShareButton({ slug, name }: Props) {
  const [label, setLabel] = useState("Share");

  async function share(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = productUrl(slug);
    const text = `${name} — ${siteConfig.brand}, Jalandhar`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: name, text, url });
        return;
      } catch {
        /* user cancelled */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setLabel("Link copied!");
      setTimeout(() => setLabel("Share"), 2000);
    } catch {
      setLabel("Copy failed");
      setTimeout(() => setLabel("Share"), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="flex items-center justify-center rounded-sm border border-brand-border px-3 py-2.5 text-[11px] uppercase tracking-wider text-brand-muted transition hover:border-rose hover:text-rose-dark"
      aria-label={`Share ${name}`}
    >
      {label}
    </button>
  );
}
