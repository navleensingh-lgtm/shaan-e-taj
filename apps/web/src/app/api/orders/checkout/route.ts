import { NextRequest, NextResponse } from "next/server";
import { requireUserSession } from "@/lib/user-auth";
import { createCheckoutOrder, type CheckoutBody } from "@/lib/orders-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await requireUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as CheckoutBody;
    const result = await createCheckoutOrder(session.user.id, body);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
