"use client";

import { useEffect, useState } from "react";

export type CategoryOption = { slug: string; name: string; kind: string };

export type FiltersState = {
  mainCategory: string;
  subCategory: string;
  productType: string;
  availability: string;
  minPrice: string;
  maxPrice: string;
  color: string;
  fabric: string;
  occasion: string;
};

export const COMMON_COLORS = [
  "Wine",
  "Maroon",
  "Ivory",
  "Sage",
  "Emerald",
  "Rose Gold",
  "Royal Blue",
  "Mustard",
  "Pink",
  "Gold",
  "Black",
];

export const COMMON_FABRICS = [
  "Pure Silk",
  "Banarasi Silk",
  "Velvet",
  "Georgette",
  "Organza",
  "Chiffon",
  "Raw Silk",
  "Chanderi",
  "Cotton Silk",
];

export const COMMON_OCCASIONS = [
  "Bridal",
  "Wedding Reception",
  "Mehendi",
  "Haldi",
  "Sangeet",
  "Cocktail",
  "Festive",
  "Party Wear",
];

export const COMMON_PRODUCT_TYPES = [
  "Ready Made",
  "Unstitched",
  "Semi-Stitched",
  "Kurti",
  "Farshi Set",
  "Sharara Suit",
  "Anarkali",
  "Lehenga",
];

export const PRICE_PRESETS = [
  { label: "Under ₹5,000", min: "", max: "5000" },
  { label: "₹5,000 – ₹10,000", min: "5000", max: "10000" },
  { label: "₹10,000 – ₹20,000", min: "10000", max: "20000" },
  { label: "₹20,000 & Above", min: "20000", max: "" },
];

interface CatalogFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FiltersState;
  onApplyFilters: (filters: FiltersState) => void;
  onResetFilters: () => void;
  mainCategories: CategoryOption[];
  subCategories: CategoryOption[];
  activeCount: number;
}

export function CatalogFilterDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  mainCategories,
  subCategories,
  activeCount,
}: CatalogFilterDrawerProps) {
  // Working copy of filters inside the drawer
  const [draft, setDraft] = useState<FiltersState>(filters);

  // Sync draft when opened or external filters change
  useEffect(() => {
    setDraft(filters);
  }, [filters, isOpen]);

  // Lock body scroll when drawer is open
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

  // Keyboard escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    category: true,
    occasion: false,
    color: false,
    fabric: false,
    productType: false,
    availability: false,
  });

  function toggleSection(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleDraftChange(key: keyof FiltersState, val: string) {
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key] === val ? "" : val, // toggle off if already active
    }));
  }

  function handlePricePreset(min: string, max: string) {
    if (draft.minPrice === min && draft.maxPrice === max) {
      setDraft((prev) => ({ ...prev, minPrice: "", maxPrice: "" }));
    } else {
      setDraft((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
    }
  }

  function apply() {
    onApplyFilters(draft);
    onClose();
  }

  function reset() {
    onResetFilters();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filters-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#201610]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Container */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#faf7f2] text-brand-text shadow-2xl animate-editorial-reveal">
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-brand-border/80 px-6">
          <div className="flex items-center gap-2">
            <h2 id="filters-title" className="serif text-2xl font-normal uppercase tracking-wide">
              Filters
            </h2>
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose text-[10px] font-semibold text-white">
                {activeCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-text transition hover:border-gold hover:text-espresso active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Facets Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-brand-border/50">
          {/* 1. Price Range */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => toggleSection("price")}
              className="flex w-full items-center justify-between py-2 text-left text-xs uppercase tracking-[0.2em] font-semibold text-espresso"
            >
              <span>Price Range</span>
              <span className="text-gold text-sm">{openSections.price ? "−" : "+"}</span>
            </button>
            {openSections.price && (
              <div className="mt-2 space-y-2 pb-2">
                <div className="grid grid-cols-2 gap-2">
                  {PRICE_PRESETS.map((p) => {
                    const active = draft.minPrice === p.min && draft.maxPrice === p.max;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handlePricePreset(p.min, p.max)}
                        className={`min-h-[40px] px-3 py-2 rounded-xs border text-xs text-center transition cursor-pointer active:scale-95 ${
                          active
                            ? "border-espresso bg-espresso text-ivory font-medium shadow-2xs"
                            : "border-brand-border bg-white text-brand-muted hover:border-gold hover:text-espresso"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={draft.minPrice}
                    onChange={(e) => setDraft((prev) => ({ ...prev, minPrice: e.target.value }))}
                    className="w-full rounded-xs border border-brand-border bg-white px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                  <span className="text-brand-subtle text-xs">—</span>
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={draft.maxPrice}
                    onChange={(e) => setDraft((prev) => ({ ...prev, maxPrice: e.target.value }))}
                    className="w-full rounded-xs border border-brand-border bg-white px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Categories & Styles */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => toggleSection("category")}
              className="flex w-full items-center justify-between py-2 text-left text-xs uppercase tracking-[0.2em] font-semibold text-espresso"
            >
              <span>Category & Collection</span>
              <span className="text-gold text-sm">{openSections.category ? "−" : "+"}</span>
            </button>
            {openSections.category && (
              <div className="mt-2 space-y-3 pb-2">
                {mainCategories.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-brand-subtle mb-2 font-medium">Main Category</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mainCategories.map((c) => {
                        const active = draft.mainCategory === c.slug;
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => handleDraftChange("mainCategory", c.slug)}
                            className={`min-h-[36px] px-3 py-1.5 rounded-xs border text-xs transition cursor-pointer active:scale-95 ${
                              active
                                ? "border-espresso bg-espresso text-ivory font-medium"
                                : "border-brand-border bg-white text-brand-muted hover:border-gold hover:text-espresso"
                            }`}
                          >
                            {c.name.replace(/_/g, " ")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {subCategories.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] uppercase tracking-wider text-brand-subtle mb-2 font-medium">Style / Silhouette</p>
                    <div className="flex flex-wrap gap-1.5">
                      {subCategories.map((c) => {
                        const active = draft.subCategory === c.slug;
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => handleDraftChange("subCategory", c.slug)}
                            className={`min-h-[36px] px-3 py-1.5 rounded-xs border text-xs transition cursor-pointer active:scale-95 ${
                              active
                                ? "border-espresso bg-espresso text-ivory font-medium"
                                : "border-brand-border bg-white text-brand-muted hover:border-gold hover:text-espresso"
                            }`}
                          >
                            {c.name.replace(/_/g, " ")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Occasion */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => toggleSection("occasion")}
              className="flex w-full items-center justify-between py-2 text-left text-xs uppercase tracking-[0.2em] font-semibold text-espresso"
            >
              <span>Occasion</span>
              <span className="text-gold text-sm">{openSections.occasion ? "−" : "+"}</span>
            </button>
            {openSections.occasion && (
              <div className="mt-2 flex flex-wrap gap-1.5 pb-2">
                {COMMON_OCCASIONS.map((occ) => {
                  const active = draft.occasion.toLowerCase() === occ.toLowerCase();
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => handleDraftChange("occasion", occ)}
                      className={`min-h-[36px] px-3 py-1.5 rounded-xs border text-xs transition cursor-pointer active:scale-95 ${
                        active
                          ? "border-espresso bg-espresso text-ivory font-medium"
                          : "border-brand-border bg-white text-brand-muted hover:border-gold hover:text-espresso"
                      }`}
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Colour */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => toggleSection("color")}
              className="flex w-full items-center justify-between py-2 text-left text-xs uppercase tracking-[0.2em] font-semibold text-espresso"
            >
              <span>Colour</span>
              <span className="text-gold text-sm">{openSections.color ? "−" : "+"}</span>
            </button>
            {openSections.color && (
              <div className="mt-2 flex flex-wrap gap-1.5 pb-2">
                {COMMON_COLORS.map((col) => {
                  const active = draft.color.toLowerCase() === col.toLowerCase();
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => handleDraftChange("color", col)}
                      className={`min-h-[36px] px-3 py-1.5 rounded-xs border text-xs transition cursor-pointer active:scale-95 ${
                        active
                          ? "border-espresso bg-espresso text-ivory font-medium"
                          : "border-brand-border bg-white text-brand-muted hover:border-gold hover:text-espresso"
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Fabric */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => toggleSection("fabric")}
              className="flex w-full items-center justify-between py-2 text-left text-xs uppercase tracking-[0.2em] font-semibold text-espresso"
            >
              <span>Fabric</span>
              <span className="text-gold text-sm">{openSections.fabric ? "−" : "+"}</span>
            </button>
            {openSections.fabric && (
              <div className="mt-2 flex flex-wrap gap-1.5 pb-2">
                {COMMON_FABRICS.map((fab) => {
                  const active = draft.fabric.toLowerCase() === fab.toLowerCase();
                  return (
                    <button
                      key={fab}
                      type="button"
                      onClick={() => handleDraftChange("fabric", fab)}
                      className={`min-h-[36px] px-3 py-1.5 rounded-xs border text-xs transition cursor-pointer active:scale-95 ${
                        active
                          ? "border-espresso bg-espresso text-ivory font-medium"
                          : "border-brand-border bg-white text-brand-muted hover:border-gold hover:text-espresso"
                      }`}
                    >
                      {fab}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 6. Product Type */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => toggleSection("productType")}
              className="flex w-full items-center justify-between py-2 text-left text-xs uppercase tracking-[0.2em] font-semibold text-espresso"
            >
              <span>Product Type</span>
              <span className="text-gold text-sm">{openSections.productType ? "−" : "+"}</span>
            </button>
            {openSections.productType && (
              <div className="mt-2 flex flex-wrap gap-1.5 pb-2">
                {COMMON_PRODUCT_TYPES.map((pt) => {
                  const active = draft.productType.toLowerCase() === pt.toLowerCase();
                  return (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => handleDraftChange("productType", pt)}
                      className={`min-h-[36px] px-3 py-1.5 rounded-xs border text-xs transition cursor-pointer active:scale-95 ${
                        active
                          ? "border-espresso bg-espresso text-ivory font-medium"
                          : "border-brand-border bg-white text-brand-muted hover:border-gold hover:text-espresso"
                      }`}
                    >
                      {pt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 7. Availability */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => toggleSection("availability")}
              className="flex w-full items-center justify-between py-2 text-left text-xs uppercase tracking-[0.2em] font-semibold text-espresso"
            >
              <span>Availability</span>
              <span className="text-gold text-sm">{openSections.availability ? "−" : "+"}</span>
            </button>
            {openSections.availability && (
              <div className="mt-2 flex flex-wrap gap-2 pb-2">
                {[
                  { value: "READY_TO_SHIP", label: "Ready to Ship" },
                  { value: "MADE_TO_ORDER", label: "Made to Order" },
                  { value: "CUSTOM", label: "Custom Tailored" },
                ].map((av) => {
                  const active = draft.availability === av.value;
                  return (
                    <button
                      key={av.value}
                      type="button"
                      onClick={() => handleDraftChange("availability", av.value)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-xs border text-xs transition cursor-pointer active:scale-95 ${
                        active
                          ? "border-espresso bg-espresso text-ivory font-medium"
                          : "border-brand-border bg-white text-brand-muted hover:border-gold hover:text-espresso"
                      }`}
                    >
                      {av.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Sticky Footer Actions */}
        <div className="border-t border-brand-border/80 bg-white p-4 flex items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="flex-1 min-h-[44px] rounded-xs border border-brand-border text-xs uppercase tracking-wider text-brand-muted hover:border-gold hover:text-espresso transition active:scale-95"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={apply}
            className="btn-luxury-primary flex-1 min-h-[44px] rounded-xs text-xs uppercase tracking-[0.16em] font-medium"
          >
            <span>Apply Filters</span>
            <span className="arrow-shift ml-1.5 text-gold">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
