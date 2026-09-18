import { NextResponse } from "next/server";
import { requireUserSession } from "@/lib/user-auth";
import { listUserOrders } from "@/lib/orders-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await listUserOrders(session.user.id);
  return NextResponse.json({ orders });
}
