import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-brand-text px-5 py-14 text-ivory-2 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <p className="serif text-[26px] tracking-wide">
            Shaan<span className="text-gold">·</span>e·Taj
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-subtle">
            Luxury Indian couture from Faridabad. Every piece a legacy, every stitch a story.
          </p>
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
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Account</p>
          <ul className="mt-4 space-y-2 text-sm text-brand-subtle">
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/account">My Account</Link></li>
            <li><Link href="/wishlist">Wishlist</Link></li>
            <li><Link href="/orders">Order History</Link></li>
            <li><Link href="/admin">Admin</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-brand-subtle">
        © {new Date().getFullYear()} Shaan-e-Taj. Made with care in Faridabad.
      </p>
    </footer>
  );
}
