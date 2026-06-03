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
  const pricing = useProductPricing(product.priceInPaise, stitching);

  function orderNow() {
    setStitchingType(stitching);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceInPaise: product.priceInPaise,
    });
    router.push("/cart");
  }

  const whatsappHref = orderWhatsAppUrl({
    name: product.name,
    slug: product.slug,
    price: product.priceInPaise / 100,
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
