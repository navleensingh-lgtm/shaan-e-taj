export type PricingSettings = {
  fullStitchChargePaise: number;
  shippingFree: boolean;
  shippingChargePaise: number;
};

export type StitchingChoice = "UNSTITCHED" | "FULLY_STITCHED";

export type OrderPricing = {
  subtotalPaise: number;
  stitchingPaise: number;
  shippingPaise: number;
  totalPaise: number;
  shippingType: "FREE" | "PAID";
  stitchingType: StitchingChoice;
};

export function calculateOrderPricing(
  subtotalPaise: number,
  stitchingType: StitchingChoice,
  settings: PricingSettings
): OrderPricing {
  const stitchingPaise =
    stitchingType === "FULLY_STITCHED" ? Math.max(0, settings.fullStitchChargePaise) : 0;
  const shippingPaise = settings.shippingFree ? 0 : Math.max(0, settings.shippingChargePaise);
  const shippingType = settings.shippingFree ? "FREE" : "PAID";

  return {
    subtotalPaise,
    stitchingPaise,
    shippingPaise,
    totalPaise: subtotalPaise + stitchingPaise + shippingPaise,
    shippingType,
    stitchingType,
  };
}

export function formatInr(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
