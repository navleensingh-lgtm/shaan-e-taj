import { NextResponse } from "next/server";
import { prisma } from "@shaan-e-taj/database";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...body },
    update: body,
  });
  return NextResponse.json(settings);
}
