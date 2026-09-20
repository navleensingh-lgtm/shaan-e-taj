"use client";

import React from "react";
import { useCatalogGrid, type GridColumns } from "@/context/CatalogGridContext";

export function GridControl({ className = "" }: { className?: string }) {
  const { columns, setColumns } = useCatalogGrid();

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-brand-subtle font-medium hidden sm:inline">
        Grid:
      </span>

      <div className="inline-flex items-center rounded-xs border border-brand-border bg-white p-0.5 shadow-2xs">
        {/* Mobile: 1 Col */}
        <button
          type="button"
          onClick={() => setColumns(1)}
          aria-label="1 column layout"
          title="1 Column"
          className={`flex sm:hidden h-7 w-7 items-center justify-center rounded-xs text-[11px] font-medium transition cursor-pointer ${
            columns === 1
              ? "bg-espresso text-white shadow-xs font-semibold"
              : "text-brand-muted hover:text-espresso hover:bg-ivory-2"
          }`}
        >
          1
        </button>

        {/* All Devices: 2 Cols */}
        <button
          type="button"
          onClick={() => setColumns(2)}
          aria-label="2 columns layout"
          title="2 Columns"
          className={`flex h-7 w-7 items-center justify-center rounded-xs text-[11px] font-medium transition cursor-pointer ${
            columns === 2
              ? "bg-espresso text-white shadow-xs font-semibold"
              : "text-brand-muted hover:text-espresso hover:bg-ivory-2"
          }`}
        >
          2
        </button>

        {/* Desktop / Tablet: 3 Cols */}
        <button
          type="button"
          onClick={() => setColumns(3)}
          aria-label="3 columns layout"
          title="3 Columns"
          className={`hidden sm:flex h-7 w-7 items-center justify-center rounded-xs text-[11px] font-medium transition cursor-pointer ${
            columns === 3
              ? "bg-espresso text-white shadow-xs font-semibold"
              : "text-brand-muted hover:text-espresso hover:bg-ivory-2"
          }`}
        >
          3
        </button>

        {/* Desktop: 4 Cols */}
        <button
          type="button"
          onClick={() => setColumns(4)}
          aria-label="4 columns layout"
          title="4 Columns"
          className={`hidden md:flex h-7 w-7 items-center justify-center rounded-xs text-[11px] font-medium transition cursor-pointer ${
            columns === 4
              ? "bg-espresso text-white shadow-xs font-semibold"
              : "text-brand-muted hover:text-espresso hover:bg-ivory-2"
          }`}
        >
          4
        </button>
      </div>
    </div>
  );
}
