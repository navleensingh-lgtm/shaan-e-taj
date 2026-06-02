import { Router } from "express";
import { prisma } from "@shaan-e-taj/database";
import { generateProductFromImage } from "../services/ai-product.js";
import { processProductImage } from "../services/image-pipeline.js";
import { requireInternalSecret } from "../middleware/auth.js";

export const internalRoutes = Router();
internalRoutes.use(requireInternalSecret);

internalRoutes.post("/process-draft", async (req, res) => {
  const { draftId, imageUrl } = req.body ?? {};
  if (!draftId || !imageUrl) {
    res.status(400).json({ error: "draftId and imageUrl required" });
    return;
  }

  const [processedImages, aiMetadata] = await Promise.all([
    processProductImage(imageUrl),
    generateProductFromImage(imageUrl),
  ]);

  await prisma.telegramDraft.update({
    where: { id: draftId },
    data: {
      processedImages,
      aiMetadata,
      status: "ready",
    },
  });

  res.json({
    name: aiMetadata.name,
    priceInPaise: aiMetadata.priceInPaise,
  });
});
