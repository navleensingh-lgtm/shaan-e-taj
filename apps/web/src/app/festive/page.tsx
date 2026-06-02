import { CollectionPage } from "@/components/CollectionPage";

export default function FestivePage() {
  return (
    <CollectionPage
      title="Festive Collection"
      tag="Season of Joy"
      query={{ mainCategory: "FESTIVE", limit: "48" }}
    />
  );
}
