"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { apiFetch } from "@/lib/api-client";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const STITCHING = [
  { value: "", label: "Unstitched" },
  { value: "FULLY_STITCHED", label: "Fully Stitched" },
] as const;

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { items, clear, totalPaise } = useCart();
  const router = useRouter();
  const [stitching, setStitching] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  async function pay() {
    setLoading(true);
    setError("");
    try {
      const checkout = await apiFetch("/orders/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          stitchingType: stitching || undefined,
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
        prefill: { email: session?.user?.email ?? "" },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg px-5 py-16">
      <h1 className="serif text-4xl">Checkout</h1>
      <p className="mt-4 text-lg text-rose-dark">
        Total: ₹{(totalPaise / 100).toLocaleString("en-IN")}
      </p>
      <div className="mt-6">
        <p className="text-[11px] uppercase tracking-wider text-brand-muted">Stitching</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STITCHING.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStitching(s.value)}
              className={`rounded-sm border px-3 py-2 text-sm ${
                stitching === s.value ? "border-rose bg-rose text-white" : ""
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-rose">{error}</p>}
      <button
        type="button"
        disabled={loading}
        onClick={pay}
        className="mt-8 w-full rounded-sm bg-rose py-4 text-[11px] uppercase tracking-wider text-white disabled:opacity-60"
      >
        {loading ? "Processing…" : "Pay with Razorpay"}
      </button>
    </section>
  );
}
