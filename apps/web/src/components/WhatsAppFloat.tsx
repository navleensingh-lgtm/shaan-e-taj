"use client";

import { whatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsAppUrl("Hello! I want to know more about your collection.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-7 right-7 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg transition hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      💬
    </a>
  );
}
