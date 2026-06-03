import { prisma } from "@shaan-e-taj/database";
import { siteConfig } from "@/lib/site-config";

export type PublicStoreSettings = {
  whatsappNumber: string;
  storeAddressLine1: string;
  storeAddressLine2: string;
  storeLandmark: string;
  storePincode: string;
  storePhone: string;
  storeMapUrl: string;
  storeHoursWeekdays: string;
  storeHoursSunday: string;
  youtubeUrl: string;
  instagramUrl: string;
  semiStitchChargePaise: number;
  fullStitchChargePaise: number;
};

const defaults: PublicStoreSettings = {
  whatsappNumber: siteConfig.whatsapp.replace(/\D/g, "") || "919876543210",
  storeAddressLine1: "120, Gulmarg Ave",
  storeAddressLine2: "Ladhewali",
  storeLandmark: "Jalandhar, Punjab",
  storePincode: "144005",
  storePhone: "",
  storeMapUrl:
    "https://maps.google.com/?q=120+Gulmarg+Ave+Ladhewali+Jalandhar+Punjab+144005",
  storeHoursWeekdays: siteConfig.hours.weekdays,
  storeHoursSunday: siteConfig.hours.sunday,
  youtubeUrl: siteConfig.social.youtube,
  instagramUrl: siteConfig.social.instagram,
  semiStitchChargePaise: 50000,
  fullStitchChargePaise: 80000,
};

export async function getPublicStoreSettings(): Promise<PublicStoreSettings> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (!row) return defaults;
    return {
      whatsappNumber: row.whatsappNumber || defaults.whatsappNumber,
      storeAddressLine1: row.storeAddressLine1 || defaults.storeAddressLine1,
      storeAddressLine2: row.storeAddressLine2 || defaults.storeAddressLine2,
      storeLandmark: row.storeLandmark || defaults.storeLandmark,
      storePincode: row.storePincode || defaults.storePincode,
      storePhone: row.storePhone || defaults.storePhone,
      storeMapUrl: row.storeMapUrl || defaults.storeMapUrl,
      storeHoursWeekdays: row.storeHoursWeekdays || defaults.storeHoursWeekdays,
      storeHoursSunday: row.storeHoursSunday || defaults.storeHoursSunday,
      youtubeUrl: row.youtubeUrl || defaults.youtubeUrl,
      instagramUrl: row.instagramUrl || defaults.instagramUrl,
      semiStitchChargePaise: row.semiStitchChargePaise,
      fullStitchChargePaise: row.fullStitchChargePaise,
    };
  } catch {
    return defaults;
  }
}

export function formatStoreAddress(s: PublicStoreSettings): string {
  return [s.storeAddressLine1, s.storeAddressLine2, s.storeLandmark, s.storePincode]
    .filter(Boolean)
    .join(", ");
}
