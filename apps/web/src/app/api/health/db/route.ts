import { NextResponse } from "next/server";
import { prisma } from "@shaan-e-taj/database";

export async function GET() {
  try {
    const count = await prisma.user.count();
    return NextResponse.json({ ok: true, db: "connected", users: count });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
