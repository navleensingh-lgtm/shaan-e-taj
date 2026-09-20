import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { getPublicStoreSettings, formatStoreAddress } from "@/lib/store-settings";
import { ContactForm } from "@/components/ContactForm";
import { SocialLinks } from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "Visit Our Boutique | Contact Shaan-e-Taj",
  description:
    "Visit Shaan-e-Taj (Taj Fashion) in Jalandhar, Punjab. Explore bespoke bridal couture, custom stitching consultations, and connect with our master tailors.",
};

export default async function ContactPage() {
  const store = await getPublicStoreSettings();
  const fullAddress = formatStoreAddress(store);
  const phone = store.storePhone || siteConfig.phone;
  const whatsappNum = store.whatsappNumber || siteConfig.whatsapp.replace(/\D/g, "");

  return (
    <div className="text-brand-text">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-espresso py-16 sm:py-24 text-ivory">
        <div className="absolute inset-0 z-0 bg-radial from-transparent via-espresso/40 to-espresso opacity-90 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="mx-auto mb-3 flex items-center justify-center gap-2.5">
            <span className="h-px w-8 bg-gold" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
              Atelier & Boutique
            </span>
            <span className="h-px w-8 bg-gold" />
          </div>

          <h1 className="serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-ivory">
            Visit <span className="italic font-serif text-gold-light">Shaan·e·Taj</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm text-ivory/80 font-light leading-relaxed">
            Rooted in Jalandhar, Punjab — our boutique invites patrons from India and abroad to experience exquisite bridal silhouettes, royal embroideries, and personalized couture tailoring.
          </p>
        </div>
      </section>

      {/* 2. Main Grid: Boutique Info + Interactive Form */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Boutique Information & Location (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Atelier Card */}
            <div className="rounded-xs border border-brand-border/80 bg-white p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-brand-border/60 pb-3">
                <span className="h-2 w-2 rounded-full bg-gold" />
                <h2 className="serif text-xl sm:text-2xl text-espresso font-normal">
                  Our Jalandhar Boutique
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-xs sm:text-sm text-brand-muted">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dark font-medium mb-1">
                    Boutique Address
                  </p>
                  <p className="font-medium text-brand-text leading-relaxed">
                    {siteConfig.legalName}
                    <br />
                    {store.storeAddressLine1}, {store.storeAddressLine2}
                    <br />
                    {store.storeLandmark}
                    <br />
                    Punjab, India — PIN: {store.storePincode}
                  </p>
                </div>

                <div className="pt-2 border-t border-brand-border/40">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dark font-medium mb-1">
                    Atelier Timings
                  </p>
                  <p className="text-brand-text">
                    <span className="font-medium">Weekdays (Mon–Sat):</span> {store.storeHoursWeekdays || "11:00 AM – 7:00 PM"}
                    <br />
                    <span className="font-medium">Sunday:</span> {store.storeHoursSunday || "By Prior Appointment"}
                  </p>
                </div>

                <div className="pt-2 border-t border-brand-border/40">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dark font-medium mb-1">
                    Direct Contact
                  </p>
                  <p className="text-brand-text">
                    Phone:{" "}
                    <a href={`tel:+91${phone}`} className="font-medium text-rose-dark hover:underline">
                      +91 {phone}
                    </a>
                    <br />
                    Email:{" "}
                    <a href={`mailto:${siteConfig.email}`} className="font-medium text-rose-dark hover:underline">
                      {siteConfig.email}
                    </a>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={store.storeMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury-primary flex-1 min-h-[44px] rounded-xs px-4 py-2.5 text-center text-[10px] uppercase tracking-[0.16em] font-medium shadow-xs"
                >
                  <span>Get Directions ↗</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury-whatsapp flex-1 min-h-[44px] rounded-xs px-4 py-2.5 text-center text-[10px] uppercase tracking-[0.16em] font-medium"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Bespoke Assistance Callout */}
            <div className="rounded-xs border border-gold/40 bg-ivory-2/70 p-6 shadow-2xs">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold-dark font-semibold">
                Personalized Styling Consultation
              </span>
              <h3 className="serif mt-1 text-xl text-brand-text">
                Need Help Choosing Your Ensemble?
              </h3>
              <p className="mt-2 text-xs text-brand-muted font-light leading-relaxed">
                Whether you are ordering custom measurements for an upcoming wedding or looking for a ready-to-ship outfit, our master stylists guide you through live video trials and fabric swatch previews on WhatsApp.
              </p>
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent("Hello! I would like personal styling assistance from Shaan-e-Taj.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-rose-dark hover:text-espresso underline underline-offset-4 transition"
              >
                <span>Book a Virtual Consultation</span>
                <span>→</span>
              </a>
            </div>

            {/* Social Proof & Channel Links */}
            <div className="pt-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-subtle font-medium mb-3">
                Follow Shaan-e-Taj Online
              </p>
              <SocialLinks />
            </div>
          </div>

          {/* Right Column: Interactive Boutique Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
