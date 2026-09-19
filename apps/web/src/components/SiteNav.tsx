"use client";

import { useState } from "react";
import Link from "next/link";
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

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-brand-border bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <div>
          <Link href="/" className="serif text-[22px] font-medium tracking-[0.12em] text-brand-text">
            Shaan<span className="text-gold-dark">·</span>e·Taj
          </Link>
          <p className="text-[9px] uppercase tracking-[0.15em] text-brand-subtle">Jalandhar</p>
        </div>

        <ul className="hidden items-center gap-6 lg:gap-7 md:flex">
          {primaryLinks.map((l) => (
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

        <div className="flex items-center gap-3 sm:gap-4">
          <NavAuth />
          <CartLink />
          <Link
            href="/catalog"
            className="hidden rounded-sm bg-rose px-5 py-2 text-[11px] uppercase tracking-[0.15em] text-white sm:inline-block"
          >
            Shop
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-brand-border text-brand-text md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-brand-border bg-ivory px-5 py-4 md:hidden">
          <ul className="flex flex-col space-y-3">
            {primaryLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-[0.15em] text-brand-muted hover:text-rose-dark py-1"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-brand-border/60">
              <Link
                href="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-block rounded-sm bg-rose px-4 py-2 text-xs uppercase tracking-[0.15em] text-white"
              >
                Shop Full Catalog
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

