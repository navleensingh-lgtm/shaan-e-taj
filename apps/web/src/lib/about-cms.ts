import { siteConfig } from "./site-config";

export type AboutCmsConfig = {
  hero: {
    eyebrow: string;
    heading: string;
    subheading: string;
    imageUrl: string;
  };
  story: {
    eyebrow: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
    quote: string;
    imageUrl: string;
  };
  craftsmanship: {
    eyebrow: string;
    heading: string;
    description: string;
    pillars: {
      title: string;
      description: string;
      image: string;
    }[];
  };
  jalandharToWorld: {
    eyebrow: string;
    heading: string;
    description: string;
    stats: {
      stat: string;
      label: string;
    }[];
    imageUrl: string;
  };
  experience: {
    eyebrow: string;
    heading: string;
    blocks: {
      number: string;
      title: string;
      description: string;
    }[];
  };
  customStitchingCta: {
    eyebrow: string;
    heading: string;
    description: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
  };
  boutiqueVisit: {
    eyebrow: string;
    heading: string;
    description: string;
    address: string;
    hoursWeekdays: string;
    hoursSunday: string;
    mapUrl: string;
    whatsappText: string;
    imageUrl: string;
  };
  finalCta: {
    heading: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
  };
};

export const DEFAULT_ABOUT_CMS: AboutCmsConfig = {
  hero: {
    eyebrow: "Atelier Heritage · Est. 2015",
    heading: "Where Heritage Meets Modern Couture",
    subheading:
      "Rooted in Jalandhar, Punjab. Tailored with devotion for connoisseurs of authentic Indian craftsmanship worldwide.",
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop&q=85",
  },
  story: {
    eyebrow: "Our Origin",
    heading: "Born in the Heart of Punjab",
    paragraph1:
      "Founded in 2015 in Jalandhar, Punjab, Shaan-e-Taj began with a singular purpose: to preserve the timeless majesty of Punjabi and North Indian bridal heirlooms while refining silhouettes for today's global celebrations.",
    paragraph2:
      "Under the master eye of Taj Fashion, every collection honors authentic zari wirework, dabka, cut-dana, and hand-embroidered gotta patti. What began as an intimate boutique salon at Gulmarg Avenue has grown into a revered fashion house dressing brides and families across the globe.",
    quote:
      "Every stitch carries the grace of Punjab, every silhouette is tailored to make you feel nothing less than royal.",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=85",
  },
  craftsmanship: {
    eyebrow: "Artisanal Devotion",
    heading: "Crafted by Hand. Made to Be Remembered.",
    description:
      "True luxury cannot be hurried. Our master artisans spend days meticulously placing each bead, hand-threading metallic cords, and inspecting every yard of handloom fabric before cutting.",
    pillars: [
      {
        title: "Intricate Zardozi & Gotta",
        description:
          "Centuries-old metal wire and gold bullion embroidery practiced by heritage artisan families in Punjab.",
        image:
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&auto=format&fit=crop&q=80",
      },
      {
        title: "Pure Handloom Textiles",
        description:
          "Rich banarasi brocades, raw silks, breathable organzas, and fluid georgettes curated directly from master weavers.",
        image:
          "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80",
      },
      {
        title: "Master Pattern Cutters",
        description:
          "Bespoke draping and precision tailoring that flatters your exact silhouette, whether royal lehenga or classic salwar kameez.",
        image:
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  jalandharToWorld: {
    eyebrow: "Global Presence",
    heading: "Crafted in Jalandhar. Worn Around the World.",
    description:
      "Distance is no barrier to haute couture. From private WhatsApp consultations to worldwide tracked express shipping, we ensure our patrons in the UK, Canada, the US, and across India experience the bespoke warmth of a boutique visit from their own homes.",
    stats: [
      { stat: "2015", label: "Year Established" },
      { stat: "15+", label: "Countries Served" },
      { stat: "100%", label: "Handcrafted Finishes" },
      { stat: "24-48h", label: "Consultation Response" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=1000&auto=format&fit=crop&q=85",
  },
  experience: {
    eyebrow: "The Taj Standard",
    heading: "The Shaan-e-Taj Experience",
    blocks: [
      {
        number: "01",
        title: "Artisanal Craftsmanship",
        description:
          "Zero shortcuts. Pure hand-embroidered details created by skilled Punjabi artisans honoring age-old textile heritage.",
      },
      {
        number: "02",
        title: "Made-to-Measure",
        description:
          "Exact body measurements, personalized necklines, sleeve variations, and dupatta borders customized to your vision.",
      },
      {
        number: "03",
        title: "Curated Indian Couture",
        description:
          "From bridal lehengas and shararas to festive unstitched ensembles — thoughtfully curated collections that stand apart.",
      },
      {
        number: "04",
        title: "Worldwide Service",
        description:
          "Direct boutique consultation over WhatsApp with video previews, secure global shipping, and doorstep delivery.",
      },
    ],
  },
  customStitchingCta: {
    eyebrow: "Bespoke Atelier",
    heading: "Your Measurements. Your Vision.",
    description:
      "Experience personal couture tailoring. Connect directly with our boutique stylist or review our measurement guide to get started.",
    primaryCtaText: "Book Boutique Appointment",
    primaryCtaHref: "/contact",
    secondaryCtaText: "Explore Custom Stitching",
    secondaryCtaHref: "/custom-stitching",
  },
  boutiqueVisit: {
    eyebrow: "Flagship Salon",
    heading: "Visit Our Jalandhar Atelier",
    description:
      "Experience our rich textiles and bridal collections in person. Walk through the fabrics, discuss your custom requirements, and meet our master craftsmen.",
    address: "120, Gulmarg Avenue, Ladhewali, Jalandhar, Punjab 144005",
    hoursWeekdays: "Mon–Sat 11:00 AM – 7:00 PM",
    hoursSunday: "Sunday: By appointment",
    mapUrl: "https://maps.google.com/?q=120+Gulmarg+Ave+Ladhewali+Jalandhar+Punjab+144005",
    whatsappText: "Hello Taj Fashion, I would like to schedule a boutique visit in Jalandhar.",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80",
  },
  finalCta: {
    heading: "Discover the Elegance of Shaan-e-Taj",
    subtitle:
      "Explore our online catalog or schedule a personal styling session with our Jalandhar boutique team.",
    primaryCtaText: "Explore Collection",
    primaryCtaHref: "/collections",
    secondaryCtaText: "Book Boutique Appointment",
    secondaryCtaHref: "/contact",
  },
};

export function normalizeAboutCms(raw: unknown): AboutCmsConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_ABOUT_CMS;
  const data = raw as Partial<AboutCmsConfig>;

  return {
    hero: { ...DEFAULT_ABOUT_CMS.hero, ...(data.hero || {}) },
    story: { ...DEFAULT_ABOUT_CMS.story, ...(data.story || {}) },
    craftsmanship: {
      ...DEFAULT_ABOUT_CMS.craftsmanship,
      ...(data.craftsmanship || {}),
      pillars: Array.isArray(data.craftsmanship?.pillars)
        ? data.craftsmanship.pillars
        : DEFAULT_ABOUT_CMS.craftsmanship.pillars,
    },
    jalandharToWorld: {
      ...DEFAULT_ABOUT_CMS.jalandharToWorld,
      ...(data.jalandharToWorld || {}),
      stats: Array.isArray(data.jalandharToWorld?.stats)
        ? data.jalandharToWorld.stats
        : DEFAULT_ABOUT_CMS.jalandharToWorld.stats,
    },
    experience: {
      ...DEFAULT_ABOUT_CMS.experience,
      ...(data.experience || {}),
      blocks: Array.isArray(data.experience?.blocks)
        ? data.experience.blocks
        : DEFAULT_ABOUT_CMS.experience.blocks,
    },
    customStitchingCta: {
      ...DEFAULT_ABOUT_CMS.customStitchingCta,
      ...(data.customStitchingCta || {}),
    },
    boutiqueVisit: {
      ...DEFAULT_ABOUT_CMS.boutiqueVisit,
      ...(data.boutiqueVisit || {}),
    },
    finalCta: { ...DEFAULT_ABOUT_CMS.finalCta, ...(data.finalCta || {}) },
  };
}
