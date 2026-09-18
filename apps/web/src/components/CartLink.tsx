"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="text-[11px] uppercase tracking-[0.12em] text-brand-muted hover:text-rose-dark"
    >
      Cart{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
