"use client";

import { useStoreSettings } from "@/context/StoreSettingsContext";
import { whatsAppLink } from "@/lib/site-config";

export function WhatsAppFloat() {
  const store = useStoreSettings();
  const num = store?.whatsappNumber?.replace(/\D/g, "");
  const href = num
    ? `https://wa.me/${num}?text=${encodeURIComponent("Hello Shaan-e-Taj! I would like personal concierge assistance with your boutique collection.")}`
    : whatsAppLink("Hello Shaan-e-Taj! I would like personal concierge assistance with your boutique collection.");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-espresso text-ivory shadow-xl border border-gold/60 transition-all duration-300 hover:scale-105 hover:border-gold hover:shadow-2xl active:scale-95 group"
      aria-label="Chat with WhatsApp Concierge"
    >
      {/* Subtle royal pulsating ring */}
      <span className="absolute inset-0 rounded-full border border-gold/40 animate-ping opacity-30 pointer-events-none" />

      <span className="text-xl sm:text-2xl leading-none">💬</span>

      {/* Luxury hover tooltip */}
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xs bg-espresso/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] font-medium text-ivory shadow-xl border border-gold/40 backdrop-blur-sm group-hover:block transition">
        Boutique Concierge
      </span>
    </a>
  );
}
