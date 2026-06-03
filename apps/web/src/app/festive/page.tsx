import type { Metadata } from "next";
import { CollectionPage } from "@/components/CollectionPage";

export const metadata: Metadata = { title: "Festive Collection" };
export const dynamic = "force-dynamic";

export default function FestivePage() {
  return (
    <CollectionPage
      title="Festive Collection"
      tag="Season of Joy"
      query={{ mainCategory: "FESTIVE", limit: "200" }}
    />
  );
}
