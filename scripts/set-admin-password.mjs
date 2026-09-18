/**
 * Sets admin password hash from ADMIN_PASSWORD in .env (never logged).
 * Usage: node scripts/set-admin-password.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const text = readFileSync(resolve(root, ".env"), "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, "");
  }
}

loadEnv();
const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@shaanetaj.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.error("Set ADMIN_PASSWORD in .env first.");
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  if (!user) {
    await prisma.user.create({
      data: { email, name: "Shaan-e-Taj Admin", passwordHash: hash, role: UserRole.ADMIN },
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hash, role: UserRole.ADMIN },
    });
  }
  console.log("Admin password updated for", email);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
