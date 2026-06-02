import Link from "next/link";
import { CartLink } from "./CartLink";
import { siteConfig } from "@/lib/site-config";

const links = [
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/bridal", label: "Bridal" },
  { href: "/party-wear", label: "Party Wear" },
  { href: "/festive", label: "Festive" },
  { href: "/custom-stitching", label: "Custom Stitching" },
  { href: "/catalog", label: "Catalog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-brand-border bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <div>
          <Link href="/" className="serif text-[22px] font-medium tracking-[0.12em] text-brand-text">
            Shaan<span className="text-gold-dark">·</span>e·Taj
          </Link>
          <p className="text-[9px] uppercase tracking-[0.15em] text-brand-subtle">Jalandhar</p>
        </div>
        <ul className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-[11px] uppercase tracking-[0.15em] text-brand-muted transition hover:text-rose-dark"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-[11px] uppercase tracking-wider text-brand-muted hover:text-rose-dark sm:inline"
            aria-label="Instagram"
          >
            IG
          </a>
          <a
            href={siteConfig.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-[11px] uppercase tracking-wider text-brand-muted hover:text-rose-dark sm:inline"
            aria-label="YouTube"
          >
            YT
          </a>
          <CartLink />
          <Link
            href="/wishlist"
            className="text-[11px] uppercase tracking-[0.12em] text-brand-muted hover:text-rose-dark"
          >
            Wishlist
          </Link>
          <Link
            href="/orders"
            className="rounded-sm bg-rose px-5 py-2 text-[11px] uppercase tracking-[0.15em] text-white"
          >
            My Orders
          </Link>
        </div>
      </div>
    </nav>
  );
}
