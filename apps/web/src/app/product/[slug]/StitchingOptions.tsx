"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { orderMessage, whatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/api";

type Product = {
  id: string;
  slug: string;
  name: string;
  mainCategory: string;
  fabric?: string | null;
  color?: string | null;
  priceInPaise: number;
  stitchingAvailable: boolean;
};

export function StitchingOptions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const price = product.priceInPaise / 100;

  function orderNow() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceInPaise: product.priceInPaise,
    });
    router.push("/cart");
  }

  return (
    <div id="stitching" className="mt-8">
      {product.stitchingAvailable && (
        <>
          <p className="text-[11px] uppercase tracking-[0.15em] text-brand-muted">Stitching</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {["Unstitched", "Fully Stitched"].map((label) => (
              <span key={label} className="rounded-sm border border-brand-border px-3 py-2">
                {label}
              </span>
            ))}
          </div>
        </>
      )}
      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={orderNow}
          className="w-full rounded-sm bg-rose py-3 text-[11px] uppercase tracking-wider text-white"
        >
          Order Now
        </button>
        <a
          href={whatsAppUrl(
            orderMessage({
              name: product.name,
              slug: product.slug,
              category: product.mainCategory.replace(/_/g, " "),
              price,
              fabric: product.fabric,
              color: product.color,
            })
          )}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { productId: product.id })}
          className="flex w-full items-center justify-center gap-1.5 rounded-sm bg-[#25D366] py-3 text-[11px] uppercase tracking-wider text-white"
        >
          <span className="text-base leading-none">+</span>
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
