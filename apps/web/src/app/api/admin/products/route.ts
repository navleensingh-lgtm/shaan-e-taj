import { NextResponse } from "next/server";
import {
  prisma,
  ProductStatus,
  PublishSource,
  type MainCategory,
  type SubCategory,
} from "@shaan-e-taj/database";
import { requireAdminSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";
import { revalidateShop } from "@/lib/revalidate-shop";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
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

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: String(body.description ?? name),
      mainCategory: (body.mainCategory as MainCategory) || "PARTY_WEAR",
      subCategory: (body.subCategory as SubCategory) || "PAKISTANI",
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
      images: imageUrl
        ? {
            create: {
              url: imageUrl,
              isPrimary: true,
              sortOrder: 0,
            },
          }
        : undefined,
    },
    include: { images: true },
  });

  revalidateShop();
  return NextResponse.json({ product });
}
