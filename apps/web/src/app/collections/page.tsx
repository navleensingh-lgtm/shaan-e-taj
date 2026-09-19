import type { Metadata } from "next";
import Link from "next/link";
import { getCatalogProducts } from "@/lib/products-server";

export const metadata: Metadata = { title: "Collections" };
export const dynamic = "force-dynamic";

const collections = [
  {
    title: "New Arrivals",
    description: "The freshest luxury cuts, suits, and ensembles straight from our boutique.",
    href: "/new-arrivals",
    tag: "Just In",
  },
  {
    title: "Bridal Collection",
    description: "Opulent lehengas, heavy embroidered suits, and royal ensembles for your big day.",
    href: "/bridal",
    tag: "Special Day",
  },
  {
    title: "Party Wear",
    description: "Modern Pakistani silhouettes, shararas, ghararas, and contemporary evening wear.",
    href: "/party-wear",
    tag: "Celebration",
  },
  {
    title: "Festive Collection",
    description: "Rich festive silks, georgettes, and velvets crafted for auspicious occasions.",
    href: "/festive",
    tag: "Festive Cheer",
  },
  {
    title: "Custom Stitching",
    description: "Bespoke tailoring, precise measurements, and personalized craftsmanship.",
    href: "/custom-stitching",
    tag: "Bespoke",
  },
  {
    title: "Full Catalog",
    description: "Explore all available pieces across categories, fabrics, styles, and colors.",
    href: "/catalog",
    tag: "Complete Shop",
  },
];

export default async function CollectionsPage() {
  const { total } = await getCatalogProducts(1);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Shaan-e-Taj</p>
      <h1 className="serif mt-3 text-4xl md:text-5xl">Our Collections</h1>
      <p className="mt-2 text-sm text-brand-subtle">
        Discover hand-embroidered luxury couture across {total} curated creations.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <div
            key={col.href}
            className="group flex flex-col justify-between rounded-sm border border-brand-border bg-white p-8 transition hover:border-rose hover:shadow-soft"
          >
            <div>
              <span className="inline-block rounded-sm bg-rose/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-rose-dark">
                {col.tag}
              </span>
              <h2 className="serif mt-4 text-2xl text-brand-text group-hover:text-rose-dark transition">
                {col.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                {col.description}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-brand-border/60">
              <Link
                href={col.href}
                className="inline-flex items-center text-[11px] uppercase tracking-[0.15em] text-rose font-medium hover:text-rose-dark"
              >
                Explore Collection →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
