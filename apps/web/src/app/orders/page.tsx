"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { OrderTracking } from "@/components/OrderTracking";
import { getDeliveryEstimate } from "@/lib/order-tracking";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalPaise: number;
  createdAt: string;
  stitchingType?: string | null;
  trackingNumber?: string | null;
  trackingCarrier?: string | null;
  trackingUrl?: string | null;
  shippedAt?: string | null;
  estimatedDeliveryAt?: string | null;
  items: { name: string; quantity: number; pricePaise: number }[];
};

const CANCELLABLE = new Set(["PENDING", "CONFIRMED"]);

function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

export default function OrdersPage() {
  const { status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadOrders = useCallback(() => {
    apiFetch("/orders")
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => setOrders([]));
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    loadOrders();
  }, [status, loadOrders]);

  async function cancelOrder(orderId: string) {
    if (!confirm("Cancel this order?")) return;
    setError("");
    setCancellingId(orderId);
    try {
      await apiFetch(`/orders/${orderId}/cancel`, { method: "POST" });
      loadOrders();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not cancel order");
    } finally {
      setCancellingId(null);
    }
  }

  if (status === "unauthenticated") {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="serif text-4xl">My Orders</h1>
        <Link href="/login?callbackUrl=/orders" className="mt-8 inline-block text-rose underline">
          Sign in to view orders
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="serif text-4xl">My Orders</h1>
      <p className="mt-2 text-sm text-brand-muted">
        Track shipping, delivery estimate, and courier details here.
      </p>
      {error && <p className="mt-4 text-sm text-rose">{error}</p>}
      <div className="mt-8 space-y-4">
        {orders.length === 0 && (
          <p className="text-brand-muted">
            No orders yet.{" "}
            <Link href="/catalog" className="text-rose underline">
              Shop now
            </Link>
          </p>
        )}
        {orders.map((o) => {
          const headline = getDeliveryEstimate(o);
          return (
            <div key={o.id} className="border border-brand-border bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2 text-sm">
                <strong>{o.orderNumber}</strong>
                <span
                  className={`uppercase ${
                    o.status === "CANCELLED"
                      ? "text-rose"
                      : o.status === "SHIPPED"
                        ? "text-gold-dark"
                        : "text-brand-subtle"
                  }`}
                >
                  {statusLabel(o.status)}
                </span>
              </div>
              {headline && o.status !== "CANCELLED" && (
                <p className="mt-2 text-sm font-medium text-rose-dark">{headline}</p>
              )}
              <p className="mt-1 text-xs text-brand-subtle">
                Placed {new Date(o.createdAt).toLocaleString("en-IN")}
              </p>
              <p className="mt-2 font-medium text-rose-dark">
                ₹{(o.totalPaise / 100).toLocaleString("en-IN")}
              </p>
              {o.stitchingType && (
                <p className="mt-1 text-xs text-brand-muted">
                  Stitching: {o.stitchingType.replace(/_/g, " ")}
                </p>
              )}
              <ul className="mt-3 text-sm text-brand-muted">
                {o.items.map((i, idx) => (
                  <li key={idx}>
                    {i.name} × {i.quantity}
                  </li>
                ))}
              </ul>

              <OrderTracking order={o} />

              {CANCELLABLE.has(o.status) && (
                <button
                  type="button"
                  disabled={cancellingId === o.id}
                  onClick={() => cancelOrder(o.id)}
                  className="mt-4 rounded-sm border border-rose px-4 py-2 text-[11px] uppercase tracking-wider text-rose hover:bg-rose hover:text-white disabled:opacity-50"
                >
                  {cancellingId === o.id ? "Cancelling…" : "Cancel order"}
                </button>
              )}
              {o.status === "CANCELLED" && (
                <p className="mt-3 text-xs text-brand-subtle">This order was cancelled.</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
