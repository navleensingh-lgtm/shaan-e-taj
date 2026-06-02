import { Router } from "express";
import { prisma } from "@shaan-e-taj/database";

export const analyticsRoutes = Router();

analyticsRoutes.post("/event", async (req, res) => {
  const { type, productId, userId, metadata } = req.body ?? {};
  if (!type) {
    res.status(400).json({ error: "type required" });
    return;
  }
  await prisma.analyticsEvent.create({
    data: {
      type,
      productId,
      userId,
      metadata: metadata ?? undefined,
    },
  });
  res.json({ ok: true });
});

analyticsRoutes.get("/dashboard", async (_req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [whatsappClicks, newOrders, visitors] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { type: "whatsapp_click", createdAt: { gte: startOfDay } },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.analyticsEvent.count({
      where: { type: "page_view", createdAt: { gte: startOfDay } },
    }),
  ]);

  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  res.json({
    today: {
      whatsappClicks,
      newOrders,
      visitors,
      conversionRate: visitors > 0 ? whatsappClicks / visitors : 0,
    },
    topProducts,
  });
});
