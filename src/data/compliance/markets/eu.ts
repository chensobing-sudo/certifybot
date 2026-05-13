// European Union market — CE marking, DVGW (Germany), ACS (France), EN standards
// For bathroom/kitchen plumbing products sold in EU/EEA

import type { MarketConfig } from "@/lib/market-config";

export const euMarket: MarketConfig = {
  code: "EU",
  label: "European Union",
  flag: "EU",
  currency: "EUR",
  language: "Multilingual",
  standards: {
    "CE_CPR": {
      name: "CE Marking – Construction Products Regulation (EU) 305/2011",
      issuer: "European Commission (notified bodies)",
      scope:
        "Construction products including sanitary fixtures, pipes, fittings, and water-related equipment",
      url: "https://ec.europa.eu/growth/sectors/construction/product-regulation_en",
      testItems: [
        "Declaration of Performance (DoP)",
        "Harmonized standard compliance (hEN)",
        "Factory Production Control (FPC) audit",
        "CE marking and labeling",
      ],
      fee: "€2,000–€10,000",
      timeline: "4–12 weeks",
      required: true,
    },
    "DVGW": {
      name: "DVGW – German Technical & Scientific Association for Gas and Water",
      issuer: "DVGW e.V. (Germany)",
      scope:
        "Products in contact with drinking water sold in Germany — pipes, fittings, valves, taps, water meters",
      url: "https://www.dvgw.de/english",
      testItems: [
        "Material hygiene testing (KTW / DVGW W 270)",
        "Migration testing (organics, inorganics, metals)",
        "Taste and odour assessment",
        "Microbiological growth promotion test",
        "Pressure and temperature resistance",
        "Endurance testing (200,000+ cycles for fittings)",
      ],
      fee: "€5,000–€25,000",
      timeline: "12–24 weeks",
      required: false, // mandatory for Germany, recommended for EU-wide
    },
    "ACS": {
      name: "ACS – Attestation de Conformité Sanitaire (France)",
      issuer: "Ministère de la Santé (France) via accredited labs",
      scope:
        "Materials and products in contact with drinking water sold in France",
      url: "https://www.anses.fr/en/content/materials-contact-drinking-water",
      testItems: [
        "Global migration test (organic carbon, TOC)",
        "Specific migration of metals (lead, nickel, chromium)",
        "Microbiological analysis",
        "Taste and odour (French standard NF EN 1420-1)",
        "Cytotoxicity test",
      ],
      fee: "€4,000–€15,000",
      timeline: "10–20 weeks",
      required: false, // mandatory for France
    },
    "EN_817": {
      name: "EN 817 – Sanitary Tap Valves (Mechanical Mixing)",
      issuer: "CEN (European Committee for Standardization)",
      scope:
        "Mechanical mixing valves for washbasins, bidets, showers, baths",
      url: "https://www.cencenelec.eu",
      testItems: [
        "Hydraulic performance (flow rate vs pressure)",
        "Mechanical strength (pressure resistance 1.0 MPa / 10 bar)",
        "Noise level testing (Group I / II)",
        "Endurance test (200,000 cycles for single lever)",
        "Temperature resistance (90°C hot water)",
      ],
      fee: "€3,000–€8,000",
      timeline: "6–12 weeks",
      required: false, // harmonized under CPR
    },
    "EN_1111": {
      name: "EN 1111 – Thermostatic Mixing Valves",
      issuer: "CEN",
      scope:
        "Thermostatic mixing valves for personal hygiene (showers, baths, bidets)",
      url: "https://www.cencenelec.eu",
      testItems: [
        "Temperature stability test",
        "Maximum outlet temperature test (safety shutdown)",
        "Flow rate vs pressure characteristics",
        "Endurance test (70,000 cycles)",
        "Cold water failure safety test",
      ],
      fee: "€4,000–€10,000",
      timeline: "8–14 weeks",
      required: false,
    },
    "EN_1717": {
      name: "EN 1717 – Protection Against Pollution of Potable Water",
      issuer: "CEN",
      scope:
        "Backflow prevention devices and fluid category classification for all plumbing products",
      url: "https://www.cencenelec.eu",
      testItems: [
        "Fluid category classification (1–5)",
        "Backflow prevention mechanism verification",
        "Pressure testing",
        "Material compatibility",
      ],
      fee: "€2,000–€6,000",
      timeline: "4–8 weeks",
      required: true, // fundamental EU requirement
    },
    "EN_997": {
      name: "EN 997 – WC Pans and WC Suites with Integral Trap",
      issuer: "CEN",
      scope:
        "Toilets, WC pans, and WC suites with integral trap",
      url: "https://www.cencenelec.eu",
      testItems: [
        "Flushing performance (solid waste removal)",
        "Water consumption verification (≤ 6L standard, ≤ 4.5L for efficient)",
        "Surface finish and cleanability",
        "Load test (seat and cover)",
        "Odour tightness test",
      ],
      fee: "€3,000–€8,000",
      timeline: "6–12 weeks",
      required: false,
    },
    "EN_14688": {
      name: "EN 14688 – Sanitary Appliances – Washbasins",
      issuer: "CEN",
      scope:
        "Washbasins for domestic and commercial use",
      url: "https://www.cencenelec.eu",
      testItems: [
        "Dimensional compliance",
        "Overflow efficiency test",
        "Load resistance test",
        "Surface resistance to chemicals and staining",
        "Thermal shock resistance",
      ],
      fee: "€2,000–€6,000",
      timeline: "4–10 weeks",
      required: false,
    },
    "EN_14527": {
      name: "EN 14527 – Shower Trays",
      issuer: "CEN",
      scope:
        "Shower trays for domestic and commercial use",
      url: "https://www.cencenelec.eu",
      testItems: [
        "Load test (static and dynamic)",
        "Water tightness test",
        "Surface resistance",
        "Slip resistance (DIN 51097 / CEN/TS 16165)",
      ],
      fee: "€2,000–€5,000",
      timeline: "4–8 weeks",
      required: false,
    },
    "REACH": {
      name: "REACH – Registration, Evaluation, Authorisation of Chemicals (EC 1907/2006)",
      issuer: "European Chemicals Agency (ECHA)",
      scope:
        "All products containing chemical substances — applies to materials, coatings, sealants, plastics",
      url: "https://echa.europa.eu/reach",
      testItems: [
        "SVHC (Substances of Very High Concern) screening",
        "Lead, cadmium, mercury, hexavalent chromium limits",
        "Phthalates restriction (DEHP, DBP, BBP, DIBP)",
        "Documentation of compliance declaration",
      ],
      fee: "€1,000–€5,000",
      timeline: "2–6 weeks",
      required: true, // mandatory for all products sold in EU
    },
  },
  productTypeRequirements: {
    faucet: {
      required: ["CE_CPR", "EN_1717", "REACH"],
      optional: ["EN_817", "DVGW", "ACS"],
    },
    "shower head": {
      required: ["CE_CPR", "EN_1717", "REACH"],
      optional: ["DVGW", "ACS"],
    },
    "shower tray": {
      required: ["CE_CPR", "REACH"],
      optional: ["EN_14527"],
    },
    toilet: {
      required: ["CE_CPR", "EN_1717", "REACH"],
      optional: ["EN_997"],
    },
    bidet: {
      required: ["CE_CPR", "EN_1717", "REACH"],
      optional: ["EN_817"],
    },
    bathtub: {
      required: ["CE_CPR", "REACH"],
      optional: ["EN_14527"],
    },
    washbasin: {
      required: ["CE_CPR", "REACH"],
      optional: ["EN_14688"],
    },
    valve: {
      required: ["CE_CPR", "EN_1717", "REACH"],
      optional: ["DVGW", "ACS", "EN_1111"],
    },
    "water heater": {
      required: ["CE_CPR", "EN_1717", "REACH"],
      optional: ["DVGW"],
    },
    "water treatment": {
      required: ["CE_CPR", "REACH"],
      optional: ["DVGW", "ACS"],
    },
    pipe: {
      required: ["CE_CPR", "EN_1717", "REACH"],
      optional: ["DVGW", "ACS"],
    },
    fitting: {
      required: ["CE_CPR", "EN_1717", "REACH"],
      optional: ["DVGW", "ACS"],
    },
  },
  apiEndpoints: {
    companySearch: "https://ec.europa.eu/growth/tools-databases/nando/",
    standardSearch: "https://www.cencenelec.eu/search/",
  },
};
