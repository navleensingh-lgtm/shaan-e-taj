"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { formatOrderAddresses } from "@/lib/format-order-address";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalPaise: number;
  trackingNumber?: string | null;
  trackingCarrier?: string | null;
  trackingUrl?: string | null;
  cancellationReason?: string | null;
  cancelledAt?: string | null;
  cancelledBy?: string | null;
  shippingName?: string | null;
  shippingPhone?: string | null;
  shippingEmail?: string | null;
  shippingLine1?: string | null;
  shippingLine2?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPincode?: string | null;
  billingName?: string | null;
  billingPhone?: string | null;
  billingLine1?: string | null;
  billingLine2?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingPincode?: string | null;
  user?: { name?: string; email?: string; phone?: string };
};

const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "IN_STITCHING"];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const [form, setForm] = useState({
    status: "SHIPPED",
    trackingNumber: "",
    trackingCarrier: "",
    trackingUrl: "",
    estimatedDeliveryAt: "",
  });

  function load() {
    apiFetch("/admin/orders").then((d) => setOrders(d.orders ?? []));
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(o: Order) {
    setEditing(o.id);
    setForm({
      status: o.status === "CONFIRMED" ? "SHIPPED" : o.status,
      trackingNumber: o.trackingNumber ?? "",
      trackingCarrier: o.trackingCarrier ?? "",
      trackingUrl: o.trackingUrl ?? "",
      estimatedDeliveryAt: "",
    });
  }

  async function save(orderId: string) {
    await apiFetch(`/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: form.status,
        trackingNumber: form.trackingNumber,
        trackingCarrier: form.trackingCarrier,
        trackingUrl: form.trackingUrl,
        estimatedDeliveryAt: form.estimatedDeliveryAt || undefined,
      }),
    });
    setEditing(null);
    load();
  }

  async function handleCancelOrder() {
    if (!cancellingOrderId) return;
    setIsSubmittingCancel(true);
    setCancelError("");
    try {
      await apiFetch(`/admin/orders/${cancellingOrderId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "CANCELLED",
          cancellationReason: cancellationReason.trim() || "Cancelled by boutique administrator",
        }),
      });
      setCancellingOrderId(null);
      setCancellationReason("");
      load();
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setIsSubmittingCancel(false);
    }
  }

  return (
    <div className="mt-12 border border-brand-border bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/70 pb-4">
        <div>
          <h2 className="serif text-2xl">Manage orders & fulfillment</h2>
          <p className="mt-1 text-sm text-brand-muted">
            Update tracking, mark fulfillment stages, or cancel unfulfilled orders.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-xs border border-brand-border px-3 py-1.5 text-xs text-brand-text hover:border-gold transition active:scale-95"
        >
          ↻ Refresh Orders
        </button>
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xs border border-brand-border bg-white p-6 shadow-2xl">
            <h3 className="serif text-xl text-rose-dark font-medium">Cancel Order</h3>
            <p className="mt-2 text-xs text-brand-muted leading-relaxed">
              Are you sure you want to cancel this order? This will mark the order as{" "}
              <strong className="text-brand-text">CANCELLED</strong>. Order history, customer details, and records will be preserved.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-medium text-brand-text">
                Cancellation Reason (Optional)
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="e.g. Customer requested cancellation via WhatsApp / Fabric out of stock"
                rows={3}
                className="mt-1.5 w-full rounded-xs border border-brand-border px-3 py-2 text-xs outline-none focus:border-rose"
              />
            </div>

            {cancelError && (
              <p className="mt-2 text-xs text-rose font-medium">{cancelError}</p>
            )}

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCancellingOrderId(null);
                  setCancellationReason("");
                  setCancelError("");
                }}
                disabled={isSubmittingCancel}
                className="rounded-xs border border-brand-border px-4 py-2 text-xs text-brand-muted hover:text-brand-text"
              >
                Keep Order Active
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={isSubmittingCancel}
                className="rounded-xs bg-red-700 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white hover:bg-red-800 disabled:opacity-50"
              >
                {isSubmittingCancel ? "Cancelling…" : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ul className="mt-6 space-y-4">
        {orders.map((o) => {
          const addr = formatOrderAddresses(o);
          const isCancelled = o.status === "CANCELLED";
          const canCancel = CANCELLABLE_STATUSES.includes(o.status);

          return (
            <li
              key={o.id}
              className={`rounded-xs border p-4 text-sm transition-all ${
                isCancelled
                  ? "border-red-200 bg-red-50/40 opacity-85"
                  : "border-brand-border bg-white shadow-2xs"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <strong className="font-mono text-sm">{o.orderNumber}</strong>
                  <span>—</span>
                  <span className="font-semibold text-rose-dark">
                    ₹{(o.totalPaise / 100).toLocaleString("en-IN")}
                  </span>
                </span>

                <span
                  className={`rounded-xs px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                    isCancelled
                      ? "border border-red-300 bg-red-100 text-red-800"
                      : o.status === "DELIVERED"
                      ? "border border-emerald-300 bg-emerald-100 text-emerald-800"
                      : o.status === "SHIPPED"
                      ? "border border-blue-300 bg-blue-100 text-blue-800"
                      : "border border-gold/40 bg-ivory-2 text-espresso"
                  }`}
                >
                  {o.status.replace(/_/g, " ")}
                </span>
              </div>

              <p className="mt-1 text-xs text-brand-subtle">
                Customer: {o.user?.name ?? o.user?.email ?? o.user?.phone ?? "Guest Checkout"}
              </p>

              {isCancelled && (
                <div className="mt-3 rounded-xs border border-red-200 bg-red-100/50 p-2.5 text-xs text-red-900">
                  <p className="font-medium">
                    Order was cancelled
                    {o.cancelledAt ? ` on ${new Date(o.cancelledAt).toLocaleDateString()}` : ""}
                    {o.cancelledBy ? ` by ${o.cancelledBy}` : ""}.
                  </p>
                  {o.cancellationReason && (
                    <p className="mt-1 text-red-800 italic">“{o.cancellationReason}”</p>
                  )}
                </div>
              )}

              {addr.shipping && (
                <pre className="mt-3 whitespace-pre-wrap rounded-xs bg-ivory-2 p-3 text-xs leading-relaxed text-brand-text border border-brand-border/60">
                  {addr.shipping}
                  {addr.billing ? `\n\n${addr.billing}` : ""}
                </pre>
              )}

              {o.trackingNumber && !isCancelled && (
                <p className="mt-2 text-xs font-medium text-brand-text">
                  Tracking: <span className="font-mono">{o.trackingCarrier} {o.trackingNumber}</span>
                  {o.trackingUrl && (
                    <a
                      href={o.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-rose underline text-[11px]"
                    >
                      Track Shipment ↗
                    </a>
                  )}
                </p>
              )}

              {editing === o.id ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2 rounded-xs border border-brand-border/80 bg-ivory-2 p-3">
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="border px-2 py-2 text-xs bg-white rounded-xs"
                  >
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="IN_STITCHING">In stitching</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                  <input
                    placeholder="Courier (Delhivery, DTDC…)"
                    value={form.trackingCarrier}
                    onChange={(e) => setForm((f) => ({ ...f, trackingCarrier: e.target.value }))}
                    className="border px-2 py-2 text-xs bg-white rounded-xs"
                  />
                  <input
                    placeholder="Tracking number"
                    value={form.trackingNumber}
                    onChange={(e) => setForm((f) => ({ ...f, trackingNumber: e.target.value }))}
                    className="border px-2 py-2 text-xs bg-white rounded-xs"
                  />
                  <input
                    placeholder="Track URL (optional)"
                    value={form.trackingUrl}
                    onChange={(e) => setForm((f) => ({ ...f, trackingUrl: e.target.value }))}
                    className="border px-2 py-2 text-xs bg-white rounded-xs"
                  />
                  <input
                    type="date"
                    value={form.estimatedDeliveryAt}
                    onChange={(e) => setForm((f) => ({ ...f, estimatedDeliveryAt: e.target.value }))}
                    className="border px-2 py-2 text-xs sm:col-span-2 bg-white rounded-xs"
                  />
                  <div className="flex gap-2 sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => save(o.id)}
                      className="flex-1 rounded-xs bg-rose py-2 text-white text-xs font-medium uppercase tracking-wider"
                    >
                      Save Status & Tracking
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="rounded-xs border border-brand-border px-3 py-2 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-brand-border/40">
                  {!isCancelled ? (
                    <button
                      type="button"
                      onClick={() => startEdit(o)}
                      className="text-xs text-rose underline font-medium"
                    >
                      Update status / tracking
                    </button>
                  ) : (
                    <span className="text-xs text-brand-subtle">Cancelled Order</span>
                  )}

                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => {
                        setCancellingOrderId(o.id);
                        setCancellationReason("");
                        setCancelError("");
                      }}
                      className="text-xs text-red-600 hover:text-red-800 underline font-medium ml-auto"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
