// ============================================================
// 四流一致智能校验引擎
// 校验合同流、物流、发票流、资金流的一致性
// ============================================================

import type {
  FourFlowConsistencyCheck, FlowCheckResult, FlowMismatch,
  RiskLevel, TransactionRecord
} from "./types"

interface FlowValidationRule {
  id: string
  name: string
  check: (transactions: TransactionRecord[]) => {
    mismatches: FlowMismatch[]
    score: number
  }
}

const flowRules: FlowValidationRule[] = [
  {
    id: "contract-payment",
    name: "合同与资金一致性",
    check: (transactions) => {
      const mismatches: FlowMismatch[] = []
      let score = 100

      const privatePayments = transactions.filter(t => t.paymentMethod === "private_account")
      for (const t of privatePayments) {
        score -= 15
        mismatches.push({
          id: `m-cp-${t.id}`,
          type: "contract_payment",
          description: `交易${t.id}：合同方为${t.counterparty}，但货款支付至个人账户`,
          severity: "critical",
          involvedParties: [t.counterparty, "个人账户"],
          amounts: [t.amount],
          suggestion: "所有货款须通过对公账户支付，确保资金流与合同流一致"
        })
      }

      const cashPayments = transactions.filter(t => t.paymentMethod === "cash")
      for (const t of cashPayments) {
        score -= 10
        mismatches.push({
          id: `m-cp-cash-${t.id}`,
          type: "contract_payment",
          description: `交易${t.id}：采用现金支付，无法形成资金流证据链`,
          severity: "major",
          involvedParties: [t.counterparty, "现金"],
          amounts: [t.amount],
          suggestion: "避免现金交易，使用对公账户转账"
        })
      }

      return { mismatches, score: Math.max(0, score) }
    }
  },

  {
    id: "contract-invoice",
    name: "合同与发票一致性",
    check: (transactions) => {
      const mismatches: FlowMismatch[] = []
      let score = 100

      const noInvoice = transactions.filter(t => !t.hasInvoice)
      for (const t of noInvoice) {
        score -= 10
        mismatches.push({
          id: `m-ci-${t.id}`,
          type: "contract_invoice",
          description: `交易${t.id}：有合同但无发票，发票流缺失`,
          severity: "major",
          involvedParties: [t.counterparty],
          amounts: [t.amount],
          suggestion: "确保每笔交易开具或取得发票"
        })
      }

      return { score: Math.max(0, score), mismatches }
    }
  },

  {
    id: "contract-logistics",
    name: "合同与物流一致性",
    check: (transactions) => {
      const mismatches: FlowMismatch[] = []
      let score = 100

      const noLogistics = transactions.filter(t => !t.hasLogisticsRecord)
      for (const t of noLogistics) {
        score -= 10
        mismatches.push({
          id: `m-cl-${t.id}`,
          type: "contract_logistics",
          description: `交易${t.id}：有合同但无物流记录，物流流缺失`,
          severity: "major",
          involvedParties: [t.counterparty],
          amounts: [t.amount],
          suggestion: "保留完整的物流单据（提单、运单、签收单等）"
        })
      }

      return { score: Math.max(0, score), mismatches }
    }
  },

  {
    id: "invoice-payment",
    name: "发票与资金一致性",
    check: (transactions) => {
      const mismatches: FlowMismatch[] = []
      let score = 100

      const invoiceNoPayment = transactions.filter(t => t.hasInvoice && !t.hasPaymentRecord)
      for (const t of invoiceNoPayment) {
        score -= 10
        mismatches.push({
          id: `m-ip-${t.id}`,
          type: "invoice_payment",
          description: `交易${t.id}：有发票但无付款记录，资金流缺失`,
          severity: "major",
          involvedParties: [t.counterparty],
          amounts: [t.amount],
          suggestion: "保留银行付款凭证，确保发票与付款对应"
        })
      }

      return { score: Math.max(0, score), mismatches }
    }
  },

  {
    id: "logistics-invoice",
    name: "物流与发票一致性",
    check: (transactions) => {
      const mismatches: FlowMismatch[] = []
      let score = 100

      const logisticsNoInvoice = transactions.filter(t => t.hasLogisticsRecord && !t.hasInvoice)
      for (const t of logisticsNoInvoice) {
        score -= 5
        mismatches.push({
          id: `m-li-${t.id}`,
          type: "logistics_invoice",
          description: `交易${t.id}：有物流记录但无发票`,
          severity: "minor",
          involvedParties: [t.counterparty],
          amounts: [t.amount],
          suggestion: "补充发票或保留物流与发票对应关系的说明"
        })
      }

      return { score: Math.max(0, score), mismatches }
    }
  }
]

export function validateFourFlowConsistency(
  transactions: TransactionRecord[]
): FourFlowConsistencyCheck {
  const allMismatches: FlowMismatch[] = []
  let totalScore = 0
  const flowResults: FlowCheckResult[] = []

  for (const rule of flowRules) {
    const { mismatches, score } = rule.check(transactions)
    allMismatches.push(...mismatches)

    const status = score >= 80 ? "consistent" : score >= 50 ? "partial" : "inconsistent"
    flowResults.push({
      flowType: mapRuleToFlowType(rule.id),
      status,
      score,
      details: getFlowDetail(rule.id, score, mismatches.length),
      evidenceCount: transactions.length - mismatches.length
    })

    totalScore += score
  }

  const averageScore = Math.round(totalScore / flowRules.length)
  const overallStatus = averageScore >= 80 ? "consistent" : averageScore >= 50 ? "partial" : "inconsistent"
  const riskLevel: RiskLevel = averageScore >= 80 ? "low" : averageScore >= 60 ? "medium" : averageScore >= 40 ? "high" : "critical"

  allMismatches.sort((a, b) => {
    const severityOrder = { critical: 0, major: 1, minor: 2 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })

  return {
    overallStatus,
    contractFlow: flowResults[2],
    logisticsFlow: flowResults[2],
    invoiceFlow: flowResults[3],
    paymentFlow: flowResults[0],
    mismatches: allMismatches,
    riskLevel
  }
}

function mapRuleToFlowType(ruleId: string): FlowCheckResult["flowType"] {
  const map: Record<string, FlowCheckResult["flowType"]> = {
    "contract-payment": "payment",
    "contract-invoice": "invoice",
    "contract-logistics": "contract",
    "invoice-payment": "invoice",
    "logistics-invoice": "logistics"
  }
  return map[ruleId] || "contract"
}

function getFlowDetail(ruleId: string, score: number, mismatchCount: number): string {
  if (score >= 80) return "四流一致，无异常"
  if (score >= 50) return `发现${mismatchCount}处不一致，建议整改`
  return `存在${mismatchCount}处严重不一致，须立即整改`
}

export function quickFourFlowCheck(
  hasContract: boolean,
  hasLogistics: boolean,
  hasInvoice: boolean,
  hasPayment: boolean,
  paymentMethod?: string
): {
  status: "consistent" | "partial" | "inconsistent"
  missingFlows: string[]
  riskLevel: RiskLevel
} {
  const missingFlows: string[] = []
  if (!hasContract) missingFlows.push("合同流")
  if (!hasLogistics) missingFlows.push("物流")
  if (!hasInvoice) missingFlows.push("发票流")
  if (!hasPayment) missingFlows.push("资金流")
  if (paymentMethod === "private_account") missingFlows.push("对公账户（私户收款）")

  const presentCount = 4 - missingFlows.length
  const status = presentCount >= 4 ? "consistent" : presentCount >= 2 ? "partial" : "inconsistent"
  const riskLevel: RiskLevel = presentCount >= 4 ? "low" : presentCount >= 3 ? "medium" : presentCount >= 2 ? "high" : "critical"

  return { status, missingFlows, riskLevel }
}
