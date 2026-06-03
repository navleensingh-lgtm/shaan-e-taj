import { CollectionPage } from "@/components/CollectionPage";

export const dynamic = "force-dynamic";

export default function BridalPage() {
  return (
    <CollectionPage
      title="Bridal Collection"
      tag="For Your Special Day"
      query={{ mainCategory: "BRIDAL", limit: "200" }}
    />
  );
}
