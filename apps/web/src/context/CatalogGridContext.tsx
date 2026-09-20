"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type GridColumns = 1 | 2 | 3 | 4;

type CatalogGridContextValue = {
  columns: GridColumns;
  setColumns: (cols: GridColumns) => void;
};

const STORAGE_KEY = "shaan_catalog_grid_cols";

const CatalogGridContext = createContext<CatalogGridContextValue>({
  columns: 4,
  setColumns: () => {},
});

export function CatalogGridProvider({ children }: { children: React.ReactNode }) {
  const [columns, setColumnsState] = useState<GridColumns>(4);

  // Load saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed === 1 || parsed === 2 || parsed === 3 || parsed === 4) {
          setColumnsState(parsed as GridColumns);
        }
      }
    } catch {
      // localStorage may fail in private mode or SSR
    }
  }, []);

  const setColumns = (cols: GridColumns) => {
    setColumnsState(cols);
    try {
      localStorage.setItem(STORAGE_KEY, String(cols));
    } catch {
      // ignore
    }
  };

  return (
    <CatalogGridContext.Provider value={{ columns, setColumns }}>
      {children}
    </CatalogGridContext.Provider>
  );
}

export function useCatalogGrid() {
  return useContext(CatalogGridContext);
}
