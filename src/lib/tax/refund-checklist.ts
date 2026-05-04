// ============================================================
// 出口退税资料清单生成 + 单证合规校验
// ============================================================

import type {
  TaxRefundChecklist, RequiredDocument, DocumentValidationResult,
  TaxRefundTimeline, CompanyProfile, ExportRecord
} from "./types"

const BASIC_REQUIREMENTS = [
  {
    item: "增值税一般纳税人资格",
    check: (company: CompanyProfile) => company.taxpayerType === "general",
    detail: (company: CompanyProfile) =>
      company.taxpayerType === "general"
        ? "已具备一般纳税人资格"
        : company.taxpayerType === "small_scale"
          ? "小规模纳税人，须先转为一般纳税人"
          : "未登记纳税人身份"
  },
  {
    item: "进出口经营权",
    check: (company: CompanyProfile) => company.hasExportLicense,
    detail: (company: CompanyProfile) =>
      company.hasExportLicense
        ? "已办理对外贸易经营者备案"
        : "未办理进出口经营权，须向商务部门申请"
  },
  {
    item: "出口退税备案",
    check: (company: CompanyProfile) => company.hasExportLicense,
    detail: (company: CompanyProfile) =>
      company.hasExportLicense
        ? "已完成出口退税备案（假设）"
        : "未办理出口退税备案"
  },
  {
    item: "海关报关单位注册",
    check: (company: CompanyProfile) => company.hasCustomsDeclaration || company.hasExportLicense,
    detail: (company: CompanyProfile) =>
      company.hasCustomsDeclaration
        ? "已办理海关报关单位注册"
        : "未办理海关注册"
  },
  {
    item: "外汇管理局名录登记",
    check: () => true,
    detail: () => "已办理外汇管理局名录登记（假设与进出口经营权同步）"
  },
  {
    item: "电子口岸IC卡",
    check: (company: CompanyProfile) => company.hasCustomsDeclaration || company.hasExportLicense,
    detail: (company: CompanyProfile) =>
      company.hasCustomsDeclaration || company.hasExportLicense
        ? "已办理电子口岸IC卡（假设）"
        : "未办理电子口岸IC卡"
  }
]

const DOCUMENT_TEMPLATES: Omit<RequiredDocument, "status">[] = [
  {
    name: "出口货物报关单（出口退税专用联）",
    description: "海关签发的出口货物报关单，须有出口退税专用联标识",
    source: "海关/报关行",
    deadline: "货物出口后次月15日前",
    notes: "报关单信息须与发票、合同一致"
  },
  {
    name: "增值税专用发票（进项发票）",
    description: "采购原材料/商品的增值税专用发票，须已认证",
    source: "供应商",
    deadline: "退税申报前完成认证",
    notes: "发票品名须与报关单品名大类一致"
  },
  {
    name: "出口发票",
    description: "企业自行开具的出口形式发票或商业发票",
    source: "企业自开",
    deadline: "出口时开具",
    notes: "须与报关单金额一致（FOB价）"
  },
  {
    name: "装箱单",
    description: "列明出口货物包装明细的装箱单据",
    source: "企业自开",
    deadline: "出口时制作",
    notes: "数量须与报关单一致"
  },
  {
    name: "外销合同/形式发票",
    description: "与境外客户签订的销售合同或形式发票",
    source: "企业与客户",
    deadline: "出口前签订",
    notes: "合同方须与报关单经营单位一致"
  },
  {
    name: "提单/空运单/快递单",
    description: "海运提单、空运单或国际快递运单",
    source: "货代/物流公司",
    deadline: "货物发运后取得",
    notes: "发货人须与报关单经营单位一致"
  },
  {
    name: "银行收汇水单/结汇水单",
    description: "银行出具的收汇凭证或结汇水单",
    source: "银行",
    deadline: "收汇后及时取得",
    notes: "付款人须与合同买方一致"
  },
  {
    name: "委托报关协议",
    description: "如委托报关行报关，须签订委托报关协议",
    source: "企业与报关行",
    deadline: "报关前签订",
    notes: "须加盖双方公章"
  },
  {
    name: "运输发票（国内段）",
    description: "货物从工厂到出口港口的国内运输发票",
    source: "物流公司",
    deadline: "运输完成后取得",
    notes: "证明货物真实从工厂发出"
  },
  {
    name: "代理出口协议",
    description: "如委托代理出口，须签订代理出口协议",
    source: "企业与代理方",
    deadline: "出口前签订",
    notes: "明确双方权利义务和退税分配"
  }
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DocumentData = Record<string, any>

interface ValidationRule {
  documentName: string
  validate: (doc: DocumentData) => { isValid: boolean; issues: string[]; suggestions: string[] }
}

const validationRules: ValidationRule[] = [
  {
    documentName: "出口货物报关单",
    validate: (doc: DocumentData) => {
      const issues: string[] = []
      if (!doc.number) issues.push("报关单号缺失")
      if (!doc.exportDate) issues.push("出口日期缺失")
      if (!doc.declarationType || doc.declarationType !== "export") issues.push("报关单类型须为出口")
      return {
        isValid: issues.length === 0,
        issues,
        suggestions: issues.map(() => "核对报关单信息，确保完整准确")
      }
    }
  },
  {
    documentName: "增值税专用发票",
    validate: (doc: DocumentData) => {
      const issues: string[] = []
      if (!doc.invoiceNumber) issues.push("发票号码缺失")
      if (!doc.amount || doc.amount <= 0) issues.push("发票金额异常")
      if (doc.status === "void") issues.push("发票已作废")
      if (doc.status === "red_flagged") issues.push("发票状态异常")
      return {
        isValid: issues.length === 0,
        issues,
        suggestions: issues.map(() => "检查发票状态，确保已认证且有效")
      }
    }
  },
  {
    documentName: "提单/空运单/快递单",
    validate: (doc: DocumentData) => {
      const issues: string[] = []
      if (!doc.consignor) issues.push("发货人信息缺失")
      if (!doc.consignee) issues.push("收货人信息缺失")
      if (!doc.portOfLoading) issues.push("装货港缺失")
      if (!doc.portOfDischarge) issues.push("卸货港缺失")
      return {
        isValid: issues.length === 0,
        issues,
        suggestions: issues.map(() => "补充物流单据信息")
      }
    }
  },
  {
    documentName: "银行收汇水单",
    validate: (doc: DocumentData) => {
      const issues: string[] = []
      if (!doc.payer) issues.push("付款人信息缺失")
      if (!doc.amount || doc.amount <= 0) issues.push("收汇金额异常")
      if (!doc.date) issues.push("收汇日期缺失")
      return {
        isValid: issues.length === 0,
        issues,
        suggestions: issues.map(() => "核对收汇信息与报关单一致性")
      }
    }
  }
]

export function generateRefundChecklist(
  company: CompanyProfile,
  exports: ExportRecord[]
): TaxRefundChecklist {
  const basicRequirements = BASIC_REQUIREMENTS.map(req => {
    const met = req.check(company)
    return {
      item: req.item,
      status: met ? ("met" as const) : ("not_met" as const),
      detail: req.detail(company)
    }
  })

  const requiredDocuments = DOCUMENT_TEMPLATES.map(tpl => ({
    ...tpl,
    status: "missing" as const
  }))

  const documentValidation: DocumentValidationResult[] = exports.length > 0
    ? validationRules.map(rule => {
        const result = rule.validate({})
        return {
          documentName: rule.documentName,
          isValid: result.isValid,
          issues: result.issues,
          suggestions: result.suggestions
        }
      })
    : []

  const timeline = generateTimeline()
  const totalExportAmount = exports.reduce((s, e) => s + e.totalValue, 0) * 7
  const estimatedRefund = calculateRefund(company, totalExportAmount)

  return {
    basicRequirements,
    requiredDocuments,
    documentValidation,
    timeline,
    estimatedRefund
  }
}

function generateTimeline(): TaxRefundTimeline {
  const now = new Date()
  const fmt = (d: Date) => d.toISOString().split("T")[0]

  const declarationDate = new Date(now)
  const docPrepEnd = new Date(now)
  docPrepEnd.setDate(docPrepEnd.getDate() + 7)
  const submissionDate = new Date(docPrepEnd)
  submissionDate.setDate(submissionDate.getDate() + 3)
  const reviewDate = new Date(submissionDate)
  reviewDate.setDate(reviewDate.getDate() + 10)
  const approvalDate = new Date(reviewDate)
  approvalDate.setDate(approvalDate.getDate() + 5)
  const refundDate = new Date(approvalDate)
  refundDate.setDate(refundDate.getDate() + 7)

  return {
    declarationDate: fmt(declarationDate),
    documentPreparationEnd: fmt(docPrepEnd),
    submissionDate: fmt(submissionDate),
    taxAuthorityReview: fmt(reviewDate),
    expectedApproval: fmt(approvalDate),
    expectedRefundDate: fmt(refundDate),
    totalDays: Math.round((refundDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }
}

function calculateRefund(company: CompanyProfile, exportAmountCNY: number) {
  const refundRate = 13
  const taxRate = 13

  const estimatedRefundAmount = Math.round(exportAmountCNY * (refundRate / 100))
  const taxAmount = Math.round(exportAmountCNY * (taxRate / 100))
  const actualRefund = Math.round(estimatedRefundAmount * 0.85)

  return {
    exportAmount: Math.round(exportAmountCNY),
    refundRate,
    estimatedRefundAmount,
    taxRate,
    taxAmount,
    actualRefund
  }
}

export function validateDocuments(documents: DocumentData[]): DocumentValidationResult[] {
  return validationRules.map(rule => {
    const doc = documents.find(d => d.name === rule.documentName) || {}
    const result = rule.validate(doc)
    return {
      documentName: rule.documentName,
      isValid: result.isValid,
      issues: result.issues,
      suggestions: result.suggestions
    }
  })
}
