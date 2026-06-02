const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919XXXXXXXXX";

export function whatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(product: {
  name: string;
  category: string;
  price: number;
  color?: string | null;
  fabric?: string | null;
}): string {
  const lines = [
    "Hi Shaan-e-Taj, I want to order:",
    "",
    `*${product.name}*`,
    `Category: ${product.category}`,
    product.fabric ? `Fabric: ${product.fabric}` : "",
    product.color ? `Color: ${product.color}` : "",
    `Price: ₹${product.price.toLocaleString("en-IN")}`,
    "",
    "Please share availability and delivery details.",
  ].filter(Boolean);
  return lines.join("\n");
}
