"use client";

import React, { useState } from "react";
import { formatMeasurement, inToCm, cmToIn, type MeasurementUnit } from "@/lib/size-guide";

export type MeasurementFieldDefinition = {
  id: string;
  label: string;
  hint?: string;
  defaultInches?: number;
};

// Comprehensive list of supported measurement fields
export const ALL_MEASUREMENT_FIELDS: MeasurementFieldDefinition[] = [
  { id: "bust", label: "Bust", hint: "Fullest part across bust" },
  { id: "underBust", label: "Under Bust", hint: "Directly under the bust line" },
  { id: "waist", label: "Natural Waist", hint: "Slimmest part above navel" },
  { id: "lowerWaist", label: "Lower Waist", hint: "Around waist where bottoms sit" },
  { id: "dropWaist", label: "Drop Waist", hint: "Just below natural waist" },
  { id: "hip", label: "Hip", hint: "Fullest part of buttocks" },
  { id: "shoulder", label: "Shoulder to Shoulder", hint: "Across back from bone to bone" },
  { id: "neckToShoulder", label: "Neck to Shoulder", hint: "Middle of neck to shoulder tip" },
  { id: "armhole", label: "Armhole Circumference", hint: "Around the shoulder joint" },
  { id: "bicep", label: "Bicep Circumference", hint: "Fullest part of upper arm" },
  { id: "elbow", label: "Elbow Circumference", hint: "Around bent elbow" },
  { id: "wrist", label: "Wrist Circumference", hint: "Around wrist bone" },
  { id: "sleeveLength", label: "Sleeve Length", hint: "Shoulder tip to wrist hem" },
  { id: "topLength", label: "Top / Kurti Length", hint: "High shoulder point to hem" },
  { id: "frontNeckDepth", label: "Front Neck Depth", hint: "Shoulder seam to desired depth" },
  { id: "backNeckDepth", label: "Back Neck Depth", hint: "Back neck seam to desired depth" },
  { id: "crotchLength", label: "Crotch Length / Rise", hint: "Front waist to back waist" },
  { id: "thigh", label: "Thigh Circumference", hint: "Around fullest part of thigh" },
  { id: "knee", label: "Knee Circumference", hint: "Around knee joint" },
  { id: "calf", label: "Calf Circumference", hint: "Around widest part of calf" },
  { id: "ankle", label: "Ankle Circumference", hint: "Around ankle hemline" },
  { id: "bottomLength", label: "Bottom / Pants Length", hint: "Waistline to ankle/footwear hem" },
  { id: "lehengaLength", label: "Lehenga / Sharara Length", hint: "Waist to floor including heels" },
  { id: "inseam", label: "Inseam", hint: "Inner crotch to bottom hem" },
  { id: "height", label: "Customer Full Height", hint: "Height including planned heels" },
];

interface CustomMeasurementFormProps {
  configuredFields?: string[];
  values: Record<string, number>;
  onChange: (values: Record<string, number>) => void;
  title?: string;
  subtitle?: string;
}

export function CustomMeasurementForm({
  configuredFields,
  values,
  onChange,
  title = "Custom Made-to-Measure Details",
  subtitle = "Provide your personal measurements for tailored boutique crafting",
}: CustomMeasurementFormProps) {
  const [unit, setUnit] = useState<MeasurementUnit>("in");

  // Determine active fields to display
  const activeFields = ALL_MEASUREMENT_FIELDS.filter((f) => {
    if (!configuredFields || configuredFields.length === 0) {
      // Default common set if none explicitly configured
      return ["bust", "waist", "hip", "shoulder", "topLength", "sleeveLength", "bottomLength"].includes(f.id);
    }
    return configuredFields.includes(f.id);
  });

  function handleValueChange(id: string, rawStr: string) {
    if (!rawStr || isNaN(Number(rawStr))) {
      const next = { ...values };
      delete next[id];
      onChange(next);
      return;
    }
    const enteredNum = Number(rawStr);
    // Always store internally normalized in inches
    const valInInches = unit === "cm" ? cmToIn(enteredNum) : enteredNum;
    onChange({ ...values, [id]: valInInches });
  }

  function getDisplayValue(id: string): string {
    const valInInches = values[id];
    if (valInInches == null || isNaN(valInInches)) return "";
    if (unit === "cm") {
      return String(inToCm(valInInches));
    }
    return String(valInInches);
  }

  return (
    <div className="mt-6 rounded-sm border border-brand-border bg-ivory/50 p-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border/60 pb-3">
        <div>
          <h3 className="serif text-lg font-medium text-brand-text">{title}</h3>
          <p className="text-xs text-brand-muted">{subtitle}</p>
        </div>

        {/* Inches / CM Toggle */}
        <div className="flex items-center rounded-sm border border-brand-border bg-white p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setUnit("in")}
            className={`rounded-xs px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition ${
              unit === "in" ? "bg-rose text-white" : "text-brand-muted hover:text-brand-text"
            }`}
          >
            Inches
          </button>
          <button
            type="button"
            onClick={() => setUnit("cm")}
            className={`rounded-xs px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition ${
              unit === "cm" ? "bg-rose text-white" : "text-brand-muted hover:text-brand-text"
            }`}
          >
            CM
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {activeFields.map((field) => (
          <label key={field.id} className="block text-xs">
            <span className="font-medium text-brand-text flex items-center justify-between">
              <span>{field.label} ({unit})</span>
              {values[field.id] && (
                <span className="text-[10px] text-rose-dark font-normal">
                  {formatMeasurement(values[field.id], unit === "in" ? "cm" : "in")}
                </span>
              )}
            </span>
            <input
              type="number"
              step="0.5"
              placeholder={field.hint || `Enter in ${unit}`}
              value={getDisplayValue(field.id)}
              onChange={(e) => handleValueChange(field.id, e.target.value)}
              className="mt-1 w-full rounded-sm border border-brand-border bg-white px-2.5 py-1.5 text-xs text-brand-text placeholder:text-brand-subtle focus:border-rose focus:outline-none"
            />
            {field.hint && (
              <span className="mt-0.5 block text-[10px] text-brand-subtle">{field.hint}</span>
            )}
          </label>
        ))}
      </div>

      <p className="mt-3 text-[11px] italic text-brand-subtle">
        ✦ Measurements are automatically preserved in both Inches and CM. Our boutique master will review these before tailoring.
      </p>
    </div>
  );
}
