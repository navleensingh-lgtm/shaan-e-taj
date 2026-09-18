import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { uploadProductFile } from "@/lib/r2-upload";
import { revalidateShop } from "@/lib/revalidate-shop";
import { MAX_PRODUCT_VIDEO_SIZE } from "@/lib/product-media";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = MAX_PRODUCT_VIDEO_SIZE;
const ALLOWED_IMAGES = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg", "image/heic", "image/heif"]);
const ALLOWED_VIDEOS = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export async function POST(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isImage = ALLOWED_IMAGES.has(file.type);
  const isVideo = ALLOWED_VIDEOS.has(file.type);
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Use JPG, PNG, WebP, HEIC, MP4, WebM, or MOV files" },
      { status: 400 }
    );
  }

  if (file.size > (isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES)) {
    return NextResponse.json(
      { error: isVideo ? "Video must be 200 MB or smaller." : "Max image size is 8 MB" },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, storage } = await uploadProductFile(buffer, file.type, file.name);

    revalidateShop();

    return NextResponse.json({ url, storage, kind: isVideo ? "VIDEO" : "IMAGE" });
  } catch (err) {
    console.error("[admin/upload]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
