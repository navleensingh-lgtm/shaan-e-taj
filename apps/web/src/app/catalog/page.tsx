import { CatalogClient } from "./CatalogClient";
import { fetchProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const { items, total } = await fetchProducts({ limit: "48", inStock: "true" });
  return <CatalogClient initialProducts={items} total={total} />;
}
