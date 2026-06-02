import OpenAI from "openai";
import { prisma } from "@shaan-e-taj/database";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function maybeAutoPostSocial(productId: string): Promise<void> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (!settings?.autoPostInstagram && !settings?.autoPostFacebook) return;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });
  if (!product) return;

  const imageUrl = product.images[0]?.url;
  if (!imageUrl || imageUrl.startsWith("data:")) return;

  const caption = await generateCaption(product.name, product.description);

  if (settings.autoPostInstagram) {
    await postInstagram(imageUrl, caption);
  }
  if (settings.autoPostFacebook) {
    await postFacebook(imageUrl, caption);
  }
}

async function generateCaption(name: string, description: string): Promise<string> {
  if (!openai) {
    return `${name}\n\n${description}\n\n#ShaanETaj #IndianCouture #BridalWear #DesignerSuits`;
  }
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Write Instagram caption for Shaan-e-Taj luxury Indian fashion. Include 8-12 relevant hashtags at end.",
      },
      { role: "user", content: `Product: ${name}\n${description}` },
    ],
    max_tokens: 400,
  });
  return res.choices[0]?.message?.content ?? `${name}\n#ShaanETaj`;
}

async function postInstagram(imageUrl: string, caption: string): Promise<void> {
  const igId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!igId || !token) {
    console.warn("[social] Instagram skipped — missing META credentials");
    return;
  }

  const containerRes = await fetch(
    `https://graph.facebook.com/v21.0/${igId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl, caption, access_token: token }),
    }
  );
  const container = (await containerRes.json()) as { id?: string; error?: { message: string } };
  if (!container.id) {
    console.error("[social] IG container failed", container.error?.message);
    return;
  }

  await fetch(`https://graph.facebook.com/v21.0/${igId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: container.id, access_token: token }),
  });
}

async function postFacebook(imageUrl: string, caption: string): Promise<void> {
  const pageId = process.env.META_PAGE_ID;
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) {
    console.warn("[social] Facebook skipped — missing META_PAGE_ID");
    return;
  }

  await fetch(`https://graph.facebook.com/v21.0/${pageId}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: imageUrl, caption, access_token: token }),
  });
}
