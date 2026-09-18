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
  { href: "/orders", label: "Orders" },
  { href: "/account", label: "Account" },
  { href: "/login", label: "Login" },
];

const infoLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function SiteFooter() {
  const store = await getPublicStoreSettings();
  const fullAddress = formatStoreAddress(store);

  return (
    <footer className="mt-12 bg-brand-text px-4 py-7 text-ivory-2 sm:px-5 md:py-9">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="serif text-xl tracking-wide sm:text-2xl">
              Shaan<span className="text-gold">·</span>e·Taj
            </p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-gold sm:text-[10px]">
              {siteConfig.legalName}
            </p>
            <p className="mt-2 hidden max-w-xs text-xs leading-relaxed text-brand-subtle sm:block">
              {siteConfig.description}
            </p>
            <div className="mt-3">
              <SocialLinksFooter />
            </div>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gold">Shop</p>
            <ul className="mt-2 space-y-1 text-xs text-brand-subtle sm:text-sm">
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
            <p className="text-[9px] uppercase tracking-[0.2em] text-gold">Account</p>
            <ul className="mt-2 space-y-1 text-xs text-brand-subtle sm:text-sm">
              {accountLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-3 space-y-1 text-xs text-brand-subtle sm:hidden">
              {infoLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gold">Contact</p>
            <p className="mt-2 text-xs text-brand-subtle sm:text-sm">
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
            <p className="mt-2 text-xs leading-snug text-brand-subtle sm:text-sm">
              {store.storeAddressLine1}, {store.storeAddressLine2} · PIN {store.storePincode}
            </p>
            <a
              href={store.storeMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-[10px] uppercase tracking-wider text-gold underline"
            >
              Directions
            </a>
            <ul className="mt-2 hidden space-y-1 text-xs text-brand-subtle sm:block sm:text-sm">
              {infoLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-5 border-t border-white/10 pt-4 text-[10px] leading-relaxed text-brand-subtle sm:text-xs">
          © {new Date().getFullYear()} {siteConfig.brand} · {fullAddress}
          {" · "}
          <Link href="/admin/login" className="text-gold/80 underline hover:text-gold">
            Staff Login
          </Link>
        </p>
      </div>
    </footer>
  );
}
