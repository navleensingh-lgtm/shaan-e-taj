"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { StoreSettingsProvider } from "@/context/StoreSettingsContext";
import { PageViewTracker } from "./PageViewTracker";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreSettingsProvider>
        <CartProvider>
          <PageViewTracker />
          {children}
        </CartProvider>
      </StoreSettingsProvider>
    </SessionProvider>
  );
}
