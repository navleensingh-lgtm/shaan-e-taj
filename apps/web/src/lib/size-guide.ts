/**
 * Shaan-e-Taj Size Guide System
 * Master Data, Types, Normalization & Unit Conversions
 */

export type MeasurementUnit = "in" | "cm";

export type MeasurementType = "BODY" | "GARMENT";

export type SizeChartRow = {
  size: string; // e.g. XS, S, M, L, XL, XXL, 3XL
  ukIndSize: string; // e.g. 6, 8, 10, 12, 14, 16, 18
  bust: number; // inches
  waist: number; // inches
  hip: number; // inches
  // Optional garment-specific measurements
  shoulder?: number;
  sleeveLength?: number;
  topLength?: number;
  bottomWaist?: number;
  bottomHip?: number;
  bottomLength?: number;
  lehengaShararaLength?: number;
  inseam?: number;
  rise?: number;
  dropWaist?: number;
  customColumns?: Record<string, number>;
};

export type HeightGuideRow = {
  height: string; // e.g. 5'0", 5'2"
  dropWaist: number; // inches
  choli: number; // inches
  lehengaSharara: number; // inches
};

export type FitSilhouette = {
  id: string;
  name: string;
  description: string;
};

export type MeasureInstruction = {
  label: string;
  instruction: string;
};

export type SizeGuideData = {
  title?: string;
  subtitle?: string;
  measurementType: MeasurementType; // 'BODY' or 'GARMENT'
  sizeChart: SizeChartRow[];
  heightGuide?: HeightGuideRow[];
  howToMeasure?: MeasureInstruction[];
  fitGuide?: FitSilhouette[];
  notes?: string[];
};

/**
 * Standard Unit Converter (Inches <-> Centimeters)
 * 1 inch = 2.54 cm
 */
export function inToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10;
}

export function cmToIn(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}

export function formatMeasurement(valueInInches: number, unit: MeasurementUnit): string {
  if (valueInInches == null || isNaN(valueInInches)) return "-";
  if (unit === "cm") {
    const cm = inToCm(valueInInches);
    return `${cm} cm`;
  }
  return `${valueInInches}"`;
}

/**
 * SOURCE OF TRUTH: MASTER READY-MADE BODY SIZE CHART
 * All values stored in Inches as the normalized base.
 */
export const MASTER_SIZE_CHART: SizeChartRow[] = [
  { size: "XS", ukIndSize: "6", bust: 32, waist: 26, hip: 34 },
  { size: "S", ukIndSize: "8", bust: 34, waist: 28, hip: 36 },
  { size: "M", ukIndSize: "10", bust: 36, waist: 30, hip: 38 },
  { size: "L", ukIndSize: "12", bust: 38, waist: 32, hip: 40 },
  { size: "XL", ukIndSize: "14", bust: 40, waist: 34, hip: 42 },
  { size: "XXL", ukIndSize: "16", bust: 42, waist: 36, hip: 44 },
  { size: "3XL", ukIndSize: "18", bust: 44, waist: 38, hip: 46 },
];

/**
 * SOURCE OF TRUTH: HEIGHT-BASED LENGTH GUIDE
 */
export const MASTER_HEIGHT_GUIDE: HeightGuideRow[] = [
  { height: `5'0"`, dropWaist: 53, choli: 14, lehengaSharara: 37 },
  { height: `5'2"`, dropWaist: 54, choli: 15, lehengaSharara: 38 },
  { height: `5'4"`, dropWaist: 56, choli: 15, lehengaSharara: 40 },
  { height: `5'6"`, dropWaist: 58, choli: 15, lehengaSharara: 42 },
  { height: `5'8"`, dropWaist: 60, choli: 15.5, lehengaSharara: 44 },
  { height: `5'10"`, dropWaist: 62, choli: 16, lehengaSharara: 46 },
];

/**
 * SOURCE OF TRUTH: HOW TO MEASURE INSTRUCTIONS
 */
export const MASTER_HOW_TO_MEASURE: MeasureInstruction[] = [
  {
    label: "Chest / Bust",
    instruction: "Measure around the fullest part of your chest/bust, keeping the tape level.",
  },
  {
    label: "Waist / Under Bust",
    instruction: "Measure around the relevant natural waist or under-bust area as specified for the product.",
  },
  {
    label: "Drop Waist",
    instruction: "Measure just below your natural waistline.",
  },
  {
    label: "Hip",
    instruction: "Measure around the fullest part of your hips.",
  },
  {
    label: "Height",
    instruction: "Measure your full height. For lehenga/gown length guidance, use height including the heels you plan to wear where specified.",
  },
  {
    label: "Neck to Shoulder",
    instruction: "Measure from the middle of the neck to the end of the shoulder, where the sleeve starts.",
  },
  {
    label: "Sleeve Length",
    instruction: "Measure from the shoulder to the wrist or required sleeve hem.",
  },
  {
    label: "Shoulder to Shoulder",
    instruction: "Measure from one shoulder point to the other across your upper back.",
  },
  {
    label: "Front / Top Length",
    instruction: "Measure from the highest point of the shoulder to the desired hemline.",
  },
  {
    label: "Bottom Length",
    instruction: "Measure from the waistline to the desired hemline, following the product's construction.",
  },
];

/**
 * SOURCE OF TRUTH: FIT GUIDE SILHOUETTES
 */
export const MASTER_FIT_GUIDE: FitSilhouette[] = [
  {
    id: "fitted",
    name: "Fitted",
    description: "Tailored closely to contour your body contours gracefully.",
  },
  {
    id: "straight",
    name: "Straight",
    description: "Falls straight down with uniform ease from chest through the hem.",
  },
  {
    id: "a-line",
    name: "A-Line",
    description: "Gently tapers outward from the waist or shoulders in an elegant flare.",
  },
  {
    id: "flared",
    name: "Flared",
    description: "Voluminous twirl flare for lehengas, anarkalis, and ceremonial gowns.",
  },
  {
    id: "relaxed",
    name: "Relaxed",
    description: "Generous drape providing effortless luxury and supreme comfort.",
  },
];

/**
 * SOURCE OF TRUTH: PLEASE NOTE DISCLAIMERS
 */
export const MASTER_NOTES: string[] = [
  "Measurements shown in the chart above represent Body Measurements unless explicitly designated as Garment Measurements.",
  "Garment ease of 2 to 4 inches is purposefully built into fully stitched and ready-to-wear silhouettes to guarantee comfortable movement.",
  "Custom stitching with your personal bust, waist, hip, and length measurements is available on all unstitched & semi-stitched outfits.",
  "For length measurements (especially lehenga, sharara, and gowns), account for the footwear or heels you intend to wear with the outfit.",
  "Due to artisan handcrafting and fabric behavior, slight variations of up to 0.5\" (1.3 cm) may occasionally occur.",
];

export const MASTER_SIZE_GUIDE: SizeGuideData = {
  title: "SIZE GUIDE",
  subtitle: "FIND YOUR PERFECT FIT",
  measurementType: "BODY",
  sizeChart: MASTER_SIZE_CHART,
  heightGuide: MASTER_HEIGHT_GUIDE,
  howToMeasure: MASTER_HOW_TO_MEASURE,
  fitGuide: MASTER_FIT_GUIDE,
  notes: MASTER_NOTES,
};

/**
 * Resolves the effective size guide for a given product.
 * If product has useMasterSizeGuide === false and custom sizeGuide data, returns custom.
 * Otherwise returns the store master size guide.
 */
export function resolveSizeGuide(
  product?: {
    useMasterSizeGuide?: boolean | null;
    sizeGuide?: unknown;
  } | null,
  overrideMaster?: unknown
): SizeGuideData {
  if (product && product.useMasterSizeGuide === false && product.sizeGuide) {
    try {
      const custom = typeof product.sizeGuide === "string" 
        ? JSON.parse(product.sizeGuide) 
        : product.sizeGuide;
      if (custom && Array.isArray(custom.sizeChart) && custom.sizeChart.length > 0) {
        return {
          title: custom.title || "SIZE GUIDE",
          subtitle: custom.subtitle || "PRODUCT MEASUREMENTS",
          measurementType: custom.measurementType === "GARMENT" ? "GARMENT" : "BODY",
          sizeChart: custom.sizeChart,
          heightGuide: custom.heightGuide || MASTER_HEIGHT_GUIDE,
          howToMeasure: custom.howToMeasure || MASTER_HOW_TO_MEASURE,
          fitGuide: custom.fitGuide || MASTER_FIT_GUIDE,
          notes: custom.notes || MASTER_NOTES,
        };
      }
    } catch {
      // Fallback to master
    }
  }

  if (overrideMaster) {
    try {
      const masterOverride = typeof overrideMaster === "string" 
        ? JSON.parse(overrideMaster) 
        : overrideMaster;
      if (masterOverride && Array.isArray(masterOverride.sizeChart)) {
        return {
          ...MASTER_SIZE_GUIDE,
          ...masterOverride,
        };
      }
    } catch {
      // Fallback to built-in master
    }
  }

  return MASTER_SIZE_GUIDE;
}
