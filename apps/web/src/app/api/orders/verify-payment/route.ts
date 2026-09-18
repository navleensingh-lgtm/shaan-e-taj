import { NextRequest, NextResponse } from "next/server";
import { requireUserSession } from "@/lib/user-auth";
import { verifyOrderPayment } from "@/lib/orders-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await requireUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const order = await verifyOrderPayment(session.user.id, body);
    return NextResponse.json({ ok: true, order });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Payment verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
