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
          className="rounded-sm bg-rose px-10 py-4 text-center text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-rose-dark"
        >
          Order Now
        </Link>
        <a
          href={whatsAppUrl(
            "Hi Shaan-e-Taj! I would like to place an order from your new arrivals. Please help me."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-sm bg-[#25D366] px-10 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-[#1ea855]"
        >
          <span className="text-lg leading-none">+</span>
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
