import { NextResponse } from "next/server";
import { prisma } from "@shaan-e-taj/database";
import { requireAdminSession } from "@/lib/admin-auth";
import { DEFAULT_HOMEPAGE_CMS, normalizeHomepageCms } from "@/lib/homepage-cms";
import { revalidateShop } from "@/lib/revalidate-shop";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const cms = normalizeHomepageCms(settings?.homepageCms);
  return NextResponse.json({ cms });
}

export async function PATCH(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const normalized = normalizeHomepageCms(body);

  // Sync heroVideoUrl with siteSettings for backward compatibility
  const heroVideo = normalized.hero.videoUrl ?? undefined;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      homepageCms: normalized as any,
      heroVideoUrl: heroVideo,
    },
    update: {
      homepageCms: normalized as any,
      ...(heroVideo !== undefined ? { heroVideoUrl: heroVideo } : {}),
    },
  });

  revalidateShop();

  return NextResponse.json({ ok: true, cms: normalizeHomepageCms(settings.homepageCms) });
}
