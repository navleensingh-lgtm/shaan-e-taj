import { NextResponse } from "next/server";
import { getPublicStoreSettings } from "@/lib/store-settings";

export async function GET() {
  const settings = await getPublicStoreSettings();
  return NextResponse.json(settings);
}
