import { ProductGrid } from "@/components/ProductGrid";
import { listProducts } from "@/lib/products-server";

export const dynamic = "force-dynamic";

type Props = {
  title: string;
  tag: string;
  query: Record<string, string>;
};

export async function CollectionPage({ title, tag, query }: Props) {
  const { items } = await listProducts(query);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose">{tag}</p>
      <h1 className="serif mt-3 text-4xl md:text-5xl">{title}</h1>
      <ProductGrid products={items} />
    </section>
  );
}
