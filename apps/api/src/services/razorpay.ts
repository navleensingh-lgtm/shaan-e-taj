import crypto from "node:crypto";
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export function getRazorpay(): Razorpay | null {
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function createRazorpayOrder(amountPaise: number, receipt: string) {
  const rz = getRazorpay();
  if (!rz) {
    return { id: `mock_${receipt}`, amount: amountPaise, currency: "INR", mock: true };
  }
  return rz.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
  });
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!keySecret) return true;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");
  return expected === signature;
}
