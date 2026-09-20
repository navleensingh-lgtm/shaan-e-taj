"use client";

import { useStoreSettings } from "@/context/StoreSettingsContext";
import { whatsAppLink } from "@/lib/site-config";

export function WhatsAppFloat() {
  const store = useStoreSettings();
  const num = store?.whatsappNumber?.replace(/\D/g, "");
  const href = num
    ? `https://wa.me/${num}?text=${encodeURIComponent("Hello! I want to know more about your collection.")}`
    : whatsAppLink("Hello! I want to know more about your collection.");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#1f8a4c] text-2xl text-white shadow-lg border border-gold/40 transition-all duration-300 hover:scale-105 hover:bg-[#176f3d] active:scale-95 group"
      aria-label="Chat on WhatsApp"
    >
      <span className="text-xl">💬</span>
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xs bg-espresso px-2.5 py-1 text-[10px] uppercase tracking-wider text-ivory shadow-md border border-gold/30 group-hover:block transition">
        WhatsApp Concierge
      </span>
    </a>
  );
}
