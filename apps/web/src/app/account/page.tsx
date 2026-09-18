"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { formatOrderAddresses } from "@/lib/format-order-address";
import { UserRole } from "@shaan-e-taj/database";

type Profile = {
  user: {
    name: string | null;
    email: string | null;
    phone: string | null;
    createdAt: string;
    role: string;
  };
  orders: {
    id: string;
    orderNumber: string;
    status: string;
    totalPaise: number;
    createdAt: string;
    items: { name: string; quantity: number }[];
    shippingName?: string | null;
    shippingLine1?: string | null;
    shippingLine2?: string | null;
    shippingCity?: string | null;
    shippingState?: string | null;
    shippingPincode?: string | null;
    shippingPhone?: string | null;
    shippingEmail?: string | null;
    billingName?: string | null;
    billingLine1?: string | null;
    billingLine2?: string | null;
    billingCity?: string | null;
    billingState?: string | null;
    billingPincode?: string | null;
    billingPhone?: string | null;
  }[];
  addresses: {
    id: string;
    label: string | null;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    isDefault: boolean;
  }[];
  measurements: { id: string; label: string; updatedAt: string }[];
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<Profile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    apiFetch("/account/me")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load account"));
  }, [status]);

  if (status === "loading") {
    return <p className="py-20 text-center text-brand-muted">Loading…</p>;
  }

  if (status === "unauthenticated") {
    return (
      <section className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="serif text-4xl">My Account</h1>
        <p className="mt-4 text-brand-muted">Sign in to see your orders and details.</p>
        <Link
          href="/login?callbackUrl=/account"
          className="mt-6 inline-block rounded-sm bg-rose px-8 py-3 text-[11px] uppercase tracking-wider text-white"
        >
          Customer login
        </Link>
      </section>
    );
  }

  if (session?.user?.role === UserRole.ADMIN) {
    return (
      <section className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="serif text-4xl">Staff account</h1>
        <p className="mt-4 text-brand-muted">
          You are signed in as admin. Use the admin portal to manage the store.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-block rounded-sm bg-brand-text px-8 py-3 text-[11px] uppercase tracking-wider text-ivory"
        >
          Go to admin portal
        </Link>
        <p className="mt-4 text-sm">
          <Link href="/orders" className="text-rose underline">
            View orders
          </Link>
        </p>
      </section>
    );
  }

  const user = data?.user;

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose">My account</p>
          <h1 className="serif mt-2 text-4xl">{user?.name ?? "Welcome"}</h1>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-sm border border-brand-border px-4 py-2 text-[11px] uppercase tracking-wider text-brand-muted hover:border-rose"
        >
          Log out
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-rose">{error}</p>}

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-sm border border-brand-border bg-white p-6">
          <h2 className="serif text-xl">Profile</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-brand-subtle">Name</dt>
              <dd>{user?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-brand-subtle">Email</dt>
              <dd>{user?.email ?? session?.user?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-brand-subtle">Phone</dt>
              <dd>{user?.phone ?? "—"}</dd>
            </div>
            {user?.createdAt && (
              <div>
                <dt className="text-brand-subtle">Member since</dt>
                <dd>{new Date(user.createdAt).toLocaleDateString("en-IN")}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-sm border border-brand-border bg-white p-6">
          <h2 className="serif text-xl">Quick links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/orders" className="text-rose underline">
                All orders & tracking
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="text-rose underline">
                Wishlist
              </Link>
            </li>
            <li>
              <Link href="/cart" className="text-rose underline">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/custom-stitching" className="text-rose underline">
                Custom stitching enquiry
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 rounded-sm border border-brand-border bg-white p-6">
        <h2 className="serif text-2xl">Order history</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Past orders with shipping addresses used at checkout.
        </p>
        {!data?.orders.length && (
          <p className="mt-6 text-sm text-brand-subtle">
            No orders yet.{" "}
            <Link href="/catalog" className="text-rose underline">
              Start shopping
            </Link>
          </p>
        )}
        <ul className="mt-6 space-y-4">
          {data?.orders.map((o) => {
            const addr = formatOrderAddresses(o);
            return (
              <li key={o.id} className="border border-brand-border/80 p-4 text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <Link href="/orders" className="font-medium text-rose-dark underline">
                    {o.orderNumber}
                  </Link>
                  <span className="uppercase text-brand-subtle">{o.status.replace(/_/g, " ")}</span>
                </div>
                <p className="mt-1 text-brand-muted">
                  {new Date(o.createdAt).toLocaleString("en-IN")} · ₹
                  {(o.totalPaise / 100).toLocaleString("en-IN")}
                </p>
                <ul className="mt-2 text-brand-subtle">
                  {o.items.map((i, idx) => (
                    <li key={idx}>
                      {i.name} × {i.quantity}
                    </li>
                  ))}
                </ul>
                {addr.shipping && (
                  <pre className="mt-3 whitespace-pre-wrap rounded-sm bg-ivory-2 p-3 text-xs leading-relaxed">
                    {addr.shipping}
                  </pre>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {!!data?.addresses.length && (
        <div className="mt-10 rounded-sm border border-brand-border bg-white p-6">
          <h2 className="serif text-2xl">Saved addresses</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data.addresses.map((a) => (
              <li key={a.id} className="rounded-sm bg-ivory-2 p-3">
                {a.label && <p className="text-[10px] uppercase tracking-wider text-rose">{a.label}</p>}
                <p>{a.line1}</p>
                {a.line2 && <p>{a.line2}</p>}
                <p>
                  {a.city}, {a.state} {a.pincode}
                </p>
                <p className="text-brand-subtle">Phone: {a.phone}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!data?.measurements.length && (
        <div className="mt-10 rounded-sm border border-brand-border bg-white p-6">
          <h2 className="serif text-2xl">Saved measurements</h2>
          <ul className="mt-4 space-y-2 text-sm text-brand-muted">
            {data.measurements.map((m) => (
              <li key={m.id}>
                {m.label} — updated {new Date(m.updatedAt).toLocaleDateString("en-IN")}
              </li>
            ))}
          </ul>
          <Link href="/custom-stitching" className="mt-4 inline-block text-sm text-rose underline">
            Update measurements →
          </Link>
        </div>
      )}
    </section>
  );
}
