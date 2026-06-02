import { prisma } from "@shaan-e-taj/database";
import bcrypt from "bcryptjs";

async function main() {
  const email = "Navleensingh05@gmail.com";
  const password = "Cupid.1907";

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  console.log("found:", user?.email, user?.role, Boolean(user?.passwordHash));
  if (user?.passwordHash) {
    console.log("password match:", await bcrypt.compare(password, user.passwordHash));
  }
  await prisma.$disconnect();
}

main();
