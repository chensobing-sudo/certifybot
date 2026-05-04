// Market configuration registry — central source of truth for all supported markets

export interface CertStandard {
  name: string;
  issuer: string;
  scope: string;
  url: string;
  testItems: string[];
  fee: string;
  timeline: string;
  required: boolean;
}

export interface MarketConfig {
  code: string;           // e.g. "US", "AU", "UK"
  label: string;          // e.g. "United States"
  flag: string;           // e.g. "US"
  currency: string;        // e.g. "USD"
  language: string;       // e.g. "English"
  standards: Record<string, CertStandard>;
  productTypeRequirements: Record<
    string,
    { required: string[]; optional: string[] }
  >;
  apiEndpoints: {
    companySearch: string;
    standardSearch: string;
  };
}

export { usMarket } from "./markets/us";
export { auMarket } from "./markets/au";
export { ukMarket } from "./markets/uk";

export const ALL_MARKETS: MarketConfig[] = [
  require("./markets/us").usMarket,
  require("./markets/au").auMarket,
  require("./markets/uk").ukMarket,
];

export const MARKET_MAP: Record<string, MarketConfig> = Object.fromEntries(
  ALL_MARKETS.map((m) => [m.code, m])
);

export function getMarket(code: string): MarketConfig | null {
  return MARKET_MAP[code] ?? null;
}

export function getRequirementsForProductType(
  market: MarketConfig,
  productType: string
): { required: string[]; optional: string[] } {
  const type = productType.toLowerCase();
  const reqs = market.productTypeRequirements;
  for (const [key, val] of Object.entries(reqs)) {
    if (type.includes(key)) return val;
  }
  // fallback: try partial match
  for (const [key, val] of Object.entries(reqs)) {
    if (key.includes(type) || type.includes(key)) return val;
  }
  // default: all required standards
  return {
    required: Object.entries(market.standards)
      .filter(([, s]) => s.required)
      .map(([k]) => k),
    optional: [],
  };
}

export function getCertCosts(
  market: MarketConfig,
  stdKeys: string[]
): { cert: string; usd: string; timeline: string }[] {
  return stdKeys
    .map((key) => {
      const std = market.standards[key];
      if (!std) return null;
      return { cert: std.name, usd: std.fee, timeline: std.timeline };
    })
    .filter(Boolean) as { cert: string; usd: string; timeline: string }[];
}
