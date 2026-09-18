import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@shaan-e-taj/database";
import { CollectionPage } from "@/components/CollectionPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug: slug.toUpperCase() },
  });
  if (!category) return { title: "Collection" };
  return { title: category.name, description: category.description ?? undefined };
}

export default async function DynamicCollectionPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug: slug.toUpperCase() },
  });
  if (!category) notFound();

  const query: Record<string, string> =
    category.kind === "SUB"
      ? { subCategory: category.slug, limit: "200" }
      : { mainCategory: category.slug, limit: "200" };

  return (
    <CollectionPage
      title={category.name}
      tag={category.description ?? "Collection"}
      query={query}
    />
  );
}
