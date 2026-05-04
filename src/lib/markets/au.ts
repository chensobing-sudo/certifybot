// Australia market — WELS water efficiency + WaterMark
import type { MarketConfig } from "../market-config";

export const auMarket: MarketConfig = {
  code: "AU",
  label: "Australia",
  flag: "AU",
  currency: "AUD",
  language: "English",
  standards: {
    WELS: {
      name: "WELS – Water Efficiency Labelling Scheme",
      issuer: "Australian Government (Department of Climate Change, Energy, the Environment and Water)",
      scope: "Water-efficient products: showers, taps, toilets, urinals, flow controllers",
      url: "https://www.waterrating.gov.au",
      testItems: [
        "Flow rate test (litres per minute)",
        "Water efficiency star rating (1–6 stars)",
        "Maximum flow rate compliance",
      ],
      fee: "A$1,000–$5,000",
      timeline: "4–8 weeks",
      required: true,
    },
    WaterMark: {
      name: "WaterMark Certification",
      issuer: "JAS-ANZ Accredited Certifiers",
      scope:
        "Plumbing products that contact potable water — valves, pipes, fittings, water heaters",
      url: "https://www.abcb.gov.au/water-mark",
      testItems: [
        "Product type testing",
        "Material safety",
        "Pressure/temperature rating",
        "Australian Standard compliance",
      ],
      fee: "A$2,000–$10,000",
      timeline: "6–12 weeks",
      required: true,
    },
    "AS/NZS 6400": {
      name: "AS/NZS 6400 – Water-Efficient Products Rating and Labelling",
      issuer: "Standards Australia",
      scope: "Product rating for water efficiency labelling",
      url: "https://www.standards.org.au",
      testItems: [
        "Star rating calculation",
        "Flow rate verification",
      ],
      fee: "A$500–$2,000",
      timeline: "2–4 weeks",
      required: false,
    },
    "AS/NZS 4020": {
      name: "AS/NZS 4020 – Products in Contact with Drinking Water",
      issuer: "Standards Australia",
      scope: "Materials and products in contact with drinking water",
      url: "https://www.standards.org.au",
      testItems: [
        "Toxicological assessment",
        "Microbiological compliance",
        "Taste and odour testing",
      ],
      fee: "A$3,000–$8,000",
      timeline: "8–16 weeks",
      required: false,
    },
    "AS/NZS 3499": {
      name: "AS/NZS 3499 – Flexible Water Connectors",
      issuer: "Standards Australia",
      scope: "Flexible water connectors for residential use",
      url: "https://www.standards.org.au",
      testItems: [
        "Pressure test",
        "Burst pressure test",
        "Torque test",
      ],
      fee: "A$1,000–$3,000",
      timeline: "4–6 weeks",
      required: false,
    },
    "AS/NZS 3718": {
      name: "AS/NZS 3718 – Watermark Marked Tap Ware",
      issuer: "Standards Australia",
      scope: "Tap ware for water supply",
      url: "https://www.standards.org.au",
      testItems: [
        "Dimensional compliance",
        "Pressure/temperature rating",
        "Endurance test",
      ],
      fee: "A$2,000–$6,000",
      timeline: "6–10 weeks",
      required: false,
    },
  },
  productTypeRequirements: {
    faucet: {
      required: ["WELS", "WaterMark"],
      optional: ["AS/NZS 4020", "AS/NZS 3718"],
    },
    "shower head": {
      required: ["WELS", "WaterMark"],
      optional: ["AS/NZS 4020"],
    },
    toilet: {
      required: ["WELS", "WaterMark"],
      optional: [],
    },
    bathtub: {
      required: ["WaterMark"],
      optional: ["WELS"],
    },
    valve: {
      required: ["WaterMark"],
      optional: ["AS/NZS 4020"],
    },
    "water heater": {
      required: ["WaterMark"],
      optional: [],
    },
    "water treatment": {
      required: ["WaterMark", "AS/NZS 4020"],
      optional: [],
    },
    "flexible connector": {
      required: ["WaterMark", "AS/NZS 3499"],
      optional: [],
    },
  },
  apiEndpoints: {
    // WELS public product search
    companySearch: "https://www.waterrating.gov.au/api/product-search",
    standardSearch: "https://www.waterrating.gov.au/api/product-search",
  },
};
