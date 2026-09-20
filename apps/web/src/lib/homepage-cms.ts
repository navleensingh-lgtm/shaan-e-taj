/**
 * Homepage Content Management System (CMS) Data Types & Defaults
 * Allows non-technical boutique administrators to edit marketing, editorial,
 * occasion, and category content directly from Admin Portal.
 */

export type HeroSectionConfig = {
  enabled: boolean;
  displayOrder: number;
  eyebrow: string;
  heading: string;
  subheading: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  videoUrl?: string | null;
  desktopImageUrl?: string | null;
  mobileImageUrl?: string | null;
  posterImageUrl?: string | null;
};

export type NewArrivalsSectionConfig = {
  enabled: boolean;
  displayOrder: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  limit: number;
  ctaText: string;
  ctaHref: string;
};

export type OccasionCardItem = {
  id: string;
  title: string;
  tag: string;
  description: string;
  href: string;
  image: string;
  videoUrl?: string | null;
  displayOrder: number;
  active: boolean;
};

export type ShopByOccasionSectionConfig = {
  enabled: boolean;
  displayOrder: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: OccasionCardItem[];
};

export type CategoryCardItem = {
  id: string;
  title: string;
  tag?: string;
  description: string;
  href: string;
  image: string;
  mobileImage?: string | null;
  videoUrl?: string | null;
  displayOrder: number;
  active: boolean;
};

export type ShopByCategorySectionConfig = {
  enabled: boolean;
  displayOrder: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: CategoryCardItem[];
};

export type BespokeStatItem = {
  stat: string;
  label: string;
};

export type BespokeCoutureSectionConfig = {
  enabled: boolean;
  displayOrder: number;
  eyebrow: string;
  heading: string;
  description: string;
  features: BespokeStatItem[];
  imageUrl: string;
  mobileImageUrl?: string | null;
  videoUrl?: string | null;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  locationTag: string;
};

export type ShopTheLookSectionConfig = {
  enabled: boolean;
  displayOrder: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  autoInstagramReels: boolean;
  maxItems: number;
};

export type BestsellersSectionConfig = {
  enabled: boolean;
  displayOrder: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
};

export type TestimonialItem = {
  quote: string;
  author: string;
  location: string;
  occasion: string;
};

export type TestimonialsSectionConfig = {
  enabled: boolean;
  displayOrder: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: TestimonialItem[];
};

export type YouTubeSectionConfig = {
  enabled: boolean;
  displayOrder: number;
  channelHandle: string;
  channelUrl: string;
};

export type BoutiqueCtaSectionConfig = {
  enabled: boolean;
  displayOrder: number;
  title: string;
  subtitle: string;
};

export type HomepageCmsConfig = {
  hero: HeroSectionConfig;
  shopTheLook: ShopTheLookSectionConfig;
  newArrivals: NewArrivalsSectionConfig;
  shopByOccasion: ShopByOccasionSectionConfig;
  shopByCategory: ShopByCategorySectionConfig;
  bestsellers: BestsellersSectionConfig;
  bespokeCouture: BespokeCoutureSectionConfig;
  testimonials: TestimonialsSectionConfig;
  youtube: YouTubeSectionConfig;
  boutiqueCta: BoutiqueCtaSectionConfig;
};

export const DEFAULT_HOMEPAGE_CMS: HomepageCmsConfig = {
  hero: {
    enabled: true,
    displayOrder: 1,
    eyebrow: "TAJ FASHION JALANDHAR · PUNJAB",
    heading: "Couture Defined by Artisanal Royalty",
    subheading:
      "From our boutique atelier in Jalandhar, Punjab, Shaan-e-Taj curates bespoke bridal lehengas, Pakistani cuts, party wear, and regal celebratory couture for patrons worldwide.",
    primaryCtaText: "Explore Collection",
    primaryCtaHref: "/new-arrivals",
    secondaryCtaText: "Custom Stitching",
    secondaryCtaHref: "/custom-stitching",
    videoUrl: null,
    desktopImageUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop&q=80",
    mobileImageUrl: null,
    posterImageUrl: null,
  },
  shopTheLook: {
    enabled: true,
    displayOrder: 2,
    eyebrow: "Shop The Look",
    title: "Trending Looks & Real Movement",
    subtitle:
      "Tap to view boutique motion, styling reels, and order bespoke cuts directly on WhatsApp",
    autoInstagramReels: true,
    maxItems: 8,
  },
  newArrivals: {
    enabled: true,
    displayOrder: 3,
    eyebrow: "Just Arrived",
    title: "New Arrivals",
    subtitle:
      "Handcrafted in our Punjab boutique — hover over pieces to view fabric movement and secondary looks.",
    limit: 8,
    ctaText: "View All New Arrivals",
    ctaHref: "/new-arrivals",
  },
  shopByOccasion: {
    enabled: true,
    displayOrder: 4,
    eyebrow: "Curated Ensembles",
    title: "Shop by Occasion",
    subtitle:
      "Whether for your wedding day or royal celebrations, discover silhouettes tailored with precision.",
    items: [
      {
        id: "occ-1",
        title: "Bridal Couture",
        tag: "The Big Day",
        description: "Intricate zardozi, gotta patti, and heavy handwork lehengas.",
        href: "/bridal",
        image:
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        videoUrl: null,
        displayOrder: 1,
        active: true,
      },
      {
        id: "occ-2",
        title: "Party Wear",
        tag: "Celebrations",
        description:
          "Modern Punjabi & Pakistani silhouettes, shararas, and regal flowing cuts.",
        href: "/party-wear",
        image:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        videoUrl: null,
        displayOrder: 2,
        active: true,
      },
      {
        id: "occ-3",
        title: "Festive Silks",
        tag: "Royal Heritage",
        description: "Rich Banarasi, georgette, and pure velvet celebratory suits.",
        href: "/festive",
        image:
          "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80",
        videoUrl: null,
        displayOrder: 3,
        active: true,
      },
      {
        id: "occ-4",
        title: "Bespoke Tailoring",
        tag: "Custom Made",
        description: "Precision measurements crafted by master tailors in Jalandhar.",
        href: "/custom-stitching",
        image:
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&auto=format&fit=crop&q=80",
        videoUrl: null,
        displayOrder: 4,
        active: true,
      },
    ],
  },
  shopByCategory: {
    enabled: true,
    displayOrder: 5,
    eyebrow: "Catalog Collections",
    title: "Curated Categories",
    subtitle: "Explore by silhouette, fabric tradition, and boutique design.",
    items: [
      {
        id: "cat-1",
        title: "Designer Suits",
        tag: "Punjabi Tradition",
        description: "Straight cut, palazzos, and salwar kameez sets with rich dupattas.",
        href: "/catalog?productType=Suits",
        image:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        displayOrder: 1,
        active: true,
      },
      {
        id: "cat-2",
        title: "Lehengas & Cholis",
        tag: "Bridal Glory",
        description: "Voluminous flares with elaborate zardozi and hand embroidery.",
        href: "/catalog?productType=Lehengas",
        image:
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        displayOrder: 2,
        active: true,
      },
      {
        id: "cat-3",
        title: "Shararas & Ghararas",
        tag: "Royal Movement",
        description: "Flared Pakistani and festive cuts adorned with sequins and thread work.",
        href: "/catalog?productType=Shararas",
        image:
          "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80",
        displayOrder: 3,
        active: true,
      },
      {
        id: "cat-4",
        title: "Unstitched Fabrics",
        tag: "Artisanal Lengths",
        description: "Pure silks, organzas, and georgettes ready for custom tailoring.",
        href: "/catalog?availability=UNSTITCHED",
        image:
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&auto=format&fit=crop&q=80",
        displayOrder: 4,
        active: true,
      },
    ],
  },
  bestsellers: {
    enabled: true,
    displayOrder: 6,
    eyebrow: "Atelier Icons",
    title: "Signature Bestsellers",
    subtitle:
      "Most coveted bespoke designs celebrated by our brides and worldwide patrons.",
    ctaText: "View Full Catalog",
    ctaHref: "/collections",
  },
  bespokeCouture: {
    enabled: true,
    displayOrder: 7,
    eyebrow: "Bespoke Couture Experience",
    heading: "Crafted in Jalandhar. Tailored for Global Patrons.",
    description:
      "Every outfit can be stitched to your precise body measurements or delivered as premium unstitched fabric. Our master tailors consult with you directly on WhatsApp to customize necklines, sleeve lengths, dupattas, and linings.",
    features: [
      { stat: "100%", label: "Pure Handwork Zari" },
      { stat: "Custom", label: "Made-to-Measure" },
      { stat: "Global", label: "Worldwide Shipping" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=900&auto=format&fit=crop&q=80",
    mobileImageUrl: null,
    videoUrl: null,
    primaryCtaText: "Book Boutique Appointment",
    primaryCtaHref: "/contact",
    secondaryCtaText: "Size & Measurement Guide →",
    secondaryCtaHref: "/custom-stitching",
    locationTag: "Atelier Taj Fashion · Jalandhar, Punjab",
  },
  testimonials: {
    enabled: true,
    displayOrder: 8,
    eyebrow: "Voices of Elegance",
    title: "Patrons of Taj",
    subtitle:
      "Trusted by brides and families across India, Canada, the United Kingdom, and the United States.",
    items: [
      {
        quote:
          "My bridal lehenga was tailored to absolute perfection from thousands of miles away in Canada. The zardozi embroidery and fit took everyone’s breath away on my wedding day.",
        author: "Simran K.",
        location: "Vancouver, Canada",
        occasion: "Bridal Ensemble",
      },
      {
        quote:
          "The craftsmanship of Taj Fashion is unmatched. Ordered custom suits for my daughter's wedding events in the UK — arrived right on schedule, flawless stitching.",
        author: "Gurpreet B.",
        location: "Birmingham, UK",
        occasion: "Wedding Festivities",
      },
      {
        quote:
          "Visiting their Jalandhar boutique was a royal experience, and ordering via WhatsApp is just as seamless. Shaan-e-Taj truly honors Punjabi couture heritage.",
        author: "Harleen D.",
        location: "New Delhi, India",
        occasion: "Festive Silk & Shararas",
      },
    ],
  },
  youtube: {
    enabled: true,
    displayOrder: 9,
    channelHandle: "@Tajfashionjalandhar",
    channelUrl: "https://www.youtube.com/@Tajfashionjalandhar",
  },
  boutiqueCta: {
    enabled: true,
    displayOrder: 10,
    title: "Experience Royal Punjabi Couture",
    subtitle:
      "Consult with our boutique stylist directly on WhatsApp for custom measurements, matching accessories, and bridal inquiries.",
  },
};

/**
 * Normalizes stored JSON into a fully guaranteed HomepageCmsConfig object.
 */
export function normalizeHomepageCms(raw: unknown): HomepageCmsConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_HOMEPAGE_CMS;
  const data = raw as Partial<HomepageCmsConfig>;

  return {
    hero: { ...DEFAULT_HOMEPAGE_CMS.hero, ...(data.hero || {}) },
    shopTheLook: { ...DEFAULT_HOMEPAGE_CMS.shopTheLook, ...(data.shopTheLook || {}) },
    newArrivals: { ...DEFAULT_HOMEPAGE_CMS.newArrivals, ...(data.newArrivals || {}) },
    shopByOccasion: {
      ...DEFAULT_HOMEPAGE_CMS.shopByOccasion,
      ...(data.shopByOccasion || {}),
      items: Array.isArray(data.shopByOccasion?.items)
        ? data.shopByOccasion.items
        : DEFAULT_HOMEPAGE_CMS.shopByOccasion.items,
    },
    shopByCategory: {
      ...DEFAULT_HOMEPAGE_CMS.shopByCategory,
      ...(data.shopByCategory || {}),
      items: Array.isArray(data.shopByCategory?.items)
        ? data.shopByCategory.items
        : DEFAULT_HOMEPAGE_CMS.shopByCategory.items,
    },
    bestsellers: { ...DEFAULT_HOMEPAGE_CMS.bestsellers, ...(data.bestsellers || {}) },
    bespokeCouture: {
      ...DEFAULT_HOMEPAGE_CMS.bespokeCouture,
      ...(data.bespokeCouture || {}),
      features: Array.isArray(data.bespokeCouture?.features)
        ? data.bespokeCouture.features
        : DEFAULT_HOMEPAGE_CMS.bespokeCouture.features,
    },
    testimonials: {
      ...DEFAULT_HOMEPAGE_CMS.testimonials,
      ...(data.testimonials || {}),
      items: Array.isArray(data.testimonials?.items)
        ? data.testimonials.items
        : DEFAULT_HOMEPAGE_CMS.testimonials.items,
    },
    youtube: { ...DEFAULT_HOMEPAGE_CMS.youtube, ...(data.youtube || {}) },
    boutiqueCta: { ...DEFAULT_HOMEPAGE_CMS.boutiqueCta, ...(data.boutiqueCta || {}) },
  };
}
