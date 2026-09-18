import { NextResponse } from "next/server";
import { getPublicStoreSettings } from "@/lib/store-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getPublicStoreSettings();
  return NextResponse.json(settings, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
}
