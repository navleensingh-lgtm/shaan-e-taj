/**
 * Multi-Currency Engine for Shaan-e-Taj
 * Supported: INR (base), USD, CAD, GBP, EUR, AUD
 */

export type CurrencyCode = "INR" | "USD" | "CAD" | "GBP" | "EUR" | "AUD";

export type CurrencyInfo = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
  defaultCountry: string;
  rateAgainstInr: number; // 1 INR in target currency
};

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: {
    code: "INR",
    symbol: "₹",
    label: "Indian Rupee (INR)",
    flag: "🇮🇳",
    defaultCountry: "IN",
    rateAgainstInr: 1,
  },
  USD: {
    code: "USD",
    symbol: "$",
    label: "US Dollar (USD)",
    flag: "🇺🇸",
    defaultCountry: "US",
    rateAgainstInr: 0.0116,
  },
  CAD: {
    code: "CAD",
    symbol: "CA$",
    label: "Canadian Dollar (CAD)",
    flag: "🇨🇦",
    defaultCountry: "CA",
    rateAgainstInr: 0.0158,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    label: "British Pound (GBP)",
    flag: "🇬🇧",
    defaultCountry: "GB",
    rateAgainstInr: 0.0092,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    label: "Euro (EUR)",
    flag: "🇪🇺",
    defaultCountry: "FR",
    rateAgainstInr: 0.0108,
  },
  AUD: {
    code: "AUD",
    symbol: "AU$",
    label: "Australian Dollar (AUD)",
    flag: "🇦🇺",
    defaultCountry: "AU",
    rateAgainstInr: 0.0182,
  },
};

export type SupportedCountry = {
  code: string;
  name: string;
  flag: string;
  defaultCurrency: CurrencyCode;
  suggestedLanguages: string[];
};

export const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  { code: "IN", name: "India", flag: "🇮🇳", defaultCurrency: "INR", suggestedLanguages: ["en", "pa"] },
  { code: "US", name: "United States", flag: "🇺🇸", defaultCurrency: "USD", suggestedLanguages: ["en"] },
  { code: "CA", name: "Canada", flag: "🇨🇦", defaultCurrency: "CAD", suggestedLanguages: ["en"] },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", defaultCurrency: "GBP", suggestedLanguages: ["en"] },
  { code: "EU", name: "European Union", flag: "🇪🇺", defaultCurrency: "EUR", suggestedLanguages: ["en"] },
  { code: "AU", name: "Australia", flag: "🇦🇺", defaultCurrency: "AUD", suggestedLanguages: ["en"] },
];

export type SupportedLanguage = {
  code: string;
  name: string;
  nativeName: string;
  isAvailable: boolean; // only true if real translations exist
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", name: "English", nativeName: "English", isAvailable: true },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", isAvailable: true },
];

/**
 * Format INR paise into target currency string.
 * Example: formatCurrency(500000, "USD") => "$58.00"
 * Example: formatCurrency(500000, "INR") => "₹5,000"
 */
export function formatCurrency(
  paise: number,
  currencyCode: CurrencyCode = "INR",
  customRates?: Partial<Record<CurrencyCode, number>>
): string {
  if (paise == null || isNaN(paise)) return "-";
  const curr = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.INR;
  const inrRupees = paise / 100;

  if (currencyCode === "INR") {
    return `₹${Math.round(inrRupees).toLocaleString("en-IN")}`;
  }

  const rate = customRates?.[currencyCode] ?? curr.rateAgainstInr;
  const converted = inrRupees * rate;

  return `${curr.symbol}${converted.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
