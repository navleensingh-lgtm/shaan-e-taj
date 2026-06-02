import {
  prisma,
  ProductStatus,
  PublishSource,
  MainCategory,
  SubCategory,
} from "@shaan-e-taj/database";
import { indexProductEmbedding } from "./search.js";

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now().toString(36)
  );
}

export async function publishTelegramDraft(draftId: string) {
  const draft = await prisma.telegramDraft.findUnique({
    where: { id: draftId },
    include: { product: true },
  });
  if (!draft) throw new Error("Draft not found");
  if (!draft.aiMetadata) throw new Error("AI metadata not ready — send image first");

  const meta = draft.aiMetadata as {
    name: string;
    description: string;
    mainCategory: MainCategory;
    subCategory: SubCategory;
    fabric?: string;
    color?: string;
    priceInPaise: number;
    seoKeywords?: string[];
  };

  const images = (draft.processedImages as { url: string; ratio: string }[]) ?? [];
  const slug = slugify(meta.name);

  const product = await prisma.$transaction(async (tx) => {
    const baseData = {
      slug,
      name: meta.name,
      description: meta.description,
      mainCategory: meta.mainCategory,
      subCategory: meta.subCategory,
      fabric: meta.fabric,
      color: meta.color,
      priceInPaise: meta.priceInPaise,
      seoKeywords: meta.seoKeywords ?? [],
      status: ProductStatus.PUBLISHED,
      isNewArrival: true,
      publishedAt: new Date(),
      publishSource: PublishSource.TELEGRAM,
      stitchingAvailable: true,
    };

    const created = draft.productId
      ? await tx.product.update({
          where: { id: draft.productId },
          data: baseData,
          include: { images: true },
        })
      : await tx.product.create({
          data: {
            ...baseData,
            images: {
              create: images.map((img, i) => ({
                url: img.url,
                ratio: img.ratio,
                sortOrder: i,
                isPrimary: i === 0,
              })),
            },
            telegramDraft: { connect: { id: draft.id } },
          },
          include: { images: true },
        });

    await tx.telegramDraft.update({
      where: { id: draft.id },
      data: { status: "published", productId: created.id },
    });

    return created;
  });

  await indexProductEmbedding(
    product.id,
    `${product.name} ${product.description} ${product.color ?? ""} ${product.fabric ?? ""}`
  );

  const { maybeAutoPostSocial } = await import("./social.js");
  maybeAutoPostSocial(product.id).catch(console.error);

  return product;
}
