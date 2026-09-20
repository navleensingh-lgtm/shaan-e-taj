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
import { SizeGuideModal } from "@/components/SizeGuideModal";
import { resolveSizeGuide } from "@/lib/size-guide";
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
  useMasterSizeGuide?: boolean | null;
  sizeGuide?: unknown;
};

export function StitchingOptions({ product }: { product: Product }) {
  const { addItem, setStitchingType } = useCart();
  const router = useRouter();
  const settings = useStoreSettings();
  const [stitching, setStitching] = useState<StitchingChoice>("UNSTITCHED");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const pricing = useProductPricing(product.priceInPaise, stitching, quantity);

  const resolvedGuide = resolveSizeGuide(product);

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

      {/* Size Guide Trigger */}
      <div className="mb-4 flex items-center justify-between border-b border-brand-border/60 pb-3">
        <div className="flex items-center gap-1.5 text-xs text-brand-muted">
          <svg className="h-4 w-4 text-gold-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <span className="uppercase tracking-wider text-[10px] font-medium text-brand-text">
            {product.useMasterSizeGuide === false ? "Custom Product Sizing" : "Standard Fit Guide"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setSizeGuideOpen(true);
            trackEvent("size_guide_open", { productId: product.id });
          }}
          className="group inline-flex items-center gap-1.5 rounded-sm border border-rose/40 bg-ivory-2/70 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-rose-dark transition hover:border-rose hover:bg-rose hover:text-white"
        >
          <span>📏</span>
          <span>Size Guide</span>
        </button>
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

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        guide={resolvedGuide}
        productName={product.name}
        categoryName={product.subCategory || product.mainCategory}
      />
    </div>
  );
}
