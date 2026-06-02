import sharp from "sharp";
import { uploadToR2 } from "./r2.js";

const RATIOS = [
  { ratio: "3:4", width: 1200, height: 1600 },
  { ratio: "1:1", width: 1080, height: 1080 },
  { ratio: "4:5", width: 1080, height: 1350 },
] as const;

async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function watermarkSvg(text: string, w: number, h: number): Buffer {
  const svg = `<svg width="${w}" height="${h}">
    <text x="50%" y="95%" text-anchor="middle" font-family="Georgia,serif" font-size="${Math.round(w * 0.04)}" fill="rgba(255,255,255,0.55)">${text}</text>
  </svg>`;
  return Buffer.from(svg);
}

export async function processProductImage(
  sourceUrl: string
): Promise<{ url: string; ratio: string }[]> {
  const watermark =
    process.env.WATERMARK_ENABLED !== "false"
      ? (process.env.WATERMARK_TEXT ?? "Shaan-e-Taj")
      : null;

  const source = await fetchBuffer(sourceUrl);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const results: { url: string; ratio: string }[] = [];

  for (const { ratio, width, height } of RATIOS) {
    let pipeline = sharp(source)
      .resize(width, height, { fit: "cover", position: "centre" })
      .modulate({ brightness: 1.02, saturation: 1.05 })
      .sharpen();

    if (watermark) {
      const overlay = watermarkSvg(watermark, width, height);
      pipeline = pipeline.composite([{ input: overlay, gravity: "south" }]);
    }

    const out = await pipeline.jpeg({ quality: 88, mozjpeg: true }).toBuffer();
    const key = `products/${id}/${ratio.replace(":", "x")}.jpg`;
    const url = await uploadToR2(key, out);
    results.push({ url, ratio });
  }

  return results;
}
