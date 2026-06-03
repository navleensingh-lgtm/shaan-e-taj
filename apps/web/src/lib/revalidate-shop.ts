import { revalidatePath } from "next/cache";

/** Clear cached shop pages after admin saves. */
export function revalidateShop() {
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
    revalidatePath(path);
  }
  revalidatePath("/", "layout");
}
