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
      className="btn-luxury-outline flex h-9 items-center justify-center gap-1.5 rounded-xs px-3 text-[10px] uppercase tracking-wider font-medium text-brand-muted hover:border-gold-dark hover:text-espresso"
      aria-label={`Share ${name}`}
    >
      <svg className="h-3.5 w-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
