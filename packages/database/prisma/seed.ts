import { PrismaClient, MainCategory, SubCategory, ProductStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@shaanetaj.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const hash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Shaan-e-Taj Admin",
      passwordHash: hash,
      role: UserRole.ADMIN,
    },
    update: { passwordHash: hash, role: UserRole.ADMIN },
  });

  const samples = [
    {
      slug: "noor-e-zareen-embroidered-suit",
      name: "Noor-e-Zareen Embroidered Suit Set",
      mainCategory: MainCategory.PARTY_WEAR,
      subCategory: SubCategory.PAKISTANI,
      priceInPaise: 399900,
      description:
        "Elegant embroidered georgette suit featuring intricate thread work and premium dupatta. Perfect for weddings and celebrations.",
      color: "Wine Maroon",
      fabric: "Georgette",
      badge: "New",
      seoKeywords: ["party wear suit", "wedding suit", "designer suit"],
    },
    {
      slug: "royal-crimson-bridal-lehenga",
      name: "Royal Crimson Bridal Lehenga",
      mainCategory: MainCategory.BRIDAL,
      subCategory: SubCategory.LEHENGA,
      priceInPaise: 8500000,
      description: "Opulent crimson bridal lehenga with zardozi and kundan embellishments.",
      color: "Crimson",
      fabric: "Silk",
      badge: "Bestseller",
      seoKeywords: ["bridal lehenga", "wedding lehenga"],
    },
  ];

  for (const s of samples) {
    await prisma.product.upsert({
      where: { slug: s.slug },
      create: {
        ...s,
        status: ProductStatus.PUBLISHED,
        isNewArrival: true,
        publishedAt: new Date(),
        stitchingAvailable: true,
        semiStitchedPricePaise: s.priceInPaise + 50000,
        fullyStitchedPricePaise: s.priceInPaise + 80000,
      },
      update: {
        status: ProductStatus.PUBLISHED,
        isNewArrival: true,
      },
    });
  }

  console.log("Seed complete. Admin:", adminEmail, "password:", adminPassword);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
