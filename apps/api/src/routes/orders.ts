import { Router } from "express";
import { prisma, OrderStatus, StitchingType } from "@shaan-e-taj/database";
import { requireUser, type AuthedRequest } from "../middleware/auth.js";
import { createRazorpayOrder, verifyPaymentSignature } from "../services/razorpay.js";

export const orderRoutes = Router();

function orderNumber() {
  return `SET-${Date.now().toString(36).toUpperCase()}`;
}

orderRoutes.get("/", requireUser, async (req, res) => {
  const { user } = req as AuthedRequest;
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
});

orderRoutes.post("/checkout", requireUser, async (req, res) => {
  const { user } = req as AuthedRequest;
  const {
    items,
    stitchingType,
    measurements,
    guestPhone,
    notes,
    shipping,
    billing,
    billingSameAsShipping,
  } = req.body as {
    items: { productId: string; quantity: number }[];
    stitchingType?: StitchingType;
    measurements?: Record<string, number>;
    guestPhone?: string;
    notes?: string;
    shipping?: {
      fullName: string;
      phone: string;
      email: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
    };
    billing?: typeof shipping;
    billingSameAsShipping?: boolean;
  };

  if (!items?.length) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, inStock: true },
  });

  let subtotalPaise = 0;
  const lineItems: { productId: string; name: string; pricePaise: number; quantity: number }[] =
    [];

  for (const line of items) {
    const p = products.find((x) => x.id === line.productId);
    if (!p) continue;
    let unit = p.priceInPaise;
    if (stitchingType === "FULLY_STITCHED" && p.fullyStitchedPricePaise) {
      unit = p.fullyStitchedPricePaise;
    } else if (stitchingType === "FULLY_STITCHED") {
      unit += settings?.fullStitchChargePaise ?? 80000;
    }
    subtotalPaise += unit * line.quantity;
    lineItems.push({
      productId: p.id,
      name: p.name,
      pricePaise: unit,
      quantity: line.quantity,
    });
  }

  if (!lineItems.length) {
    res.status(400).json({ error: "No valid products" });
    return;
  }

  const stitchingPaise = 0;
  const totalPaise = subtotalPaise + stitchingPaise;
  const receipt = orderNumber();

  const ship = shipping;
  const bill = billingSameAsShipping !== false ? ship : billing;
  if (!ship?.line1 || !ship.fullName) {
    res.status(400).json({ error: "Shipping address is required" });
    return;
  }
  if (!bill?.line1 || !bill.fullName) {
    res.status(400).json({ error: "Billing address is required" });
    return;
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: receipt,
      userId: user.id,
      guestPhone: guestPhone ?? ship.phone?.replace(/\D/g, "").slice(-10),
      stitchingType: stitchingType ?? null,
      measurements: measurements ?? undefined,
      subtotalPaise,
      stitchingPaise,
      totalPaise,
      notes,
      shippingName: ship.fullName.trim(),
      shippingPhone: ship.phone.replace(/\D/g, "").slice(-10),
      shippingEmail: ship.email.trim().toLowerCase(),
      shippingLine1: ship.line1.trim(),
      shippingLine2: ship.line2?.trim() || null,
      shippingCity: ship.city.trim(),
      shippingState: ship.state.trim(),
      shippingPincode: ship.pincode.trim(),
      billingName: bill.fullName.trim(),
      billingPhone: bill.phone.replace(/\D/g, "").slice(-10),
      billingLine1: bill.line1.trim(),
      billingLine2: bill.line2?.trim() || null,
      billingCity: bill.city.trim(),
      billingState: bill.state.trim(),
      billingPincode: bill.pincode.trim(),
      items: { create: lineItems },
    },
    include: { items: true },
  });

  const rzOrder = await createRazorpayOrder(totalPaise, receipt);
  await prisma.order.update({
    where: { id: order.id },
    data: { razorpayOrderId: rzOrder.id },
  });

  res.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    amountPaise: totalPaise,
    razorpayOrderId: rzOrder.id,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? null,
    mock: "mock" in rzOrder,
  });
});

orderRoutes.post("/verify-payment", requireUser, async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const valid = verifyPaymentSignature(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );
  if (!valid && process.env.RAZORPAY_KEY_SECRET) {
    res.status(400).json({ error: "Invalid payment signature" });
    return;
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.CONFIRMED,
      razorpayPaymentId,
      razorpayOrderId,
    },
  });
  res.json({ ok: true, order: updated });
});

const CANCELLABLE: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
];

orderRoutes.post("/:id/cancel", requireUser, async (req, res) => {
  const { user } = req as AuthedRequest;
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: user.id },
  });

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (order.status === OrderStatus.CANCELLED) {
    res.status(400).json({ error: "Order is already cancelled" });
    return;
  }

  if (!CANCELLABLE.includes(order.status)) {
    res.status(400).json({
      error: "This order can no longer be cancelled. Contact us on WhatsApp for help.",
    });
    return;
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.CANCELLED },
    include: { items: true },
  });

  res.json({ ok: true, order: updated });
});
