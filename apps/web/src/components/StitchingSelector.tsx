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
            className={`rounded-sm border px-3 py-2 text-sm transition ${
              value === s.value
                ? "border-rose bg-rose text-white"
                : "border-brand-border text-brand-muted hover:border-rose"
            } disabled:opacity-50`}
          >
            {s.label}
            {s.value === "FULLY_STITCHED" && stitchChargeRupees != null && stitchChargeRupees > 0 && (
              <span className="ml-1 text-[10px] opacity-90">(+₹{stitchChargeRupees}/suit)</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
