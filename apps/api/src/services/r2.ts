import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

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

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType = "image/jpeg"
): Promise<string> {
  const s3 = getClient();
  if (!s3) {
    return `data:${contentType};base64,${body.toString("base64")}`;
  }
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  if (publicUrl) {
    return `${publicUrl.replace(/\/$/, "")}/${key}`;
  }
  return `https://${bucket}.${accountId}.r2.dev/${key}`;
}

export function isR2Configured(): boolean {
  return Boolean(accountId && accessKeyId && secretAccessKey && publicUrl);
}
