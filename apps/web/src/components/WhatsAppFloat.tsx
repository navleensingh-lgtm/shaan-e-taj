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
      className="fixed bottom-7 right-7 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg transition hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      💬
    </a>
  );
}
