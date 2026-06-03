"use client";

import { useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { calculateOrderPricing, type OrderPricing } from "@/lib/order-pricing";

const EMPTY: OrderPricing & { ready: boolean } = {
  subtotalPaise: 0,
  stitchingPaise: 0,
  stitchingPerUnitPaise: 0,
  itemQuantity: 0,
  shippingPaise: 0,
  totalPaise: 0,
  shippingType: "FREE",
  stitchingType: "UNSTITCHED",
  ready: false,
};

export function useOrderPricing(overrideStitching?: "UNSTITCHED" | "FULLY_STITCHED") {
  const { totalPaise, stitchingType, count } = useCart();
  const settings = useStoreSettings();

  return useMemo(() => {
    const choice = overrideStitching ?? stitchingType;
    const itemQuantity = Math.max(1, count);
    if (!settings) {
      return { ...EMPTY, subtotalPaise: totalPaise, totalPaise, itemQuantity, ready: false };
    }
    const pricing = calculateOrderPricing(totalPaise, choice, {
      fullStitchChargePaise: settings.fullStitchChargePaise,
      shippingFree: settings.shippingFree,
      shippingChargePaise: settings.shippingChargePaise,
    }, itemQuantity);
    return { ...pricing, ready: true };
  }, [totalPaise, stitchingType, count, overrideStitching, settings]);
}

/** Single-product pricing (product page) — quantity-aware stitching. */
export function useProductPricing(
  priceInPaise: number,
  stitchingType: "UNSTITCHED" | "FULLY_STITCHED",
  quantity = 1
) {
  const settings = useStoreSettings();
  const qty = Math.max(1, quantity);

  return useMemo(() => {
    const subtotalPaise = priceInPaise * qty;
    if (!settings) {
      return {
        subtotalPaise,
        stitchingPaise: 0,
        stitchingPerUnitPaise: 0,
        itemQuantity: qty,
        shippingPaise: 0,
        totalPaise: subtotalPaise,
        shippingType: "FREE" as const,
        stitchingType,
        ready: false,
      };
    }
    return {
      ...calculateOrderPricing(subtotalPaise, stitchingType, {
        fullStitchChargePaise: settings.fullStitchChargePaise,
        shippingFree: settings.shippingFree,
        shippingChargePaise: settings.shippingChargePaise,
      }, qty),
      ready: true,
    };
  }, [priceInPaise, stitchingType, qty, settings]);
}
