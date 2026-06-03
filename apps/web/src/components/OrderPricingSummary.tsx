import { formatInr } from "@/lib/order-pricing";

type Props = {
  subtotalPaise: number;
  stitchingPaise: number;
  shippingPaise: number;
  totalPaise: number;
  stitchingType?: "UNSTITCHED" | "FULLY_STITCHED";
  compact?: boolean;
};

export function OrderPricingSummary({
  subtotalPaise,
  stitchingPaise,
  shippingPaise,
  totalPaise,
  stitchingType,
  compact,
}: Props) {
  const row = compact ? "text-xs" : "text-sm";

  return (
    <div className={`space-y-2 ${row} text-brand-muted`}>
      <div className="flex justify-between">
        <span>Product subtotal</span>
        <span className="text-brand-text">{formatInr(subtotalPaise)}</span>
      </div>
      {stitchingType === "FULLY_STITCHED" && (
        <div className="flex justify-between">
          <span>Stitching</span>
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
