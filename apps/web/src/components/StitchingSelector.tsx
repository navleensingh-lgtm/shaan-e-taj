"use client";

import type { StitchingChoice } from "@/lib/order-pricing";

const OPTIONS: { value: StitchingChoice; label: string }[] = [
  { value: "UNSTITCHED", label: "Unstitched" },
  { value: "FULLY_STITCHED", label: "Fully Stitched" },
];

type Props = {
  value: StitchingChoice;
  onChange: (value: StitchingChoice) => void;
  disabled?: boolean;
  stitchChargeRupees?: number;
};

export function StitchingSelector({ value, onChange, disabled, stitchChargeRupees }: Props) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-brand-muted">Stitching</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {OPTIONS.map((s) => (
          <button
            key={s.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(s.value)}
            className={`min-h-[44px] rounded-xs border px-4 py-2.5 text-xs sm:text-sm font-medium transition cursor-pointer active:scale-95 ${
              value === s.value
                ? "border-espresso bg-espresso text-ivory shadow-xs"
                : "border-brand-border bg-white text-brand-text hover:border-gold-dark hover:bg-ivory-2/60"
            } disabled:opacity-50`}
          >
            {s.label}
            {s.value === "FULLY_STITCHED" && stitchChargeRupees != null && stitchChargeRupees > 0 && (
              <span className="ml-1.5 text-[10px] font-normal text-gold-light opacity-95">
                (+₹{stitchChargeRupees}/suit)
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
