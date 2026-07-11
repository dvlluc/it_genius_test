export const LOCALES = ["en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

function readEnv(name: string, fallback: string): string {
  const value = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return value && value.length > 0 ? value : fallback;
}

function readEnvNumber(name: string, fallback: number): number {
  const raw = typeof process !== "undefined" ? process.env?.[name] : undefined;
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const APP_NAME = readEnv(
  "NEXT_PUBLIC_APP_NAME",
  "Analytics Dashboard",
);

export const DEFAULT_LOCALE = ((): Locale => {
  const value = readEnv("NEXT_PUBLIC_DEFAULT_LOCALE", "en");
  return LOCALES.includes(value as Locale) ? (value as Locale) : "en";
})();

export const DUMMY_JSON_BASE_URL = readEnv(
  "NEXT_PUBLIC_DUMMY_JSON_BASE_URL",
  "https://dummyjson.com",
);

export const REST_COUNTRIES_BASE_URL = readEnv(
  "NEXT_PUBLIC_REST_COUNTRIES_BASE_URL",
  "https://restcountries.com/v3.1",
);

export const API_TIMEOUT_MS = readEnvNumber(
  "NEXT_PUBLIC_API_TIMEOUT_MS",
  15000,
);

export const LOW_STOCK_THRESHOLD = readEnvNumber(
  "NEXT_PUBLIC_LOW_STOCK_THRESHOLD",
  10,
);

export const DEFAULT_PAGE_SIZE = readEnvNumber(
  "NEXT_PUBLIC_DEFAULT_PAGE_SIZE",
  10,
);

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
