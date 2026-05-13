// US market — standards and requirements
import type { MarketConfig } from "../market-config";

export const usMarket: MarketConfig = {
  code: "US",
  label: "United States",
  flag: "US",
  currency: "USD",
  language: "English",
  standards: {
    "cUPC / ASME A112.18.1": {
      name: "cUPC (IAS to U.S. Consensus)",
      issuer: "IAPMO",
      scope: "Faucets, valves, showerheads, and other plumbing fixture fittings",
      url: "https://www.iapmo.org/quality-verification/product-listing",
      testItems: [
        "Dimensional compliance",
        "Water flow rate (GPM)",
        "Pressure resistance (500 PSI minimum)",
        "Temperature resistance (180°F)",
        "Leakage test",
        "Endurance test (500,000 cycles)",
        "Material safety (no lead content)",
      ],
      fee: "$3,000–$15,000",
      timeline: "6–16 weeks",
      required: true,
    },
    "NSF/ANSI/CAN 61": {
      name: "NSF/ANSI/CAN 61 – Drinking Water System Components",
      issuer: "NSF International",
      scope: "All components that contact potable water — faucets, valves, pipes, fittings",
      url: "https://www.nsf.org/consumer-resources/articles/product-certification",
      testItems: [
        "Toxicology review",
        "Lead content analysis",
        "Microbiological testing",
        "Organics testing",
        "Corrosion resistance",
        "Maximum use levels for contaminants",
      ],
      fee: "$5,000–$30,000",
      timeline: "8–20 weeks",
      required: true,
    },
    "NSF/ANSI/CAN 372": {
      name: "NSF/ANSI/CAN 372 – Lead Free",
      issuer: "NSF International",
      scope: "Plumbing products with weighted average lead content ≤ 0.25%",
      url: "https://www.nsf.org/consumer-resources/articles/product-certification",
      testItems: [
        "Weighted average lead content calculation",
        "Surface area calculation",
        "Sample preparation and testing",
      ],
      fee: "$2,000–$8,000",
      timeline: "4–8 weeks",
      required: true,
    },
    WaterSense: {
      name: "EPA WaterSense",
      issuer: "U.S. Environmental Protection Agency",
      scope: "High-efficiency toilets, faucets, showerheads",
      url: "https://www.epa.gov/watersense",
      testItems: [
        "Flow rate verification",
        "Performance standards (MEP test)",
        "Labeling requirements",
      ],
      fee: "$2,000–$6,000",
      timeline: "4–8 weeks",
      required: false,
    },
    "IAPMO Z124": {
      name: "IAPMO Z124 – Plastic Plumbing Fixtures",
      issuer: "IAPMO",
      scope: "Shower pans, bathtubs, sinks made of plastic materials",
      url: "https://www.iapmo.org",
      testItems: [
        "Impact resistance",
        "Surface finish",
        "Structural integrity",
        "Chemical resistance",
      ],
      fee: "$3,000–$10,000",
      timeline: "6–12 weeks",
      required: false,
    },
    "ASME A112.19.2": {
      name: "ASME A112.19.2 – Water Closets",
      issuer: "ASME",
      scope: "Toilets and urinals",
      url: "https://webstore.ansi.org",
      testItems: [
        "Flush performance (Gallons Per Flush)",
        "Water consumption verification",
        "Material compliance",
      ],
      fee: "$5,000–$20,000",
      timeline: "8–20 weeks",
      required: false,
    },
    UL: {
      name: "UL 1431 / UL 1951 – Electrical Safety for Plumbing Products",
      issuer: "Underwriters Laboratories",
      scope: "Electrically operated plumbing products — smart toilets, electric faucets, heated bidets",
      url: "https://www.ul.com/services/plumbing-products",
      testItems: [
        "Electrical shock protection",
        "Overheating protection",
        "Water ingress protection (IP rating)",
        "Grounding continuity",
        "Component stress test",
      ],
      fee: "$8,000–$25,000",
      timeline: "8–16 weeks",
      required: false,
    },
  },
  productTypeRequirements: {
    faucet: {
      required: ["cUPC / ASME A112.18.1", "NSF/ANSI/CAN 61", "NSF/ANSI/CAN 372"],
      optional: ["WaterSense"],
    },
    "shower head": {
      required: ["cUPC / ASME A112.18.1", "NSF/ANSI/CAN 61", "NSF/ANSI/CAN 372"],
      optional: ["WaterSense"],
    },
    toilet: {
      required: ["cUPC / ASME A112.18.1", "NSF/ANSI/CAN 61", "NSF/ANSI/CAN 372"],
      optional: ["ASME A112.19.2", "WaterSense"],
    },
    bathtub: {
      required: ["cUPC / ASME A112.18.1", "NSF/ANSI/CAN 61"],
      optional: ["IAPMO Z124"],
    },
    valve: {
      required: ["cUPC / ASME A112.18.1", "NSF/ANSI/CAN 61", "NSF/ANSI/CAN 372"],
      optional: [],
    },
    "water heater": {
      required: ["NSF/ANSI/CAN 61"],
      optional: [],
    },
    "water treatment": {
      required: ["NSF/ANSI/CAN 61"],
      optional: ["NSF/ANSI/CAN 372"],
    },
    bidet: {
      required: ["cUPC / ASME A112.18.1", "NSF/ANSI/CAN 61", "NSF/ANSI/CAN 372"],
      optional: [],
    },
  },
  // API endpoints for real-time lookups
  apiEndpoints: {
    companySearch: "https://pld-api.iapmo.org/api/search/myplc",
    standardSearch: "https://pld-api.iapmo.org/api/search/myplc",
  },
};
