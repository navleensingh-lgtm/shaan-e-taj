import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  uploadProductFile,
  getDirectUploadInstructions,
} from "@/lib/r2-upload";
import { revalidateShop } from "@/lib/revalidate-shop";
import {
  ALLOWED_PRODUCT_IMAGE_TYPES,
  ALLOWED_PRODUCT_VIDEO_TYPES,
  MAX_PRODUCT_IMAGE_SIZE,
  MAX_PRODUCT_VIDEO_SIZE,
} from "@/lib/product-media";

export const runtime = "nodejs";
export const maxDuration = 300;

const ALLOWED_IMAGES = new Set<string>(ALLOWED_PRODUCT_IMAGE_TYPES);
const ALLOWED_VIDEOS = new Set<string>(ALLOWED_PRODUCT_VIDEO_TYPES);

/**
 * GET /api/admin/upload?filename=...&contentType=...&size=...
 * Returns R2 direct upload instructions (presigned S3 PUT URL)
 * so the client can upload large files (up to 500 MB images / 1 GB videos) directly without hitting
 * serverless body size limits (e.g. 4.5 MB on Vercel, reverse proxy limits, etc.).
 */
export async function GET(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename") ?? "file";
  const contentType = searchParams.get("contentType") ?? "";
  const size = Number(searchParams.get("size") || 0);

  const isImage = ALLOWED_IMAGES.has(contentType);
  const isVideo = ALLOWED_VIDEOS.has(contentType);

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Use JPG, PNG, WebP, HEIC, MP4, WebM, or MOV files" },
      { status: 400 }
    );
  }

  if (isVideo && size > MAX_PRODUCT_VIDEO_SIZE) {
    return NextResponse.json({ error: "Video must be 1 GB or smaller." }, { status: 400 });
  }

  if (isImage && size > MAX_PRODUCT_IMAGE_SIZE) {
    return NextResponse.json({ error: "Image must be 500 MB or smaller." }, { status: 400 });
  }

  try {
    const instructions = await getDirectUploadInstructions(filename, contentType);
    return NextResponse.json({
      direct: true,
      ...instructions,
      kind: isVideo ? "VIDEO" : "IMAGE",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "R2 upload configuration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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

  if (isVideo && file.size > MAX_PRODUCT_VIDEO_SIZE) {
    return NextResponse.json({ error: "Video must be 1 GB or smaller." }, { status: 400 });
  }

  if (isImage && file.size > MAX_PRODUCT_IMAGE_SIZE) {
    return NextResponse.json({ error: "Image must be 500 MB or smaller." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    // In production, uploadProductFile will throw if cloud storage is missing.
    const { url, storage } = await uploadProductFile(buffer, file.type, file.name);

    revalidateShop();

    return NextResponse.json({ url, storage, kind: isVideo ? "VIDEO" : "IMAGE" });
  } catch (err) {
    console.error("[admin/upload]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
