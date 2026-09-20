"use client";

import { useState } from "react";
import {
  SUPPORTED_CURRENCIES,
  SUPPORTED_COUNTRIES,
  SUPPORTED_LANGUAGES,
  type CurrencyCode,
} from "@/lib/currency";
import { useCurrency } from "@/context/CurrencyContext";

type ModalTab = "currency" | "country" | "language";

export function FloatingCurrencySelector() {
  const {
    currency,
    currencyInfo,
    setCurrency,
    country,
    countryInfo,
    setCountry,
    language,
    languageInfo,
    setLanguage,
  } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>("currency");

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40">
      <div className="relative">
        {/* Floating Modal Popup */}
        {isOpen && (
          <div className="absolute bottom-full left-0 mb-3 w-80 max-w-[calc(100vw-2rem)] rounded-xs border border-brand-border bg-white/95 p-4 shadow-2xl backdrop-blur-md animate-editorial-reveal text-brand-text">
            {/* Header with Close */}
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-2.5 mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-dark font-medium">
                  Regional Preferences
                </p>
                <p className="serif text-sm font-normal text-espresso mt-0.5">
                  Country, Language & Currency
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-brand-subtle hover:text-espresso text-base px-1 leading-none"
                aria-label="Close preferences"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex rounded-xs bg-ivory-2 p-1 gap-1 border border-brand-border/60 mb-3 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("currency")}
                className={`flex-1 rounded-xs py-1 text-[10px] uppercase tracking-wider font-medium transition cursor-pointer ${
                  activeTab === "currency"
                    ? "bg-espresso text-white shadow-xs"
                    : "text-brand-muted hover:text-espresso"
                }`}
              >
                Currency
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("country")}
                className={`flex-1 rounded-xs py-1 text-[10px] uppercase tracking-wider font-medium transition cursor-pointer ${
                  activeTab === "country"
                    ? "bg-espresso text-white shadow-xs"
                    : "text-brand-muted hover:text-espresso"
                }`}
              >
                Country
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("language")}
                className={`flex-1 rounded-xs py-1 text-[10px] uppercase tracking-wider font-medium transition cursor-pointer ${
                  activeTab === "language"
                    ? "bg-espresso text-white shadow-xs"
                    : "text-brand-muted hover:text-espresso"
                }`}
              >
                Language
              </button>
            </div>

            {/* Tab Contents */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
              {activeTab === "currency" && (
                <>
                  {Object.values(SUPPORTED_CURRENCIES).map((c) => {
                    const active = c.code === currency;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setCurrency(c.code as CurrencyCode);
                          setIsOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xs px-3 py-2 text-xs transition cursor-pointer active:scale-98 ${
                          active
                            ? "bg-espresso text-ivory font-medium"
                            : "hover:bg-ivory-2 text-brand-text"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{c.label}</span>
                        </div>
                        <span className="serif text-gold text-xs font-semibold">{c.symbol}</span>
                      </button>
                    );
                  })}
                </>
              )}

              {activeTab === "country" && (
                <>
                  {SUPPORTED_COUNTRIES.map((cty) => {
                    const active = cty.code === country;
                    return (
                      <button
                        key={cty.code}
                        type="button"
                        onClick={() => {
                          setCountry(cty.code);
                          setIsOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xs px-3 py-2 text-xs transition cursor-pointer active:scale-98 ${
                          active
                            ? "bg-espresso text-ivory font-medium"
                            : "hover:bg-ivory-2 text-brand-text"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{cty.flag}</span>
                          <span>{cty.name}</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-brand-subtle">
                          {cty.defaultCurrency}
                        </span>
                      </button>
                    );
                  })}
                </>
              )}

              {activeTab === "language" && (
                <>
                  {SUPPORTED_LANGUAGES.map((lng) => {
                    const active = lng.code === language;
                    return (
                      <button
                        key={lng.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lng.code);
                          setIsOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xs px-3 py-2 text-xs transition cursor-pointer active:scale-98 ${
                          active
                            ? "bg-espresso text-ivory font-medium"
                            : "hover:bg-ivory-2 text-brand-text"
                        }`}
                      >
                        <div>
                          <span>{lng.name}</span>
                          <span className="ml-2 text-brand-subtle text-[11px]">({lng.nativeName})</span>
                        </div>
                        {active && <span className="text-gold text-xs">✓</span>}
                      </button>
                    );
                  })}
                  <p className="text-[10px] text-brand-subtle pt-2 px-2 border-t border-brand-border/40 leading-relaxed">
                    * Showing only genuinely supported boutique languages.
                  </p>
                </>
              )}
            </div>

            {/* Current Summary Footer */}
            <div className="mt-3 pt-2.5 border-t border-brand-border/60 flex items-center justify-between text-[10px] text-brand-muted">
              <span>
                {countryInfo.flag} {countryInfo.name} · {languageInfo.name}
              </span>
              <span className="font-semibold text-espresso">
                {currencyInfo.symbol} {currencyInfo.code}
              </span>
            </div>
          </div>
        )}

        {/* Floating Trigger Pill */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex min-h-[38px] items-center gap-2 rounded-full border border-brand-border/80 bg-white/95 px-3.5 py-1.5 text-xs text-espresso shadow-md backdrop-blur-md hover:border-gold transition active:scale-95 cursor-pointer select-none"
          aria-label="Country, Language & Currency Selector"
          aria-expanded={isOpen}
        >
          <span className="text-xs">{countryInfo.flag}</span>
          <span className="serif text-xs font-semibold text-gold-dark">{currencyInfo.symbol}</span>
          <span className="text-[11px] font-medium tracking-wide uppercase">{currencyInfo.code}</span>
          <span className="text-[9px] text-brand-subtle">{isOpen ? "▲" : "▼"}</span>
        </button>
      </div>
    </div>
  );
}
