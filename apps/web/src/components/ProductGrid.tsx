"use client";

import type { Product } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { useCatalogGrid, type GridColumns } from "@/context/CatalogGridContext";

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
  overrideColumns,
}: {
  products: Product[];
  emptyMessage?: string;
  overrideColumns?: GridColumns;
}) {
  const { columns: contextColumns } = useCatalogGrid();
  const cols = overrideColumns ?? contextColumns ?? 4;

  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-brand-subtle serif text-2xl">{emptyMessage}</p>
    );
  }

  // Determine responsive grid classes based on selected column setting
  // On mobile (<640px): 1 or 2 columns based on setting (defaults to 2 for 3/4)
  // On tablet (640px - 1024px): 2 or 3 columns (defaults to 3 for 4)
  // On desktop (>1024px): exactly matches 2, 3, or 4
  let gridClasses = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
  if (cols === 1) {
    gridClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto";
  } else if (cols === 2) {
    gridClasses = "grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto";
  } else if (cols === 3) {
    gridClasses = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3";
  } else if (cols === 4) {
    gridClasses = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
  }

  return (
    <div className={`mt-8 grid gap-2.5 sm:gap-6 ${gridClasses}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
