export type AddressInput = {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

export const emptyAddress = (): AddressInput => ({
  fullName: "",
  phone: "",
  email: "",
  line1: "",
  line2: "",
  city: "",
  state: "Punjab",
  pincode: "",
});

export function validateAddress(addr: AddressInput, label: string): string | null {
  if (!addr.fullName.trim()) return `${label}: full name is required`;
  if (!/^\d{10}$/.test(addr.phone.replace(/\D/g, "").slice(-10))) {
    return `${label}: enter a valid 10-digit phone number`;
  }
  if (!addr.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr.email.trim())) {
    return `${label}: valid email is required`;
  }
  if (!addr.line1.trim()) return `${label}: address line 1 is required`;
  if (!addr.city.trim()) return `${label}: city is required`;
  if (!addr.state.trim()) return `${label}: state is required`;
  if (!/^\d{6}$/.test(addr.pincode.trim())) return `${label}: enter a valid 6-digit PIN code`;
  return null;
}

export function formatAddressBlock(addr: AddressInput): string {
  const lines = [
    addr.fullName,
    addr.line1,
    addr.line2?.trim() || null,
    `${addr.city}, ${addr.state} ${addr.pincode}`,
    `Phone: ${addr.phone}`,
    `Email: ${addr.email}`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function shippingToOrderFields(addr: AddressInput) {
  return {
    shippingName: addr.fullName.trim(),
    shippingPhone: addr.phone.replace(/\D/g, "").slice(-10),
    shippingEmail: addr.email.trim().toLowerCase(),
    shippingLine1: addr.line1.trim(),
    shippingLine2: addr.line2.trim() || null,
    shippingCity: addr.city.trim(),
    shippingState: addr.state.trim(),
    shippingPincode: addr.pincode.trim(),
  };
}

export function billingToOrderFields(addr: AddressInput) {
  return {
    billingName: addr.fullName.trim(),
    billingPhone: addr.phone.replace(/\D/g, "").slice(-10),
    billingLine1: addr.line1.trim(),
    billingLine2: addr.line2.trim() || null,
    billingCity: addr.city.trim(),
    billingState: addr.state.trim(),
    billingPincode: addr.pincode.trim(),
  };
}
