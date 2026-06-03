import { revalidatePath } from "next/cache";

/** Clear cached shop pages after admin saves. */
export function revalidateShop(productSlug?: string) {
  const paths = [
    "/",
    "/catalog",
    "/contact",
    "/about",
    "/new-arrivals",
    "/bridal",
    "/party-wear",
    "/festive",
  ];
  for (const path of paths) {
    revalidatePath(path, "page");
    revalidatePath(path, "layout");
  }
  revalidatePath("/", "layout");
  if (productSlug) {
    revalidatePath(`/product/${productSlug}`, "page");
  }
}
