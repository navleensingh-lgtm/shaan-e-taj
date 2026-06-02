import type { Request, Response, NextFunction } from "express";
import { prisma, UserRole, type User } from "@shaan-e-taj/database";

export type AuthedRequest = Request & { user: User };

export function requireInternalSecret(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret || req.headers["x-internal-secret"] !== secret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export async function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.headers["x-user-id"];
  if (!userId || typeof userId !== "string") {
    res.status(401).json({ error: "Login required" });
    return;
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(401).json({ error: "Invalid session" });
    return;
  }
  (req as AuthedRequest).user = user;
  next();
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  requireUser(req, res, () => {
    const user = (req as AuthedRequest).user;
    if (user.role !== UserRole.ADMIN) {
      res.status(403).json({ error: "Admin only" });
      return;
    }
    next();
  });
}
