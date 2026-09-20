"use client";

import { useStoreSettings } from "@/context/StoreSettingsContext";
import { whatsAppLink } from "@/lib/site-config";

export function ContactWhatsAppButton() {
  const store = useStoreSettings();
  const num = store?.whatsappNumber?.replace(/\D/g, "") ?? "";
  const href = num
    ? `https://wa.me/${num}?text=${encodeURIComponent("Hello Shaan-e-Taj! I have an enquiry about your collection.")}`
    : whatsAppLink("Hello Shaan-e-Taj! I have an enquiry about your collection.");

  return (
    <button
      type="button"
      onClick={() => window.open(href, "_blank")}
      className="btn-luxury-whatsapp w-full rounded-xs py-4 text-[11px] uppercase tracking-[0.2em] font-medium"
    >
      <span className="mr-2 text-base leading-none">💬</span>
      <span>Message on WhatsApp</span>
    </button>
  );
}
