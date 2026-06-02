"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalPaise: number;
  trackingNumber?: string | null;
  trackingCarrier?: string | null;
  trackingUrl?: string | null;
  user?: { name?: string; email?: string; phone?: string };
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
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

  return (
    <div className="mt-12 border border-brand-border bg-white p-6">
      <h2 className="serif text-2xl">Manage orders & tracking</h2>
      <p className="mt-2 text-sm text-brand-muted">
        Mark shipped with tracking ID — customer sees delivery estimate on My Orders.
      </p>
      <ul className="mt-6 space-y-3">
        {orders.slice(0, 15).map((o) => (
          <li key={o.id} className="border border-brand-border p-4 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <span>
                <strong>{o.orderNumber}</strong> — ₹{(o.totalPaise / 100).toLocaleString("en-IN")}
              </span>
              <span className="uppercase text-brand-subtle">{o.status.replace(/_/g, " ")}</span>
            </div>
            <p className="text-brand-subtle">
              {o.user?.name ?? o.user?.email ?? o.user?.phone ?? "Guest"}
            </p>
            {o.trackingNumber && (
              <p className="mt-1">
                Tracking: {o.trackingCarrier} {o.trackingNumber}
              </p>
            )}
            {editing === o.id ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="border px-2 py-2"
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
                  className="border px-2 py-2"
                />
                <input
                  placeholder="Tracking number"
                  value={form.trackingNumber}
                  onChange={(e) => setForm((f) => ({ ...f, trackingNumber: e.target.value }))}
                  className="border px-2 py-2"
                />
                <input
                  placeholder="Track URL (optional)"
                  value={form.trackingUrl}
                  onChange={(e) => setForm((f) => ({ ...f, trackingUrl: e.target.value }))}
                  className="border px-2 py-2"
                />
                <input
                  type="date"
                  value={form.estimatedDeliveryAt}
                  onChange={(e) => setForm((f) => ({ ...f, estimatedDeliveryAt: e.target.value }))}
                  className="border px-2 py-2 sm:col-span-2"
                />
                <button
                  type="button"
                  onClick={() => save(o.id)}
                  className="rounded-sm bg-rose py-2 text-white sm:col-span-2"
                >
                  Save tracking
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => startEdit(o)}
                className="mt-2 text-rose underline"
              >
                Update status / tracking
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
