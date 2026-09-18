import type { Metadata } from "next";
import { CollectionPage } from "@/components/CollectionPage";

export const metadata: Metadata = { title: "Bridal Collection" };
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
