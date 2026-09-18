import { Router } from "express";
import { prisma } from "@shaan-e-taj/database";
import { requireUser, type AuthedRequest } from "../middleware/auth.js";

export const accountRoutes = Router();
accountRoutes.use(requireUser);

accountRoutes.get("/addresses", async (req, res) => {
  const { user } = req as AuthedRequest;
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json({ addresses });
});

accountRoutes.post("/addresses", async (req, res) => {
  const { user } = req as AuthedRequest;
  const address = await prisma.address.create({
    data: { ...req.body, userId: user.id },
  });
  res.json({ address });
});

accountRoutes.get("/measurements", async (req, res) => {
  const { user } = req as AuthedRequest;
  const measurements = await prisma.savedMeasurement.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  res.json({ measurements });
});

accountRoutes.post("/measurements", async (req, res) => {
  const { user } = req as AuthedRequest;
  const measurement = await prisma.savedMeasurement.create({
    data: { ...req.body, userId: user.id },
  });
  res.json({ measurement });
});

accountRoutes.put("/measurements/:id", async (req, res) => {
  const { user } = req as AuthedRequest;
  const measurement = await prisma.savedMeasurement.updateMany({
    where: { id: req.params.id, userId: user.id },
    data: req.body,
  });
  res.json({ ok: measurement.count > 0 });
});
