import { NextResponse } from "next/server";
import { prisma } from "@shaan-e-taj/database";
import { requireAdminSession } from "@/lib/admin-auth";
import { getSocialConfig, type SocialConfig } from "@/lib/instagram-service";
import { revalidateShop } from "@/lib/revalidate-shop";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getSocialConfig();
  return NextResponse.json({ config });
}

export async function PATCH(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Partial<SocialConfig> = await req.json();

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      socialConfig: body as any,
      whatsappNumber: body.whatsappNumber ?? "919464385993",
      youtubeUrl: body.youtubeChannelUrl ?? "https://www.youtube.com/@Tajfashionjalandhar",
      instagramUrl: body.instagramProfileUrl ?? "https://www.instagram.com/shaan_e_taj/",
    },
    update: {
      socialConfig: body as any,
      ...(body.whatsappNumber ? { whatsappNumber: body.whatsappNumber } : {}),
      ...(body.youtubeChannelUrl ? { youtubeUrl: body.youtubeChannelUrl } : {}),
      ...(body.instagramProfileUrl ? { instagramUrl: body.instagramProfileUrl } : {}),
    },
  });

  revalidateShop();

  return NextResponse.json({ ok: true, config: settings.socialConfig });
}
