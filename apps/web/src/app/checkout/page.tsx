"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOrderPricing } from "@/hooks/useOrderPricing";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { apiFetch } from "@/lib/api-client";
import { AddressFields } from "@/components/AddressFields";
import { OrderPricingSummary } from "@/components/OrderPricingSummary";
import { StitchingSelector } from "@/components/StitchingSelector";
import { emptyAddress, validateAddress, type AddressInput } from "@/lib/checkout-address";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { items, clear, stitchingType, setStitchingType, count } = useCart();
  const pricing = useOrderPricing();
  const settings = useStoreSettings();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shipping, setShipping] = useState<AddressInput>(emptyAddress());
  const [billing, setBilling] = useState<AddressInput>(emptyAddress());
  const [billingSame, setBillingSame] = useState(true);
  const [orderNotes, setOrderNotes] = useState("");

  useEffect(() => {
    if (!session?.user) return;
    setShipping((s) => ({
      ...s,
      fullName: session.user?.name ?? s.fullName,
      email: session.user?.email ?? s.email,
    }));
  }, [session]);

  if (status === "loading") {
    return <p className="p-20 text-center text-brand-muted">Loading…</p>;
  }

  if (status === "unauthenticated") {
    return (
      <section className="mx-auto max-w-md px-5 py-20 text-center">
        <p className="text-brand-muted">Please sign in to checkout.</p>
        <Link href="/login?callbackUrl=/checkout" className="mt-4 inline-block text-rose underline">
          Sign in
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-md px-5 py-20 text-center">
        <p>Cart is empty.</p>
        <Link href="/catalog" className="text-rose underline">
          Continue shopping
        </Link>
      </section>
    );
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const shipErr = validateAddress(shipping, "Shipping");
    if (shipErr) {
      setError(shipErr);
      return;
    }
    const billingAddr = billingSame ? shipping : billing;
    const billErr = validateAddress(billingAddr, "Billing");
    if (billErr) {
      setError(billErr);
      return;
    }

    setLoading(true);
    try {
      const checkout = await apiFetch("/orders/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          stitchingType,
          notes: orderNotes.trim() || undefined,
          shipping,
          billing: billingAddr,
          billingSameAsShipping: billingSame,
        }),
      });

      if (checkout.mock || !checkout.razorpayKeyId) {
        await apiFetch("/orders/verify-payment", {
          method: "POST",
          body: JSON.stringify({
            orderId: checkout.orderId,
            razorpayOrderId: checkout.razorpayOrderId,
            razorpayPaymentId: `mock_${Date.now()}`,
            razorpaySignature: "mock",
          }),
        });
        clear();
        router.push("/orders");
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Razorpay failed to load"));
        document.body.appendChild(script);
      });

      const rzp = new window.Razorpay!({
        key: checkout.razorpayKeyId,
        amount: checkout.amountPaise,
        currency: "INR",
        name: "Shaan-e-Taj",
        description: checkout.orderNumber,
        order_id: checkout.razorpayOrderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          await apiFetch("/orders/verify-payment", {
            method: "POST",
            body: JSON.stringify({
              orderId: checkout.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          clear();
          router.push("/orders");
        },
        prefill: {
          name: shipping.fullName,
          email: shipping.email,
          contact: shipping.phone.replace(/\D/g, "").slice(-10),
        },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-5 py-16 lg:px-8">
      <h1 className="serif text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-brand-muted">
        Enter shipping and billing details — we ship pan India from Jalandhar.
      </p>

      <form onSubmit={pay} className="mt-8 space-y-8">
        <div className="rounded-sm border border-brand-border bg-white p-6">
          <AddressFields
            title="Shipping address"
            value={shipping}
            onChange={setShipping}
            idPrefix="ship"
          />
        </div>

        <div className="rounded-sm border border-brand-border bg-white p-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={billingSame}
              onChange={(e) => setBillingSame(e.target.checked)}
              className="rounded border-brand-border"
            />
            Billing address same as shipping
          </label>
          {!billingSame && (
            <div className="mt-6">
              <AddressFields
                title="Billing address"
                value={billing}
                onChange={setBilling}
                idPrefix="bill"
              />
            </div>
          )}
        </div>

        <div className="rounded-sm border border-brand-border bg-white p-6">
          <StitchingSelector
            value={stitchingType}
            onChange={setStitchingType}
            stitchChargeRupees={
              settings ? settings.fullStitchChargePaise / 100 : undefined
            }
          />
        </div>

        <label className="block text-sm">
          Order notes (optional)
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-sm border border-brand-border bg-white px-3 py-2 text-sm"
            placeholder="Delivery instructions, size notes…"
          />
        </label>

        <div className="rounded-sm border border-brand-border bg-white p-6">
          <OrderPricingSummary
            subtotalPaise={pricing.subtotalPaise}
            stitchingPaise={pricing.stitchingPaise}
            stitchingPerUnitPaise={pricing.stitchingPerUnitPaise}
            itemQuantity={pricing.itemQuantity}
            shippingPaise={pricing.shippingPaise}
            totalPaise={pricing.totalPaise}
            stitchingType={stitchingType}
          />
          <p className="mt-2 text-xs text-brand-subtle">{count} item(s) in cart</p>
        </div>

        {error && <p className="text-sm text-rose">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-rose py-4 text-[11px] uppercase tracking-wider text-white disabled:opacity-60"
        >
          {loading ? "Processing…" : "Pay with Razorpay"}
        </button>
      </form>
    </section>
  );
}
