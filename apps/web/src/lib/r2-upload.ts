import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET_NAME ?? "shaanetaj-products";
const publicUrl = process.env.R2_PUBLIC_URL;

let client: S3Client | null = null;

function getClient(): S3Client | null {
  if (!accountId || !accessKeyId || !secretAccessKey) return null;
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return client;
}

export async function uploadProductImage(
  buffer: Buffer,
  contentType: string,
  filename: string
): Promise<{ url: string; storage: "r2" | "inline" }> {
  const ext =
    contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const key = `products/${Date.now()}-${filename.replace(/[^\w.-]/g, "_")}.${ext}`;

  const s3 = getClient();
  if (!s3) {
    if (buffer.length > 2_500_000) {
      throw new Error("Image too large without cloud storage. Use a smaller file or set up R2.");
    }
    return {
      url: `data:${contentType};base64,${buffer.toString("base64")}`,
      storage: "inline",
    };
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const url = publicUrl
    ? `${publicUrl.replace(/\/$/, "")}/${key}`
    : `https://${bucket}.${accountId}.r2.dev/${key}`;

  return { url, storage: "r2" };
}

export function isR2Configured(): boolean {
  return Boolean(accountId && accessKeyId && secretAccessKey);
}
