import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { uploadProductImage } from "@/lib/r2-upload";
import { revalidateShop } from "@/lib/revalidate-shop";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

export async function POST(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No image file provided" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Use JPG, PNG, or WebP only" },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Max file size 4 MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { url, storage } = await uploadProductImage(buffer, file.type, file.name);

  revalidateShop();

  return NextResponse.json({ url, storage });
}
