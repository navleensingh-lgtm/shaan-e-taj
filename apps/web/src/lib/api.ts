import { listProducts } from "@/lib/products-server";

export type ProductImage = {
  url: string;
  ratio: string;
  isPrimary: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  fabric?: string | null;
  color?: string | null;
  priceInPaise: number;
  compareAtPaise?: number | null;
  badge?: string | null;
  stitchingAvailable: boolean;
  inStock?: boolean;
  images: ProductImage[];
};

const empty = { items: [] as Product[], total: 0 };

/** Server components: read DB directly. Client: same-origin /api/products. */
export async function fetchProducts(params?: Record<string, string>) {
  if (typeof window === "undefined") {
    try {
      return await listProducts(params ?? {});
    } catch (e) {
      console.error("fetchProducts (server)", e);
      return empty;
    }
  }

  try {
    const qs = params ? `?${new URLSearchParams(params)}` : "";
    const res = await fetch(`/api/products${qs}`, { cache: "no-store" });
    if (!res.ok) return empty;
    return (await res.json()) as { items: Product[]; total: number };
  } catch (e) {
    console.error("fetchProducts (client)", e);
    return empty;
  }
}

export async function trackEvent(
  type: string,
  meta?: { productId?: string; userId?: string; metadata?: Record<string, string> }
) {
  try {
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shaanetaj.com");
    await fetch(`${base}/api/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...meta }),
    });
  } catch {
    /* non-blocking */
  }
}
