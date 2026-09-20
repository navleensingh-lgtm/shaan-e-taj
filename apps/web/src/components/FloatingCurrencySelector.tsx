"use client";

import { useState } from "react";

export type Currency = {
  code: string;
  symbol: string;
  label: string;
};

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", label: "INR (₹)" },
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "CAD", symbol: "CA$", label: "CAD ($)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "AUD", symbol: "AU$", label: "AUD ($)" },
];

export function FloatingCurrencySelector() {
  const [selected, setSelected] = useState<string>("INR");
  const [isOpen, setIsOpen] = useState(false);

  const current = SUPPORTED_CURRENCIES.find((c) => c.code === selected) || SUPPORTED_CURRENCIES[0];

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40">
      <div className="relative">
        {/* Currency Menu Dropdown */}
        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-44 rounded-xs border border-brand-border/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-md animate-editorial-reveal">
            <p className="px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-brand-subtle font-semibold border-b border-brand-border/50 mb-1">
              Select Currency
            </p>
            <div className="space-y-0.5">
              {SUPPORTED_CURRENCIES.map((c) => {
                const active = c.code === selected;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setSelected(c.code);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xs px-2.5 py-2 text-xs transition cursor-pointer active:scale-95 ${
                      active
                        ? "bg-espresso text-ivory font-medium"
                        : "text-brand-text hover:bg-ivory-2 hover:text-espresso"
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className="font-serif text-gold text-xs">{c.symbol}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Floating Trigger Pill */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex min-h-[38px] items-center gap-1.5 rounded-full border border-brand-border/80 bg-white/95 px-3 py-1.5 text-xs text-espresso shadow-md backdrop-blur-md hover:border-gold transition active:scale-95 cursor-pointer select-none"
          aria-label="Currency Selector"
          aria-expanded={isOpen}
        >
          <span className="serif text-xs font-semibold text-gold-dark">{current.symbol}</span>
          <span className="text-[11px] font-medium tracking-wide uppercase">{current.code}</span>
          <span className="text-[10px] text-brand-subtle ml-0.5">{isOpen ? "▲" : "▼"}</span>
        </button>
      </div>
    </div>
  );
}
