import type { Metadata } from "next";
import { CatalogClient } from "./CatalogClient";
import { getCatalogProducts } from "@/lib/products-server";

export const metadata: Metadata = { title: "Catalog" };
export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const { items, total } = await getCatalogProducts();
  return <CatalogClient initialProducts={items} total={total} />;
}
