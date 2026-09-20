"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/api";
import { orderWhatsAppUrl } from "@/lib/whatsapp";
import { calculateOrderPricing } from "@/lib/order-pricing";
import { trackEvent } from "@/lib/api";
import { videoEmbed } from "@/lib/product-media";
import { useCart } from "@/context/CartContext";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { WishlistButton } from "./WishlistButton";
import { ProductShareButton } from "./ProductShareButton";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const settings = useStoreSettings();

  const [isHovered, setIsHovered] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  const primaryImg = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const secondaryImg = product.images.length > 1 ? product.images[1] : null;

  // Video detection (MP4 or direct video url preferred for hover preview)
  const videoMedia = product.media?.find((m) => {
    const embed = videoEmbed(m.url);
    return embed.type === "video";
  });

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

  function orderNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock || isOrdering) return;

    // Instant tactile loading feedback
    setIsOrdering(true);

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceInPaise: product.priceInPaise,
      imageUrl: primaryImg?.url,
    });

    router.push("/cart");
  }

  return (
    <article
      className="group relative flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xs bg-ivory-2 border border-brand-border/60">
          {/* 1. Primary Image */}
          {primaryImg?.url ? (
            <Image
              src={primaryImg.url}
              alt={product.name}
              fill
              unoptimized={primaryImg.url.startsWith("data:")}
              className={`object-cover transition-all duration-700 ease-out ${
                isHovered && (videoMedia || secondaryImg) ? "opacity-0 scale-102" : "opacity-100 scale-100"
              }`}
              sizes="(max-width:768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-brand-subtle">
              No image
            </div>
          )}

          {/* 2. Secondary Image Hover Reveal (if no video) */}
          {!videoMedia && secondaryImg?.url && (
            <Image
              src={secondaryImg.url}
              alt={`${product.name} — alternate view`}
              fill
              unoptimized={secondaryImg.url.startsWith("data:")}
              className={`object-cover transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-102"
              }`}
              sizes="(max-width:768px) 50vw, 25vw"
            />
          )}

          {/* 3. Video On Hover (Desktop) */}
          {videoMedia && isHovered && (
            <div className="hidden sm:block absolute inset-0 bg-black">
              <video
                src={videoEmbed(videoMedia.url).src}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-2xs">
              <span className="rounded-xs border border-white/30 bg-black/60 px-3 py-1 text-[10px] uppercase tracking-widest text-white">
                Out of stock
              </span>
            </div>
          )}

          {/* Luxury Badges */}
          {product.badge && !outOfStock && (
            <span className="absolute left-2.5 top-2.5 rounded-xs border border-rose/30 bg-rose/90 px-2 py-0.5 text-[9px] uppercase tracking-widest text-white shadow-xs">
              {product.badge}
            </span>
          )}

          {videoMedia && !outOfStock && (
            <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-xs bg-espresso/80 px-2 py-0.5 text-[9px] uppercase tracking-wider text-ivory backdrop-blur-xs border border-gold/30">
              <span className="text-[8px] text-gold">▶</span>
              <span>Video</span>
            </span>
          )}
        </div>

        {/* Product Details Hierarchy */}
        <div className="mt-3.5">
          <p className="text-[9px] uppercase tracking-[0.25em] text-brand-subtle font-medium">
            {product.subCategory.replace(/_/g, " ")}
          </p>

          <h3 className="serif mt-1 text-lg sm:text-xl text-brand-text group-hover:text-rose-dark transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>

          <p className="mt-1 flex items-baseline gap-2 text-sm font-medium text-rose-dark">
            <span>₹{price.toLocaleString("en-IN")}</span>
            {onSale && (
              <span className="text-xs font-normal text-brand-subtle line-through">
                ₹{mrp!.toLocaleString("en-IN")}
              </span>
            )}
          </p>
        </div>
      </Link>

      {/* Tactile Action Buttons */}
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={orderNow}
            disabled={outOfStock || isOrdering}
            className="btn-luxury-primary flex-1 py-2.5 rounded-xs text-[10px] uppercase tracking-[0.16em] font-medium disabled:opacity-50"
          >
            {isOrdering ? (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border border-ivory border-t-transparent" />
                <span>Adding…</span>
              </span>
            ) : outOfStock ? (
              "Out of stock"
            ) : (
              <span className="flex items-center justify-center gap-1">
                <span>Order Now</span>
                <span className="arrow-shift text-gold">→</span>
              </span>
            )}
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
          className="btn-luxury-whatsapp flex items-center justify-center gap-1.5 rounded-xs py-2 text-[10px] uppercase tracking-wider font-medium"
        >
          <span className="text-sm leading-none">💬</span>
          <span>Order on WhatsApp</span>
        </a>
      </div>
    </article>
  );
}

