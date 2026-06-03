import { prisma } from "@shaan-e-taj/database";

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      storeAddressLine1: "120, Gulmarg Ave",
      storeAddressLine2: "Ladhewali",
      storeLandmark: "Jalandhar, Punjab",
      storePincode: "144005",
      storeMapUrl:
        "https://maps.google.com/?q=120+Gulmarg+Ave+Ladhewali+Jalandhar+Punjab+144005",
    },
    update: {
      storeAddressLine1: "120, Gulmarg Ave",
      storeAddressLine2: "Ladhewali",
      storeLandmark: "Jalandhar, Punjab",
      storePincode: "144005",
      storeMapUrl:
        "https://maps.google.com/?q=120+Gulmarg+Ave+Ladhewali+Jalandhar+Punjab+144005",
    },
  });
  console.log("Store address updated to Gulmarg Ave, Ladhewali, 144005");
  await prisma.$disconnect();
}

main();
