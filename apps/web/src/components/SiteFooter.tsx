import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getPublicStoreSettings, formatStoreAddress } from "@/lib/store-settings";
import { SocialLinksFooter } from "@/components/SocialLinks";

const shopLinks = [
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/bridal", label: "Bridal" },
  { href: "/party-wear", label: "Party Wear" },
  { href: "/festive", label: "Festive" },
  { href: "/catalog", label: "Full Catalog" },
  { href: "/custom-stitching", label: "Custom Stitching" },
];

const accountLinks = [
  { href: "/cart", label: "Cart" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/orders", label: "My Orders" },
  { href: "/account", label: "Account" },
  { href: "/login", label: "Login" },
];

export async function SiteFooter() {
  const store = await getPublicStoreSettings();
  const fullAddress = formatStoreAddress(store);

  return (
    <footer className="mt-20 bg-brand-text px-5 py-14 text-ivory-2 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <p className="serif text-[26px] tracking-wide">
            Shaan<span className="text-gold">·</span>e·Taj
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">
            {siteConfig.legalName}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-subtle">
            {siteConfig.description}
          </p>
          <div className="mt-5">
            <SocialLinksFooter />
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Collections</p>
          <ul className="mt-4 space-y-2 text-sm text-brand-subtle">
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Your account</p>
          <ul className="mt-4 space-y-2 text-sm text-brand-subtle">
            {accountLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-gold">Info</p>
          <ul className="mt-3 space-y-2 text-sm text-brand-subtle">
            <li>
              <Link href="/about" className="hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Contact</p>
          <p className="mt-3 text-sm text-brand-subtle">
            <a href={`tel:+91${store.storePhone || "9464385993"}`} className="hover:text-gold">
              {store.storePhone || "9464385993"}
            </a>
            {" · "}
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold"
            >
              WhatsApp
            </a>
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-gold">Visit us</p>
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
          <ul className="mt-5 space-y-2 text-sm text-brand-subtle">
            <li>
              <a href={store.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                YouTube
              </a>
            </li>
            <li>
              <a href={store.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-brand-subtle">
        © {new Date().getFullYear()} {siteConfig.brand} · {fullAddress}
      </p>
    </footer>
  );
}
