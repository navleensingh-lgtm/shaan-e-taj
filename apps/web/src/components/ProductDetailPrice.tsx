"use client";

import { useCurrency } from "@/context/CurrencyContext";

interface ProductDetailPriceProps {
  priceInPaise: number;
  compareAtPaise?: number | null;
}

export function ProductDetailPrice({ priceInPaise, compareAtPaise }: ProductDetailPriceProps) {
  const { formatPrice } = useCurrency();
  const onSale = compareAtPaise != null && compareAtPaise > priceInPaise;

  return (
    <div className="mt-3 sm:mt-4 flex flex-wrap items-baseline gap-2 sm:gap-3 border-b border-brand-border/60 pb-3 sm:pb-4">
      <span className="text-2xl sm:text-3xl font-medium text-rose-dark">
        {formatPrice(priceInPaise)}
      </span>
      {onSale && (
        <span className="text-sm sm:text-base text-brand-subtle line-through">
          {formatPrice(compareAtPaise!)}
        </span>
      )}
      <span className="w-full sm:w-auto text-[10px] sm:text-[11px] text-brand-muted uppercase tracking-wider">
        Taxes included · Free domestic shipping
      </span>
    </div>
  );
}
