import { CollectionPage } from "@/components/CollectionPage";

export default function NewArrivalsPage() {
  return (
    <CollectionPage
      title="New Arrivals"
      tag="Just Arrived"
      query={{ isNewArrival: "true", limit: "48" }}
    />
  );
}
