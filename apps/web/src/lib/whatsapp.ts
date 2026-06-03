const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919464385993";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shaanetaj.com";

export function whatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function productPageUrl(slug: string): string {
  return `${SITE_URL.replace(/\/$/, "")}/product/${slug}`;
}

export function orderMessage(product: {
  name: string;
  slug?: string;
  category: string;
  price: number;
  color?: string | null;
  fabric?: string | null;
}): string {
  const lines = [
    "Hi Shaan-e-Taj, I want to order:",
    "",
    `*${product.name}*`,
    product.slug ? `Link: ${productPageUrl(product.slug)}` : "",
    `Category: ${product.category}`,
    product.fabric ? `Fabric: ${product.fabric}` : "",
    product.color ? `Color: ${product.color}` : "",
    `Price: ₹${product.price.toLocaleString("en-IN")}`,
    "",
    "Please share availability and delivery details.",
  ].filter(Boolean);
  return lines.join("\n");
}
