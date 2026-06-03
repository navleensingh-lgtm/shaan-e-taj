import { ProductGrid } from "@/components/ProductGrid";
import { fetchProducts } from "@/lib/api";

type Props = {
  title: string;
  tag: string;
  query: Record<string, string>;
};

export async function CollectionPage({ title, tag, query }: Props) {
  const { items } = await fetchProducts({ ...query, inStock: "true" });

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose">{tag}</p>
      <h1 className="serif mt-3 text-4xl md:text-5xl">{title}</h1>
      <ProductGrid products={items} />
    </section>
  );
}
