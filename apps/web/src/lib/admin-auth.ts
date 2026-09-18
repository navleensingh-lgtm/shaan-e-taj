import { getServerSession } from "next-auth";
import { UserRole } from "@shaan-e-taj/database";
import { authOptions } from "@/lib/auth-options";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
    return null;
  }
  return session;
}
