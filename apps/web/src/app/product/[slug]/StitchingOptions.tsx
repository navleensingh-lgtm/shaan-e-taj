"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useProductPricing } from "@/hooks/useOrderPricing";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { orderWhatsAppUrl, contextualWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/api";
import { OrderPricingSummary } from "@/components/OrderPricingSummary";
import { StitchingSelector } from "@/components/StitchingSelector";
import { SizeGuideModal } from "@/components/SizeGuideModal";
import { CustomMeasurementForm } from "@/components/CustomMeasurementForm";
import { resolveSizeGuide } from "@/lib/size-guide";
import type { StitchingChoice } from "@/lib/order-pricing";

export type ProductOptionsProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    sku?: string | null;
    mainCategory: string;
    subCategory?: string;
    fabric?: string | null;
    color?: string | null;
    productType?: string | null;
    fit?: string | null;
    availability?: string | null;
    prepTimeline?: string | null;
    priceInPaise: number;
    stitchingAvailable: boolean;
    useMasterSizeGuide?: boolean | null;
    sizeGuide?: unknown;
    customMeasurements?: { fields?: string[] } | null;
    inStock?: boolean;
  };
};

const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export function StitchingOptions({ product }: ProductOptionsProps) {
  const { addItem, setStitchingType } = useCart();
  const router = useRouter();
  const settings = useStoreSettings();
  
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [stitching, setStitching] = useState<StitchingChoice>("UNSTITCHED");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [measurements, setMeasurements] = useState<Record<string, number>>({});

  const pricing = useProductPricing(product.priceInPaise, stitching, quantity);
  const resolvedGuide = resolveSizeGuide(product);

  const isOutOfStock = product.availability === "OUT_OF_STOCK" || product.inStock === false;
  const isMadeToOrder = product.availability === "MADE_TO_ORDER";
  const isCustom = product.availability === "CUSTOM";
  const isLowStock = product.availability === "LOW_STOCK";

  function orderNow() {
    if (isOutOfStock) return;
    setStitchingType(stitching);
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: `${product.name} (${selectedSize})`,
        priceInPaise: product.priceInPaise,
      },
      quantity
    );
    router.push("/cart");
  }

  const primaryWhatsAppHref = orderWhatsAppUrl({
    name: product.name,
    slug: product.slug,
    sku: product.sku || product.slug,
    price: pricing.subtotalPaise / 100,
    size: selectedSize,
    quantity,
    category: product.mainCategory.replace(/_/g, " "),
    style: product.subCategory?.replace(/_/g, " "),
    fabric: product.fabric,
    color: product.color,
    stitchingType: stitching,
    stitchingCharge: pricing.stitchingPaise / 100,
    shippingCharge: pricing.shippingPaise / 100,
    totalPrice: pricing.totalPaise / 100,
  });

  const customStitchWhatsAppHref = contextualWhatsAppUrl(
    {
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      color: product.color,
      size: selectedSize,
    },
    "CUSTOM_STITCHING"
  );

  const sizeHelpWhatsAppHref = contextualWhatsAppUrl(
    {
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      color: product.color,
      size: selectedSize,
    },
    "SIZE_HELP"
  );

  const urgentWhatsAppHref = contextualWhatsAppUrl(
    {
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      color: product.color,
      size: selectedSize,
    },
    "URGENT"
  );

  return (
    <div id="stitching" className="mt-8">
      {/* 1. Availability Banner */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-y border-brand-border/60 py-3 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isOutOfStock
                ? "bg-red-500"
                : isLowStock
                ? "bg-amber-500 animate-pulse"
                : isMadeToOrder || isCustom
                ? "bg-gold-dark"
                : "bg-emerald-600"
            }`}
          />
          <span className="font-medium tracking-wide uppercase text-[11px] text-brand-text">
            {isOutOfStock
              ? "Out of Stock"
              : isLowStock
              ? "Low Stock — Limited Edition"
              : isMadeToOrder
              ? "Made to Order"
              : isCustom
              ? "Bespoke Custom Tailored"
              : "Ready to Ship"}
          </span>
        </div>

        {product.prepTimeline && (
          <span className="text-[11px] text-brand-muted italic">
            ✦ {product.prepTimeline}
          </span>
        )}
      </div>

      {/* 2. Size Selector + Size Guide Trigger */}
      <div className="mb-5">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-brand-muted">Select Size</span>
            <span className="text-xs font-semibold text-rose-dark">({selectedSize})</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSizeGuideOpen(true);
              trackEvent("size_guide_open", { productId: product.id });
            }}
            className="group inline-flex items-center gap-1.5 text-xs text-rose-dark hover:text-rose underline-offset-4 hover:underline transition"
          >
            <span>📏</span>
            <span className="uppercase tracking-wider text-[11px] font-medium">Size Guide</span>
          </button>
        </div>

        {/* Sizes Buttons */}
        <div className="flex flex-wrap gap-2">
          {STANDARD_SIZES.map((sz) => {
            const isSelected = selectedSize === sz;
            return (
              <button
                key={sz}
                type="button"
                onClick={() => setSelectedSize(sz)}
                className={`min-w-[44px] h-10 rounded-sm border px-3 text-xs font-medium uppercase tracking-wider transition ${
                  isSelected
                    ? "border-rose bg-rose text-white shadow-xs"
                    : "border-brand-border bg-white text-brand-text hover:border-rose/70 hover:bg-ivory-2/40"
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Custom Stitching & Measurement Option */}
      {product.stitchingAvailable && (
        <div className="mb-5">
          <StitchingSelector
            value={stitching}
            onChange={(choice) => {
              setStitching(choice);
              if (choice === "FULLY_STITCHED") {
                setShowMeasurementForm(true);
              }
            }}
            stitchChargeRupees={
              settings ? settings.fullStitchChargePaise / 100 : undefined
            }
          />

          {/* Toggle button for custom measurement form */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowMeasurementForm(!showMeasurementForm)}
              className="text-rose-dark hover:text-rose underline underline-offset-2 flex items-center gap-1"
            >
              <span>{showMeasurementForm ? "Hide" : "+ Add"} Custom Body Measurements</span>
            </button>
            <a
              href={customStitchWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-brand-muted hover:text-gold-dark"
            >
              Tailoring Queries? WhatsApp ↗
            </a>
          </div>

          {/* Expandable Measurement Form */}
          {showMeasurementForm && (
            <CustomMeasurementForm
              configuredFields={product.customMeasurements?.fields}
              values={measurements}
              onChange={setMeasurements}
            />
          )}
        </div>
      )}

      {/* 4. Quantity Selector */}
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-wider text-brand-muted">Quantity</p>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-9 w-9 rounded-sm border border-brand-border text-lg leading-none hover:border-rose transition"
          >
            −
          </button>
          <span className="min-w-[2ch] text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-9 w-9 rounded-sm border border-brand-border text-lg leading-none hover:border-rose transition"
          >
            +
          </button>
        </div>
      </div>

      {/* 5. Pricing Breakdown */}
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

      {/* 6. Primary Action Buttons */}
      <div className="mt-6 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={orderNow}
          disabled={isOutOfStock}
          className={`w-full rounded-sm py-3.5 text-[11px] uppercase tracking-[0.18em] font-medium transition ${
            isOutOfStock
              ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              : "bg-rose text-white hover:bg-rose-dark shadow-xs"
          }`}
        >
          {isOutOfStock
            ? "Currently Out of Stock"
            : isMadeToOrder
            ? "Place Made-to-Order"
            : "Order Now"}
        </button>

        <a
          href={primaryWhatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { productId: product.id })}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] py-3 text-[11px] uppercase tracking-wider text-white shadow-xs hover:bg-[#20bd5a] transition"
        >
          <span className="text-base leading-none">💬</span>
          <span>Order on WhatsApp with Concierge</span>
        </a>
      </div>

      {/* 7. Contextual Assistance Links */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-brand-muted border-t border-brand-border/60 pt-3">
        <a
          href={sizeHelpWhatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-rose-dark transition flex items-center gap-1"
        >
          <span>📏</span> Need Help With Size?
        </a>
        <span className="text-brand-border">•</span>
        <a
          href={urgentWhatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-rose-dark transition flex items-center gap-1"
        >
          <span>⚡</span> Need It Urgently?
        </a>
      </div>

      {/* Size Guide Modal */}
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
