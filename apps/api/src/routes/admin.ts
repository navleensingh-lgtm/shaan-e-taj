import { Router } from "express";
import { prisma, ProductStatus, OrderStatus, type Prisma } from "@shaan-e-taj/database";
import { requireAdmin } from "../middleware/auth.js";
import { indexProductEmbedding } from "../services/search.js";
import { publishTelegramDraft } from "../services/publish.js";

export const adminRoutes = Router();
adminRoutes.use(requireAdmin);

adminRoutes.get("/dashboard", async (_req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    whatsappClicks,
    newOrders,
    visitors,
    todaySales,
    topProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { type: "whatsapp_click", createdAt: { gte: startOfDay } },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.analyticsEvent.count({
      where: { type: "page_view", createdAt: { gte: startOfDay } },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfDay },
        status: { not: "CANCELLED" },
      },
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
      include: { items: true, user: { select: { name: true, email: true, phone: true } } },
    }),
  ]);

  const topWithNames = await Promise.all(
    topProducts.map(async (t) => {
      const p = await prisma.product.findUnique({
        where: { id: t.productId },
        select: { name: true, slug: true },
      });
      return { ...t, product: p };
    })
  );

  res.json({
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
});

adminRoutes.get("/settings", async (_req, res) => {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  res.json(settings);
});

adminRoutes.patch("/settings", async (req, res) => {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...req.body },
    update: req.body,
  });
  res.json(settings);
});

adminRoutes.get("/products", async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { images: true },
  });
  res.json({ products });
});

adminRoutes.post("/products", async (req, res) => {
  const data = req.body as Prisma.ProductCreateInput;
  const product = await prisma.product.create({
    data: {
      ...data,
      status: ProductStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    include: { images: true },
  });
  await indexProductEmbedding(
    product.id,
    `${product.name} ${product.description}`
  );
  res.json({ product });
});

adminRoutes.delete("/products/:id", async (req, res) => {
  await prisma.product.update({
    where: { id: req.params.id },
    data: { status: ProductStatus.ARCHIVED },
  });
  res.json({ ok: true });
});

adminRoutes.post("/publish-draft/:draftId", async (req, res) => {
  const product = await publishTelegramDraft(req.params.draftId);
  res.json({ product });
});

adminRoutes.get("/orders", async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      items: true,
      user: { select: { name: true, email: true, phone: true } },
    },
  });
  res.json({ orders });
});

adminRoutes.patch("/orders/:id", async (req, res) => {
  const {
    status,
    trackingNumber,
    trackingCarrier,
    trackingUrl,
    estimatedDeliveryAt,
  } = req.body as {
    status?: OrderStatus;
    trackingNumber?: string;
    trackingCarrier?: string;
    trackingUrl?: string;
    estimatedDeliveryAt?: string;
  };

  const existing = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const data: Prisma.OrderUpdateInput = {};
  if (status) data.status = status;
  if (trackingNumber !== undefined) data.trackingNumber = trackingNumber || null;
  if (trackingCarrier !== undefined) data.trackingCarrier = trackingCarrier || null;
  if (trackingUrl !== undefined) data.trackingUrl = trackingUrl || null;

  if (status === OrderStatus.SHIPPED) {
    data.shippedAt = existing.shippedAt ?? new Date();
    if (estimatedDeliveryAt) {
      data.estimatedDeliveryAt = new Date(estimatedDeliveryAt);
    } else if (!existing.estimatedDeliveryAt) {
      const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
      const days = settings?.defaultDeliveryDaysMax ?? 7;
      data.estimatedDeliveryAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
  }

  if (estimatedDeliveryAt && status !== OrderStatus.SHIPPED) {
    data.estimatedDeliveryAt = new Date(estimatedDeliveryAt);
  }

  if (status === OrderStatus.DELIVERED) {
    data.estimatedDeliveryAt = existing.estimatedDeliveryAt ?? new Date();
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data,
    include: { items: true },
  });

  res.json({ order });
});
