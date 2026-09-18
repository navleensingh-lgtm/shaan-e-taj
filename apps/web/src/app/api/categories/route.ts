import { NextResponse } from "next/server";
import { CategoryKind } from "@shaan-e-taj/database";
import { listCategories } from "@/lib/categories-server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const kindParam = new URL(req.url).searchParams.get("kind");
    const kind =
      kindParam === "MAIN"
        ? CategoryKind.MAIN
        : kindParam === "SUB"
          ? CategoryKind.SUB
          : undefined;
    const categories = await listCategories(kind);
    return NextResponse.json({ categories });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
