"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/api";

export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    trackEvent("page_view", { metadata: { path: pathname } });
  }, [pathname]);
  return null;
}
