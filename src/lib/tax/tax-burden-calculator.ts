// ============================================================
// 税负测算与纳税人身份规划引擎
// ============================================================

import type {
  TaxBurdenCalculation, TaxScenario, TaxDetail,
  TaxpayerType, CompanyProfile
} from "./types"

export function calculateTaxBurden(company: CompanyProfile): TaxBurdenCalculation {
  const annualRevenueCNY = company.annualExportVolume * 7
  const exportRatio = 0.8
  const annualExportRevenue = annualRevenueCNY * exportRatio
  const annualDomesticRevenue = annualRevenueCNY * (1 - exportRatio)

  const currentScenario = calculateScenario(
    company.taxpayerType,
    annualRevenueCNY,
    annualExportRevenue,
    annualDomesticRevenue,
    company.mainProducts
  )

  const generalScenario = calculateScenario(
    "general",
    annualRevenueCNY,
    annualExportRevenue,
    annualDomesticRevenue,
    company.mainProducts
  )

  const smallScaleScenario = calculateScenario(
    "small_scale",
    annualRevenueCNY,
    annualExportRevenue,
    annualDomesticRevenue,
    company.mainProducts
  )

  const scenarios: TaxScenario[] = [currentScenario]

  if (company.taxpayerType !== "general") {
    scenarios.push(generalScenario)
  }
  if (company.taxpayerType !== "small_scale") {
    scenarios.push(smallScaleScenario)
  }

  const recommendation = generateRecommendation(
    company,
    scenarios,
    annualRevenueCNY
  )

  return {
    companyName: company.companyName,
    currentTaxpayerType: company.taxpayerType,
    scenarios,
    recommendation
  }
}

function calculateScenario(
  taxpayerType: TaxpayerType,
  annualRevenue: number,
  annualExportRevenue: number,
  annualDomesticRevenue: number,
  products: string[]
): TaxScenario {
  void products
  const details: TaxDetail[] = []

  let vatBurden: number
  let vatBurdenRate: number
  let exportTaxRefund: number
  let corporateIncomeTax: number

  if (taxpayerType === "small_scale") {
    const vatRate = 0.03
    vatBurden = Math.round(annualRevenue * vatRate)
    vatBurdenRate = 3
    exportTaxRefund = 0
    corporateIncomeTax = Math.round(annualRevenue * 0.05 * 0.25)

    details.push(
      { item: "增值税（征收率3%）", amount: vatBurden, rate: "3%", note: "小规模纳税人，不可抵扣进项" },
      { item: "出口退税", amount: 0, rate: "0%", note: "小规模纳税人不可申请出口退税" },
      { item: "企业所得税（估算）", amount: corporateIncomeTax, rate: "25%", note: "按5%利润率估算" }
    )
  } else if (taxpayerType === "general") {
    const inputRatio = 0.65
    const outputTax = Math.round(annualDomesticRevenue * 0.13)
    const inputTax = Math.round(annualRevenue * 0.13 * inputRatio)
    vatBurden = Math.max(0, outputTax - inputTax)
    vatBurdenRate = Math.round((vatBurden / annualRevenue) * 100 * 10) / 10

    const refundRate = 13
    exportTaxRefund = Math.round(annualExportRevenue * (refundRate / 100))

    const exemptionAmount = Math.max(0, annualExportRevenue * (refundRate / 100) - inputTax)
    const surcharge = Math.round(exemptionAmount * 0.12)

    corporateIncomeTax = Math.round(annualRevenue * 0.05 * 0.25)

    details.push(
      { item: "销项税额（国内销售）", amount: outputTax, rate: "13%", note: `国内收入${annualDomesticRevenue.toFixed(0)}万元` },
      { item: "进项税额（估算）", amount: inputTax, rate: "13%", note: `按进项占比${inputRatio * 100}%估算` },
      { item: "增值税应纳税额", amount: vatBurden, rate: `${vatBurdenRate}%`, note: "销项-进项" },
      { item: "出口退税（应退）", amount: exportTaxRefund, rate: `${refundRate}%`, note: `出口收入${annualExportRevenue.toFixed(0)}万元` },
      { item: "免抵额附加税", amount: surcharge, rate: "12%", note: "城建税7%+教育费附加3%+地方教育附加2%" },
      { item: "企业所得税（估算）", amount: corporateIncomeTax, rate: "25%", note: "按5%利润率估算" }
    )
  } else {
    vatBurden = 0
    vatBurdenRate = 0
    exportTaxRefund = 0
    corporateIncomeTax = 0
    details.push({ item: "未登记纳税人身份", amount: 0, rate: "-", note: "须先办理税务登记" })
  }

  const totalTaxBurden = vatBurden + corporateIncomeTax
  const netTaxBurden = totalTaxBurden - exportTaxRefund
  const netTaxBurdenRate = annualRevenue > 0
    ? Math.round((netTaxBurden / annualRevenue) * 100 * 10) / 10
    : 0

  return {
    taxpayerType,
    annualRevenue: Math.round(annualRevenue),
    annualExportRevenue: Math.round(annualExportRevenue),
    annualDomesticRevenue: Math.round(annualDomesticRevenue),
    totalTaxBurden,
    taxBurdenRate: Math.round((totalTaxBurden / annualRevenue) * 100 * 10) / 10,
    vatBurden,
    vatBurdenRate,
    corporateIncomeTax,
    exportTaxRefund,
    netTaxBurden,
    netTaxBurdenRate,
    details
  }
}

function generateRecommendation(
  company: CompanyProfile,
  scenarios: TaxScenario[],
  _annualRevenue: number
): TaxBurdenCalculation["recommendation"] {
  void _annualRevenue
  const sorted = [...scenarios].sort((a, b) => a.netTaxBurden - b.netTaxBurden)
  const best = sorted[0]

  const conditions: string[] = []
  if (best.taxpayerType === "general") {
    conditions.push("年销售额超500万元须强制登记为一般纳税人")
    conditions.push("须建立规范的会计核算制度")
    conditions.push("须取得足够的增值税专用发票用于抵扣")
    conditions.push("须办理出口退税备案")
  } else {
    conditions.push("年销售额不超过500万元")
    conditions.push("进项税额较少或无法取得专票")
    conditions.push("会计核算能力有限")
  }

  const currentNetBurden = scenarios[0].netTaxBurden
  const annualSavings = Math.max(0, currentNetBurden - best.netTaxBurden)

  return {
    recommendedType: best.taxpayerType,
    reason: best.taxpayerType === "general"
      ? `一般纳税人方案净税负${best.netTaxBurdenRate}%，低于小规模方案。可享受出口退税，实际税负更低。`
      : `小规模纳税人方案净税负${best.netTaxBurdenRate}%，当前阶段更适合。`,
    annualSavings,
    conditions
  }
}

export function quickTaxBurdenEstimate(
  annualExportVolumeUSD: number,
  taxpayerType: TaxpayerType,
  inputRatio?: number
): {
  annualRevenueCNY: number
  vatBurden: number
  exportTaxRefund: number
  netBurden: number
  netBurdenRate: string
} {
  const rate = 7
  const revenueCNY = annualExportVolumeUSD * rate

  if (taxpayerType === "small_scale") {
    const vat = Math.round(revenueCNY * 0.03)
    return {
      annualRevenueCNY: Math.round(revenueCNY),
      vatBurden: vat,
      exportTaxRefund: 0,
      netBurden: vat,
      netBurdenRate: "3.0%"
    }
  }

  const inputR = inputRatio || 0.65
  const outputTax = Math.round(revenueCNY * 0.13)
  const inputTax = Math.round(revenueCNY * 0.13 * inputR)
  const vat = Math.max(0, outputTax - inputTax)
  const refund = Math.round(revenueCNY * 0.13)
  const surcharge = Math.round(Math.max(0, refund - inputTax) * 0.12)
  const net = vat - refund + surcharge
  const netRate = revenueCNY > 0 ? ((net / revenueCNY) * 100).toFixed(1) + "%" : "0%"

  return {
    annualRevenueCNY: Math.round(revenueCNY),
    vatBurden: vat,
    exportTaxRefund: refund,
    netBurden: net,
    netBurdenRate: netRate
  }
}
