const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919464385993";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shaanetaj.com";

export function whatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function productPageUrl(slug: string): string {
  const base =
    typeof window !== "undefined" ? window.location.origin : SITE_URL.replace(/\/$/, "");
  return `${base}/product/${slug}`;
}

export type OrderProductInput = {
  name: string;
  slug: string;
  price: number;
  category?: string;
  style?: string | null;
  color?: string | null;
  fabric?: string | null;
  quantity?: number;
  sku?: string | null;
  productUrl?: string;
};

export function orderMessage(product: OrderProductInput): string {
  const link = product.productUrl ?? productPageUrl(product.slug);
  const sku = product.sku?.trim() || product.slug;

  const lines = [
    "Hello, I would like to order this product:",
    "",
    `Product: ${product.name}`,
    `Price: ₹${product.price.toLocaleString("en-IN")}`,
    product.style ? `Style: ${product.style}` : "",
    product.color ? `Color: ${product.color}` : "",
    product.fabric ? `Fabric: ${product.fabric}` : "",
    product.category ? `Category: ${product.category}` : "",
    product.quantity && product.quantity > 1 ? `Quantity: ${product.quantity}` : "",
    sku ? `SKU: ${sku}` : "",
    "",
    "Product Link:",
    link,
  ].filter(Boolean);

  return lines.join("\n");
}

/** Build WhatsApp order URL with canonical product page link (client-safe). */
export function orderWhatsAppUrl(product: OrderProductInput): string {
  return whatsAppUrl(
    orderMessage({
      ...product,
      productUrl: productPageUrl(product.slug),
    })
  );
}
