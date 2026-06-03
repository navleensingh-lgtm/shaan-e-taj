import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getPublicStoreSettings, formatStoreAddress } from "@/lib/store-settings";
import { SocialLinksFooter } from "@/components/SocialLinks";

export async function SiteFooter() {
  const store = await getPublicStoreSettings();
  const fullAddress = formatStoreAddress(store);

  return (
    <footer className="mt-20 bg-brand-text px-5 py-14 text-ivory-2 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="serif text-[26px] tracking-wide">
            Shaan<span className="text-gold">·</span>e·Taj
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">
            {siteConfig.legalName}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-subtle">
            {siteConfig.description}
          </p>
          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Visit us</p>
            <p className="mt-3 text-sm leading-relaxed text-brand-subtle">
              {store.storeAddressLine1}
              <br />
              {store.storeAddressLine2}
              <br />
              {store.storeLandmark}
              <br />
              PIN {store.storePincode}
            </p>
            <a
              href={store.storeMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs uppercase tracking-wider text-gold underline"
            >
              Get directions →
            </a>
          </div>
          <div className="mt-5">
            <SocialLinksFooter />
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-brand-subtle">
            <li><Link href="/new-arrivals">New Arrivals</Link></li>
            <li><Link href="/bridal">Bridal Collection</Link></li>
            <li><Link href="/party-wear">Party Wear</Link></li>
            <li><Link href="/catalog">Catalog</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Connect</p>
          <ul className="mt-4 space-y-2 text-sm text-brand-subtle">
            <li>
              <a href={store.youtubeUrl} target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </li>
            <li>
              <a href={store.instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/admin">Admin</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-brand-subtle">
        © {new Date().getFullYear()} {siteConfig.brand} · {fullAddress}
      </p>
    </footer>
  );
}
