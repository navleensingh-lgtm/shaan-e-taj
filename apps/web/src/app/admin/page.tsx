"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { AdminOrders } from "@/components/AdminOrders";
import { AdminProducts } from "@/components/AdminProducts";
import { AdminStoreSettings } from "@/components/AdminStoreSettings";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

type Tab = "products" | "store" | "orders" | "overview";

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
  const [tab, setTab] = useState<Tab>("products");
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") return;
    apiFetch("/admin/dashboard").then(setData).catch(console.error);
  }, [session]);

  if (status === "loading") return <p className="p-20 text-center">Loading…</p>;

  if (session?.user?.role !== "ADMIN") {
    return (
      <section className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="serif text-3xl">Admin</h1>
        <p className="mt-4 text-brand-muted">Admin access only.</p>
        <Link href="/admin/login" className="mt-4 inline-block text-rose underline">
          Admin sign in
        </Link>
      </section>
    );
  }

  const t = data?.today;
  const tabs: { id: Tab; label: string }[] = [
    { id: "products", label: "Products" },
    { id: "store", label: "Store & WhatsApp" },
    { id: "orders", label: "Orders" },
    { id: "overview", label: "Overview" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="serif text-4xl">Admin</h1>
          <p className="mt-2 text-sm text-brand-muted">
            Manage collections, prices, stock, address, WhatsApp & orders.
          </p>
          <p className="mt-1 text-xs text-brand-subtle">{session.user?.email}</p>
        </div>
        <AdminLogoutButton />
      </div>

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-brand-border pb-4">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-sm px-4 py-2 text-[11px] uppercase tracking-wider ${
              tab === id ? "bg-rose text-white" : "border border-brand-border text-brand-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "products" && <AdminProducts />}

      {tab === "store" && (
        <div className="mt-8 border border-brand-border bg-white p-6">
          <AdminStoreSettings />
        </div>
      )}

      {tab === "orders" && <AdminOrders />}

      {tab === "overview" && (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Today's Sales", value: `₹${((t?.salesPaise ?? 0) / 100).toLocaleString("en-IN")}` },
              { label: "New Orders", value: t?.newOrders ?? 0 },
              { label: "Visitors", value: t?.visitors ?? 0 },
              { label: "WhatsApp Clicks", value: t?.whatsappClicks ?? 0 },
              { label: "Conversion", value: `${((t?.conversionRate ?? 0) * 100).toFixed(1)}%` },
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
        </>
      )}
    </section>
  );
}
