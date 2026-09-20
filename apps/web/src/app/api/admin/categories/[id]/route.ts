import { NextResponse } from "next/server";
import { prisma, CategoryKind } from "@shaan-e-taj/database";
import { requireAdminSession } from "@/lib/admin-auth";
import { countProductsUsingCategorySlug, slugifyCategory } from "@/lib/categories-server";
import { revalidateShop } from "@/lib/revalidate-shop";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const body = await req.json();
  const data: {
    name?: string;
    slug?: string;
    description?: string | null;
    imageUrl?: string | null;
    kind?: CategoryKind;
    sortOrder?: number;
  } = {};

  if (body.name != null) {
    const name = String(body.name).trim();
    if (!name) return NextResponse.json({ error: "Category name cannot be empty" }, { status: 400 });
    data.name = name;
  }

  if (body.slug != null) {
    const slug = String(body.slug).trim().toUpperCase() || slugifyCategory(data.name ?? existing.name);
    if (slug !== existing.slug) {
      const conflict = await prisma.category.findUnique({ where: { slug } });
      if (conflict) {
        return NextResponse.json({ error: "Another category already uses this slug" }, { status: 409 });
      }
      const productCount = await countProductsUsingCategorySlug(existing.slug);
      if (productCount > 0) {
        await prisma.product.updateMany({
          where: { mainCategory: existing.slug },
          data: { mainCategory: slug },
        });
        await prisma.product.updateMany({
          where: { subCategory: existing.slug },
          data: { subCategory: slug },
        });
      }
      data.slug = slug;
    }
  }

  if (body.description !== undefined) {
    data.description = body.description ? String(body.description).trim() : null;
  }
  if (body.imageUrl !== undefined) {
    data.imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
  }
  if (body.kind != null) {
    data.kind = String(body.kind).toUpperCase() === "SUB" ? CategoryKind.SUB : CategoryKind.MAIN;
  }
  if (body.sortOrder != null) {
    data.sortOrder = Number(body.sortOrder) || 0;
  }

  const category = await prisma.category.update({ where: { id }, data });
  revalidateShop();
  return NextResponse.json({ category });
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const productCount = await countProductsUsingCategorySlug(existing.slug);
  if (productCount > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete: ${productCount} product(s) use this category. Reassign them first.`,
        productCount,
      },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });
  revalidateShop();
  return NextResponse.json({ ok: true });
}
