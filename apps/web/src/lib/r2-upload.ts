const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const bucket = process.env.SUPABASE_BUCKET ?? "product-images";

function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseServiceKey);
}

export async function uploadProductImage(
  buffer: Buffer,
  contentType: string,
  filename: string
): Promise<{ url: string; storage: "r2" | "inline" }> {
  const ext =
    contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const baseName = filename.replace(/\.[^.]+$/, "").replace(/[^\w.-]/g, "_");
  const path = `products/${Date.now()}-${baseName}.${ext}`;

  if (!isSupabaseConfigured()) {
    console.warn("[upload] SUPABASE_URL or SUPABASE_SERVICE_KEY not set.");
    if (buffer.length > 2_500_000) {
      throw new Error("Image too large. Please set up Supabase storage or use a smaller image.");
    }
    return {
      url: `data:${contentType};base64,${buffer.toString("base64")}`,
      storage: "inline",
    };
  }

  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${supabaseServiceKey}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: buffer,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase upload failed: ${err}`);
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  return { url: publicUrl, storage: "r2" };
}

export function isR2Configured(): boolean {
  return isSupabaseConfigured();
}
