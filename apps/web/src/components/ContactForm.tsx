"use client";

import { useState } from "react";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { whatsAppLink } from "@/lib/site-config";

const ENQUIRY_CATEGORIES = [
  "Bridal Couture",
  "Party Wear",
  "Festive Suits",
  "Custom Stitching",
  "General Enquiry",
];

export function ContactForm() {
  const store = useStoreSettings();
  const [category, setCategory] = useState("Bridal Couture");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const num = store?.whatsappNumber?.replace(/\D/g, "") ?? "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Prepare message for WhatsApp direct submission fallback
    const text = `*New Boutique Enquiry — Shaan-e-Taj*\n` +
      `• *Category*: ${category}\n` +
      `• *Name*: ${fullName}\n` +
      `• *Phone*: ${phone}\n` +
      (email ? `• *Email*: ${email}\n` : "") +
      `• *Message*: ${message}`;

    const waHref = num
      ? `https://wa.me/${num}?text=${encodeURIComponent(text)}`
      : whatsAppLink(text);

    // Open WhatsApp in new tab and mark submitted state
    window.open(waHref, "_blank");
    setSubmitted(true);
  }

  return (
    <div className="rounded-xs border border-brand-border/80 bg-white p-6 sm:p-8 shadow-sm">
      <div className="border-b border-brand-border/60 pb-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-gold-dark font-medium">Direct Boutique Enquiry</p>
        <h3 className="serif mt-1 text-2xl text-brand-text font-normal">
          Send Us an Enquiry
        </h3>
        <p className="mt-1 text-xs text-brand-muted font-light">
          Our Jalandhar atelier will connect with you via WhatsApp or phone with catalog recommendations.
        </p>
      </div>

      {submitted ? (
        <div className="py-10 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            ✓
          </div>
          <h4 className="serif text-xl text-brand-text">Thank You for Connecting</h4>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            Your enquiry has been forwarded directly to our boutique stylists. We look forward to dressing you royally.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 text-xs text-rose-dark underline hover:text-espresso"
          >
            Send another enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Enquiry Category Pills */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-brand-muted font-medium mb-2">
              Select Enquiry Type
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {ENQUIRY_CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-xs border text-xs transition-all cursor-pointer active:scale-95 ${
                      active
                        ? "border-espresso bg-espresso text-ivory font-medium shadow-xs"
                        : "border-brand-border bg-ivory-2/40 text-brand-text hover:border-gold hover:bg-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">
                Full Name *
              </label>
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xs border border-brand-border bg-white px-3.5 py-2.5 text-base sm:text-xs outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">
                Mobile / WhatsApp Number *
              </label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
                className="w-full rounded-xs border border-brand-border bg-white px-3.5 py-2.5 text-base sm:text-xs outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-text mb-1">
              Email Address <span className="text-brand-subtle font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="For order confirmations & catalogs"
              className="w-full rounded-xs border border-brand-border bg-white px-3.5 py-2.5 text-base sm:text-xs outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-text mb-1">
              Your Message or Specific Styling Requirements
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about the event date, preferred colors, custom measurement needs, or specific design questions…"
              className="w-full rounded-xs border border-brand-border bg-white px-3.5 py-2.5 text-base sm:text-xs outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            className="btn-luxury-primary w-full min-h-[48px] rounded-xs py-3.5 text-xs uppercase tracking-[0.2em] font-medium shadow-md"
          >
            <span>Send Enquiry to Boutique</span>
            <span className="arrow-shift ml-2 text-gold">→</span>
          </button>

          <p className="text-center text-[10px] uppercase tracking-wider text-brand-subtle">
            Instant connection with our Jalandhar master stylists via WhatsApp
          </p>
        </form>
      )}
    </div>
  );
}
