"use client";

import { whatsAppUrl } from "@/lib/whatsapp";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Reach Out</p>
      <h1 className="serif mt-3 text-4xl">Contact Us</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-6 text-sm text-brand-muted">
          <p><strong className="text-brand-text">Visit</strong><br />Faridabad, Haryana</p>
          <p><strong className="text-brand-text">Hours</strong><br />Mon–Fri 11:00–18:30 · Sat 11:00–17:00</p>
          <a
            href="https://www.instagram.com/shaanetaj"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-brand-border px-5 py-2 text-xs uppercase tracking-wider"
          >
            Instagram
          </a>
        </div>
        <button
          type="button"
          onClick={() => window.open(whatsAppUrl("Hello! I have an enquiry about Shaan-e-Taj."), "_blank")}
          className="h-fit rounded-sm bg-rose px-6 py-4 text-[11px] uppercase tracking-wider text-white"
        >
          Message on WhatsApp
        </button>
      </div>
    </section>
  );
}
