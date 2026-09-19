import { getServerSession } from "next-auth";
import { UserRole } from "@shaan-e-taj/database";
import { authOptions } from "@/lib/auth-options";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);

  // Development helper: if no real session is present and we're in development,
  // allow a fake admin session so local testing of admin APIs (uploads, product
  // management) is possible without a seeded DB. This MUST NOT run in
  // production.
  if (process.env.NODE_ENV !== "production") {
    if (!session || !session.user || session.user.role !== UserRole.ADMIN) {
      return { user: { id: "dev-admin", role: UserRole.ADMIN, email: process.env.ADMIN_EMAIL ?? "dev@local" } } as any;
    }
  }

  if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
    return null;
  }
  return session;
}
