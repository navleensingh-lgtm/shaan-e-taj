import { prisma, CategoryKind, ProductStatus, type Prisma } from "@shaan-e-taj/database";

export async function listCategories(kind?: CategoryKind) {
  const where: Prisma.CategoryWhereInput = kind ? { kind } : {};
  return prisma.category.findMany({
    where,
    orderBy: [{ kind: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
}

export function slugifyCategory(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}

export async function countProductsUsingCategorySlug(slug: string): Promise<number> {
  return prisma.product.count({
    where: {
      OR: [{ mainCategory: slug }, { subCategory: slug }],
      status: { not: ProductStatus.ARCHIVED },
    },
  });
}
