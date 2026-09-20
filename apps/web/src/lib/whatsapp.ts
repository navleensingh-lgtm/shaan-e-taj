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
  size?: string | null;
  quantity?: number;
  sku?: string | null;
  productUrl?: string;
  stitchingType?: "UNSTITCHED" | "FULLY_STITCHED";
  stitchingCharge?: number;
  shippingCharge?: number;
  totalPrice?: number;
};

export function orderMessage(product: OrderProductInput): string {
  const link = product.productUrl ?? productPageUrl(product.slug);
  const sku = product.sku?.trim() || product.slug;
  const stitchingLabel =
    product.stitchingType === "FULLY_STITCHED" ? "Fully Stitched" : "Unstitched";

  const lines = [
    "Hello Shaan-e-Taj, I would like to order this piece:",
    "",
    `Product: ${product.name}`,
    sku ? `SKU: ${sku}` : "",
    `Price: ₹${product.price.toLocaleString("en-IN")}`,
    product.size ? `Size: ${product.size}` : "",
    product.color ? `Colour: ${product.color}` : "",
    product.fabric ? `Fabric: ${product.fabric}` : "",
    product.style ? `Style: ${product.style}` : "",
    product.category ? `Category: ${product.category}` : "",
    product.quantity && product.quantity > 1 ? `Quantity: ${product.quantity}` : "",
    `Stitching: ${stitchingLabel}`,
    product.totalPrice != null ? `Estimated Total: ₹${product.totalPrice.toLocaleString("en-IN")}` : "",
    "",
    "Product Link:",
    link,
  ].filter(Boolean);

  return lines.join("\n");
}

export function orderWhatsAppUrl(product: OrderProductInput): string {
  return whatsAppUrl(
    orderMessage({
      ...product,
      productUrl: productPageUrl(product.slug),
    })
  );
}

export type WhatsAppEnquiryContext = "GENERAL" | "CUSTOM_STITCHING" | "SIZE_HELP" | "URGENT";

export function contextualWhatsAppUrl(
  product: {
    name: string;
    slug: string;
    sku?: string | null;
    priceInPaise?: number;
    color?: string | null;
    size?: string | null;
  },
  context: WhatsAppEnquiryContext
): string {
  const link = productPageUrl(product.slug);
  const sku = product.sku?.trim() || product.slug;

  let intro = "Hello Shaan-e-Taj, I would like assistance with:";
  if (context === "CUSTOM_STITCHING") {
    intro = "Hello Shaan-e-Taj, I would like to enquire about custom stitching for:";
  } else if (context === "SIZE_HELP") {
    intro = "Hello Shaan-e-Taj, I need assistance finding the perfect size for:";
  } else if (context === "URGENT") {
    intro = "Hello Shaan-e-Taj, I need this piece urgently and would like to check expedited delivery for:";
  }

  const lines = [
    intro,
    "",
    `Product: ${product.name}`,
    `SKU: ${sku}`,
    product.size ? `Selected Size: ${product.size}` : "",
    product.color ? `Colour: ${product.color}` : "",
    "",
    "Product Link:",
    link,
  ].filter(Boolean);

  return whatsAppUrl(lines.join("\n"));
}
