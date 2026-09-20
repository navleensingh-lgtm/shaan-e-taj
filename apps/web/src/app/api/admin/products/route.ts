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
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      media: { orderBy: { sortOrder: "asc" } },
    },
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
  const mediaFromBody = normalizeProductMedia(body.media);
  const imagesPayload =
    imagesFromBody.length > 0
      ? imagesFromBody
      : imageUrl
        ? [{ url: imageUrl, isPrimary: true, sortOrder: 0 }]
        : [];

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
      sku: body.sku ? String(body.sku).trim() : null,
      productType: body.productType ? String(body.productType).trim() : null,
      fit: body.fit ? String(body.fit).trim() : "Straight Fit",
      availability: body.availability || "READY_TO_SHIP",
      prepTimeline: body.prepTimeline ? String(body.prepTimeline).trim() : null,
      components: Array.isArray(body.components) ? body.components : [],
      fabricDetails: body.fabricDetails ? String(body.fabricDetails).trim() : null,
      careInstructions: body.careInstructions ? String(body.careInstructions).trim() : null,
      deliveryInfo: body.deliveryInfo ? String(body.deliveryInfo).trim() : null,
      customStitchingInfo: body.customStitchingInfo ? String(body.customStitchingInfo).trim() : null,
      returnsInfo: body.returnsInfo ? String(body.returnsInfo).trim() : null,
      customMeasurements: body.customMeasurements ?? null,
      useMasterSizeGuide: body.useMasterSizeGuide !== false,
      sizeGuide: body.sizeGuide ?? null,
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
      media: mediaFromBody.length
        ? {
            create: mediaFromBody.map((item, index) => ({
              url: item.url,
              kind: item.kind,
              sortOrder: index,
            })),
          }
        : undefined,
    },
    include: { images: true, media: true },
  });

  revalidateShop(product.slug);
  return NextResponse.json({ product });
}
