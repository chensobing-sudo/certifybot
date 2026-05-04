// US Plumbing Certification requirements — structured for AI consumption
// Key standards and what they require

export const US_STANDARDS = {
  "cUPC / ASME A112.18.1": {
    name: "cUPC (IAS to U.S. Consensus)",
    issuer: "IAPMO",
    scope:
      "Faucets, valves, showerheads, and other plumbing fixture fittings",
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
    feeRange: "$3,000 – $15,000",
    timeline: "6–16 weeks",
    required: true,
  },
  "NSF/ANSI/CAN 61": {
    name: "NSF/ANSI/CAN 61 – Drinking Water System Components",
    issuer: "NSF International",
    scope:
      "All components that contact potable water — faucets, valves, pipes, fittings",
    url: "https://www.nsf.org/consumer-resources/articles/product-certification",
    testItems: [
      "Toxicology review",
      "Lead content analysis",
      "Microbiological testing",
      "Organics testing",
      "Corrosion resistance",
      "Maximum use levels for contaminants",
    ],
    feeRange: "$5,000 – $30,000",
    timeline: "8–20 weeks",
    required: true,
  },
  "NSF/ANSI/CAN 372": {
    name: "NSF/ANSI/CAN 372 – Lead Free",
    issuer: "NSF International",
    scope:
      "Plumbing products with weighted average lead content ≤ 0.25%",
    url: "https://www.nsf.org/consumer-resources/articles/product-certification",
    testItems: [
      "Weighted average lead content calculation",
      "Surface area calculation",
      "Sample preparation and testing",
    ],
    feeRange: "$2,000 – $8,000",
    timeline: "4–8 weeks",
    required: true,
  },
  "WaterSense": {
    name: "EPA WaterSense",
    issuer: "U.S. Environmental Protection Agency",
    scope:
      "High-efficiency toilets, faucets, showerheads, flushometer-valves",
    url: "https://www.epa.gov/watersense",
    testItems: [
      "Flow rate verification",
      "Performance standards (MEP test)",
      "Labeling requirements",
    ],
    feeRange: "$2,000 – $6,000",
    timeline: "4–8 weeks",
    required: false, // optional but premium market
  },
  "IAPMO Z124": {
    name: "IAPMO Z124 – Plastic Plumbing Fixtures",
    issuer: "IAPMO",
    scope:
      "Shower pans, bathtubs, sinks made of plastic materials",
    url: "https://www.iapmo.org",
    testItems: [
      "Impact resistance",
      "Surface finish",
      "Structural integrity",
      "Chemical resistance",
    ],
    feeRange: "$3,000 – $10,000",
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
    feeRange: "$5,000 – $20,000",
    timeline: "8–20 weeks",
    required: false, // but critical for toilet manufacturers
  },
};

// Standard requirements for specific product types
export const PRODUCT_TYPE_REQUIREMENTS: Record<
  string,
  { required: string[]; optional: string[] }
> = {
  "faucet": {
    required: ["cUPC / ASME A112.18.1", "NSF/ANSI/CAN 61", "NSF/ANSI/CAN 372"],
    optional: ["WaterSense"],
  },
  "shower head": {
    required: ["cUPC / ASME A112.18.1", "NSF/ANSI/CAN 61", "NSF/ANSI/CAN 372"],
    optional: ["WaterSense"],
  },
  "toilet": {
    required: ["cUPC / ASME A112.18.1", "NSF/ANSI/CAN 61", "NSF/ANSI/CAN 372"],
    optional: ["ASME A112.19.2", "WaterSense"],
  },
  "bathtub": {
    required: ["cUPC / ASME A112.18.1", "NSF/ANSI/CAN 61"],
    optional: ["IAPMO Z124"],
  },
  "valve": {
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
  "bidet": {
    required: ["cUPC / ASME A112.18.1", "NSF/ANSI/CAN 61", "NSF/ANSI/CAN 372"],
    optional: ["ASME A112.4.2"],
  },
  default: {
    required: ["cUPC / ASME A112.18.1", "NSF/ANSI/CAN 61", "NSF/ANSI/CAN 372"],
    optional: ["WaterSense"],
  },
};

export function getRequirements(
  productType: string
): { required: string[]; optional: string[] } {
  const type = productType.toLowerCase();
  for (const [key, val] of Object.entries(PRODUCT_TYPE_REQUIREMENTS)) {
    if (type.includes(key)) return val;
  }
  return PRODUCT_TYPE_REQUIREMENTS.default;
}

// Cost estimates per certification (for report)
export const CERT_COSTS: Record<string, { fee: string; timeline: string }> = {
  "cUPC / ASME A112.18.1": {
    fee: "$3,000–$15,000",
    timeline: "6–16 weeks",
  },
  "NSF/ANSI/CAN 61": { fee: "$5,000–$30,000", timeline: "8–20 weeks" },
  "NSF/ANSI/CAN 372": { fee: "$2,000–$8,000", timeline: "4–8 weeks" },
  WaterSense: { fee: "$2,000–$6,000", timeline: "4–8 weeks" },
  "IAPMO Z124": { fee: "$3,000–$10,000", timeline: "6–12 weeks" },
  "ASME A112.19.2": { fee: "$5,000–$20,000", timeline: "8–20 weeks" },
};
