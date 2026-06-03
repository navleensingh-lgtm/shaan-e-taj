type OrderAddress = {
  shippingName?: string | null;
  shippingPhone?: string | null;
  shippingEmail?: string | null;
  shippingLine1?: string | null;
  shippingLine2?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPincode?: string | null;
  billingName?: string | null;
  billingPhone?: string | null;
  billingLine1?: string | null;
  billingLine2?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingPincode?: string | null;
};

function block(
  label: string,
  name?: string | null,
  phone?: string | null,
  line1?: string | null,
  line2?: string | null,
  city?: string | null,
  state?: string | null,
  pincode?: string | null,
  email?: string | null
) {
  if (!line1 && !name) return null;
  const lines = [
    `${label}`,
    name,
    line1,
    line2 || null,
    city && state ? `${city}, ${state} ${pincode ?? ""}`.trim() : null,
    phone ? `Phone: ${phone}` : null,
    email ? `Email: ${email}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

export function formatOrderAddresses(order: OrderAddress): {
  shipping: string | null;
  billing: string | null;
} {
  const shipping = block(
    "Ship to",
    order.shippingName,
    order.shippingPhone,
    order.shippingLine1,
    order.shippingLine2,
    order.shippingCity,
    order.shippingState,
    order.shippingPincode,
    order.shippingEmail
  );
  const billing = block(
    "Bill to",
    order.billingName,
    order.billingPhone,
    order.billingLine1,
    order.billingLine2,
    order.billingCity,
    order.billingState,
    order.billingPincode
  );
  const same =
    order.shippingLine1 &&
    order.billingLine1 &&
    order.shippingLine1 === order.billingLine1 &&
    order.shippingName === order.billingName;
  return {
    shipping,
    billing: same ? null : billing,
  };
}
