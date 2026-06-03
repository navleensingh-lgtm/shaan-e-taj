import { prisma } from "@shaan-e-taj/database";

const WHATSAPP = "919464385993"; // 91 + 9464385993
const PHONE_DISPLAY = "9464385993";

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      whatsappNumber: WHATSAPP,
      storePhone: PHONE_DISPLAY,
    },
    update: {
      whatsappNumber: WHATSAPP,
      storePhone: PHONE_DISPLAY,
    },
  });
  console.log("Updated WhatsApp:", WHATSAPP, "Phone:", PHONE_DISPLAY);
  await prisma.$disconnect();
}

main();
