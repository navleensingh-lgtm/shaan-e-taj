import { NextResponse } from "next/server";
import {
  prisma,
  ProductStatus,
  PublishSource,
} from "@shaan-e-taj/database";
import { requireAdminSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";
import { revalidateShop } from "@/lib/revalidate-shop";
import { normalizeProductImages, normalizeProductMedia } from "@/lib/product-media";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { images: { orderBy: { sortOrder: "asc" } }, media: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  let slug = String(body.slug ?? slugify(name)).trim() || slugify(name);
  const existingSlug = await prisma.product.findUnique({ where: { slug } });
  if (existingSlug) slug = `${slug}-${Date.now().toString(36)}`;

  const priceInPaise = Math.round(Number(body.priceInPaise) || 0);
  const compareAtRaw = body.compareAtPaise;
  const compareAtPaise =
    compareAtRaw != null && compareAtRaw !== ""
      ? Math.round(Number(compareAtRaw))
      : null;

  const imageUrl = String(body.imageUrl ?? "").trim();
  const imagesFromBody = normalizeProductImages(body.images);
  const imagesPayload =
    imagesFromBody.length > 0
      ? imagesFromBody
      : imageUrl
        ? [{ url: imageUrl, isPrimary: true, sortOrder: 0 }]
        : [];
  const media = normalizeProductMedia(body.media);
  if (Array.isArray(body.media) && body.media.length > 0 && media.length === 0) {
    return NextResponse.json(
      { error: "One or more video URLs are invalid. Check YouTube, Shorts, or Instagram Reel links." },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: String(body.description ?? name),
      mainCategory: String(body.mainCategory ?? "").trim() || "PARTY_WEAR",
      subCategory: String(body.subCategory ?? "").trim() || "OTHER",
      fabric: body.fabric || null,
      color: body.color || null,
      occasion: body.occasion || null,
      priceInPaise,
      compareAtPaise: compareAtPaise && compareAtPaise > priceInPaise ? compareAtPaise : null,
      badge: body.badge || null,
      status: body.status === "DRAFT" ? ProductStatus.DRAFT : ProductStatus.PUBLISHED,
      isNewArrival: body.isNewArrival !== false,
      inStock: body.inStock !== false,
      stitchingAvailable: body.stitchingAvailable !== false,
      publishSource: PublishSource.ADMIN,
      publishedAt: body.status === "DRAFT" ? null : new Date(),
      images: imagesPayload.length
        ? {
            create: imagesPayload.map((img, index) => ({
              url: img.url,
              isPrimary: img.isPrimary ?? index === 0,
              sortOrder: img.sortOrder ?? index,
              alt: img.alt ?? null,
            })),
          }
        : undefined,
      media: media.length
        ? { create: media.map((item, index) => ({ ...item, sortOrder: index })) }
        : undefined,
    },
    include: { images: true, media: { orderBy: { sortOrder: "asc" } } },
  });

  revalidateShop(product.slug);
  return NextResponse.json({ product });
}
