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
      className="w-full rounded-sm bg-[#25D366] px-6 py-4 text-[11px] uppercase tracking-wider text-white"
    >
      Message on WhatsApp
    </button>
  );
}
