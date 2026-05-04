// ─── Parsed product from PDF/spec sheet ───
export interface ParsedProduct {
  rawText: string;
  companyName: string | null;
  brandName: string | null;
  productType: string | null;
  modelNumber: string | null;
  material: string | null;
  connectionSize: string | null;
  waterPressure: string | null;
  certifications: string[];
  confidence: number; // 0-1
}

// ─── IAPMO certification record ───
export interface CertRecord {
  project_number: string;
  company_name: string;
  product_description: string;
  standard: string;
  status: string;
  cert_url: string;
}

// ─── Company summary from index ───
export interface CompanySummary {
  company_name: string;
  cert_count: number;
  certs?: {
    project_number: string;
    product: string;
    standard: string;
    status: string;
    url: string;
  }[];
  products: string[];
  standards: string[];
}

// ─── Report section ───
export interface CertStatus {
  name: string;
  status: "present" | "missing" | "partial";
  detail: string;
  certifiedCompanies?: number;
}

export interface Report {
  id: string;
  uploadedAt: string;
  product: ParsedProduct;
  market: string;
  certStatuses: CertStatus[];
  productType: string;
  marketGaps: string[];
  competitiveScore: "red" | "yellow" | "green";
  competitiveDetail: string;
  costEstimate: {
    cert: string;
    usd: string;
    timeline: string;
  }[];
  recommendations: string[];
  sourceCompanies: CompanySummary[];
}
