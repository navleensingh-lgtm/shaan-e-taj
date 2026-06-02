import { Router } from "express";
import { prisma, ProductStatus, Prisma } from "@shaan-e-taj/database";
import { semanticSearch } from "../services/search.js";

export const productRoutes = Router();

productRoutes.get("/", async (req, res) => {
  const {
    mainCategory,
    subCategory,
    minPrice,
    maxPrice,
    color,
    fabric,
    occasion,
    stitchingType,
    inStock,
    isNewArrival,
    q,
    limit = "24",
    offset = "0",
  } = req.query;

  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,
  };

  if (mainCategory) where.mainCategory = String(mainCategory) as Prisma.EnumMainCategoryFilter;
  if (subCategory) where.subCategory = String(subCategory) as Prisma.EnumSubCategoryFilter;
  if (color) where.color = { contains: String(color), mode: "insensitive" };
  if (fabric) where.fabric = { contains: String(fabric), mode: "insensitive" };
  if (occasion) where.occasion = { contains: String(occasion), mode: "insensitive" };
  if (inStock === "true") where.inStock = true;
  if (isNewArrival === "true") where.isNewArrival = true;

  if (minPrice || maxPrice) {
    where.priceInPaise = {};
    if (minPrice) where.priceInPaise.gte = Number(minPrice) * 100;
    if (maxPrice) where.priceInPaise.lte = Number(maxPrice) * 100;
  }

  if (q && String(q).trim()) {
    const ids = await semanticSearch(String(q), 48);
    if (ids.length === 0) {
      return res.json({ items: [], total: 0 });
    }
    where.id = { in: ids };
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

  res.json({ items, total });
});

productRoutes.get("/:slug", async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug, status: ProductStatus.PUBLISHED },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});
