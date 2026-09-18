import type { Product } from "@/lib/api";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
}: {
  products: Product[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-brand-subtle serif text-2xl">{emptyMessage}</p>
    );
  }
  return (
    <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
