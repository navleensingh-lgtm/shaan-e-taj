import { Router } from "express";
import { prisma } from "@shaan-e-taj/database";
import { requireUser, type AuthedRequest } from "../middleware/auth.js";

export const wishlistRoutes = Router();

wishlistRoutes.use(requireUser);

wishlistRoutes.get("/", async (req, res) => {
  const { user } = req as AuthedRequest;
  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: {
      product: { include: { images: { orderBy: { sortOrder: "asc" } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ items: items.map((i) => i.product) });
});

wishlistRoutes.post("/:productId", async (req, res) => {
  const { user } = req as AuthedRequest;
  await prisma.wishlistItem.upsert({
    where: {
      userId_productId: { userId: user.id, productId: req.params.productId },
    },
    create: { userId: user.id, productId: req.params.productId },
    update: {},
  });
  res.json({ ok: true });
});

wishlistRoutes.delete("/:productId", async (req, res) => {
  const { user } = req as AuthedRequest;
  await prisma.wishlistItem.deleteMany({
    where: { userId: user.id, productId: req.params.productId },
  });
  res.json({ ok: true });
});
