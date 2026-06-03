import { formatInr } from "@/lib/order-pricing";

type Props = {
  subtotalPaise: number;
  stitchingPaise: number;
  stitchingPerUnitPaise?: number;
  itemQuantity?: number;
  shippingPaise: number;
  totalPaise: number;
  stitchingType?: "UNSTITCHED" | "FULLY_STITCHED";
  compact?: boolean;
};

export function OrderPricingSummary({
  subtotalPaise,
  stitchingPaise,
  stitchingPerUnitPaise = 0,
  itemQuantity = 1,
  shippingPaise,
  totalPaise,
  stitchingType,
  compact,
}: Props) {
  const row = compact ? "text-xs" : "text-sm";
  const qty = Math.max(1, itemQuantity);
  const perUnit = stitchingPerUnitPaise || (qty > 0 ? Math.round(stitchingPaise / qty) : 0);

  const stitchingLabel =
    qty > 1 && perUnit > 0
      ? `Stitching (${formatInr(perUnit)} × ${qty})`
      : "Stitching";

  return (
    <div className={`space-y-2 ${row} text-brand-muted`}>
      <div className="flex justify-between">
        <span>{qty > 1 ? `Product subtotal (${qty} items)` : "Product subtotal"}</span>
        <span className="text-brand-text">{formatInr(subtotalPaise)}</span>
      </div>
      {stitchingType === "FULLY_STITCHED" && (
        <div className="flex justify-between">
          <span>{stitchingLabel}</span>
          <span className="text-brand-text">
            {stitchingPaise > 0 ? formatInr(stitchingPaise) : "Included"}
          </span>
        </div>
      )}
      <div className="flex justify-between">
        <span>Shipping</span>
        <span className="text-brand-text">
          {shippingPaise > 0 ? formatInr(shippingPaise) : "Free"}
        </span>
      </div>
      <div
        className={`flex justify-between border-t border-brand-border pt-2 font-medium text-rose-dark ${
          compact ? "text-sm" : "text-lg"
        }`}
      >
        <span>Grand total</span>
        <span>{formatInr(totalPaise)}</span>
      </div>
    </div>
  );
}
