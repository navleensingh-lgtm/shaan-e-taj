import { NextResponse } from "next/server";
import { prisma } from "@shaan-e-taj/database";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [whatsappClicks, newOrders, visitors, todaySales, topProducts, recentOrders] =
    await Promise.all([
      prisma.analyticsEvent.count({
        where: { type: "whatsapp_click", createdAt: { gte: startOfDay } },
      }),
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.analyticsEvent.count({
        where: { type: "page_view", createdAt: { gte: startOfDay } },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfDay }, status: { not: "CANCELLED" } },
        _sum: { totalPaise: true },
      }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, phone: true } },
        },
      }),
    ]);

  const topWithNames = await Promise.all(
    topProducts.map(async (t) => {
      const product = await prisma.product.findUnique({
        where: { id: t.productId },
        select: { name: true, slug: true },
      });
      return { ...t, product };
    })
  );

  return NextResponse.json({
    today: {
      salesPaise: todaySales._sum.totalPaise ?? 0,
      newOrders,
      visitors,
      whatsappClicks,
      conversionRate: visitors > 0 ? whatsappClicks / visitors : 0,
    },
    topProducts: topWithNames,
    recentOrders,
  });
}
