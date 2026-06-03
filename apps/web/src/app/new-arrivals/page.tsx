import { CollectionPage } from "@/components/CollectionPage";

export const dynamic = "force-dynamic";

export default function NewArrivalsPage() {
  return (
    <CollectionPage
      title="New Arrivals"
      tag="Just Arrived"
      query={{ isNewArrival: "true", limit: "200" }}
    />
  );
}
