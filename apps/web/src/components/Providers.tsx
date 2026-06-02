"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { PageViewTracker } from "./PageViewTracker";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <PageViewTracker />
        {children}
      </CartProvider>
    </SessionProvider>
  );
}
