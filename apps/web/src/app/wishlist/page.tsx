"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/api";
import { ProductGrid } from "@/components/ProductGrid";
import { apiFetch } from "@/lib/api-client";

export default function WishlistPage() {
  const { status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }
    apiFetch("/wishlist")
      .then((d) => setProducts(d.items ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "unauthenticated") {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="serif text-4xl">Wishlist</h1>
        <p className="mt-4 text-brand-muted">Sign in to save your favourite pieces.</p>
        <Link href="/login?callbackUrl=/wishlist" className="mt-8 inline-block text-rose underline">
          Sign in
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <h1 className="serif text-4xl">Wishlist</h1>
      {loading ? (
        <p className="mt-8 text-brand-subtle">Loading…</p>
      ) : (
        <ProductGrid products={products} emptyMessage="Your wishlist is empty." />
      )}
    </section>
  );
}
