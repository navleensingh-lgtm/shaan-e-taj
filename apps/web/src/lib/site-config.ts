/** Brand & contact — Taj Fashion Jalandhar / Shaan-e-Taj */
export const siteConfig = {
  brand: "Shaan-e-Taj",
  /** Default browser tab title */
  pageTitle: "Shaan-e-Taj | Luxury Indian Couture",
  /** Child pages: "Catalog | Shaan-e-Taj" */
  pageTitleTemplate: "%s | Shaan-e-Taj",
  legalName: "Taj Fashion Jalandhar",
  tagline: "Luxury Indian Couture",
  subtitle: "Taj Fashion aKa Shaan-e-taj",
  founded: "2015",
  city: "Jalandhar",
  state: "Punjab",
  country: "India",
  email: "Navleensingh05@gmail.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919464385993",
  phone: "9464385993",
  hours: {
    weekdays: "Mon–Sat 11:00 AM – 7:00 PM",
    sunday: "Sunday: By appointment",
  },
  social: {
    youtube: "https://www.youtube.com/@Tajfashionjalandhar",
    youtubeHandle: "@Tajfashionjalandhar",
    instagram: "https://www.instagram.com/shaan_e_taj/",
    instagramHandle: "@shaan_e_taj",
  },
  description:
    "Shaan-e-Taj — Taj Fashion Jalandhar brings luxury bridal lehengas, Pakistani suits, party wear & festive couture. Hand-embroidered pieces, custom stitching, and pan-India delivery.",
  about: {
    intro:
      "Welcome to Shaan-e-Taj, also known as Taj Fashion Jalandhar — where tradition meets timeless luxury.",
    story: [
      "From our boutique heart in Jalandhar, Punjab, we curate premium bridal, party wear, and festive collections for the modern Indian woman.",
      "Every suit is chosen with care — rich fabrics, intricate embroidery, and silhouettes that make you feel royal. We offer unstitched, semi-stitched, and fully stitched options with custom measurements.",
      "Follow our journey on YouTube and Instagram for new arrivals, styling tips, and behind-the-scenes looks from Taj Fashion.",
    ],
    highlights: [
      "Bridal & Party Wear",
      "Pakistani & Indo-Western Suits",
      "Custom Stitching & Measurements",
      "Pan India Shipping",
      "WhatsApp Ordering",
    ],
  },
  youtubeEmbed: "https://www.youtube.com/embed?listType=user_uploads&list=Tajfashionjalandhar",
} as const;

export function whatsAppLink(message: string): string {
  const num = siteConfig.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}
