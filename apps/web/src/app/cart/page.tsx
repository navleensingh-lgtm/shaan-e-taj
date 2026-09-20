"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useOrderPricing } from "@/hooks/useOrderPricing";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { useCurrency } from "@/context/CurrencyContext";
import { OrderPricingSummary } from "@/components/OrderPricingSummary";
import { StitchingSelector } from "@/components/StitchingSelector";

export default function CartPage() {
  const { items, updateQty, removeItem, stitchingType, setStitchingType, count } = useCart();
  const pricing = useOrderPricing();
  const settings = useStoreSettings();
  const { formatPrice } = useCurrency();

  return (
    <section className="mx-auto max-w-3xl px-3.5 py-6 sm:px-6 sm:py-16">
      <h1 className="serif text-3xl sm:text-4xl">Cart ({count})</h1>
      {items.length === 0 ? (
        <p className="mt-6 sm:mt-8 text-brand-muted">
          Your cart is empty.{" "}
          <Link href="/catalog" className="text-rose underline">
            Browse catalog
          </Link>
        </p>
      ) : (
        <>
          <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 sm:gap-4 rounded-xs border border-brand-border bg-white p-3 sm:p-4 shadow-2xs">
                <div className="relative h-28 w-20 sm:h-24 sm:w-20 shrink-0 overflow-hidden rounded-xs bg-ivory-2 border border-brand-border/60">
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt="" fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${item.slug}`} className="serif text-base sm:text-lg font-medium text-brand-text hover:text-rose-dark line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm sm:text-base font-semibold text-rose-dark">
                      {formatPrice(item.priceInPaise)}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className="flex h-9 w-9 items-center justify-center rounded-xs border border-brand-border text-base hover:border-gold active:scale-95 cursor-pointer bg-white"
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="min-w-[2ch] text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        className="flex h-9 w-9 items-center justify-center rounded-xs border border-brand-border text-base hover:border-gold active:scale-95 cursor-pointer bg-white"
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="min-h-[36px] px-2 text-xs font-medium text-rose hover:text-rose-dark"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 sm:mt-8 space-y-5 sm:space-y-6 rounded-xs border border-brand-border bg-white p-4 sm:p-5 shadow-2xs">
            <StitchingSelector
              value={stitchingType}
              onChange={setStitchingType}
              stitchChargeRupees={
                settings ? settings.fullStitchChargePaise / 100 : undefined
              }
            />
            <OrderPricingSummary
              subtotalPaise={pricing.subtotalPaise}
              stitchingPaise={pricing.stitchingPaise}
              stitchingPerUnitPaise={pricing.stitchingPerUnitPaise}
              itemQuantity={pricing.itemQuantity}
              shippingPaise={pricing.shippingPaise}
              totalPaise={pricing.totalPaise}
              stitchingType={stitchingType}
            />
          </div>

          <Link
            href="/checkout"
            className="btn-luxury-primary mt-6 block w-full min-h-[48px] rounded-xs py-4 text-center text-[11px] uppercase tracking-[0.2em] font-medium"
          >
            <span>Proceed to Checkout</span>
            <span className="arrow-shift ml-2 text-gold">→</span>
          </Link>
        </>
      )}
    </section>
  );
}
