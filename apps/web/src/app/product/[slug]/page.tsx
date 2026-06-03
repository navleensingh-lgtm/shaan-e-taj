import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StitchingOptions } from "./StitchingOptions";

function apiBase(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${apiBase()}/api/products/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product?.name) return { title: "Product" };
  return { title: product.name, description: product.description ?? undefined };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const img = product.images?.[0];
  const price = product.priceInPaise / 100;

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-2 lg:px-8">
      <div className="relative aspect-[3/4] overflow-hidden rounded bg-ivory-2">
        {img?.url && (
          <Image src={img.url} alt={product.name} fill className="object-cover" priority />
        )}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-rose">
          {product.subCategory?.replace(/_/g, " ")}
        </p>
        <h1 className="serif mt-2 text-4xl">{product.name}</h1>
        <p className="mt-3 text-2xl font-medium text-rose-dark">
          ₹{price.toLocaleString("en-IN")}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-brand-muted">{product.description}</p>
        {(product.fabric || product.color) && (
          <p className="mt-4 text-sm text-brand-subtle">
            {product.fabric && <>Fabric: {product.fabric}<br /></>}
            {product.color && <>Color: {product.color}</>}
          </p>
        )}
        <StitchingOptions product={{ ...product, slug }} />
        <Link href="/catalog" className="mt-8 inline-block text-sm text-rose underline">
          ← Back to catalog
        </Link>
      </div>
    </section>
  );
}
