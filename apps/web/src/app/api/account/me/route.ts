import { NextResponse } from "next/server";
import { prisma } from "@shaan-e-taj/database";
import { requireUserSession } from "@/lib/user-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const [user, orders, addresses, measurements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, createdAt: true, role: true },
    }),
    prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.savedMeasurement.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user, orders, addresses, measurements });
}
