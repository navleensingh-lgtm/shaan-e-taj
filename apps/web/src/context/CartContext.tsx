"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { StitchingChoice } from "@/lib/order-pricing";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  priceInPaise: number;
  imageUrl?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  stitchingType: StitchingChoice;
  setStitchingType: (type: StitchingChoice) => void;
  addItem: (item: Omit<CartLine, "quantity">, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clear: () => void;
  /** Sum of base product prices × qty (excludes stitching & shipping). */
  totalPaise: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "shaanetaj_cart";
const STITCH_KEY = "shaanetaj_stitching";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [stitchingType, setStitchingTypeState] = useState<StitchingChoice>("UNSTITCHED");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
      const st = localStorage.getItem(STITCH_KEY);
      if (st === "FULLY_STITCHED" || st === "UNSTITCHED") setStitchingTypeState(st);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const setStitchingType = useCallback((type: StitchingChoice) => {
    setStitchingTypeState(type);
    localStorage.setItem(STITCH_KEY, type);
  }, []);

  const addItem = useCallback((item: Omit<CartLine, "quantity">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId
            ? { ...p, quantity: p.quantity + qty }
            : p
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const updateQty = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.productId === productId ? { ...p, quantity } : p))
        .filter((p) => p.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setStitchingTypeState("UNSTITCHED");
    localStorage.removeItem(STITCH_KEY);
  }, []);

  const totalPaise = useMemo(
    () => items.reduce((s, i) => s + i.priceInPaise * i.quantity, 0),
    [items]
  );
  const count = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      stitchingType,
      setStitchingType,
      addItem,
      removeItem,
      updateQty,
      clear,
      totalPaise,
      count,
    }),
    [items, stitchingType, setStitchingType, addItem, removeItem, updateQty, clear, totalPaise, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
