import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2AccountId = process.env.R2_ACCOUNT_ID?.trim();
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
const r2Bucket = process.env.R2_BUCKET_NAME?.trim();
const r2PublicUrl = process.env.R2_PUBLIC_URL?.trim();

export type UploadStorage = "r2";

export type DirectUploadInstructions = {
  storage: "r2";
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

function missingR2Variables(): string[] {
  const variables: Array<[string, string | undefined]> = [
    ["R2_ACCOUNT_ID", r2AccountId],
    ["R2_ACCESS_KEY_ID", r2AccessKeyId],
    ["R2_SECRET_ACCESS_KEY", r2SecretAccessKey],
    ["R2_BUCKET_NAME", r2Bucket],
    ["R2_PUBLIC_URL", r2PublicUrl],
  ];
  return variables.filter(([, value]) => !value || isPlaceholderSecret(value)).map(([name]) => name);
}

function isR2Configured(): boolean {
  return missingR2Variables().length === 0;
}

function r2ConfigurationError(): Error {
  return new Error(`R2 is not configured. Missing: ${missingR2Variables().join(", ")}.`);
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

async function uploadToR2(buffer: Buffer, contentType: string, filename: string): Promise<string> {
  const client = getR2Client();
  if (!client || !r2Bucket || !r2PublicUrl) throw r2ConfigurationError();
  const key = objectKey(filename, contentType);
  await client.send(
    new PutObjectCommand({
      Bucket: r2Bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return `${r2PublicUrl.replace(/\/$/, "")}/${key}`;
}

export async function uploadProductFile(
  buffer: Buffer,
  contentType: string,
  filename: string
): Promise<{ url: string; storage: UploadStorage }> {
  if (!isR2Configured()) throw r2ConfigurationError();
  const url = await uploadToR2(buffer, contentType, filename);
  return { url, storage: "r2" };
}

/** Backwards-compatible name for image-only callers. */
export const uploadProductImage = uploadProductFile;

export async function getDirectUploadInstructions(
  filename: string,
  contentType: string
): Promise<DirectUploadInstructions | null> {
  if (!isR2Configured()) throw r2ConfigurationError();
  {
    const client = getR2Client();
    if (!client || !r2Bucket || !r2PublicUrl) throw r2ConfigurationError();
    const key = objectKey(filename, contentType);
    const command = new PutObjectCommand({
      Bucket: r2Bucket,
      Key: key,
      ContentType: contentType,
    });
    // Presigned URL valid for 30 minutes to accommodate large 1 GB uploads
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 1800 });
    const publicUrl = `${r2PublicUrl.replace(/\/$/, "")}/${key}`;

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

}

export function isCloudStorageConfigured(): boolean {
  return isR2Configured();
}

/** @deprecated use isCloudStorageConfigured */
export function isR2ConfiguredLegacy(): boolean {
  return isR2Configured();
}
