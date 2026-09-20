"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartLink } from "./CartLink";
import { NavAuth } from "./NavAuth";

const primaryLinks = [
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/collections", label: "Collections" },
  { href: "/catalog", label: "Catalog" },
  { href: "/custom-stitching", label: "Custom Stitching" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Ensure mobile menu closes automatically when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-brand-border/80 bg-ivory/95 backdrop-blur-md shadow-xs py-0"
          : "border-b border-brand-border/40 bg-ivory/90 backdrop-blur-sm py-1"
      }`}
    >
      <div className="mx-auto flex h-[64px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link
          href="/"
          className="group flex flex-col items-start justify-center cursor-pointer select-none py-1 focus:outline-none"
          aria-label="Shaan-e-Taj Homepage"
        >
          <span className="serif text-[22px] font-normal tracking-[0.14em] text-brand-text group-hover:text-espresso transition-colors">
            Shaan<span className="text-gold">·</span>e·Taj
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-medium -mt-0.5">
            Jalandhar
          </span>
        </Link>

        <ul className="hidden items-center gap-6 lg:gap-8 md:flex">
          {primaryLinks.map((l) => {
            const isActive = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`nav-link-royal text-[11px] uppercase tracking-[0.16em] transition-colors py-1 ${
                    isActive ? "text-espresso font-medium active" : "text-brand-muted hover:text-espresso"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 sm:gap-4">
          <NavAuth />
          <CartLink />
          <Link
            href="/catalog"
            className="btn-luxury-primary hidden rounded-xs px-5 py-2 text-[10px] uppercase tracking-[0.18em] font-medium sm:inline-flex"
          >
            <span>Shop</span>
            <span className="arrow-shift ml-1.5 text-gold">→</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-xs border border-brand-border text-brand-text md:hidden transition hover:border-gold"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-brand-border/80 bg-ivory/98 px-6 py-6 shadow-md md:hidden animate-editorial-reveal">
          <ul className="flex flex-col space-y-4">
            {primaryLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-[0.18em] text-brand-text hover:text-rose-dark py-1 font-medium transition"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-4 border-t border-brand-border/70 flex flex-col gap-2.5">
              <Link
                href="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-luxury-primary w-full py-3 rounded-xs text-center text-xs uppercase tracking-[0.18em] font-medium"
              >
                <span>Shop Full Catalog</span>
                <span className="arrow-shift ml-2 text-gold">→</span>
              </Link>
              <Link
                href="/custom-stitching"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-luxury-outline w-full py-3 rounded-xs text-center text-xs uppercase tracking-[0.18em] font-medium"
              >
                Custom Stitching
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

