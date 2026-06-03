function apiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return "http://localhost:3000";
}

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

export async function fetchProducts(params?: Record<string, string>) {
  const empty = { items: [] as Product[], total: 0 };
  try {
    const qs = params ? `?${new URLSearchParams(params)}` : "";
    const res = await fetch(`${apiBaseUrl()}/api/products${qs}`, {
      cache: "no-store",
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
    await fetch(`${apiBaseUrl()}/api/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...meta }),
    });
  } catch {
    /* non-blocking */
  }
}
