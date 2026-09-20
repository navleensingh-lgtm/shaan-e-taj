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
    <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
