import { Cormorant_Garamond } from "next/font/google";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col items-center justify-center bg-ivory text-brand-text">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="serif text-2xl sm:text-3xl tracking-[0.16em] text-brand-text">
          Shaan<span className="text-gold">·</span>e·Taj
        </div>
        <div className="h-0.5 w-16 bg-gold/60 rounded-full" />
        <p className="text-[9px] uppercase tracking-[0.25em] text-gold-dark font-medium">
          Loading Couture…
        </p>
      </div>
    </div>
  );
}
