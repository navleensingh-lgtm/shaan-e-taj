"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
  type CurrencyInfo,
  formatCurrency,
  SUPPORTED_COUNTRIES,
  type SupportedCountry,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/lib/currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  currencyInfo: CurrencyInfo;
  setCurrency: (code: CurrencyCode) => void;
  country: string;
  countryInfo: SupportedCountry;
  setCountry: (code: string) => void;
  language: string;
  languageInfo: SupportedLanguage;
  setLanguage: (code: string) => void;
  formatPrice: (paise: number) => string;
  rates: Partial<Record<CurrencyCode, number>>;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const CURRENCY_KEY = "shaanetaj_currency";
const COUNTRY_KEY = "shaanetaj_country";
const LANGUAGE_KEY = "shaanetaj_language";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");
  const [country, setCountryState] = useState<string>("IN");
  const [language, setLanguageState] = useState<string>("en");
  const [rates, setRates] = useState<Partial<Record<CurrencyCode, number>>>({});

  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem(CURRENCY_KEY) as CurrencyCode | null;
      if (savedCurrency && SUPPORTED_CURRENCIES[savedCurrency]) {
        setCurrencyState(savedCurrency);
      }
      const savedCountry = localStorage.getItem(COUNTRY_KEY);
      if (savedCountry && SUPPORTED_COUNTRIES.some((c) => c.code === savedCountry)) {
        setCountryState(savedCountry);
      }
      const savedLang = localStorage.getItem(LANGUAGE_KEY);
      if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
        setLanguageState(savedLang);
      }
    } catch {
      // ignore
    }
  }, []);

  function setCurrency(code: CurrencyCode) {
    if (!SUPPORTED_CURRENCIES[code]) return;
    setCurrencyState(code);
    try {
      localStorage.setItem(CURRENCY_KEY, code);
    } catch {
      // ignore
    }
  }

  function setCountry(code: string) {
    const matched = SUPPORTED_COUNTRIES.find((c) => c.code === code);
    if (!matched) return;
    setCountryState(code);
    try {
      localStorage.setItem(COUNTRY_KEY, code);
    } catch {
      // ignore
    }
    // Automatically match currency to country if user switches country
    if (matched.defaultCurrency) {
      setCurrency(matched.defaultCurrency);
    }
  }

  function setLanguage(code: string) {
    const matched = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (!matched) return;
    setLanguageState(code);
    try {
      localStorage.setItem(LANGUAGE_KEY, code);
    } catch {
      // ignore
    }
  }

  const currencyInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.INR;
  const countryInfo =
    SUPPORTED_COUNTRIES.find((c) => c.code === country) || SUPPORTED_COUNTRIES[0];
  const languageInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const value = useMemo(
    () => ({
      currency,
      currencyInfo,
      setCurrency,
      country,
      countryInfo,
      setCountry,
      language,
      languageInfo,
      setLanguage,
      rates,
      formatPrice: (paise: number) => formatCurrency(paise, currency, rates),
    }),
    [currency, currencyInfo, country, countryInfo, language, languageInfo, rates]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Fallback safe dummy context to prevent hydration crashes if used outside provider
    return {
      currency: "INR" as CurrencyCode,
      currencyInfo: SUPPORTED_CURRENCIES.INR,
      setCurrency: () => {},
      country: "IN",
      countryInfo: SUPPORTED_COUNTRIES[0],
      setCountry: () => {},
      language: "en",
      languageInfo: SUPPORTED_LANGUAGES[0],
      setLanguage: () => {},
      formatPrice: (paise: number) => formatCurrency(paise, "INR"),
      rates: {},
    };
  }
  return ctx;
}
