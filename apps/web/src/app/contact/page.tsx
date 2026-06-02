"use client";

import { siteConfig, whatsAppLink } from "@/lib/site-config";
import { SocialLinks } from "@/components/SocialLinks";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Reach Out</p>
      <h1 className="serif mt-3 text-4xl">Contact {siteConfig.brand}</h1>
      <p className="mt-2 text-sm text-brand-muted">{siteConfig.legalName}</p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-6 text-sm text-brand-muted">
          <p>
            <strong className="text-brand-text">Boutique</strong>
            <br />
            {siteConfig.city}, {siteConfig.state}
            <br />
            {siteConfig.country}
          </p>
          <p>
            <strong className="text-brand-text">Email</strong>
            <br />
            <a href={`mailto:${siteConfig.email}`} className="text-rose underline">
              {siteConfig.email}
            </a>
          </p>
          <p>
            <strong className="text-brand-text">Hours</strong>
            <br />
            {siteConfig.hours.weekdays}
            <br />
            {siteConfig.hours.sunday}
          </p>
          <SocialLinks />
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() =>
              window.open(
                whatsAppLink("Hello Shaan-e-Taj! I have an enquiry about your collection."),
                "_blank"
              )
            }
            className="w-full rounded-sm bg-[#25D366] px-6 py-4 text-[11px] uppercase tracking-wider text-white"
          >
            Message on WhatsApp
          </button>
          <a
            href={siteConfig.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-sm border border-brand-border px-6 py-4 text-center text-[11px] uppercase tracking-wider"
          >
            Watch on YouTube
          </a>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-sm border border-brand-border px-6 py-4 text-center text-[11px] uppercase tracking-wider"
          >
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
