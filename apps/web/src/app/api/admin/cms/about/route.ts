import { NextResponse } from "next/server";
import { prisma } from "@shaan-e-taj/database";
import { requireAdminSession } from "@/lib/admin-auth";
import { DEFAULT_ABOUT_CMS, normalizeAboutCms } from "@/lib/about-cms";
import { revalidateShop } from "@/lib/revalidate-shop";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  // Stored under siteSettings.homepageCms.about or fallback
  const rawHomepageCms = settings?.homepageCms as any;
  const aboutCms = normalizeAboutCms(rawHomepageCms?.about);
  return NextResponse.json({ cms: aboutCms });
}

export async function PATCH(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const normalized = normalizeAboutCms(body);

  const existing = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const rawHomepageCms = (existing?.homepageCms as Record<string, any>) || {};

  const updatedHomepageCms = {
    ...rawHomepageCms,
    about: normalized,
  };

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      homepageCms: updatedHomepageCms,
    },
    update: {
      homepageCms: updatedHomepageCms,
    },
  });

  revalidateShop();

  return NextResponse.json({ ok: true, cms: normalized });
}
