import { NextResponse } from "next/server";
import { prisma } from "@shaan-e-taj/database";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      items: true,
      user: { select: { name: true, email: true, phone: true } },
    },
  });
  return NextResponse.json({ orders });
}
