// California market — CEC Appliance Efficiency + CA Prop 65
// California has stricter requirements than US federal law

import type { MarketConfig } from "@/lib/market-config";

export const californiaMarket: MarketConfig = {
  code: "CA",
  label: "California",
  flag: "US-CA",
  currency: "USD",
  language: "English",
  standards: {
    "CEC_Title20": {
      name: "CEC Title 20 – Appliance Efficiency Regulation",
      issuer: "California Energy Commission",
      scope:
        "Plumbing fixtures sold in California — faucets, showerheads, toilets, urinals, flushometer valves",
      url: "https://www.energy.ca.gov/programs-and-topics/programs/appliance-efficiency-program",
      testItems: [
        "Maximum flow rate: faucets ≤ 1.2 GPM (vs federal 2.2 GPM)",
        "Maximum flow rate: showerheads ≤ 1.8 GPM (vs federal 2.5 GPM)",
        "Toilet flush volume ≤ 1.28 GPF (vs federal 1.6 GPF)",
        "Urinal flush volume ≤ 0.5 GPF",
        "Performance testing (MaP test for toilets)",
        "Certification by NRTL (Nationally Recognized Testing Laboratory)",
      ],
      fee: "$2,000–$8,000",
      timeline: "6–12 weeks",
      required: true,
    },
    "CA_Prop65": {
      name: "California Proposition 65 – Safe Drinking Water and Toxic Enforcement Act",
      issuer: "California Office of Environmental Health Hazard Assessment (OEHHA)",
      scope:
        "All products sold in California that may expose consumers to listed chemicals (lead, cadmium, phthalates, etc.)",
      url: "https://oehha.ca.gov/proposition-65",
      testItems: [
        "Lead content: ≤ 0.25% (weighted average) for wetted surfaces",
        "Cadmium content screening",
        "Phthalates (DEHP, DBP, BBP, DINP) screening",
        "Hexavalent chromium screening",
        "Clear and reasonable warning label required if any listed chemical present",
        "Annual reporting for certain exposures",
      ],
      fee: "$1,000–$5,000",
      timeline: "2–6 weeks",
      required: true,
    },
    "CA_AB1953": {
      name: "California AB 1953 – Lead-Free Plumbing Requirements",
      issuer: "California State Legislature",
      scope:
        "All plumbing products conveying or dispensing water for human consumption",
      url: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=200520060AB1953",
      testItems: [
        "Weighted average lead content ≤ 0.25%",
        "Compliance with NSF/ANSI 61 and NSF/ANSI 372",
        "Certification by accredited third-party lab",
        "Labeling requirements",
      ],
      fee: "$1,000–$3,000",
      timeline: "2–4 weeks",
      required: true,
    },
    "CA_GreenBuilding": {
      name: "CALGreen – California Green Building Standards Code (Title 24, Part 11)",
      issuer: "California Building Standards Commission",
      scope:
        "New construction and renovations — water efficiency and fixture performance",
      url: "https://www.dgs.ca.gov/BSC/CALGreen",
      testItems: [
        "Compliance with CEC Title 20 flow rates",
        "Water efficiency credits documentation",
        "Fixture performance verification",
      ],
      fee: "$500–$2,000",
      timeline: "1–4 weeks",
      required: false, // applies to new construction projects
    },
    "CA_LeadWarning": {
      name: "California Prop 65 – Clear & Reasonable Warning Requirements",
      issuer: "OEHHA",
      scope:
        "Products containing any listed chemical above safe harbor level — warning label on product, packaging, or at point of sale",
      url: "https://www.p65warnings.ca.gov",
      testItems: [
        "Warning label content compliance (specific language required since 2018)",
        "Online disclosure requirements for e-commerce",
        "Safe harbor level calculation",
      ],
      fee: "$500–$2,000",
      timeline: "1–2 weeks",
      required: true,
    },
  },
  productTypeRequirements: {
    faucet: {
      required: ["CEC_Title20", "CA_Prop65", "CA_AB1953", "CA_LeadWarning"],
      optional: ["CA_GreenBuilding"],
    },
    "shower head": {
      required: ["CEC_Title20", "CA_Prop65", "CA_AB1953", "CA_LeadWarning"],
      optional: ["CA_GreenBuilding"],
    },
    toilet: {
      required: ["CEC_Title20", "CA_Prop65", "CA_AB1953", "CA_LeadWarning"],
      optional: ["CA_GreenBuilding"],
    },
    bidet: {
      required: ["CEC_Title20", "CA_Prop65", "CA_AB1953", "CA_LeadWarning"],
      optional: ["CA_GreenBuilding"],
    },
    bathtub: {
      required: ["CA_Prop65", "CA_AB1953", "CA_LeadWarning"],
      optional: ["CEC_Title20", "CA_GreenBuilding"],
    },
    valve: {
      required: ["CA_Prop65", "CA_AB1953", "CA_LeadWarning"],
      optional: ["CEC_Title20"],
    },
    urinal: {
      required: ["CEC_Title20", "CA_Prop65", "CA_LeadWarning"],
      optional: ["CA_GreenBuilding"],
    },
    "water heater": {
      required: ["CEC_Title20", "CA_Prop65", "CA_LeadWarning"],
      optional: [],
    },
    "water treatment": {
      required: ["CA_Prop65", "CA_AB1953", "CA_LeadWarning"],
      optional: [],
    },
    pipe: {
      required: ["CA_Prop65", "CA_AB1953", "CA_LeadWarning"],
      optional: [],
    },
    fitting: {
      required: ["CA_Prop65", "CA_AB1953", "CA_LeadWarning"],
      optional: [],
    },
  },
  apiEndpoints: {
    companySearch: "https://www.energy.ca.gov/appliance-database",
    standardSearch: "https://oehha.ca.gov/proposition-65/getlist",
  },
};
