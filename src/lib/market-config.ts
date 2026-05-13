// Market configuration registry — central source of truth for all supported markets
// Dynamic loading: all markets in src/data/compliance/markets/ are auto-registered

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
  code: string;           // e.g. "US", "EU", "CA"
  label: string;          // e.g. "United States", "European Union"
  flag: string;           // e.g. "US", "EU", "US-CA"
  currency: string;        // e.g. "USD", "EUR"
  language: string;       // e.g. "English", "Multilingual"
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

// ─── Market registry ───
// Import all markets explicitly for tree-shaking and type safety

import { usMarket } from "./markets/us";
import { auMarket } from "./markets/au";
import { ukMarket } from "./markets/uk";
import { euMarket } from "../data/compliance/markets/eu";
import { californiaMarket } from "../data/compliance/markets/california";

export const ALL_MARKETS: MarketConfig[] = [
  usMarket,
  euMarket,
  californiaMarket,
  ukMarket,
  auMarket,
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

// ─── Multi-market compliance check ───
// Given a product type and list of target markets, return combined requirements
export function getMultiMarketRequirements(
  productType: string,
  marketCodes: string[]
): {
  market: string;
  required: string[];
  optional: string[];
  costs: { cert: string; usd: string; timeline: string }[];
}[] {
  return marketCodes
    .map((code) => {
      const market = getMarket(code);
      if (!market) return null;
      const reqs = getRequirementsForProductType(market, productType);
      const costs = getCertCosts(market, reqs.required);
      return { market: code, ...reqs, costs };
    })
    .filter(Boolean) as any;
}
