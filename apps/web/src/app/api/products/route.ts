import { NextRequest, NextResponse } from "next/server";
import { listProducts } from "@/lib/products-server";

export const dynamic = "force-dynamic";

const noCache = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const data = await listProducts(params);
    return NextResponse.json(data, { headers: noCache });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ items: [], total: 0 }, { status: 500 });
  }
}
