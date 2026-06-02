const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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
  badge?: string | null;
  stitchingAvailable: boolean;
  images: ProductImage[];
};

export async function fetchProducts(params?: Record<string, string>) {
  const empty = { items: [] as Product[], total: 0 };
  try {
    const qs = params ? `?${new URLSearchParams(params)}` : "";
    const res = await fetch(`${API_URL}/products${qs}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return empty;
    return (await res.json()) as { items: Product[]; total: number };
  } catch {
    return empty;
  }
}

export async function trackEvent(
  type: string,
  meta?: { productId?: string; userId?: string; metadata?: Record<string, string> }
) {
  try {
    await fetch(`${API_URL}/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...meta }),
    });
  } catch {
    /* non-blocking */
  }
}
