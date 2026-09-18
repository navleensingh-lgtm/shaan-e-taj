import { PrismaClient, ProductStatus, UserRole, CategoryKind } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const MAIN_CATEGORIES: { slug: string; name: string; sortOrder: number }[] = [
  { slug: "BRIDAL", name: "Bridal", sortOrder: 0 },
  { slug: "PARTY_WEAR", name: "Party Wear", sortOrder: 1 },
  { slug: "FESTIVE", name: "Festive", sortOrder: 2 },
  { slug: "NEW_ARRIVALS", name: "New Arrivals", sortOrder: 3 },
];

const SUB_CATEGORIES: { slug: string; name: string; sortOrder: number }[] = [
  { slug: "ANARKALI", name: "Anarkali", sortOrder: 0 },
  { slug: "SHARARA", name: "Sharara", sortOrder: 1 },
  { slug: "GHARARA", name: "Gharara", sortOrder: 2 },
  { slug: "PAKISTANI", name: "Pakistani", sortOrder: 3 },
  { slug: "INDO_WESTERN", name: "Indo Western", sortOrder: 4 },
  { slug: "LEHENGA", name: "Lehenga", sortOrder: 5 },
  { slug: "KURTI_SET", name: "Kurti Set", sortOrder: 6 },
  { slug: "SALWAR_SUIT", name: "Salwar Suit", sortOrder: 7 },
  { slug: "DUPATTA", name: "Dupatta", sortOrder: 8 },
  { slug: "OTHER", name: "Other", sortOrder: 9 },
];

async function seedCategories() {
  for (const c of MAIN_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: { ...c, kind: CategoryKind.MAIN },
      update: { name: c.name, kind: CategoryKind.MAIN, sortOrder: c.sortOrder },
    });
  }
  for (const c of SUB_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: { ...c, kind: CategoryKind.SUB },
      update: { name: c.name, kind: CategoryKind.SUB, sortOrder: c.sortOrder },
    });
  }
}

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "919876543210",
      storeAddressLine1: "120, Gulmarg Ave",
      storeAddressLine2: "Ladhewali",
      storeLandmark: "Jalandhar, Punjab",
      storePincode: "144005",
      storeMapUrl:
        "https://maps.google.com/?q=120+Gulmarg+Ave+Ladhewali+Jalandhar+Punjab+144005",
    },
    update: {
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? undefined,
      storeAddressLine1: "120, Gulmarg Ave",
      storeAddressLine2: "Ladhewali",
      storeLandmark: "Jalandhar, Punjab",
      storePincode: "144005",
      storeMapUrl:
        "https://maps.google.com/?q=120+Gulmarg+Ave+Ladhewali+Jalandhar+Punjab+144005",
    },
  });

  await seedCategories();

  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@shaanetaj.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Cupid.1907";
  const hash = await bcrypt.hash(adminPassword, 12);

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: adminEmail, mode: "insensitive" } },
        { email: "admin@shaanetaj.com" },
      ],
    },
  });

  if (existing) {
    const conflict = await prisma.user.findFirst({
      where: {
        email: { equals: adminEmail, mode: "insensitive" },
        NOT: { id: existing.id },
      },
    });
    if (conflict) {
      await prisma.user.delete({ where: { id: conflict.id } });
    }
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        email: adminEmail,
        name: "Shaan-e-Taj Admin",
        passwordHash: hash,
        role: UserRole.ADMIN,
      },
    });
  } else {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Shaan-e-Taj Admin",
        passwordHash: hash,
        role: UserRole.ADMIN,
      },
    });
  }

  const samples = [
    {
      slug: "noor-e-zareen-embroidered-suit",
      name: "Noor-e-Zareen Embroidered Suit Set",
      mainCategory: "PARTY_WEAR",
      subCategory: "PAKISTANI",
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
      mainCategory: "BRIDAL",
      subCategory: "LEHENGA",
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

  console.log("Seed complete. Admin email:", adminEmail);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
