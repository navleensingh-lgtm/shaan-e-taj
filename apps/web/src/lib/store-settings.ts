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
  storeAddressLine1: "Taj Fashion — Shaan-e-Taj Boutique",
  storeAddressLine2: "Kapoor Market, Near Bus Stand",
  storeLandmark: `${siteConfig.city}, ${siteConfig.state}`,
  storePincode: "144001",
  storePhone: "",
  storeMapUrl: "https://maps.google.com/?q=Taj+Fashion+Jalandhar+Kapoor+Market",
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
