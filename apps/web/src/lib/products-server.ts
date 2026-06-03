import { prisma, ProductStatus, Prisma } from "@shaan-e-taj/database";

const MAX_LIMIT = 500;

export async function listProducts(query: Record<string, string | undefined>) {
  const {
    q,
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

  const search = q?.trim();
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { color: { contains: search, mode: "insensitive" } },
      { fabric: { contains: search, mode: "insensitive" } },
      { occasion: { contains: search, mode: "insensitive" } },
      { badge: { contains: search, mode: "insensitive" } },
    ];
  }

  if (minPrice || maxPrice) {
    where.priceInPaise = {};
    if (minPrice) where.priceInPaise.gte = Number(minPrice) * 100;
    if (maxPrice) where.priceInPaise.lte = Number(maxPrice) * 100;
  }

  const take = Math.min(Math.max(Number(limit) || 24, 1), MAX_LIMIT);
  const skip = Math.max(Number(offset) || 0, 0);

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ createdAt: "desc" }, { publishedAt: "desc" }],
      take,
      skip,
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

/** Latest published products for home New Arrivals (newest first). */
export async function getHomeNewArrivals(limit = 8) {
  const flagged = await listProducts({ isNewArrival: "true", limit: String(limit) });
  if (flagged.items.length >= limit) return flagged.items;

  const latest = await listProducts({ limit: String(limit) });
  const seen = new Set(flagged.items.map((p) => p.id));
  const merged = [...flagged.items];
  for (const p of latest.items) {
    if (merged.length >= limit) break;
    if (!seen.has(p.id)) merged.push(p);
  }
  return merged;
}

export async function getCatalogProducts(limit = 200) {
  return listProducts({ limit: String(limit) });
}
