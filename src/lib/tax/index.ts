// ============================================================
// 税务合规模块 - 统一导出
// ============================================================

export { runTaxHealthCheck } from "./health-check-engine"
export { matchDeclarationMode } from "./declaration-matcher"
export { generateRefundChecklist, validateDocuments } from "./refund-checklist"
export { validateFourFlowConsistency, quickFourFlowCheck } from "./four-flow-validator"
export { calculateTaxBurden, quickTaxBurdenEstimate } from "./tax-burden-calculator"
export {
  getVATGuide, getAllVATGuides, getVATRecommendations,
  estimateImportDuties, getVATComplianceChecklist
} from "./overseas-vat-guide"

export type * from "./types"
