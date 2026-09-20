"use client";

import React, { useEffect, useState } from "react";
import {
  type SizeGuideData,
  type MeasurementUnit,
  formatMeasurement,
} from "@/lib/size-guide";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  guide: SizeGuideData;
  productName?: string;
  categoryName?: string;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  guide,
  productName,
  categoryName,
}: SizeGuideModalProps) {
  const [unit, setUnit] = useState<MeasurementUnit>("in");

  // Keyboard escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isGarment = guide.measurementType === "GARMENT";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 md:p-8"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-[#2c1f14]/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative flex max-h-[92vh] sm:max-h-[90vh] w-full max-w-4xl flex-col rounded-sm border border-[#e8ddd0] bg-[#faf7f2] shadow-2xl transition-all">
        {/* Top Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close size guide"
          className="absolute right-3 top-3 sm:right-4 sm:top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-white/90 text-brand-text backdrop-blur-xs transition hover:bg-rose hover:text-white active:scale-95 shadow-xs"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-4 py-6 sm:px-10 sm:py-10 text-brand-text">
          {/* 1. Header Banner */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gold" />
              <h2 className="serif text-2xl sm:text-3xl font-normal tracking-[0.14em] text-brand-text uppercase">
                Shaan<span className="text-gold-dark">·</span>e·Taj
              </h2>
              <span className="h-px w-8 bg-gold" />
            </div>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-subtle">
              JALANDHAR
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-rose-dark font-medium">
              TIMELESS TRADITIONS · MODERN YOU
            </p>

            <div className="mt-6 inline-block">
              <h1 id="size-guide-title" className="serif text-3xl sm:text-4xl tracking-wide">
                {guide.title || "SIZE GUIDE"}
              </h1>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-brand-muted">
                {guide.subtitle || "FIND YOUR PERFECT FIT"}
              </p>
              {productName && (
                <p className="mt-1 text-xs text-brand-subtle italic font-serif">
                  {productName} {categoryName ? `(${categoryName.replace(/_/g, " ")})` : ""}
                </p>
              )}
            </div>
          </div>

          {/* 2. Measurement Type Badge & Inches/CM Toggle */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/80 pb-4">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-xs px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                  isGarment
                    ? "border border-amber-300 bg-amber-50 text-amber-900"
                    : "border border-rose/30 bg-rose/10 text-rose-dark"
                }`}
              >
                {isGarment ? "✦ Garment Measurements" : "✦ Body Measurements"}
              </span>
              <span className="text-xs text-brand-muted hidden sm:inline">
                {isGarment
                  ? "(Exact dimensions of the finished outfit)"
                  : "(Recommended customer body measurements)"}
              </span>
            </div>

            {/* Inches / CM Toggle Control */}
            <div className="flex items-center rounded-xs border border-brand-border bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setUnit("in")}
                className={`min-h-[40px] px-4 rounded-xs text-xs font-semibold uppercase tracking-wider transition active:scale-95 ${
                  unit === "in"
                    ? "bg-rose text-white shadow-xs"
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => setUnit("cm")}
                className={`min-h-[40px] px-4 rounded-xs text-xs font-semibold uppercase tracking-wider transition active:scale-95 ${
                  unit === "cm"
                    ? "bg-rose text-white shadow-xs"
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                CM
              </button>
            </div>
          </div>

          {/* 3. Ready-Made Size Table */}
          <div className="mt-6">
            <div className="flex items-center justify-between pb-2">
              <h3 className="serif text-xl tracking-wide text-brand-text">
                Ready-Made Tops / Kurtis / Suits
              </h3>
              <span className="text-[11px] text-brand-subtle sm:hidden">Swipe table →</span>
            </div>

            <div className="overflow-x-auto rounded-sm border border-brand-border bg-white shadow-2xs">
              <table className="w-full min-w-[500px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-ivory-2 text-[11px] font-medium uppercase tracking-wider text-brand-text">
                    <th className="px-4 py-3 text-center">Size</th>
                    <th className="px-4 py-3 text-center">UK / Ind</th>
                    <th className="px-4 py-3 text-center">Bust ({unit})</th>
                    <th className="px-4 py-3 text-center">Waist ({unit})</th>
                    <th className="px-4 py-3 text-center">Hip ({unit})</th>
                    {guide.sizeChart.some((r) => r.shoulder) && (
                      <th className="px-4 py-3 text-center">Shoulder ({unit})</th>
                    )}
                    {guide.sizeChart.some((r) => r.topLength) && (
                      <th className="px-4 py-3 text-center">Length ({unit})</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {guide.sizeChart.map((row, idx) => (
                    <tr
                      key={row.size}
                      className={`transition-colors hover:bg-ivory/80 ${
                        idx % 2 === 0 ? "bg-white" : "bg-ivory/30"
                      }`}
                    >
                      <td className="px-4 py-2.5 text-center font-medium text-brand-text">{row.size}</td>
                      <td className="px-4 py-2.5 text-center text-brand-muted font-mono text-xs">
                        {row.ukIndSize}
                      </td>
                      <td className="px-4 py-2.5 text-center font-medium text-rose-dark">
                        {formatMeasurement(row.bust, unit)}
                      </td>
                      <td className="px-4 py-2.5 text-center text-brand-muted">
                        {formatMeasurement(row.waist, unit)}
                      </td>
                      <td className="px-4 py-2.5 text-center text-brand-muted">
                        {formatMeasurement(row.hip, unit)}
                      </td>
                      {guide.sizeChart.some((r) => r.shoulder) && (
                        <td className="px-4 py-2.5 text-center text-brand-muted">
                          {row.shoulder ? formatMeasurement(row.shoulder, unit) : "-"}
                        </td>
                      )}
                      {guide.sizeChart.some((r) => r.topLength) && (
                        <td className="px-4 py-2.5 text-center text-brand-muted">
                          {row.topLength ? formatMeasurement(row.topLength, unit) : "-"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Ready-Made Bottoms Table (Palazzo / Pants / Sharara) */}
          <div className="mt-8">
            <h3 className="serif text-xl tracking-wide text-brand-text pb-2">
              Ready-Made Bottoms / Palazzo / Pants / Sharara
            </h3>
            <div className="overflow-x-auto rounded-sm border border-brand-border bg-white shadow-2xs">
              <table className="w-full min-w-[460px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-ivory-2 text-[11px] font-medium uppercase tracking-wider text-brand-text">
                    <th className="px-4 py-3 text-center">Size</th>
                    <th className="px-4 py-3 text-center">Waist ({unit})</th>
                    <th className="px-4 py-3 text-center">Hip ({unit})</th>
                    <th className="px-4 py-3 text-center">Standard Length ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {guide.sizeChart.map((row, idx) => {
                    const bWaist = row.bottomWaist ?? row.waist;
                    const bHip = row.bottomHip ?? row.hip;
                    const bLength = row.bottomLength ?? 38;
                    return (
                      <tr
                        key={`bottom-${row.size}`}
                        className={`transition-colors hover:bg-ivory/80 ${
                          idx % 2 === 0 ? "bg-white" : "bg-ivory/30"
                        }`}
                      >
                        <td className="px-4 py-2.5 text-center font-medium text-brand-text">{row.size}</td>
                        <td className="px-4 py-2.5 text-center text-brand-muted">
                          {formatMeasurement(bWaist, unit)}
                        </td>
                        <td className="px-4 py-2.5 text-center text-brand-muted">
                          {formatMeasurement(bHip, unit)}
                        </td>
                        <td className="px-4 py-2.5 text-center font-medium text-rose-dark">
                          {formatMeasurement(bLength, unit)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Height-Based Length Guide */}
          {guide.heightGuide && guide.heightGuide.length > 0 && (
            <div className="mt-8">
              <h3 className="serif text-xl tracking-wide text-brand-text pb-2">
                Height-Based Length Guide
              </h3>
              <p className="text-xs text-brand-muted mb-2">
                Recommended garment lengths according to your overall height (including footwear/heels):
              </p>
              <div className="overflow-x-auto rounded-sm border border-brand-border bg-white shadow-2xs">
                <table className="w-full min-w-[500px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-brand-border bg-ivory-2 text-[11px] font-medium uppercase tracking-wider text-brand-text">
                      <th className="px-4 py-3 text-center">Customer Height</th>
                      <th className="px-4 py-3 text-center">Lower Waist / Drop Waist ({unit})</th>
                      <th className="px-4 py-3 text-center">Choli Length ({unit})</th>
                      <th className="px-4 py-3 text-center">Lehenga / Sharara ({unit})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {guide.heightGuide.map((h, idx) => (
                      <tr
                        key={h.height}
                        className={`transition-colors hover:bg-ivory/80 ${
                          idx % 2 === 0 ? "bg-white" : "bg-ivory/30"
                        }`}
                      >
                        <td className="px-4 py-2.5 text-center font-semibold text-brand-text">{h.height}</td>
                        <td className="px-4 py-2.5 text-center text-brand-muted">
                          {formatMeasurement(h.dropWaist, unit)}
                        </td>
                        <td className="px-4 py-2.5 text-center text-brand-muted">
                          {formatMeasurement(h.choli, unit)}
                        </td>
                        <td className="px-4 py-2.5 text-center font-medium text-rose-dark">
                          {formatMeasurement(h.lehengaSharara, unit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. Fit Guide with Silhouettes */}
          {guide.fitGuide && guide.fitGuide.length > 0 && (
            <div className="mt-10">
              <div className="text-center">
                <h3 className="serif text-2xl tracking-wide text-brand-text">Fit Guide</h3>
                <p className="text-xs uppercase tracking-[0.18em] text-brand-subtle mt-0.5">
                  Distinctive Silhouettes &amp; Garment Shapes
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {guide.fitGuide.map((fit) => (
                  <div
                    key={fit.id}
                    className="flex flex-col items-center rounded-sm border border-brand-border bg-white p-3 text-center shadow-2xs"
                  >
                    {/* SVG Garment Silhouette Icon */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ivory-2 text-rose-dark mb-2">
                      <FitSilhouetteIcon id={fit.id} />
                    </div>
                    <p className="font-serif text-base font-semibold text-brand-text">{fit.name}</p>
                    <p className="mt-1 text-[11px] leading-tight text-brand-muted">{fit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. How To Measure Section with Illustrated Figure */}
          <div className="mt-10 rounded-sm border border-brand-border bg-white p-6 sm:p-8 shadow-2xs">
            <div className="border-b border-brand-border/70 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-gold" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-rose-dark font-medium">Boutique Fit Guide</span>
              </div>
              <h3 className="serif mt-1 text-2xl sm:text-3xl text-brand-text">How to Measure</h3>
              <p className="mt-1 text-xs sm:text-sm text-brand-muted leading-relaxed font-light">
                Follow these simple steps with a flexible measuring tape for optimal fit accuracy.
              </p>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
              {/* Illustrated Figure Card - Strictly Contained */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-sm bg-ivory-2/70 p-6 border border-brand-border/80 shadow-2xs">
                <div className="relative flex w-full items-center justify-center py-2">
                  <svg
                    className="h-72 w-36 text-rose-dark drop-shadow-xs"
                    viewBox="0 0 100 220"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-label="Measurement points guide illustration"
                  >
                    {/* Head & Neck */}
                    <circle cx="50" cy="22" r="14" strokeWidth="1.5" />
                    <path d="M47 36v6M53 36v6" />
                    {/* Shoulders & Arms */}
                    <path d="M30 50h40l8 35-4 4-8-30H34l-8 30-4-4 8-35z" />
                    {/* Bustline Guide */}
                    <line x1="28" y1="62" x2="72" y2="62" stroke="#b87d60" strokeDasharray="3 2" strokeWidth="1.5" />
                    <circle cx="50" cy="62" r="2" fill="#b87d60" />
                    <text x="74" y="65" fill="#8e583f" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Bust</text>
                    {/* Torso & Natural Waist */}
                    <path d="M34 50c0 15-4 28-2 42 2 12 8 20 18 20s16-8 18-20c2-14-2-27-2-42" />
                    <line x1="33" y1="84" x2="67" y2="84" stroke="#c8a96e" strokeDasharray="3 2" strokeWidth="1.5" />
                    <text x="70" y="87" fill="#8f6e30" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Waist</text>
                    {/* Drop Waist */}
                    <line x1="32" y1="98" x2="68" y2="98" stroke="#b87d60" strokeDasharray="3 2" strokeWidth="1.5" />
                    <text x="70" y="101" fill="#8e583f" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">Drop W.</text>
                    {/* Hips */}
                    <line x1="30" y1="112" x2="70" y2="112" stroke="#c8a96e" strokeDasharray="3 2" strokeWidth="1.5" />
                    <text x="72" y="115" fill="#8f6e30" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Hips</text>
                    {/* Skirt / Pants Flare */}
                    <path d="M32 112L20 205h60l-12-93" />
                    {/* Height ruler */}
                    <line x1="12" y1="12" x2="12" y2="208" stroke="#8e583f" strokeWidth="1.2" strokeDasharray="4 2" />
                    <path d="M9 12h6M9 208h6" stroke="#8e583f" strokeWidth="1.2" />
                    <text x="6" y="110" fill="#8e583f" fontSize="7" fontWeight="bold" transform="rotate(-90 6 110)" textAnchor="middle">Full Height</text>
                  </svg>
                </div>
                <div className="mt-3 w-full rounded-xs bg-white/90 p-2 text-center border border-brand-border/60">
                  <p className="text-[10px] uppercase tracking-wider text-brand-text font-medium">
                    Tape level &amp; comfortably snug
                  </p>
                  <p className="text-[9px] text-brand-subtle mt-0.5">
                    Stand naturally with feet together
                  </p>
                </div>
              </div>

              {/* Numbered Instructions List */}
              <div className="lg:col-span-8 grid gap-3 sm:grid-cols-2">
                {guide.howToMeasure?.map((item, idx) => (
                  <div
                    key={item.label}
                    className="rounded-xs border border-brand-border/70 bg-ivory/40 p-3.5 transition-colors hover:border-gold/60 hover:bg-white"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose/15 text-[10px] font-semibold text-rose-dark font-mono">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-text">
                        {item.label}
                      </h4>
                    </div>
                    <p className="mt-1.5 pl-7 text-xs text-brand-muted leading-relaxed font-light">
                      {item.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 8. Please Note Section */}
          {guide.notes && guide.notes.length > 0 && (
            <div className="mt-8 rounded-sm border border-brand-border/80 bg-ivory-2/70 p-5 text-xs text-brand-muted">
              <p className="serif text-base font-semibold text-brand-text uppercase tracking-wide">
                Please Note:
              </p>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                {guide.notes.map((note, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Modal Footer actions */}
          <div className="mt-8 border-t border-brand-border pt-4 text-center">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm bg-rose px-8 py-2.5 text-xs uppercase tracking-wider text-white shadow-xs hover:bg-rose-dark transition"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Clean SVG silhouettes for the 5 Fit Types
 */
function FitSilhouetteIcon({ id }: { id: string }) {
  switch (id) {
    case "fitted":
      return (
        <svg className="h-9 w-9" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 8h12l2 6-4 8 2 12H14l2-12-4-8z" />
        </svg>
      );
    case "straight":
      return (
        <svg className="h-9 w-9" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 8h12l1 10v16H13V18z" />
        </svg>
      );
    case "a-line":
      return (
        <svg className="h-9 w-9" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 8h10l6 26H9z" />
        </svg>
      );
    case "flared":
      return (
        <svg className="h-9 w-9" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 8h10l2 8 8 18H5l8-18z" />
        </svg>
      );
    case "relaxed":
    default:
      return (
        <svg className="h-9 w-9" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 8h16l4 14-2 12H10l-2-12z" />
        </svg>
      );
  }
}
