"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useProductPricing } from "@/hooks/useOrderPricing";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { orderWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/api";
import { OrderPricingSummary } from "@/components/OrderPricingSummary";
import { StitchingSelector } from "@/components/StitchingSelector";
import type { StitchingChoice } from "@/lib/order-pricing";

type Product = {
  id: string;
  slug: string;
  name: string;
  mainCategory: string;
  subCategory?: string;
  fabric?: string | null;
  color?: string | null;
  priceInPaise: number;
  stitchingAvailable: boolean;
};

export function StitchingOptions({ product }: { product: Product }) {
  const { addItem, setStitchingType } = useCart();
  const router = useRouter();
  const settings = useStoreSettings();
  const [stitching, setStitching] = useState<StitchingChoice>("UNSTITCHED");
  const [quantity, setQuantity] = useState(1);
  const pricing = useProductPricing(product.priceInPaise, stitching, quantity);

  function orderNow() {
    setStitchingType(stitching);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceInPaise: product.priceInPaise,
    }, quantity);
    router.push("/cart");
  }

  const whatsappHref = orderWhatsAppUrl({
    name: product.name,
    slug: product.slug,
    price: pricing.subtotalPaise / 100,
    quantity,
    category: product.mainCategory.replace(/_/g, " "),
    style: product.subCategory?.replace(/_/g, " "),
    fabric: product.fabric,
    color: product.color,
    sku: product.slug,
    stitchingType: stitching,
    stitchingCharge: pricing.stitchingPaise / 100,
    shippingCharge: pricing.shippingPaise / 100,
    totalPrice: pricing.totalPaise / 100,
  });

  return (
    <div id="stitching" className="mt-8">
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-wider text-brand-muted">Quantity</p>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-9 w-9 rounded-sm border border-brand-border text-lg leading-none hover:border-rose"
          >
            −
          </button>
          <span className="min-w-[2ch] text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-9 w-9 rounded-sm border border-brand-border text-lg leading-none hover:border-rose"
          >
            +
          </button>
        </div>
      </div>

      {product.stitchingAvailable && (
        <StitchingSelector
          value={stitching}
          onChange={setStitching}
          stitchChargeRupees={
            settings ? settings.fullStitchChargePaise / 100 : undefined
          }
        />
      )}

      <div className="mt-6 rounded-sm border border-brand-border bg-white p-4">
        <OrderPricingSummary
          subtotalPaise={pricing.subtotalPaise}
          stitchingPaise={pricing.stitchingPaise}
          stitchingPerUnitPaise={pricing.stitchingPerUnitPaise}
          itemQuantity={pricing.itemQuantity}
          shippingPaise={pricing.shippingPaise}
          totalPaise={pricing.totalPaise}
          stitchingType={stitching}
          compact
        />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={orderNow}
          className="w-full rounded-sm bg-rose py-3 text-[11px] uppercase tracking-wider text-white"
        >
          Order Now
        </button>
        <a
          href={whatsappHref}
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
