"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="flex min-h-[44px] items-center px-2 text-[11px] uppercase tracking-[0.12em] text-brand-muted hover:text-rose-dark transition-colors"
    >
      <span className="flex items-center gap-1">
        <span>Cart</span>
        {count > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose text-[10px] font-bold text-white px-1">
            {count}
          </span>
        )}
      </span>
    </Link>
  );
}
