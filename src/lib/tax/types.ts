// ============================================================
// 税务合规模块 - 核心类型定义
// 卫浴行业跨境电商出口税务合规
// ============================================================

// ---------- 企业基本信息 ----------
export interface CompanyProfile {
  companyName: string
  unifiedSocialCreditCode: string
  taxpayerType: TaxpayerType
  registeredCapital: number
  exportStartYear: number
  annualExportVolume: number
  mainProducts: BathroomProductCategory[]
  exportChannels: ExportChannel[]
  hasExportLicense: boolean
  hasCustomsDeclaration: boolean
  customsDeclarationMode: CustomsDeclarationMode
  hasForeignWarehouse: boolean
  foreignWarehouseCountries: string[]
  platformStores: PlatformStore[]
  hasDedicatedTaxAccountant: boolean
  bookkeepingMethod: BookkeepingMethod
  invoiceIssuanceMethod: InvoiceIssuanceMethod
  supplyChainStructure: SupplyChainStructure
}

export type TaxpayerType = "general" | "small_scale" | "unregistered"

export type BathroomProductCategory =
  | "toilet" | "bathroom_cabinet" | "shower_room" | "shower_head"
  | "faucet" | "kitchen_sink" | "bath_tub" | "hardware_fittings"
  | "bidet" | "towel_rack" | "mirror" | "other"

export type ExportChannel =
  | "amazon" | "ebay" | "walmart" | "shopify_independent_station"
  | "alibaba_international" | "made_in_china" | "overseas_warehouse"
  | "general_trade_b2b" | "cross_border_b2b" | "other"

export type CustomsDeclarationMode =
  | "9710" | "9810" | "0110" | "1039" | "unknown"

export interface PlatformStore {
  platform: ExportChannel
  storeName: string
  annualRevenue: number
  registrationCountry: string
}

export type BookkeepingMethod =
  | "in_house_full_time" | "in_house_part_time"
  | "agency_bookkeeping" | "no_bookkeeping"

export type InvoiceIssuanceMethod =
  | "self_issuance" | "tax_bureau_agent" | "no_issuance"

export type SupplyChainStructure =
  | "self_production_full" | "self_production_partial"
  | "outsourcing_assembly" | "pure_trading" | "platform_only"

// ---------- 税务合规体检 ----------
export interface TaxHealthCheckRequest {
  company: CompanyProfile
  recentTransactions?: TransactionRecord[]
  exportRecords?: ExportRecord[]
  invoiceRecords?: InvoiceRecord[]
}

export interface TaxHealthCheckResult {
  overallScore: number
  overallRisk: RiskLevel
  dimensions: TaxDimensionResult[]
  criticalIssues: TaxIssue[]
  warnings: TaxIssue[]
  suggestions: TaxSuggestion[]
  timestamp: string
}

export interface TaxDimensionResult {
  dimensionId: string
  dimensionName: string
  score: number
  risk: RiskLevel
  weight: number
  issues: TaxIssue[]
}

export type RiskLevel = "critical" | "high" | "medium" | "low" | "safe"

export interface TaxIssue {
  id: string
  category: TaxIssueCategory
  title: string
  description: string
  risk: RiskLevel
  regulation: string
  penalty: string
  suggestion: string
  relatedDocuments?: string[]
}

export type TaxIssueCategory =
  | "export_tax_refund" | "invoice_compliance" | "four_flow_consistency"
  | "private_account" | "customs_code" | "taxpayer_identity"
  | "overseas_vat" | "golden_tax_phase4" | "declaration_mode"
  | "transfer_pricing" | "document_compliance" | "general"

export interface TaxSuggestion {
  id: string
  priority: "urgent" | "important" | "suggested"
  title: string
  description: string
  expectedBenefit: string
  estimatedCost: string
  difficulty: "easy" | "medium" | "hard"
  timeline: string
}

// ---------- 交易与单证 ----------
export interface TransactionRecord {
  id: string
  date: string
  type: "export" | "domestic" | "platform"
  amount: number
  currency: string
  counterparty: string
  counterpartyCountry: string
  paymentMethod: "public_account" | "private_account" | "platform" | "cash"
  hasContract: boolean
  hasInvoice: boolean
  hasLogisticsRecord: boolean
  hasPaymentRecord: boolean
  productCategory: BathroomProductCategory
  customsDeclarationMode?: CustomsDeclarationMode
}

export interface ExportRecord {
  id: string
  date: string
  customsDeclarationNumber: string
  productName: string
  hsCode: string
  quantity: number
  unit: string
  totalValue: number
  destinationCountry: string
  tradeMode: CustomsDeclarationMode
  portOfDeparture: string
  hasMatchedInvoice: boolean
  hasMatchedPayment: boolean
  hasLogisticsBill: boolean
  taxRefundStatus: TaxRefundStatus
}

export type TaxRefundStatus =
  | "declared" | "processing" | "approved" | "rejected" | "not_declared"

export interface InvoiceRecord {
  id: string
  invoiceNumber: string
  invoiceType: "special_vat" | "general_vat" | "export_invoice" | "no_invoice"
  amount: number
  taxAmount: number
  taxRate: number
  issuer: string
  receiver: string
  date: string
  productDescription: string
  isInput: boolean
  status: "valid" | "void" | "red_flagged"
}

// ---------- 报关模式匹配 ----------
export interface DeclarationModeMatchRequest {
  companyProfile: CompanyProfile
  exportDetails: {
    productCategory: BathroomProductCategory
    destinationCountry: string
    estimatedAnnualVolume: number
    hasOverseasWarehouse: boolean
    overseasWarehouseCountry?: string
    isB2B: boolean
    isB2C: boolean
    hasPlatformStore: boolean
    platformType?: ExportChannel
    buyerType: "end_user" | "retailer" | "wholesaler" | "distributor"
  }
}

export interface DeclarationModeMatchResult {
  recommendedMode: CustomsDeclarationMode
  alternatives: {
    mode: CustomsDeclarationMode
    reason: string
    pros: string[]
    cons: string[]
    suitability: number
  }[]
  analysis: string
  taxRefundEligibility: {
    eligible: boolean
    estimatedRefundRate: number
    estimatedAnnualRefund: number
    conditions: string[]
    gaps: string[]
  }
}

// ---------- 出口退税 ----------
export interface TaxRefundChecklist {
  basicRequirements: {
    item: string
    status: "met" | "not_met" | "partial"
    detail: string
  }[]
  requiredDocuments: RequiredDocument[]
  documentValidation: DocumentValidationResult[]
  timeline: TaxRefundTimeline
  estimatedRefund: {
    exportAmount: number
    refundRate: number
    estimatedRefundAmount: number
    taxRate: number
    taxAmount: number
    actualRefund: number
  }
}

export interface RequiredDocument {
  name: string
  status: "ready" | "missing" | "invalid"
  description: string
  source: string
  deadline: string
  notes: string
}

export interface DocumentValidationResult {
  documentName: string
  isValid: boolean
  issues: string[]
  suggestions: string[]
}

export interface TaxRefundTimeline {
  declarationDate: string
  documentPreparationEnd: string
  submissionDate: string
  taxAuthorityReview: string
  expectedApproval: string
  expectedRefundDate: string
  totalDays: number
}

// ---------- 四流一致 ----------
export interface FourFlowConsistencyCheck {
  overallStatus: "consistent" | "partial" | "inconsistent"
  contractFlow: FlowCheckResult
  logisticsFlow: FlowCheckResult
  invoiceFlow: FlowCheckResult
  paymentFlow: FlowCheckResult
  mismatches: FlowMismatch[]
  riskLevel: RiskLevel
}

export interface FlowCheckResult {
  flowType: "contract" | "logistics" | "invoice" | "payment"
  status: "consistent" | "partial" | "inconsistent"
  score: number
  details: string
  evidenceCount: number
}

export interface FlowMismatch {
  id: string
  type: "contract_logistics" | "contract_invoice" | "contract_payment"
    | "logistics_invoice" | "logistics_payment" | "invoice_payment"
  description: string
  severity: "critical" | "major" | "minor"
  involvedParties: string[]
  amounts: number[]
  suggestion: string
}

// ---------- 税负测算 ----------
export interface TaxBurdenCalculation {
  companyName: string
  currentTaxpayerType: TaxpayerType
  scenarios: TaxScenario[]
  recommendation: {
    recommendedType: TaxpayerType
    reason: string
    annualSavings: number
    conditions: string[]
  }
}

export interface TaxScenario {
  taxpayerType: TaxpayerType
  annualRevenue: number
  annualExportRevenue: number
  annualDomesticRevenue: number
  totalTaxBurden: number
  taxBurdenRate: number
  vatBurden: number
  vatBurdenRate: number
  corporateIncomeTax: number
  exportTaxRefund: number
  netTaxBurden: number
  netTaxBurdenRate: number
  details: TaxDetail[]
}

export interface TaxDetail {
  item: string
  amount: number
  rate: string
  note: string
}

// ---------- 海外VAT ----------
export interface OverseasVATGuide {
  country: string
  countryCode: string
  vatRate: number
  vatThreshold: number
  registrationRequired: boolean
  registrationThreshold: number
  filingFrequency: "monthly" | "quarterly" | "annually"
  filingDeadline: string
  penaltyForLateFiling: string
  taxRepresentativeRequired: boolean
  iossAvailable: boolean
  ossAvailable: boolean
  dutyRate: number
  dutyFreeThreshold: number
  specialRules: string[]
  commonMistakes: string[]
  tips: string[]
}

// ---------- 风险案例 ----------
export interface TaxRiskCase {
  id: string
  title: string
  category: TaxIssueCategory
  scenario: string
  violation: string
  penalty: string
  lesson: string
  prevention: string[]
  applicableTo: BathroomProductCategory[]
  severity: RiskLevel
  year: number
  region: string
}

// ---------- 知识库词条 ----------
export interface TaxKnowledgeEntry {
  id: string
  title: string
  category: TaxIssueCategory
  tags: string[]
  summary: string
  content: string
  regulations: string[]
  applicableScenarios: string[]
  lastUpdated: string
}

// ---------- HS编码 ----------
export interface HSCodeEntry {
  hsCode: string
  productName: string
  exportTaxRebateRate: number
  importTariffRate: number
  notes: string
}

// ---------- API 响应 ----------
export interface TaxApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: string
}
