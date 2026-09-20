import { NextResponse } from "next/server";
import { prisma, CategoryKind } from "@shaan-e-taj/database";
import { requireAdminSession } from "@/lib/admin-auth";
import { countProductsUsingCategorySlug, listCategories, slugifyCategory } from "@/lib/categories-server";
import { revalidateShop } from "@/lib/revalidate-shop";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const categories = await listCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }

  const kindRaw = String(body.kind ?? "MAIN").toUpperCase();
  const kind = kindRaw === "SUB" ? CategoryKind.SUB : CategoryKind.MAIN;
  let slug = String(body.slug ?? slugifyCategory(name)).trim() || slugifyCategory(name);
  slug = slug.toUpperCase();

  const duplicate = await prisma.category.findUnique({ where: { slug } });
  if (duplicate) {
    return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      kind,
      description: body.description ? String(body.description).trim() : null,
      imageUrl: body.imageUrl ? String(body.imageUrl).trim() : null,
      sortOrder: Number(body.sortOrder) || 0,
    },
  });

  revalidateShop();
  return NextResponse.json({ category });
}
