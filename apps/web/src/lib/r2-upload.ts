import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY?.trim();
const supabaseBucket = process.env.SUPABASE_BUCKET ?? "product-images";

const r2AccountId = process.env.R2_ACCOUNT_ID?.trim();
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
const r2Bucket = process.env.R2_BUCKET_NAME ?? "shaanetaj-products";
const r2PublicUrl = process.env.R2_PUBLIC_URL?.trim();

export type UploadStorage = "r2" | "supabase" | "local";

export type DirectUploadInstructions = {
  storage: "r2" | "supabase";
  uploadUrl: string;
  publicUrl: string;
  method: "PUT" | "POST";
  headers: Record<string, string>;
};

let r2Client: S3Client | null = null;

function getR2Client(): S3Client | null {
  if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey) return null;
  if (!r2Client) {
    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: r2AccessKeyId, secretAccessKey: r2SecretAccessKey },
    });
  }
  return r2Client;
}

function isPlaceholderSecret(value: string | undefined): boolean {
  if (!value) return true;
  return /paste|change-me|your_|here|xxx|example|todo/i.test(value);
}

function isR2Configured(): boolean {
  return Boolean(
    r2AccountId &&
      r2AccessKeyId &&
      r2SecretAccessKey &&
      !isPlaceholderSecret(r2AccessKeyId) &&
      !isPlaceholderSecret(r2SecretAccessKey)
  );
}

function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseServiceKey) return false;
  if (isPlaceholderSecret(supabaseServiceKey)) return false;
  return true;
}

function safeExt(filename: string, contentType: string): string {
  const fromName = filename.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (fromName && fromName.length <= 8) return fromName;
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("heic") || contentType.includes("heif")) return "heic";
  if (contentType.includes("mp4")) return "mp4";
  if (contentType.includes("webm")) return "webm";
  if (contentType.includes("quicktime")) return "mov";
  return "bin";
}

function objectKey(filename: string, contentType: string): string {
  const baseName = filename.replace(/\.[^.]+$/, "").replace(/[^\w.-]/g, "_").slice(0, 80);
  const ext = safeExt(filename, contentType);
  return `products/${Date.now()}-${baseName || "file"}.${ext}`;
}

function publicSiteBase(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function uploadToR2(buffer: Buffer, contentType: string, filename: string): Promise<string> {
  const client = getR2Client();
  if (!client) throw new Error("R2 client unavailable");
  const key = objectKey(filename, contentType);
  await client.send(
    new PutObjectCommand({
      Bucket: r2Bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  if (r2PublicUrl) {
    return `${r2PublicUrl.replace(/\/$/, "")}/${key}`;
  }
  return `https://${r2Bucket}.${r2AccountId}.r2.dev/${key}`;
}

async function uploadToSupabase(buffer: Buffer, contentType: string, filename: string): Promise<string> {
  const key = objectKey(filename, contentType);
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${supabaseBucket}/${key}`;
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseServiceKey}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: new Uint8Array(buffer),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase upload failed: ${err.slice(0, 200)}`);
  }
  return `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${key}`;
}

async function uploadToLocalDisk(buffer: Buffer, contentType: string, filename: string): Promise<string> {
  const ext = safeExt(filename, contentType);
  const baseName = filename.replace(/\.[^.]+$/, "").replace(/[^\w.-]/g, "_").slice(0, 80);
  const storedName = `${Date.now()}-${baseName || "file"}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, storedName), buffer);
  return `${publicSiteBase()}/uploads/products/${storedName}`;
}

export async function uploadProductFile(
  buffer: Buffer,
  contentType: string,
  filename: string
): Promise<{ url: string; storage: UploadStorage }> {
  if (isR2Configured()) {
    const url = await uploadToR2(buffer, contentType, filename);
    return { url, storage: "r2" };
  }

  if (isSupabaseConfigured()) {
    try {
      const url = await uploadToSupabase(buffer, contentType, filename);
      return { url, storage: "supabase" };
    } catch (err) {
      console.error("[upload] Supabase failed, falling back to local disk:", err);
    }
  }

  const url = await uploadToLocalDisk(buffer, contentType, filename);
  return { url, storage: "local" };
}

/** Backwards-compatible name for image-only callers. */
export const uploadProductImage = uploadProductFile;

export async function getDirectUploadInstructions(
  filename: string,
  contentType: string
): Promise<DirectUploadInstructions | null> {
  if (isR2Configured()) {
    const client = getR2Client();
    if (!client) return null;
    const key = objectKey(filename, contentType);
    const command = new PutObjectCommand({
      Bucket: r2Bucket,
      Key: key,
      ContentType: contentType,
    });
    // Presigned URL valid for 30 minutes to accommodate large 1 GB uploads
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 1800 });
    const publicUrl = r2PublicUrl
      ? `${r2PublicUrl.replace(/\/$/, "")}/${key}`
      : `https://${r2Bucket}.${r2AccountId}.r2.dev/${key}`;

    return {
      storage: "r2",
      uploadUrl,
      publicUrl,
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
    };
  }

  if (isSupabaseConfigured() && supabaseUrl && supabaseServiceKey) {
    const key = objectKey(filename, contentType);
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${supabaseBucket}/${key}`;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${key}`;

    return {
      storage: "supabase",
      uploadUrl,
      publicUrl,
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": contentType,
        "x-upsert": "true",
      },
    };
  }

  return null;
}

export function isCloudStorageConfigured(): boolean {
  return isR2Configured() || isSupabaseConfigured();
}

/** @deprecated use isCloudStorageConfigured */
export function isR2ConfiguredLegacy(): boolean {
  return isR2Configured();
}

