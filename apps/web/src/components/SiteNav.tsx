import Image from "next/image";
import Link from "next/link";
import { CartLink } from "./CartLink";

const primaryLinks = [
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/catalog", label: "Catalog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-brand-border bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Shaan·e·Taj Jalandhar"
            width={140}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
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

        <div className="flex items-center gap-4">
          <CartLink />
          <Link
            href="/catalog"
            className="hidden rounded-sm bg-rose px-5 py-2 text-[11px] uppercase tracking-[0.15em] text-white sm:inline-block"
          >
            Shop
          </Link>
        </div>
      </div>
    </nav>
  );
}
