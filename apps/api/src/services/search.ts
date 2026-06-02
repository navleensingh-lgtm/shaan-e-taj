import OpenAI from "openai";
import { prisma, ProductStatus } from "@shaan-e-taj/database";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/** Semantic search: embed query, cosine-similarity against stored embeddings (JSON). */
export async function semanticSearch(query: string, limit: number): Promise<string[]> {
  if (!openai) {
    const fallback = await prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { color: { contains: query, mode: "insensitive" } },
          { seoKeywords: { hasSome: query.toLowerCase().split(/\s+/) } },
        ],
      },
      select: { id: true },
      take: limit,
    });
    return fallback.map((p) => p.id);
  }

  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryVec = embeddingRes.data[0].embedding;

  const products = await prisma.product.findMany({
    where: { status: ProductStatus.PUBLISHED, searchEmbedding: { not: null } },
    select: { id: true, searchEmbedding: true },
  });

  const scored = products
    .map((p) => {
      const vec = JSON.parse(p.searchEmbedding!) as number[];
      const score = cosineSimilarity(queryVec, vec);
      return { id: p.id, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((s) => s.id);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function indexProductEmbedding(
  productId: string,
  text: string
): Promise<void> {
  if (!openai) return;
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  await prisma.product.update({
    where: { id: productId },
    data: { searchEmbedding: JSON.stringify(embeddingRes.data[0].embedding) },
  });
}
