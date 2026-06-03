import type { Metadata } from "next";
import { CollectionPage } from "@/components/CollectionPage";

export const metadata: Metadata = { title: "Party Wear" };
export const dynamic = "force-dynamic";

export default function PartyWearPage() {
  return (
    <CollectionPage
      title="Party Wear"
      tag="Celebrate in Style"
      query={{ mainCategory: "PARTY_WEAR", limit: "200" }}
    />
  );
}
