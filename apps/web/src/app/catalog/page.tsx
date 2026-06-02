import { CatalogClient } from "./CatalogClient";
import { fetchProducts } from "@/lib/api";

export default async function CatalogPage() {
  const { items, total } = await fetchProducts({ limit: "48" });
  return <CatalogClient initialProducts={items} total={total} />;
}
