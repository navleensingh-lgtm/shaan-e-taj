"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { StoreSettingsProvider } from "@/context/StoreSettingsContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { PageViewTracker } from "./PageViewTracker";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreSettingsProvider>
        <CurrencyProvider>
          <CartProvider>
            <PageViewTracker />
            {children}
          </CartProvider>
        </CurrencyProvider>
      </StoreSettingsProvider>
    </SessionProvider>
  );
}
