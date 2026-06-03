"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useOrderPricing } from "@/hooks/useOrderPricing";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { OrderPricingSummary } from "@/components/OrderPricingSummary";
import { StitchingSelector } from "@/components/StitchingSelector";

export default function CartPage() {
  const { items, updateQty, removeItem, stitchingType, setStitchingType, count } = useCart();
  const pricing = useOrderPricing();
  const settings = useStoreSettings();

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="serif text-4xl">Cart ({count})</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-brand-muted">
          Your cart is empty.{" "}
          <Link href="/catalog" className="text-rose underline">
            Browse catalog
          </Link>
        </p>
      ) : (
        <>
          <ul className="mt-8 space-y-4">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4 border border-brand-border bg-white p-4">
                <div className="relative h-24 w-20 shrink-0 bg-ivory-2">
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt="" fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/product/${item.slug}`} className="serif text-lg">
                    {item.name}
                  </Link>
                  <p className="text-rose-dark">
                    ₹{(item.priceInPaise / 100).toLocaleString("en-IN")} each
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="border px-2"
                      onClick={() => updateQty(item.productId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      className="border px-2"
                      onClick={() => updateQty(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-auto text-xs text-rose"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-6 rounded-sm border border-brand-border bg-white p-5">
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
              shippingPaise={pricing.shippingPaise}
              totalPaise={pricing.totalPaise}
              stitchingType={stitchingType}
            />
          </div>

          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-sm bg-rose py-4 text-center text-[11px] uppercase tracking-wider text-white"
          >
            Proceed to Checkout
          </Link>
        </>
      )}
    </section>
  );
}
