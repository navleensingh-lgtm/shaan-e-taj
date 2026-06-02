"use client";

import { useCallback, useState } from "react";
import type { Product } from "@/lib/api";
import { ProductGrid } from "@/components/ProductGrid";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const MAIN_CATEGORIES = ["", "BRIDAL", "PARTY_WEAR", "FESTIVE", "NEW_ARRIVALS"];
const SUB_CATEGORIES = [
  "",
  "ANARKALI",
  "SHARARA",
  "GHARARA",
  "PAKISTANI",
  "LEHENGA",
  "KURTI_SET",
  "SALWAR_SUIT",
];

export function CatalogClient({
  initialProducts,
  total: initialTotal,
}: {
  initialProducts: Product[];
  total: number;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({
    mainCategory: "",
    subCategory: "",
    minPrice: "",
    maxPrice: "",
    color: "",
    fabric: "",
    occasion: "",
    inStock: "true",
  });

  const load = useCallback(async (query: string, f: typeof filters) => {
    const params = new URLSearchParams({ limit: "48" });
    if (query) params.set("q", query);
    if (f.mainCategory) params.set("mainCategory", f.mainCategory);
    if (f.subCategory) params.set("subCategory", f.subCategory);
    if (f.minPrice) params.set("minPrice", f.minPrice);
    if (f.maxPrice) params.set("maxPrice", f.maxPrice);
    if (f.color) params.set("color", f.color);
    if (f.fabric) params.set("fabric", f.fabric);
    if (f.occasion) params.set("occasion", f.occasion);
    if (f.inStock) params.set("inStock", f.inStock);

    const res = await fetch(`${API_URL}/products?${params}`);
    const data = await res.json();
    setProducts(data.items ?? []);
    setTotal(data.total ?? 0);
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    load(q, filters);
  }

  function onFilterChange(key: keyof typeof filters, value: string) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    load(q, next);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Full Catalog</p>
      <h1 className="serif mt-3 text-4xl md:text-5xl">Shop All</h1>

      <form onSubmit={onSearch} className="mt-8 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder='AI search: "red wedding suit"'
          className="flex-1 rounded-sm border border-brand-border bg-white px-4 py-3 text-sm outline-none focus:border-rose"
        />
        <button type="submit" className="rounded-sm bg-rose px-6 text-[11px] uppercase tracking-wider text-white">
          Search
        </button>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          value={filters.mainCategory}
          onChange={(e) => onFilterChange("mainCategory", e.target.value)}
          className="border border-brand-border bg-white px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {MAIN_CATEGORIES.filter(Boolean).map((c) => (
            <option key={c} value={c}>
              {c.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <select
          value={filters.subCategory}
          onChange={(e) => onFilterChange("subCategory", e.target.value)}
          className="border border-brand-border bg-white px-3 py-2 text-sm"
        >
          <option value="">All styles</option>
          {SUB_CATEGORIES.filter(Boolean).map((c) => (
            <option key={c} value={c}>
              {c.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <input
          placeholder="Min ₹"
          value={filters.minPrice}
          onChange={(e) => onFilterChange("minPrice", e.target.value)}
          className="border border-brand-border bg-white px-3 py-2 text-sm"
        />
        <input
          placeholder="Max ₹"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange("maxPrice", e.target.value)}
          className="border border-brand-border bg-white px-3 py-2 text-sm"
        />
        <input
          placeholder="Color"
          value={filters.color}
          onChange={(e) => onFilterChange("color", e.target.value)}
          className="border border-brand-border bg-white px-3 py-2 text-sm"
        />
        <input
          placeholder="Fabric"
          value={filters.fabric}
          onChange={(e) => onFilterChange("fabric", e.target.value)}
          className="border border-brand-border bg-white px-3 py-2 text-sm"
        />
        <input
          placeholder="Occasion"
          value={filters.occasion}
          onChange={(e) => onFilterChange("occasion", e.target.value)}
          className="border border-brand-border bg-white px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.inStock === "true"}
            onChange={(e) => onFilterChange("inStock", e.target.checked ? "true" : "")}
          />
          In stock only
        </label>
      </div>

      <p className="mt-4 text-xs text-brand-subtle">{total} pieces · AI semantic search</p>
      <ProductGrid products={products} />
    </section>
  );
}
