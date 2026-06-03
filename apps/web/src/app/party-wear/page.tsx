import { CollectionPage } from "@/components/CollectionPage";

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
