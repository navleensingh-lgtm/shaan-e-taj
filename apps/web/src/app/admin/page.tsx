"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { AdminOrders } from "@/components/AdminOrders";

type Dashboard = {
  today: {
    salesPaise: number;
    newOrders: number;
    visitors: number;
    whatsappClicks: number;
    conversionRate: number;
  };
  topProducts: { product?: { name: string }; _sum: { quantity: number | null } }[];
  recentOrders: {
    orderNumber: string;
    totalPaise: number;
    status: string;
    user?: { name?: string; email?: string };
  }[];
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<Dashboard | null>(null);
  const [settings, setSettings] = useState({
    semiStitchChargePaise: 50000,
    fullStitchChargePaise: 80000,
    autoPostInstagram: false,
    autoPostFacebook: false,
    watermarkEnabled: true,
  });

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") return;
    apiFetch("/admin/dashboard").then(setData).catch(console.error);
    apiFetch("/admin/settings").then(setSettings).catch(console.error);
  }, [session]);

  async function saveSettings() {
    await apiFetch("/admin/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
    alert("Settings saved");
  }

  if (status === "loading") return <p className="p-20 text-center">Loading…</p>;

  if (session?.user?.role !== "ADMIN") {
    return (
      <section className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="serif text-3xl">Admin</h1>
        <p className="mt-4 text-brand-muted">Admin access only.</p>
        <Link href="/login" className="mt-4 inline-block text-rose underline">
          Sign in
        </Link>
      </section>
    );
  }

  const t = data?.today;

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <h1 className="serif text-4xl">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-brand-muted">Shaan-e-Taj — daily operations</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Today's Sales", value: `₹${((t?.salesPaise ?? 0) / 100).toLocaleString("en-IN")}` },
          { label: "New Orders", value: t?.newOrders ?? 0 },
          { label: "Visitors", value: t?.visitors ?? 0 },
          { label: "WhatsApp Clicks", value: t?.whatsappClicks ?? 0 },
          {
            label: "Conversion",
            value: `${((t?.conversionRate ?? 0) * 100).toFixed(1)}%`,
          },
        ].map((card) => (
          <div key={card.label} className="border border-brand-border bg-white p-5">
            <p className="text-[10px] uppercase tracking-wider text-brand-subtle">{card.label}</p>
            <p className="serif mt-2 text-2xl">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="serif text-2xl">Top Products</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {data?.topProducts.map((p, i) => (
              <li key={i} className="flex justify-between border-b border-brand-border py-2">
                <span>{p.product?.name ?? "Product"}</span>
                <span>{p._sum.quantity ?? 0} sold</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="serif text-2xl">Recent Orders</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {data?.recentOrders.map((o) => (
              <li key={o.orderNumber} className="border-b border-brand-border py-2">
                <strong>{o.orderNumber}</strong> — ₹{(o.totalPaise / 100).toLocaleString("en-IN")}
                <br />
                <span className="text-brand-subtle">
                  {o.user?.name ?? o.user?.email ?? "Guest"} · {o.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 border border-brand-border bg-white p-6">
        <h2 className="serif text-2xl">Site Settings</h2>
        <div className="mt-6 max-w-xs">
          <label className="text-sm">
            Full stitch charge (₹) — added to unstitched price when customer picks fully stitched
            <input
              type="number"
              className="mt-1 w-full border px-3 py-2"
              value={settings.fullStitchChargePaise / 100}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  fullStitchChargePaise: Number(e.target.value) * 100,
                }))
              }
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.autoPostInstagram}
              onChange={(e) =>
                setSettings((s) => ({ ...s, autoPostInstagram: e.target.checked }))
              }
            />
            Auto-post Instagram
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.autoPostFacebook}
              onChange={(e) =>
                setSettings((s) => ({ ...s, autoPostFacebook: e.target.checked }))
              }
            />
            Auto-post Facebook
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.watermarkEnabled}
              onChange={(e) =>
                setSettings((s) => ({ ...s, watermarkEnabled: e.target.checked }))
              }
            />
            Watermark on images
          </label>
        </div>
        <button
          type="button"
          onClick={saveSettings}
          className="mt-6 rounded-sm bg-rose px-8 py-3 text-[11px] uppercase tracking-wider text-white"
        >
          Save settings
        </button>
      </div>

      <AdminOrders />

      <p className="mt-8 text-sm text-brand-subtle">
        Upload products via Telegram bot → <code>/publish</code>.
      </p>
    </section>
  );
}
