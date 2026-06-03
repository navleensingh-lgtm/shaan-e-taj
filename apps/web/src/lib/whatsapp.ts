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
    "Hello, I would like to order this product:",
    "",
    `Product: ${product.name}`,
    `Product Price: ₹${product.price.toLocaleString("en-IN")}`,
    product.style ? `Style: ${product.style}` : "",
    product.color ? `Color: ${product.color}` : "",
    product.fabric ? `Fabric: ${product.fabric}` : "",
    product.category ? `Category: ${product.category}` : "",
    product.quantity && product.quantity > 1 ? `Quantity: ${product.quantity}` : "",
    sku ? `SKU: ${sku}` : "",
    `Stitching: ${stitchingLabel}`,
    product.stitchingCharge != null && product.stitchingCharge > 0
      ? product.quantity && product.quantity > 1 && product.stitchingType === "FULLY_STITCHED"
        ? `Stitching Charge: ₹${(product.stitchingCharge / product.quantity).toLocaleString("en-IN")}/suit × ${product.quantity} = ₹${product.stitchingCharge.toLocaleString("en-IN")}`
        : `Stitching Charge: ₹${product.stitchingCharge.toLocaleString("en-IN")}`
      : product.stitchingType === "FULLY_STITCHED"
        ? "Stitching Charge: ₹0"
        : "",
    product.shippingCharge != null
      ? product.shippingCharge > 0
        ? `Shipping: ₹${product.shippingCharge.toLocaleString("en-IN")}`
        : "Shipping: Free"
      : "",
    product.totalPrice != null ? `Total: ₹${product.totalPrice.toLocaleString("en-IN")}` : "",
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
