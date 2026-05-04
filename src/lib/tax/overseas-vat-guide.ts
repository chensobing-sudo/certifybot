// ============================================================
// 海外VAT/关税/销售税合规指引引擎
// ============================================================

import type { OverseasVATGuide, CompanyProfile } from "./types"
import { overseasVATGuides } from "@/data/tax/tax-knowledge-base"

export function getVATGuide(countryCode: string): OverseasVATGuide | undefined {
  return overseasVATGuides.find(g => g.countryCode === countryCode)
}

export function getAllVATGuides(): OverseasVATGuide[] {
  return overseasVATGuides
}

export interface VATRecommendation {
  country: string
  countryCode: string
  action: "register_immediately" | "register_soon" | "monitor" | "no_action"
  reason: string
  estimatedCost: string
  deadline: string
  priority: "critical" | "high" | "medium" | "low"
}

export function getVATRecommendations(company: CompanyProfile): VATRecommendation[] {
  const recommendations: VATRecommendation[] = []

  const amazonStores = company.platformStores.filter(s => s.platform === "amazon")

  for (const store of amazonStores) {
    const guide = overseasVATGuides.find(g => g.countryCode === store.registrationCountry)
    if (!guide) continue

    const revenueUSD = store.annualRevenue
    const revenueLocal = convertToLocalCurrency(revenueUSD, store.registrationCountry)

    if (guide.registrationRequired && revenueLocal > guide.registrationThreshold) {
      recommendations.push({
        country: guide.country,
        countryCode: guide.countryCode,
        action: "register_immediately",
        reason: `年销售额${revenueUSD}万美元（约${revenueLocal.toFixed(0)}${getCurrencySymbol(store.registrationCountry)}），超过${guide.registrationThreshold}${getCurrencySymbol(store.registrationCountry)}注册阈值，须立即注册VAT`,
        estimatedCost: `注册费约${getRegistrationCost(store.registrationCountry)}，年申报费约${getFilingCost(store.registrationCountry)}`,
        deadline: "立即",
        priority: "critical"
      })
    } else if (guide.registrationRequired && revenueLocal > guide.registrationThreshold * 0.7) {
      recommendations.push({
        country: guide.country,
        countryCode: guide.countryCode,
        action: "register_soon",
        reason: `年销售额${revenueUSD}万美元，接近${guide.registrationThreshold}${getCurrencySymbol(store.registrationCountry)}注册阈值（已达${Math.round(revenueLocal / guide.registrationThreshold * 100)}%），建议提前注册`,
        estimatedCost: `注册费约${getRegistrationCost(store.registrationCountry)}`,
        deadline: "3个月内",
        priority: "high"
      })
    } else {
      recommendations.push({
        country: guide.country,
        countryCode: guide.countryCode,
        action: "monitor",
        reason: `当前销售额${revenueUSD}万美元，未达${guide.registrationThreshold}${getCurrencySymbol(store.registrationCountry)}注册阈值，但须持续监控`,
        estimatedCost: "监控成本低",
        deadline: "持续监控",
        priority: "low"
      })
    }
  }

  if (company.hasForeignWarehouse) {
    for (const countryCode of company.foreignWarehouseCountries) {
      const guide = overseasVATGuides.find(g => g.countryCode === countryCode)
      if (!guide) continue

      const alreadyAdded = recommendations.some(r => r.countryCode === countryCode)
      if (!alreadyAdded) {
        recommendations.push({
          country: guide.country,
          countryCode: guide.countryCode,
          action: "register_immediately",
          reason: `在${guide.country}设有海外仓，无论销售额多少均须注册当地VAT`,
          estimatedCost: `注册费约${getRegistrationCost(countryCode)}，年申报费约${getFilingCost(countryCode)}`,
          deadline: "立即",
          priority: "critical"
        })
      }
    }
  }

  return recommendations
}

function convertToLocalCurrency(usd: number, countryCode: string): number {
  const rates: Record<string, number> = {
    US: 1, DE: 0.92, GB: 0.79, FR: 0.92, IT: 0.92,
    JP: 149.5, SA: 3.75, AE: 3.67, AU: 1.54
  }
  const rate = rates[countryCode] || 1
  return usd * 10000 * rate
}

function getCurrencySymbol(countryCode: string): string {
  const symbols: Record<string, string> = {
    US: "$", DE: "€", GB: "£", FR: "€", IT: "€",
    JP: "¥", SA: "SAR", AE: "AED", AU: "A$"
  }
  return symbols[countryCode] || "$"
}

function getRegistrationCost(countryCode: string): string {
  const costs: Record<string, string> = {
    DE: "€500-1,500", GB: "£300-800", FR: "€800-2,000",
    IT: "€1,000-3,000", JP: "¥50,000-150,000",
    SA: "SAR 5,000-15,000", AE: "AED 3,000-8,000",
    AU: "AUD 500-1,500"
  }
  return costs[countryCode] || "待确认"
}

function getFilingCost(countryCode: string): string {
  const costs: Record<string, string> = {
    DE: "€800-2,000/年", GB: "£500-1,500/年", FR: "€1,000-2,500/年",
    IT: "€1,200-3,000/年", JP: "¥80,000-200,000/年",
    SA: "SAR 8,000-20,000/年", AE: "AED 5,000-12,000/年",
    AU: "AUD 800-2,000/年"
  }
  return costs[countryCode] || "待确认"
}

export interface DutyEstimate {
  country: string
  countryCode: string
  productValue: number
  dutyRate: number
  dutyAmount: number
  vatRate: number
  vatAmount: number
  totalTax: number
  dutyFreeThreshold: number
  isDutyFree: boolean
  additionalTariffs: { name: string; rate: number; amount: number }[]
}

export function estimateImportDuties(
  countryCode: string,
  productValueUSD: number,
  productCategory?: string
): DutyEstimate | null {
  const guide = overseasVATGuides.find(g => g.countryCode === countryCode)
  if (!guide) return null

  const isDutyFree = productValueUSD <= guide.dutyFreeThreshold
  const dutyAmount = isDutyFree ? 0 : Math.round(productValueUSD * guide.dutyRate / 100)
  const vatBase = productValueUSD + dutyAmount
  const vatAmount = Math.round(vatBase * guide.vatRate / 100)

  const additionalTariffs: { name: string; rate: number; amount: number }[] = []
  if (countryCode === "US" && productCategory) {
    const bathroomProducts = ["toilet", "bathroom_cabinet", "shower_room", "shower_head", "faucet", "hardware_fittings"]
    if (bathroomProducts.includes(productCategory || "")) {
      const section301Rate = 0.075
      const section301Amount = Math.round(productValueUSD * section301Rate)
      additionalTariffs.push({
        name: "301条款附加关税",
        rate: section301Rate * 100,
        amount: section301Amount
      })
    }
  }

  const totalAdditional = additionalTariffs.reduce((s, t) => s + t.amount, 0)

  return {
    country: guide.country,
    countryCode: guide.countryCode,
    productValue: productValueUSD,
    dutyRate: guide.dutyRate,
    dutyAmount,
    vatRate: guide.vatRate,
    vatAmount,
    totalTax: dutyAmount + vatAmount + totalAdditional,
    dutyFreeThreshold: guide.dutyFreeThreshold,
    isDutyFree,
    additionalTariffs
  }
}

export interface VATComplianceChecklist {
  country: string
  countryCode: string
  items: {
    task: string
    status: "done" | "pending" | "not_applicable"
    deadline: string
    notes: string
  }[]
}

export function getVATComplianceChecklist(countryCode: string): VATComplianceChecklist | null {
  const guide = overseasVATGuides.find(g => g.countryCode === countryCode)
  if (!guide) return null

  const items = [
    {
      task: `注册${guide.country}VAT`,
      status: "pending" as const,
      deadline: guide.registrationRequired ? "立即" : "不适用",
      notes: guide.taxRepresentativeRequired ? "须指定当地税务代表" : "可自行注册"
    },
    {
      task: "获取EORI号码（欧盟清关用）",
      status: guide.countryCode !== "GB" ? "pending" as const : "not_applicable" as const,
      deadline: "首次清关前",
      notes: "欧盟统一EORI号码，任一成员国注册即可"
    },
    {
      task: "设置VAT申报频率",
      status: "pending" as const,
      deadline: "注册后立即设置",
      notes: `${guide.filingFrequency}申报，截止日${guide.filingDeadline}`
    },
    {
      task: "保留进口VAT抵扣凭证",
      status: "pending" as const,
      deadline: "每次清关时",
      notes: "保留C88海关清关文件用于VAT抵扣"
    },
    {
      task: guide.iossAvailable ? "注册IOSS简化清关" : "确认清关流程",
      status: guide.iossAvailable ? "pending" as const : "not_applicable" as const,
      deadline: "首次B2C发货前",
      notes: guide.iossAvailable ? "IOSS可避免B2C包裹在海关被扣押" : "不适用"
    },
    {
      task: "设置税务记录保存",
      status: "pending" as const,
      deadline: "注册后立即设置",
      notes: "须保留7年税务记录（德国等国家要求）"
    }
  ]

  return { country: guide.country, countryCode: guide.countryCode, items }
}
