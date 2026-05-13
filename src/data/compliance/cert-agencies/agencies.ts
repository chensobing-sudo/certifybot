// Certification agencies database — where to apply for each certification
// Structured for AI Agent to recommend application paths

export interface CertAgency {
  name: string;
  shortName: string;
  type: "notified_body" | "nrtl" | "govt_agency" | "standards_body" | "accredited_lab";
  headquarters: string;
  website: string;
  certifications: string[];
  regions: string[];
  description: string;
  estimatedLeadTime: string;
  applicationProcess: string[];
}

export const CERT_AGENCIES: CertAgency[] = [
  // ─── US / North America ───
  {
    name: "IAPMO – International Association of Plumbing and Mechanical Officials",
    shortName: "IAPMO",
    type: "nrtl",
    headquarters: "Ontario, California, USA",
    website: "https://www.iapmo.org",
    certifications: ["cUPC", "IAPMO Z124", "WaterMark (AU)"],
    regions: ["US", "CA", "AU"],
    description:
      "Primary certifier for plumbing products in the US. Issues cUPC certification recognized across all US states and Canada.",
    estimatedLeadTime: "6–16 weeks",
    applicationProcess: [
      "Submit product specifications and drawings",
      "Complete application form with product details",
      "Provide material composition data",
      "Schedule product testing at IAPMO lab or approved facility",
      "Undergo factory inspection (for initial certification)",
      "Receive certification and listing on IAPMO PLD database",
    ],
  },
  {
    name: "NSF International",
    shortName: "NSF",
    type: "nrtl",
    headquarters: "Ann Arbor, Michigan, USA",
    website: "https://www.nsf.org",
    certifications: ["NSF/ANSI/CAN 61", "NSF/ANSI/CAN 372"],
    regions: ["US", "CA"],
    description:
      "Global public health organization that certifies drinking water system components. NSF 61 is the gold standard for potable water safety.",
    estimatedLeadTime: "8–20 weeks",
    applicationProcess: [
      "Submit product and material formulation data",
      "Complete toxicology review questionnaire",
      "Provide samples for testing",
      "Undergo extraction/migration testing",
      "Review and submit final report",
      "Sign licensing agreement for certification mark",
    ],
  },
  {
    name: "UL Solutions – Underwriters Laboratories",
    shortName: "UL",
    type: "nrtl",
    headquarters: "Northbrook, Illinois, USA",
    website: "https://www.ul.com",
    certifications: ["UL 399", "UL 1951", "UL 1795"],
    regions: ["US", "CA", "EU"],
    description:
      "Global safety science leader. Tests plumbing products for electrical safety, fire resistance, and mechanical performance.",
    estimatedLeadTime: "8–16 weeks",
    applicationProcess: [
      "Submit product specifications and bill of materials",
      "Complete UL application and quote request",
      "Provide samples for testing",
      "Conduct testing at UL laboratory",
      "Factory inspection (CTDP or FUS)",
      "Receive UL listing and follow-up service program",
    ],
  },
  {
    name: "Intertek – ETL SEMKO",
    shortName: "Intertek",
    type: "nrtl",
    headquarters: "London, UK (global HQ)",
    website: "https://www.intertek.com",
    certifications: ["ETL Listed", "CE Marking", "UKCA", "WaterMark"],
    regions: ["US", "CA", "EU", "UK", "AU"],
    description:
      "Global testing and certification provider. ETL mark is accepted by US authorities as alternative to UL. Also provides CE and UKCA certification.",
    estimatedLeadTime: "6–14 weeks",
    applicationProcess: [
      "Submit product documentation and specifications",
      "Request quote and complete application",
      "Provide samples for testing",
      "Testing at Intertek lab or witnessed at client site",
      "Factory inspection (if required)",
      "Certification issuance and listing",
    ],
  },
  {
    name: "CSA Group – Canadian Standards Association",
    shortName: "CSA",
    type: "nrtl",
    headquarters: "Toronto, Ontario, Canada",
    website: "https://www.csagroup.org",
    certifications: ["CSA B125", "NSF/ANSI/CAN 61", "NSF/ANSI/CAN 372"],
    regions: ["US", "CA"],
    description:
      "Canadian standards development and testing organization. CSA marks are recognized across North America for plumbing products.",
    estimatedLeadTime: "8–16 weeks",
    applicationProcess: [
      "Submit product specifications and drawings",
      "Complete application package",
      "Provide samples for testing",
      "Testing at CSA laboratory",
      "Factory evaluation (initial certification)",
      "Certification and listing in CSA database",
    ],
  },

  // ─── Europe ───
  {
    name: "TÜV SÜD – Technischer Überwachungsverein",
    shortName: "TÜV SÜD",
    type: "notified_body",
    headquarters: "Munich, Germany",
    website: "https://www.tuvsud.com",
    certifications: ["CE Marking", "DVGW", "GS Mark", "EN Standards"],
    regions: ["EU", "UK"],
    description:
      "German notified body for CE marking and DVGW certification. One of the most recognized certification bodies in Europe for plumbing products.",
    estimatedLeadTime: "8–20 weeks",
    applicationProcess: [
      "Submit product documentation and technical file",
      "Determine applicable harmonized standards",
      "Complete conformity assessment",
      "Product testing at TÜV SÜD lab",
      "Factory Production Control (FPC) audit",
      "Issue Declaration of Performance (DoP) and CE certificate",
    ],
  },
  {
    name: "TÜV Rheinland",
    shortName: "TÜV Rheinland",
    type: "notified_body",
    headquarters: "Cologne, Germany",
    website: "https://www.tuv.com",
    certifications: ["CE Marking", "DVGW", "EN Standards", "GS Mark"],
    regions: ["EU", "UK", "US"],
    description:
      "German notified body with global presence. Provides CE marking, DVGW certification, and product safety testing for plumbing products.",
    estimatedLeadTime: "8–20 weeks",
    applicationProcess: [
      "Submit product documentation",
      "Identify applicable EU directives and standards",
      "Product testing",
      "Factory inspection",
      "Technical file review",
      "Certification issuance",
    ],
  },
  {
    name: "BSI – British Standards Institution",
    shortName: "BSI",
    type: "standards_body",
    headquarters: "London, UK",
    website: "https://www.bsigroup.com",
    certifications: ["BS 6920", "BS EN 817", "BS EN 1111", "UKCA", "CE Marking"],
    regions: ["UK", "EU"],
    description:
      "UK's national standards body. Provides testing and certification for BS and EN standards. Key for UKCA marking post-Brexit.",
    estimatedLeadTime: "8–16 weeks",
    applicationProcess: [
      "Submit product specifications",
      "Complete application and testing agreement",
      "Provide samples for testing",
      "Testing at BSI laboratory",
      "Technical file review",
      "Certification and listing",
    ],
  },
  {
    name: "Kiwa Ltd",
    shortName: "Kiwa",
    type: "accredited_lab",
    headquarters: "Rijswijk, Netherlands",
    website: "https://www.kiwa.com",
    certifications: ["KIWA", "WRAS", "WaterMark", "CE Marking", "ACS"],
    regions: ["UK", "EU", "AU"],
    description:
      "International testing and certification body. Key for WRAS approval in the UK and KIWA certification for drinking water products.",
    estimatedLeadTime: "8–16 weeks",
    applicationProcess: [
      "Submit product and material data",
      "Complete application form",
      "Provide samples for testing",
      "BS 6920 testing (for WRAS)",
      "Review and certification decision",
      "Ongoing surveillance testing",
    ],
  },
  {
    name: "CSTB – Centre Scientifique et Technique du Bâtiment",
    shortName: "CSTB",
    type: "accredited_lab",
    headquarters: "Marne-la-Vallée, France",
    website: "https://www.cstb.fr",
    certifications: ["ACS", "CE Marking", "NF Mark"],
    regions: ["EU"],
    description:
      "French building science center. The sole issuer of ACS (Attestation de Conformité Sanitaire) certification required for France.",
    estimatedLeadTime: "10–20 weeks",
    applicationProcess: [
      "Submit product formulation and material data",
      "Complete ACS application dossier",
      "Provide samples for migration testing",
      "Testing at CSTB or approved lab",
      "Review by health authorities (ANSES)",
      "Issue ACS certificate",
    ],
  },

  // ─── Australia ───
  {
    name: "JAS-ANZ – Joint Accreditation System of Australia and New Zealand",
    shortName: "JAS-ANZ",
    type: "govt_agency",
    headquarters: "Canberra, Australia",
    website: "https://www.jas-anz.org",
    certifications: ["WaterMark", "WELS"],
    regions: ["AU", "NZ"],
    description:
      "Government-appointed accreditation body. Oversees WaterMark certification scheme for plumbing products in Australia.",
    estimatedLeadTime: "6–12 weeks",
    applicationProcess: [
      "Submit product specifications to JAS-ANZ accredited certifier",
      "Product testing to relevant Australian Standards",
      "Factory inspection (if required)",
      "Certification decision by accredited certifier",
      "WaterMark listing on ABCB database",
    ],
  },
  {
    name: "SAI Global – Standards Australia",
    shortName: "SAI Global",
    type: "standards_body",
    headquarters: "Sydney, Australia",
    website: "https://www.saiglobal.com",
    certifications: ["WaterMark", "AS/NZS Standards", "WELS"],
    regions: ["AU", "NZ"],
    description:
      "Standards development and certification body. Provides WaterMark certification and AS/NZS standard testing.",
    estimatedLeadTime: "6–14 weeks",
    applicationProcess: [
      "Submit product documentation",
      "Complete certification application",
      "Product testing to applicable AS/NZS standards",
      "Factory audit (if required)",
      "Certification decision",
      "Listing in WaterMark product database",
    ],
  },
];

// Quick lookup by certification name
export function getAgenciesForCert(certName: string): CertAgency[] {
  return CERT_AGENCIES.filter((a) =>
    a.certifications.some((c) =>
      c.toLowerCase().includes(certName.toLowerCase())
    )
  );
}

// Quick lookup by region
export function getAgenciesForRegion(region: string): CertAgency[] {
  return CERT_AGENCIES.filter((a) =>
    a.regions.some((r) => r.toLowerCase() === region.toLowerCase())
  );
}
