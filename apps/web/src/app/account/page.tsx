"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

export default function AccountPage() {
  const { status } = useSession();
  const [addresses, setAddresses] = useState<unknown[]>([]);
  const [measurements, setMeasurements] = useState<unknown[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    apiFetch("/account/addresses").then((d) => setAddresses(d.addresses ?? []));
    apiFetch("/account/measurements").then((d) => setMeasurements(d.measurements ?? []));
  }, [status]);

  if (status === "unauthenticated") {
    return (
      <section className="mx-auto max-w-md px-5 py-20 text-center">
        <Link href="/login?callbackUrl=/account" className="text-rose underline">
          Sign in
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="serif text-4xl">My Account</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="serif text-xl">Saved Addresses</h2>
          <p className="mt-2 text-sm text-brand-muted">{addresses.length} saved</p>
          <Link href="/custom-stitching" className="mt-4 inline-block text-sm text-rose underline">
            Add via custom order form →
          </Link>
        </div>
        <div>
          <h2 className="serif text-xl">Saved Measurements</h2>
          <p className="mt-2 text-sm text-brand-muted">{measurements.length} profiles</p>
          <Link href="/custom-stitching" className="mt-4 inline-block text-sm text-rose underline">
            Update measurements →
          </Link>
        </div>
      </div>
      <div className="mt-10 flex gap-4 text-sm">
        <Link href="/orders" className="text-rose underline">
          Order history
        </Link>
        <Link href="/wishlist" className="text-rose underline">
          Wishlist
        </Link>
      </div>
    </section>
  );
}
