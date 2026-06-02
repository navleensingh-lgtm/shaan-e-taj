import { prisma, ProductStatus, Prisma } from "@shaan-e-taj/database";

export async function listProducts(query: Record<string, string | undefined>) {
  const {
    mainCategory,
    subCategory,
    minPrice,
    maxPrice,
    color,
    fabric,
    occasion,
    inStock,
    isNewArrival,
    limit = "24",
    offset = "0",
  } = query;

  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,
  };

  if (mainCategory) where.mainCategory = mainCategory as Prisma.EnumMainCategoryFilter;
  if (subCategory) where.subCategory = subCategory as Prisma.EnumSubCategoryFilter;
  if (color) where.color = { contains: color, mode: "insensitive" };
  if (fabric) where.fabric = { contains: fabric, mode: "insensitive" };
  if (occasion) where.occasion = { contains: occasion, mode: "insensitive" };
  if (inStock === "true") where.inStock = true;
  if (isNewArrival === "true") where.isNewArrival = true;

  if (minPrice || maxPrice) {
    where.priceInPaise = {};
    if (minPrice) where.priceInPaise.gte = Number(minPrice) * 100;
    if (maxPrice) where.priceInPaise.lte = Number(maxPrice) * 100;
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { publishedAt: "desc" },
      take: Number(limit),
      skip: Number(offset),
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: ProductStatus.PUBLISHED },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}
