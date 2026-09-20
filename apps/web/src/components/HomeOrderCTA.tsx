import Link from "next/link";
import { whatsAppUrl } from "@/lib/whatsapp";

export function HomeOrderCTA() {
  return (
    <div className="mt-14 border-t border-brand-border pt-12">
      <p className="text-center text-[10px] uppercase tracking-[0.3em] text-rose">Shop your way</p>
      <h3 className="serif mt-3 text-center text-2xl text-brand-text md:text-3xl">
        Ready to order?
      </h3>
      <p className="mx-auto mt-3 max-w-md text-center text-sm text-brand-muted">
        Pay securely on our website or message us on WhatsApp — we are happy to help.
      </p>
      <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
        <Link
          href="/catalog"
          className="btn-luxury-primary group rounded-xs px-10 py-4 text-center text-[11px] uppercase tracking-[0.2em] font-medium"
        >
          <span>Order Now</span>
          <span className="arrow-shift ml-2 text-gold">→</span>
        </Link>
        <a
          href={whatsAppUrl(
            "Hi Shaan-e-Taj! I would like to place an order from your new arrivals. Please help me."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-luxury-whatsapp flex items-center justify-center gap-2 rounded-xs px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-medium"
        >
          <span className="text-base leading-none">💬</span>
          <span>Order on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
