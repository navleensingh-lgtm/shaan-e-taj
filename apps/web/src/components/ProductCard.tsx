"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/api";
import { orderWhatsAppUrl } from "@/lib/whatsapp";
import { calculateOrderPricing } from "@/lib/order-pricing";
import { trackEvent } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { WishlistButton } from "./WishlistButton";
import { ProductShareButton } from "./ProductShareButton";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const settings = useStoreSettings();
  const img = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const price = product.priceInPaise / 100;
  const mrp = product.compareAtPaise ? product.compareAtPaise / 100 : null;
  const onSale = mrp != null && mrp > price;
  const outOfStock = product.inStock === false;

  const whatsappPricing =
    settings &&
    calculateOrderPricing(product.priceInPaise, "UNSTITCHED", {
      fullStitchChargePaise: settings.fullStitchChargePaise,
      shippingFree: settings.shippingFree,
      shippingChargePaise: settings.shippingChargePaise,
    });

  function orderNow() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceInPaise: product.priceInPaise,
      imageUrl: img?.url,
    });
    router.push("/cart");
  }

  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded bg-ivory-2">
          {img?.url ? (
            <Image
              src={img.url}
              alt={product.name}
              fill
              unoptimized={img.url.startsWith("data:")}
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-brand-subtle">
              No image
            </div>
          )}
          {outOfStock && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[11px] uppercase tracking-wider text-white">
              Out of stock
            </span>
          )}
          {product.badge && !outOfStock && (
            <span className="absolute left-3 top-3 bg-rose px-2.5 py-1 text-[10px] uppercase tracking-wider text-white">
              {product.badge}
            </span>
          )}
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-brand-subtle">
          {product.subCategory.replace(/_/g, " ")}
        </p>
        <h3 className="serif mt-1 text-xl text-brand-text">{product.name}</h3>
        <p className="mt-1 font-medium text-rose-dark">
          ₹{price.toLocaleString("en-IN")}
          {onSale && (
            <span className="ml-2 text-sm font-normal text-brand-subtle line-through">
              ₹{mrp!.toLocaleString("en-IN")}
            </span>
          )}
        </p>
      </Link>
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={orderNow}
            disabled={outOfStock}
            className="flex flex-1 items-center justify-center rounded-sm bg-rose py-2.5 text-[11px] uppercase tracking-wider text-white disabled:opacity-50"
          >
            {outOfStock ? "Out of stock" : "Order Now"}
          </button>
          <WishlistButton productId={product.id} />
          <ProductShareButton slug={product.slug} name={product.name} />
        </div>
        <a
          href={orderWhatsAppUrl({
            name: product.name,
            slug: product.slug,
            price: price,
            category: product.mainCategory.replace(/_/g, " "),
            style: product.subCategory.replace(/_/g, " "),
            color: product.color,
            fabric: product.fabric,
            sku: product.slug,
            stitchingType: "UNSTITCHED",
            stitchingCharge: 0,
            shippingCharge: whatsappPricing ? whatsappPricing.shippingPaise / 100 : 0,
            totalPrice: whatsappPricing ? whatsappPricing.totalPaise / 100 : price,
          })}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { productId: product.id })}
          className="flex items-center justify-center gap-1.5 rounded-sm bg-[#25D366] py-2.5 text-[11px] uppercase tracking-wider text-white"
        >
          <span className="text-base leading-none">+</span>
          Order on WhatsApp
        </a>
      </div>
    </article>
  );
}
