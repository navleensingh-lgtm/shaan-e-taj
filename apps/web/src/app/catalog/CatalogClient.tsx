"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/api";
import { ProductGrid } from "@/components/ProductGrid";
import {
  CatalogFilterDrawer,
  type CategoryOption,
  type FiltersState,
} from "@/components/CatalogFilterDrawer";

const CATALOG_LIMIT = "200";

const INITIAL_FILTERS: FiltersState = {
  mainCategory: "",
  subCategory: "",
  productType: "",
  availability: "",
  minPrice: "",
  maxPrice: "",
  color: "",
  fabric: "",
  occasion: "",
};

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
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
  const [sortBy, setSortBy] = useState("featured");
  const [mainCategories, setMainCategories] = useState<CategoryOption[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryOption[]>([]);
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Compute active filters list for display & chips
  const activeFilters = useMemo(() => {
    const list: { key: keyof FiltersState; label: string; value: string }[] = [];

    if (filters.mainCategory) {
      const cat = mainCategories.find((c) => c.slug === filters.mainCategory);
      list.push({
        key: "mainCategory",
        label: cat ? cat.name.replace(/_/g, " ") : filters.mainCategory,
        value: filters.mainCategory,
      });
    }

    if (filters.subCategory) {
      const cat = subCategories.find((c) => c.slug === filters.subCategory);
      list.push({
        key: "subCategory",
        label: cat ? cat.name.replace(/_/g, " ") : filters.subCategory,
        value: filters.subCategory,
      });
    }

    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice ? `₹${Number(filters.minPrice).toLocaleString("en-IN")}` : "₹0";
      const max = filters.maxPrice ? `₹${Number(filters.maxPrice).toLocaleString("en-IN")}` : "Above";
      list.push({
        key: "minPrice",
        label: `${min} – ${max}`,
        value: `${filters.minPrice}-${filters.maxPrice}`,
      });
    }

    if (filters.occasion) {
      list.push({ key: "occasion", label: filters.occasion, value: filters.occasion });
    }

    if (filters.color) {
      list.push({ key: "color", label: filters.color, value: filters.color });
    }

    if (filters.fabric) {
      list.push({ key: "fabric", label: filters.fabric, value: filters.fabric });
    }

    if (filters.productType) {
      list.push({ key: "productType", label: filters.productType, value: filters.productType });
    }

    if (filters.availability) {
      const label =
        filters.availability === "READY_TO_SHIP"
          ? "Ready to Ship"
          : filters.availability === "MADE_TO_ORDER"
          ? "Made to Order"
          : "Custom Tailored";
      list.push({ key: "availability", label, value: filters.availability });
    }

    return list;
  }, [filters, mainCategories, subCategories]);

  const load = useCallback(async (query: string, f: FiltersState, sort: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: CATALOG_LIMIT });
      if (query) params.set("q", query);
      if (sort) params.set("sortBy", sort);
      if (f.mainCategory) params.set("mainCategory", f.mainCategory);
      if (f.subCategory) params.set("subCategory", f.subCategory);
      if (f.productType) params.set("productType", f.productType);
      if (f.availability) params.set("availability", f.availability);
      if (f.minPrice) params.set("minPrice", f.minPrice);
      if (f.maxPrice) params.set("maxPrice", f.maxPrice);
      if (f.color) params.set("color", f.color);
      if (f.fabric) params.set("fabric", f.fabric);
      if (f.occasion) params.set("occasion", f.occasion);

      const res = await fetch(`/api/products?${params}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setProducts(data.items ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        const all: CategoryOption[] = d.categories ?? [];
        setMainCategories(all.filter((c) => c.kind === "MAIN"));
        setSubCategories(all.filter((c) => c.kind === "SUB"));
      })
      .catch(() => {});

    if (initialProducts.length === 0) {
      void load("", filters, sortBy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount initial check
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    load(q, filters, sortBy);
  }

  function handleSortChange(nextSort: string) {
    setSortBy(nextSort);
    load(q, filters, nextSort);
  }

  function handleApplyFilters(nextFilters: FiltersState) {
    setFilters(nextFilters);
    load(q, nextFilters, sortBy);
  }

  function handleResetFilters() {
    setFilters(INITIAL_FILTERS);
    load(q, INITIAL_FILTERS, sortBy);
  }

  function removeFilterChip(key: keyof FiltersState) {
    let next: FiltersState;
    if (key === "minPrice" || key === "maxPrice") {
      next = { ...filters, minPrice: "", maxPrice: "" };
    } else {
      next = { ...filters, [key]: "" };
    }
    setFilters(next);
    load(q, next, sortBy);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 text-brand-text">
      {/* 1. Luxury Editorial Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="h-px w-8 bg-gold" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark font-medium">Boutique Archive</p>
          <span className="h-px w-8 bg-gold" />
        </div>
        <h1 className="serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-espresso">
          The Complete Catalog
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-brand-muted font-light leading-relaxed">
          Explore artisanal Pakistani cuts, hand-embroidered wedding couture, and luxury unstitched fabrics handcrafted in Punjab.
        </p>
      </div>

      {/* 2. Unified Search & Fast Actions Bar */}
      <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 border-b border-brand-border/70 pb-5">
        {/* Search Input */}
        <form onSubmit={onSearch} className="relative flex-1 max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by silhouette, embroidery, color or fabric…"
            className="w-full rounded-xs border border-brand-border bg-white px-4 py-2.5 text-base sm:text-xs outline-none focus:border-gold placeholder:text-brand-subtle pr-10 shadow-2xs"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center text-brand-subtle hover:text-espresso"
          >
            <svg className="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </form>

        {/* Filter Trigger + Sort Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full md:w-auto">
          {/* Filters Button */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex-1 sm:flex-none flex min-h-[42px] items-center justify-center gap-2 rounded-xs border border-brand-border bg-white px-4 py-2 text-xs uppercase tracking-[0.16em] font-medium text-espresso shadow-2xs hover:border-gold transition active:scale-95"
          >
            <svg className="h-4 w-4 stroke-current text-gold-dark" fill="none" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            <span>Filters</span>
            {activeFilters.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose text-[10px] font-bold text-white px-1">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 rounded-xs border border-brand-border bg-white px-3 py-2 shadow-2xs">
            <span className="text-[10px] uppercase tracking-wider text-brand-subtle hidden xs:inline font-medium">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent text-xs text-brand-text outline-none cursor-pointer uppercase tracking-wider font-medium"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Active Filter Chips & Summary Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {activeFilters.map((af) => (
            <span
              key={`${af.key}-${af.value}`}
              className="inline-flex items-center gap-1.5 rounded-xs border border-rose/30 bg-rose/10 px-2.5 py-1 text-xs text-rose-dark shadow-2xs font-medium"
            >
              <span>{af.label}</span>
              <button
                type="button"
                onClick={() => removeFilterChip(af.key)}
                aria-label={`Remove filter ${af.label}`}
                className="hover:text-espresso cursor-pointer leading-none text-sm"
              >
                ✕
              </button>
            </span>
          ))}

          {activeFilters.length > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-brand-subtle underline hover:text-rose-dark ml-1 transition"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Subtle Product Count */}
        <p className="text-xs text-brand-subtle font-mono">
          {loading ? (
            <span className="animate-pulse">Refreshing collection…</span>
          ) : (
            `${total} pieces`
          )}
        </p>
      </div>

      {/* 4. Product Grid */}
      <ProductGrid
        products={products}
        emptyMessage="No pieces matched your selected filters. Try clearing some options to view our full collection."
      />

      {/* 5. Filter Slide-Over Drawer */}
      <CatalogFilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        mainCategories={mainCategories}
        subCategories={subCategories}
        activeCount={activeFilters.length}
      />
    </section>
  );
}
