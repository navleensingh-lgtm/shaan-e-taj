import { NextResponse } from "next/server";
import {
  prisma,
  ProductStatus,
  type MainCategory,
  type SubCategory,
  type Prisma,
} from "@shaan-e-taj/database";
import { requireAdminSession } from "@/lib/admin-auth";
import { revalidateShop } from "@/lib/revalidate-shop";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const data: Prisma.ProductUpdateInput = {};

  if (body.name != null) data.name = String(body.name).trim();
  if (body.slug != null) data.slug = String(body.slug).trim();
  if (body.description != null) data.description = String(body.description);
  if (body.mainCategory != null) data.mainCategory = body.mainCategory as MainCategory;
  if (body.subCategory != null) data.subCategory = body.subCategory as SubCategory;
  if (body.fabric !== undefined) data.fabric = body.fabric || null;
  if (body.color !== undefined) data.color = body.color || null;
  if (body.badge !== undefined) data.badge = body.badge || null;
  if (body.priceInPaise != null) {
    const price = Math.round(Number(body.priceInPaise));
    if (price <= 0) {
      return NextResponse.json({ error: "Price must be greater than 0" }, { status: 400 });
    }
    data.priceInPaise = price;
  }
  if (body.compareAtPaise !== undefined) {
    const compare = body.compareAtPaise === "" || body.compareAtPaise == null
      ? null
      : Math.round(Number(body.compareAtPaise));
    const price =
      data.priceInPaise != null
        ? (data.priceInPaise as number)
        : existing.priceInPaise;
    data.compareAtPaise = compare && compare > price ? compare : null;
  }
  if (body.isNewArrival != null) data.isNewArrival = Boolean(body.isNewArrival);
  if (body.inStock != null) data.inStock = Boolean(body.inStock);
  if (body.stitchingAvailable != null) data.stitchingAvailable = Boolean(body.stitchingAvailable);
  if (body.status != null) {
    data.status = body.status as ProductStatus;
    if (body.status === ProductStatus.PUBLISHED) {
      data.publishedAt = existing.publishedAt ?? new Date();
      if (body.isNewArrival == null && !existing.isNewArrival) {
        data.isNewArrival = true;
      }
    }
  }

  let updated = await prisma.product.update({
    where: { id },
    data,
    include: { images: true },
  });

  if (body.imageUrl !== undefined) {
    const url = String(body.imageUrl).trim();
    if (url) {
      const primary = updated.images.find((i) => i.isPrimary) ?? updated.images[0];
      if (primary) {
        await prisma.productImage.update({ where: { id: primary.id }, data: { url } });
      } else {
        await prisma.productImage.create({
          data: { productId: id, url, isPrimary: true, sortOrder: 0 },
        });
      }
    }
    const refreshed = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
    if (refreshed) updated = refreshed;
  }

  revalidateShop(updated.slug);
  return NextResponse.json({ product: updated });
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.product.update({
    where: { id },
    data: { status: ProductStatus.ARCHIVED, inStock: false },
  });
  revalidateShop();
  return NextResponse.json({ ok: true });
}
