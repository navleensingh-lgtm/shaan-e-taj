import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StitchingOptions } from "./StitchingOptions";
import { LuxuryProductGallery } from "@/components/LuxuryProductGallery";
import { ProductAccordion, type AccordionSectionItem } from "@/components/ProductAccordion";
import { ProductGrid } from "@/components/ProductGrid";
import { WishlistButton } from "@/components/WishlistButton";
import { ProductShareButton } from "@/components/ProductShareButton";
import { getRelatedProducts } from "@/lib/products-server";

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
  if (!product?.name) return { title: "Product | Shaan-e-Taj" };
  return {
    title: `${product.name} | Shaan-e-Taj`,
    description: product.description ?? `${product.name} luxury Indian couture from Shaan-e-Taj Jalandhar`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const price = product.priceInPaise / 100;
  const mrp = product.compareAtPaise ? product.compareAtPaise / 100 : null;
  const onSale = mrp != null && mrp > price;
  const sku = product.sku || product.slug;

  // Fetch related products for "You May Also Like"
  const relatedProducts = await getRelatedProducts(product, 4);

  // Build editorial accordion sections
  const accordionSections: AccordionSectionItem[] = [
    {
      id: "description",
      title: "Description & Craftsmanship",
      content: product.description,
    },
    {
      id: "components",
      title: "What's Included",
      items: Array.isArray(product.components) && product.components.length > 0 ? product.components : undefined,
    },
    {
      id: "fabric-details",
      title: "Fabric & Embellishment Details",
      content:
        product.fabricDetails ||
        (product.fabric ? `Fabric: ${product.fabric}${product.color ? ` · Colour: ${product.color}` : ""}` : null),
    },
    {
      id: "fit-silhouette",
      title: "Silhouette & Fit Guidance",
      content: product.fit
        ? `Fit: ${product.fit}. Crafted with comfortable boutique ease for grace and movement.`
        : "Standard luxury silhouette with tailored ease.",
    },
    {
      id: "delivery-shipping",
      title: "Delivery & Shipping",
      content:
        product.deliveryInfo ||
        `Preparation: ${product.prepTimeline || "Ready to ship within 24–48 hours."}\nDomestic Shipping: Complimentary standard transit across India (3–5 business days).\nInternational Shipping: Orders shipped worldwide. Final freight and duties may be calculated at checkout or confirmed via our WhatsApp concierge based on package dimensions and destination.`,
    },
    {
      id: "custom-stitching",
      title: "Custom Stitching & Bespoke Tailoring",
      content:
        product.customStitchingInfo ||
        "Our boutique master tailors in Jalandhar provide custom measurements on unstitched and semi-stitched suits. Select 'Fully Stitched' to enter your personal measurements, or reach out directly to our WhatsApp concierge with your customization requirements.",
    },
    {
      id: "care-instructions",
      title: "Care Instructions",
      content:
        product.careInstructions ||
        "Dry clean only. Handle delicate zari, sequin, and thread hand-embroidery with care. Store in a cool dry place wrapped in cotton or muslin cloth.",
    },
    {
      id: "returns-exchanges",
      title: "Returns & Boutique Guarantee",
      content:
        product.returnsInfo ||
        "Every Shaan-e-Taj garment undergoes strict multi-point quality inspection prior to packaging. Bespoke and stitched outfits are tailored to order; complimentary alteration support is gladly provided.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12 text-brand-text">
      {/* Breadcrumb Bar */}
      <nav className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-brand-subtle">
        <Link href="/" className="hover:text-rose-dark transition">Home</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-rose-dark transition">Catalog</Link>
        <span>/</span>
        <span className="text-brand-muted truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Main Product Layout: Editorial 2-Column */}
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left Column: Media Gallery (7 Cols on LG) */}
        <div className="lg:col-span-7">
          <LuxuryProductGallery
            images={product.images ?? []}
            media={product.media ?? []}
            productName={product.name}
          />
        </div>

        {/* Right Column: Identity, Options & Accordions (5 Cols on LG) */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Category & Badge */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-dark">
              {product.productType || product.subCategory?.replace(/_/g, " ")}
            </p>
            {product.badge && (
              <span className="rounded-xs border border-rose/40 bg-rose/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-rose-dark font-medium">
                {product.badge}
              </span>
            )}
          </div>

          {/* Title & SKU */}
          <h1 className="serif mt-2 text-3xl sm:text-4xl text-brand-text font-normal leading-tight">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center justify-between text-xs text-brand-subtle">
            <span className="font-mono text-[11px]">SKU: {sku}</span>
            <div className="flex items-center gap-2">
              <WishlistButton productId={product.id} />
              <ProductShareButton slug={product.slug} name={product.name} />
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-4 flex items-baseline gap-3 border-b border-brand-border/60 pb-4">
            <span className="text-2xl sm:text-3xl font-medium text-rose-dark">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {onSale && (
              <span className="text-base text-brand-subtle line-through">
                ₹{mrp!.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-[11px] text-brand-muted uppercase tracking-wider">
              Taxes included · Free domestic shipping
            </span>
          </div>

          {/* Quick Specifications Pills */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {product.fabric && (
              <div className="rounded-xs border border-brand-border/80 bg-ivory-2/50 px-3 py-2">
                <span className="block text-[9px] uppercase tracking-wider text-brand-subtle">Fabric</span>
                <span className="font-medium text-brand-text">{product.fabric}</span>
              </div>
            )}
            {product.color && (
              <div className="rounded-xs border border-brand-border/80 bg-ivory-2/50 px-3 py-2">
                <span className="block text-[9px] uppercase tracking-wider text-brand-subtle">Colour</span>
                <span className="font-medium text-brand-text">{product.color}</span>
              </div>
            )}
            {product.fit && (
              <div className="rounded-xs border border-brand-border/80 bg-ivory-2/50 px-3 py-2">
                <span className="block text-[9px] uppercase tracking-wider text-brand-subtle">Fit Silhouette</span>
                <span className="font-medium text-brand-text">{product.fit}</span>
              </div>
            )}
            {product.occasion && (
              <div className="rounded-xs border border-brand-border/80 bg-ivory-2/50 px-3 py-2">
                <span className="block text-[9px] uppercase tracking-wider text-brand-subtle">Occasion</span>
                <span className="font-medium text-brand-text">{product.occasion}</span>
              </div>
            )}
          </div>

          {/* Stitching, Sizes, Measurements & Actions */}
          <StitchingOptions product={{ ...product, slug }} />

          {/* Editorial Product Accordion System */}
          <ProductAccordion sections={accordionSections} defaultOpenId="description" />
        </div>
      </div>

      {/* "You May Also Like" Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-brand-border/80 pt-12">
          <div className="text-center mb-8">
            <span className="h-px w-10 bg-gold inline-block mb-1" />
            <h2 className="serif text-3xl sm:text-4xl text-brand-text">Complete the Look</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-brand-muted">
              Curated ensembles from our boutique collection
            </p>
          </div>
          <ProductGrid products={relatedProducts as any} />
        </section>
      )}
    </div>
  );
}
