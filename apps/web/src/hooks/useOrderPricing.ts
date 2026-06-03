"use client";

import { useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { calculateOrderPricing, type OrderPricing } from "@/lib/order-pricing";

const EMPTY: OrderPricing & { ready: boolean } = {
  subtotalPaise: 0,
  stitchingPaise: 0,
  shippingPaise: 0,
  totalPaise: 0,
  shippingType: "FREE",
  stitchingType: "UNSTITCHED",
  ready: false,
};

export function useOrderPricing(overrideStitching?: "UNSTITCHED" | "FULLY_STITCHED") {
  const { totalPaise, stitchingType } = useCart();
  const settings = useStoreSettings();

  return useMemo(() => {
    const choice = overrideStitching ?? stitchingType;
    if (!settings) {
      return { ...EMPTY, subtotalPaise: totalPaise, totalPaise, ready: false };
    }
    const pricing = calculateOrderPricing(totalPaise, choice, {
      fullStitchChargePaise: settings.fullStitchChargePaise,
      shippingFree: settings.shippingFree,
      shippingChargePaise: settings.shippingChargePaise,
    });
    return { ...pricing, ready: true };
  }, [totalPaise, stitchingType, overrideStitching, settings]);
}

/** Single-product pricing (product page). */
export function useProductPricing(
  priceInPaise: number,
  stitchingType: "UNSTITCHED" | "FULLY_STITCHED"
) {
  const settings = useStoreSettings();

  return useMemo(() => {
    if (!settings) {
      return {
        subtotalPaise: priceInPaise,
        stitchingPaise: 0,
        shippingPaise: 0,
        totalPaise: priceInPaise,
        shippingType: "FREE" as const,
        stitchingType,
        ready: false,
      };
    }
    return {
      ...calculateOrderPricing(priceInPaise, stitchingType, {
        fullStitchChargePaise: settings.fullStitchChargePaise,
        shippingFree: settings.shippingFree,
        shippingChargePaise: settings.shippingChargePaise,
      }),
      ready: true,
    };
  }, [priceInPaise, stitchingType, settings]);
}
