// United Kingdom market — WRAS, UKCA, KIWA
import type { MarketConfig } from "../market-config";

export const ukMarket: MarketConfig = {
  code: "UK",
  label: "United Kingdom",
  flag: "UK",
  currency: "GBP",
  language: "English",
  standards: {
    WRAS: {
      name: "WRAS – Water Regulations Advisory Scheme",
      issuer: "WRAS (Water Regulations Advisory Scheme)",
      scope:
        "Products that contact or may contact potable water — valves, fittings, taps, pipework",
      url: "https://www.wras.com",
      testItems: [
        "Material suitability (no toxic contamination)",
        "Taste and odour test",
        "Copper/steel corrosion test",
        "Physical/pressure test",
        "Microbiological test (BS 6920)",
      ],
      fee: "£2,000–$15,000",
      timeline: "8–20 weeks",
      required: true,
    },
    UKCA: {
      name: "UKCA – UK Conformity Assessed",
      issuer: "UK Government",
      scope: "Plumbing products sold in Great Britain (post-Brexit replacement for CE Mark)",
      url: "https://www.gov.uk/ukca-marking",
      testItems: [
        "Conformity assessment",
        "Technical documentation",
        "Declaration of conformity",
      ],
      fee: "£500–$3,000",
      timeline: "2–4 weeks",
      required: true,
    },
    BS_6920: {
      name: "BS 6920 – Non-Metallic Products for Use in Contact with Potable Water",
      issuer: "BSI (British Standards Institution)",
      scope: "Non-metallic materials and products in contact with potable water",
      url: "https://www.bsigroup.com",
      testItems: [
        "Taste test",
        "Turbidity test",
        "Appearance of water test",
        "Release of metals test",
        "Microbiological growth test",
      ],
      fee: "£3,000–$10,000",
      timeline: "8–16 weeks",
      required: false,
    },
    KIWA: {
      name: "KIWA – Water Industry Specification",
      issuer: "Kiwa Ltd (UK)",
      scope: "Products approved for contact with drinking water in the UK",
      url: "https://www.kiwa.co.uk",
      testItems: [
        "BS 6920 testing",
        "Kiwa additional requirements",
        "Ongoing surveillance testing",
      ],
      fee: "£2,000–$8,000",
      timeline: "8–16 weeks",
      required: false,
    },
    "BS EN 817": {
      name: "BS EN 817 – Sanitary Tap Valves",
      issuer: "BSI / CEN",
      scope: "Mechanical mixing taps for washbasins and bidets",
      url: "https://www.bsigroup.com",
      testItems: [
        "Flow rate",
        "Pressure resistance",
        "Noise level",
        "Endurance test",
      ],
      fee: "£1,500–$5,000",
      timeline: "6–12 weeks",
      required: false,
    },
    "BS EN 1111": {
      name: "BS EN 1111 – Thermostatic Mixing Valves",
      issuer: "BSI / CEN",
      scope: "Thermostatic mixing valves for personal applications",
      url: "https://www.bsigroup.com",
      testItems: [
        "Maximum maintained temperature",
        "Thermal shutdown test",
        "Flow rate",
        "Pressure resistance",
      ],
      fee: "£1,500–$5,000",
      timeline: "6–12 weeks",
      required: false,
    },
  },
  productTypeRequirements: {
    faucet: {
      required: ["WRAS", "UKCA"],
      optional: ["BS_6920", "BS EN 817"],
    },
    "shower head": {
      required: ["WRAS", "UKCA"],
      optional: ["BS_6920"],
    },
    toilet: {
      required: ["WRAS", "UKCA"],
      optional: [],
    },
    bathtub: {
      required: ["WRAS", "UKCA"],
      optional: ["BS_6920"],
    },
    valve: {
      required: ["WRAS", "UKCA"],
      optional: ["BS EN 1111", "BS_6920"],
    },
    "water heater": {
      required: ["WRAS", "UKCA"],
      optional: [],
    },
    "water treatment": {
      required: ["WRAS", "UKCA", "BS_6920"],
      optional: ["KIWA"],
    },
  },
  apiEndpoints: {
    companySearch: "https://www.wras.com/approved-products",
    standardSearch: "https://www.wras.com/approved-products",
  },
};
