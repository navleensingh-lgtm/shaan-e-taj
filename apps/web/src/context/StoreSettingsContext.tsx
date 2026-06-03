"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { PublicStoreSettings } from "@/lib/store-settings";

const StoreSettingsContext = createContext<PublicStoreSettings | null>(null);

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PublicStoreSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings/public", { cache: "no-store" })
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => null);
  }, []);

  return (
    <StoreSettingsContext.Provider value={settings}>{children}</StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext);
}
