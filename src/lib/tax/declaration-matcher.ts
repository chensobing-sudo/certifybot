// ============================================================
// 报关模式智能匹配引擎
// 9710 B2B直接出口 / 9810 海外仓出口 / 0110 一般贸易
// ============================================================

import type {
  DeclarationModeMatchRequest, DeclarationModeMatchResult,
  CustomsDeclarationMode, BathroomProductCategory
} from "./types"

interface ModeRule {
  mode: CustomsDeclarationMode
  name: string
  description: string
  conditions: {
    field: keyof ConditionInput
    operator: "eq" | "gt" | "lt" | "gte" | "lte" | "in" | "has"
    value: string | number | boolean | string[]
    score: number
  }[]
  maxScore: number
  pros: string[]
  cons: string[]
}

interface ConditionInput {
  isB2B: boolean
  isB2C: boolean
  hasOverseasWarehouse: boolean
  hasPlatformStore: boolean
  platformType?: string
  buyerType: string
  estimatedAnnualVolume: number
  productCategory: BathroomProductCategory
  hasExportLicense: boolean
  isInPilotZone: boolean
}

const modeRules: ModeRule[] = [
  {
    mode: "9710",
    name: "B2B直接出口",
    description: "跨境电商企业直接出口给境外企业，适合B2B平台成交",
    conditions: [
      { field: "isB2B", operator: "eq", value: true, score: 30 },
      { field: "isB2C", operator: "eq", value: false, score: 15 },
      { field: "buyerType", operator: "in", value: ["wholesaler", "distributor", "retailer"], score: 20 },
      { field: "hasPlatformStore", operator: "eq", value: true, score: 10 },
      { field: "platformType", operator: "in", value: ["alibaba_international", "made_in_china"], score: 15 },
      { field: "isInPilotZone", operator: "eq", value: true, score: 10 },
    ],
    maxScore: 100,
    pros: [
      "简化申报流程，可汇总申报",
      "通关效率高，适合小批量多批次",
      "可享受跨境电商综试区优惠政策",
      "适合B2B平台（阿里国际站等）成交"
    ],
    cons: [
      "须在跨境电商综试区备案",
      "单票货值不超过5000元（不适用）或超过5000元须按0110申报",
      "对物流方式有一定限制"
    ]
  },
  {
    mode: "9810",
    name: "海外仓出口",
    description: "货物先出口至海外仓，再从海外仓配送至消费者/零售商",
    conditions: [
      { field: "hasOverseasWarehouse", operator: "eq", value: true, score: 40 },
      { field: "isB2C", operator: "eq", value: true, score: 15 },
      { field: "hasPlatformStore", operator: "eq", value: true, score: 10 },
      { field: "platformType", operator: "in", value: ["amazon", "ebay", "walmart", "shopify_independent_station"], score: 15 },
      { field: "isInPilotZone", operator: "eq", value: true, score: 10 },
      { field: "estimatedAnnualVolume", operator: "gte", value: 50, score: 10 },
    ],
    maxScore: 100,
    pros: [
      "货物入仓即可申请退税（无需等待销售）",
      "缩短退税周期，改善现金流",
      "适合亚马逊FBA卖家",
      "海外仓发货提升客户体验"
    ],
    cons: [
      "须在跨境电商综试区备案",
      "货物须在次年4月30日前完成销售",
      "海外仓库存管理成本较高",
      "退货处理复杂"
    ]
  },
  {
    mode: "0110",
    name: "一般贸易",
    description: "传统B2B批量出口，适合大额订单",
    conditions: [
      { field: "isB2B", operator: "eq", value: true, score: 20 },
      { field: "buyerType", operator: "in", value: ["wholesaler", "distributor"], score: 15 },
      { field: "estimatedAnnualVolume", operator: "gte", value: 100, score: 20 },
      { field: "hasExportLicense", operator: "eq", value: true, score: 15 },
      { field: "hasOverseasWarehouse", operator: "eq", value: false, score: 10 },
      { field: "hasPlatformStore", operator: "eq", value: false, score: 10 },
    ],
    maxScore: 100,
    pros: [
      "流程成熟，适用面广",
      "适合大额B2B订单",
      "无需跨境电商综试区备案",
      "单证要求明确，操作规范"
    ],
    cons: [
      "须收汇后才能申请退税",
      "通关流程相对繁琐",
      "不适合小批量多批次出口",
      "无法享受跨境电商优惠政策"
    ]
  }
]

const refundRateByProduct: Record<BathroomProductCategory, number> = {
  toilet: 13,
  bathroom_cabinet: 13,
  shower_room: 13,
  shower_head: 13,
  faucet: 13,
  kitchen_sink: 13,
  bath_tub: 13,
  hardware_fittings: 13,
  bidet: 13,
  towel_rack: 13,
  mirror: 13,
  other: 13
}

export function matchDeclarationMode(request: DeclarationModeMatchRequest): DeclarationModeMatchResult {
  const { companyProfile, exportDetails } = request

  const conditionInput: ConditionInput = {
    isB2B: exportDetails.isB2B,
    isB2C: exportDetails.isB2C,
    hasOverseasWarehouse: exportDetails.hasOverseasWarehouse,
    hasPlatformStore: exportDetails.hasPlatformStore,
    platformType: exportDetails.platformType,
    buyerType: exportDetails.buyerType,
    estimatedAnnualVolume: exportDetails.estimatedAnnualVolume,
    productCategory: exportDetails.productCategory,
    hasExportLicense: companyProfile.hasExportLicense,
    isInPilotZone: true
  }

  const scoredModes = modeRules.map(rule => {
    let score = 0
    for (const condition of rule.conditions) {
      const actualValue = conditionInput[condition.field]
      let matched = false

      switch (condition.operator) {
        case "eq":
          matched = actualValue === condition.value
          break
        case "gt":
          matched = typeof actualValue === "number" && typeof condition.value === "number" && actualValue > condition.value
          break
        case "gte":
          matched = typeof actualValue === "number" && typeof condition.value === "number" && actualValue >= condition.value
          break
        case "lt":
          matched = typeof actualValue === "number" && typeof condition.value === "number" && actualValue < condition.value
          break
        case "lte":
          matched = typeof actualValue === "number" && typeof condition.value === "number" && actualValue <= condition.value
          break
        case "in":
          matched = Array.isArray(condition.value) && condition.value.includes(actualValue as string)
          break
        case "has":
          matched = typeof actualValue === "boolean" && actualValue === true
          break
      }

      if (matched) {
        score += condition.score
      }
    }

    return {
      mode: rule.mode,
      score: Math.round((score / rule.maxScore) * 100),
      pros: rule.pros,
      cons: rule.cons
    }
  })

  scoredModes.sort((a, b) => b.score - a.score)
  const recommended = scoredModes[0]

  const analysis = generateAnalysis(recommended.mode, exportDetails)

  const refundRate = refundRateByProduct[exportDetails.productCategory] || 13
  const estimatedAnnualRefund = exportDetails.estimatedAnnualVolume * 7 * (refundRate / 100) * 0.8

  const taxRefundEligibility = {
    eligible: companyProfile.taxpayerType === "general" && companyProfile.hasExportLicense,
    estimatedRefundRate: refundRate,
    estimatedAnnualRefund: Math.round(estimatedAnnualRefund),
    conditions: getRefundConditions(recommended.mode, companyProfile),
    gaps: getRefundGaps(recommended.mode, companyProfile)
  }

  return {
    recommendedMode: recommended.mode,
    alternatives: scoredModes.map(m => ({
      mode: m.mode,
      reason: getModeReason(m.mode),
      pros: m.pros,
      cons: m.cons,
      suitability: m.score
    })),
    analysis,
    taxRefundEligibility
  }
}

function generateAnalysis(mode: CustomsDeclarationMode, details: DeclarationModeMatchRequest["exportDetails"]): string {
  const modeNames: Record<CustomsDeclarationMode, string> = {
    "9710": "9710 B2B直接出口",
    "9810": "9810 海外仓出口",
    "0110": "0110 一般贸易",
    "1039": "1039 市场采购贸易",
    "unknown": "未确定"
  }

  const productNames: Record<BathroomProductCategory, string> = {
    toilet: "马桶", bathroom_cabinet: "浴室柜", shower_room: "淋浴房",
    shower_head: "花洒", faucet: "水龙头", kitchen_sink: "水槽",
    bath_tub: "浴缸", hardware_fittings: "五金配件", bidet: "智能马桶盖",
    towel_rack: "毛巾架", mirror: "浴室镜", other: "其他卫浴产品"
  }

  return `根据企业信息和出口详情分析，推荐采用${modeNames[mode]}模式。

企业主营${productNames[details.productCategory]}，年预计出口额${details.estimatedAnnualVolume}万美元，出口至${details.destinationCountry}。
${details.hasOverseasWarehouse ? "企业设有海外仓，适合9810模式提前退税。" : ""}
${details.isB2B ? "采用B2B交易模式。" : "采用B2C交易模式。"}
${details.hasPlatformStore ? `通过${details.platformType}等平台销售。` : ""}

${mode === "9810" ? "9810模式优势在于货物进入海外仓即可申请退税，无需等待实际销售，可显著改善企业现金流。" : ""}
${mode === "9710" ? "9710模式适合B2B平台成交，可简化申报流程，提高通关效率。" : ""}
${mode === "0110" ? "0110模式流程成熟，适合传统B2B大额订单出口。" : ""}`
}

function getModeReason(mode: CustomsDeclarationMode): string {
  const reasons: Record<CustomsDeclarationMode, string> = {
    "9710": "适合跨境电商B2B出口，可简化申报",
    "9810": "适合海外仓模式，可提前退税",
    "0110": "适合传统B2B大额订单",
    "1039": "适合市场采购贸易",
    "unknown": "需进一步评估"
  }
  return reasons[mode]
}

function getRefundConditions(mode: CustomsDeclarationMode, company: DeclarationModeMatchRequest["companyProfile"]): string[] {
  const conditions: string[] = []
  if (company.taxpayerType === "general") conditions.push("增值税一般纳税人资格")
  if (company.hasExportLicense) conditions.push("已办理进出口经营权")
  conditions.push("取得出口退税专用报关单")
  conditions.push("财务上已作出口销售处理")
  conditions.push("已收汇并办理核销")
  if (mode === "9810") conditions.push("货物进入海外仓并取得入库凭证")
  if (mode === "9710") conditions.push("在跨境电商综试区备案")
  return conditions
}

function getRefundGaps(mode: CustomsDeclarationMode, company: DeclarationModeMatchRequest["companyProfile"]): string[] {
  const gaps: string[] = []
  if (company.taxpayerType !== "general") gaps.push("非一般纳税人，无法直接申请出口退税")
  if (!company.hasExportLicense) gaps.push("未办理进出口经营权")
  if (!company.hasCustomsDeclaration) gaps.push("未自行报关")
  return gaps
}
