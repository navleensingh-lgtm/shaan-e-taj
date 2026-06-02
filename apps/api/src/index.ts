import dotenv from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../../.env") });
import cors from "cors";
import express from "express";
import { productRoutes } from "./routes/products.js";
import { analyticsRoutes } from "./routes/analytics.js";
import { publishRoutes } from "./routes/publish.js";
import { internalRoutes } from "./routes/internal.js";
import { wishlistRoutes } from "./routes/wishlist.js";
import { orderRoutes } from "./routes/orders.js";
import { accountRoutes } from "./routes/account.js";
import { adminRoutes } from "./routes/admin.js";

const app = express();
const port = Number(process.env.API_PORT) || 4000;

app.use(cors({ origin: process.env.NEXTAUTH_URL ?? "http://localhost:3000" }));
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "shaan-e-taj-api" });
});

app.get("/settings/public", async (_req, res) => {
  const { prisma } = await import("@shaan-e-taj/database");
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  res.json(settings);
});

app.use("/products", productRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/publish", publishRoutes);
app.use("/internal", internalRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/orders", orderRoutes);
app.use("/account", accountRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
