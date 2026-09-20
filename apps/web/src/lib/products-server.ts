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
    productType,
    availability,
    inStock,
    isNewArrival,
    sortBy,
    limit = "24",
    offset = "0",
  } = query;

  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,
  };

  if (mainCategory) where.mainCategory = mainCategory;
  if (subCategory) where.subCategory = subCategory;
  if (productType) where.productType = { contains: productType, mode: "insensitive" };
  if (availability) where.availability = availability;
  if (color) where.color = { contains: color, mode: "insensitive" };
  if (fabric) where.fabric = { contains: fabric, mode: "insensitive" };
  if (occasion) where.occasion = { contains: occasion, mode: "insensitive" };
  if (inStock === "true") where.inStock = true;
  if (isNewArrival === "true") where.isNewArrival = true;

  const search = q?.trim();
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { color: { contains: search, mode: "insensitive" } },
      { fabric: { contains: search, mode: "insensitive" } },
      { occasion: { contains: search, mode: "insensitive" } },
      { productType: { contains: search, mode: "insensitive" } },
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

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [
    { createdAt: "desc" },
    { publishedAt: "desc" },
  ];

  if (sortBy === "price_asc") {
    orderBy = [{ priceInPaise: "asc" }];
  } else if (sortBy === "price_desc") {
    orderBy = [{ priceInPaise: "desc" }];
  } else if (sortBy === "featured") {
    orderBy = [{ isNewArrival: "desc" }, { createdAt: "desc" }];
  } else if (sortBy === "newest") {
    orderBy = [{ publishedAt: "desc" }, { createdAt: "desc" }];
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        media: { orderBy: { sortOrder: "asc" } },
      },
      orderBy,
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
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      media: { orderBy: { sortOrder: "asc" } },
    },
  });
}

/** Latest published products for home New Arrivals (newest first). */
export async function getHomeNewArrivals(limit = 8) {
  try {
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
  } catch (error) {
    console.warn("New arrivals unavailable until the database is connected.", error);
    return [];
  }
}

export async function getCatalogProducts(limit = 200) {
  return listProducts({ limit: String(limit) });
}

export async function getRelatedProducts(product: {
  id: string;
  mainCategory: string;
  subCategory?: string;
  occasion?: string | null;
}, limit = 4) {
  try {
    const related = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        status: ProductStatus.PUBLISHED,
        OR: [
          { mainCategory: product.mainCategory },
          { subCategory: product.subCategory },
          product.occasion ? { occasion: product.occasion } : undefined,
        ].filter(Boolean) as Prisma.ProductWhereInput[],
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        media: { orderBy: { sortOrder: "asc" } },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    if (related.length < limit) {
      const more = await prisma.product.findMany({
        where: {
          id: { notIn: [product.id, ...related.map((r) => r.id)] },
          status: ProductStatus.PUBLISHED,
        },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          media: { orderBy: { sortOrder: "asc" } },
        },
        take: limit - related.length,
        orderBy: { createdAt: "desc" },
      });
      return [...related, ...more];
    }

    return related;
  } catch (err) {
    console.warn("Could not fetch related products:", err);
    return [];
  }
}
