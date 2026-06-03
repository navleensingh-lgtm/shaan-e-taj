import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getPublicStoreSettings, formatStoreAddress } from "@/lib/store-settings";
import { SocialLinks } from "@/components/SocialLinks";
import { ContactWhatsAppButton } from "@/components/ContactWhatsAppButton";

export default async function ContactPage() {
  const store = await getPublicStoreSettings();
  const fullAddress = formatStoreAddress(store);

  return (
    <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Reach Out</p>
      <h1 className="serif mt-3 text-4xl">Contact {siteConfig.brand}</h1>
      <p className="mt-2 text-sm text-brand-muted">{siteConfig.legalName}</p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-6 text-sm text-brand-muted">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-rose">Visit our boutique</p>
            <p className="mt-3 leading-relaxed text-brand-text">
              <strong>{store.storeAddressLine1}</strong>
              <br />
              {store.storeAddressLine2}
              <br />
              {store.storeLandmark}
              <br />
              PIN: {store.storePincode}
            </p>
            {store.storePhone && (
              <p className="mt-2">
                Phone:{" "}
                <a href={`tel:${store.storePhone}`} className="text-rose underline">
                  {store.storePhone}
                </a>
              </p>
            )}
            <a
              href={store.storeMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-sm border border-rose px-4 py-2 text-[11px] uppercase tracking-wider text-rose"
            >
              Open in Google Maps →
            </a>
          </div>

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
            {store.storeHoursWeekdays}
            <br />
            {store.storeHoursSunday}
          </p>
          <p className="text-xs text-brand-subtle">{fullAddress}</p>
          <SocialLinks />
        </div>
        <div className="space-y-4">
          <ContactWhatsAppButton />
          <a
            href={store.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-sm border border-brand-border px-6 py-4 text-center text-[11px] uppercase tracking-wider"
          >
            Watch on YouTube
          </a>
          <a
            href={store.instagramUrl}
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
