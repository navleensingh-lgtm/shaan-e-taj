import { prisma, OrderStatus, type StitchingType } from "@shaan-e-taj/database";
import {
  type AddressInput,
  billingToOrderFields,
  shippingToOrderFields,
  validateAddress,
} from "@/lib/checkout-address";
import { createRazorpayOrder, verifyPaymentSignature } from "@/lib/razorpay";

function orderNumber() {
  return `SET-${Date.now().toString(36).toUpperCase()}`;
}

export type CheckoutBody = {
  items: { productId: string; quantity: number }[];
  stitchingType?: StitchingType;
  measurements?: Record<string, number>;
  notes?: string;
  shipping: AddressInput;
  billing: AddressInput;
  billingSameAsShipping: boolean;
};

export async function createCheckoutOrder(userId: string, body: CheckoutBody) {
  const shipErr = validateAddress(body.shipping, "Shipping");
  if (shipErr) throw new Error(shipErr);

  const billingAddr = body.billingSameAsShipping ? body.shipping : body.billing;
  const billErr = validateAddress(billingAddr, "Billing");
  if (billErr) throw new Error(billErr);

  if (!body.items?.length) throw new Error("Cart is empty");

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const products = await prisma.product.findMany({
    where: { id: { in: body.items.map((i) => i.productId) }, inStock: true },
  });

  let subtotalPaise = 0;
  const lineItems: { productId: string; name: string; pricePaise: number; quantity: number }[] =
    [];

  for (const line of body.items) {
    const p = products.find((x) => x.id === line.productId);
    if (!p) continue;
    let unit = p.priceInPaise;
    if (body.stitchingType === "FULLY_STITCHED" && p.fullyStitchedPricePaise) {
      unit = p.fullyStitchedPricePaise;
    } else if (body.stitchingType === "FULLY_STITCHED") {
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

  if (!lineItems.length) throw new Error("No valid in-stock products in cart");

  const totalPaise = subtotalPaise;
  const receipt = orderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber: receipt,
      userId,
      guestPhone: body.shipping.phone.replace(/\D/g, "").slice(-10),
      stitchingType: body.stitchingType ?? null,
      measurements: body.measurements ?? undefined,
      subtotalPaise,
      stitchingPaise: 0,
      totalPaise,
      notes: body.notes,
      ...shippingToOrderFields(body.shipping),
      ...billingToOrderFields(billingAddr),
      items: { create: lineItems },
    },
    include: { items: true },
  });

  const rzOrder = await createRazorpayOrder(totalPaise, receipt);
  await prisma.order.update({
    where: { id: order.id },
    data: { razorpayOrderId: rzOrder.id },
  });

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    amountPaise: totalPaise,
    razorpayOrderId: rzOrder.id,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? null,
    mock: "mock" in rzOrder,
  };
}

export async function verifyOrderPayment(
  userId: string,
  body: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }
) {
  const order = await prisma.order.findFirst({
    where: { id: body.orderId, userId },
  });
  if (!order) throw new Error("Order not found");

  const valid = verifyPaymentSignature(
    body.razorpayOrderId,
    body.razorpayPaymentId,
    body.razorpaySignature
  );
  if (!valid && process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Invalid payment signature");
  }

  return prisma.order.update({
    where: { id: body.orderId },
    data: {
      status: OrderStatus.CONFIRMED,
      razorpayPaymentId: body.razorpayPaymentId,
      razorpayOrderId: body.razorpayOrderId,
    },
    include: { items: true },
  });
}

export async function listUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

const CANCELLABLE: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED];

export async function cancelUserOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
  });
  if (!order) throw new Error("Order not found");
  if (order.status === OrderStatus.CANCELLED) throw new Error("Order is already cancelled");
  if (!CANCELLABLE.includes(order.status)) {
    throw new Error("This order can no longer be cancelled. Contact us on WhatsApp for help.");
  }
  return prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.CANCELLED },
    include: { items: true },
  });
}
