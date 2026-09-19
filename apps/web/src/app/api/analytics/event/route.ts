import { NextResponse } from "next/server";
import { prisma } from "@shaan-e-taj/database";

export async function POST(req: Request) {
  try {
    const { type, productId, userId, metadata } = await req.json();
    if (typeof type !== "string" || !type.trim()) {
      return NextResponse.json({ error: "type required" }, { status: 400 });
    }

    await prisma.analyticsEvent.create({
      data: {
        type: type.trim(),
        productId: typeof productId === "string" ? productId : undefined,
        userId: typeof userId === "string" ? userId : undefined,
        metadata: metadata && typeof metadata === "object" ? metadata : undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[analytics/event]", error);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
