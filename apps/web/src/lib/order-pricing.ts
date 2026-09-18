export type PricingSettings = {
  fullStitchChargePaise: number;
  shippingFree: boolean;
  shippingChargePaise: number;
};

export type StitchingChoice = "UNSTITCHED" | "FULLY_STITCHED";

export type OrderPricing = {
  subtotalPaise: number;
  stitchingPaise: number;
  stitchingPerUnitPaise: number;
  itemQuantity: number;
  shippingPaise: number;
  totalPaise: number;
  shippingType: "FREE" | "PAID";
  stitchingType: StitchingChoice;
};

/**
 * @param subtotalPaise Sum of (unit price × quantity) for all line items
 * @param itemQuantity Total units ordered (stitching is charged per unit)
 */
export function calculateOrderPricing(
  subtotalPaise: number,
  stitchingType: StitchingChoice,
  settings: PricingSettings,
  itemQuantity = 1
): OrderPricing {
  const qty = Math.max(1, Math.floor(itemQuantity) || 1);
  const stitchingPerUnitPaise =
    stitchingType === "FULLY_STITCHED" ? Math.max(0, settings.fullStitchChargePaise) : 0;
  const stitchingPaise = stitchingPerUnitPaise * qty;
  const shippingPaise = settings.shippingFree ? 0 : Math.max(0, settings.shippingChargePaise);
  const shippingType = settings.shippingFree ? "FREE" : "PAID";

  return {
    subtotalPaise,
    stitchingPaise,
    stitchingPerUnitPaise,
    itemQuantity: qty,
    shippingPaise,
    totalPaise: subtotalPaise + stitchingPaise + shippingPaise,
    shippingType,
    stitchingType,
  };
}

export function formatInr(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
