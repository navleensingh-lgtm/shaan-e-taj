import type { Metadata } from "next";
import { CollectionPage } from "@/components/CollectionPage";

export const metadata: Metadata = { title: "New Arrivals" };
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
