import { NextResponse } from "next/server";
import { prisma, OrderStatus, type Prisma } from "@shaan-e-taj/database";
import { requireAdminSession } from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const data: Prisma.OrderUpdateInput = {};
  const { status, trackingNumber, trackingCarrier, trackingUrl, estimatedDeliveryAt } = body;

  if (status) data.status = status as OrderStatus;
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
    where: { id },
    data,
    include: { items: true },
  });

  return NextResponse.json({ order });
}
