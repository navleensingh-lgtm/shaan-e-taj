export type TrackableOrder = {
  status: string;
  createdAt: string;
  shippedAt?: string | null;
  estimatedDeliveryAt?: string | null;
  trackingNumber?: string | null;
  trackingCarrier?: string | null;
  trackingUrl?: string | null;
};

const LABELS = ["Order placed", "Confirmed", "In stitching", "Shipped", "Delivered"];
const STATUS_ORDER = ["PENDING", "CONFIRMED", "IN_STITCHING", "SHIPPED", "DELIVERED"];

export function getTrackingSteps(status: string) {
  if (status === "CANCELLED") return null;
  const idx = STATUS_ORDER.indexOf(status);
  const active = idx >= 0 ? idx : 0;
  return LABELS.map((label, i) => ({
    label,
    done: i <= active,
    current: i === active,
  }));
}

export function getDeliveryEstimate(order: TrackableOrder): string | null {
  if (order.status === "DELIVERED") return "Delivered to you. Thank you for shopping with Shaan-e-Taj!";
  if (order.status === "CANCELLED") return null;
  if (order.status === "SHIPPED") {
    if (order.estimatedDeliveryAt) {
      const eta = new Date(order.estimatedDeliveryAt);
      const days = Math.ceil((eta.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (days <= 0) return "Your parcel is arriving very soon!";
      if (days === 1) return "Expected delivery in about 1 day.";
      return `Expected delivery in about ${days} days (by ${eta.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}).`;
    }
    return "Your order has been shipped. Delivery date will be updated shortly.";
  }
  if (order.status === "IN_STITCHING") {
    return "Your outfit is being stitched with care. We will notify you when it ships.";
  }
  if (order.status === "CONFIRMED") {
    return "Order confirmed. Typical delivery is 5–7 days after shipping.";
  }
  if (order.status === "PENDING") {
    return "Order received. Tracking will appear once payment is confirmed and order ships.";
  }
  return null;
}
