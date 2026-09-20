import { ProductGrid } from "@/components/ProductGrid";
import { GridControl } from "@/components/GridControl";
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
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-brand-border/60 pb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose">{tag}</p>
          <h1 className="serif mt-3 text-4xl md:text-5xl">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-xs text-brand-subtle font-mono">
            {items.length} pieces
          </p>
          <GridControl />
        </div>
      </div>

      <ProductGrid products={items} />
    </section>
  );
}
