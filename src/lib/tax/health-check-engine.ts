// ============================================================
// 税务合规自查体检引擎
// 基于规则引擎的卫浴企业税务健康检查
// ============================================================

import type {
  CompanyProfile, TaxHealthCheckResult, TaxHealthCheckRequest,
  TaxDimensionResult, TaxIssue, TaxSuggestion,
  RiskLevel, TaxIssueCategory, TransactionRecord,
  ExportRecord, InvoiceRecord
} from "./types"
import { taxRiskCases } from "@/data/tax/tax-knowledge-base"
void taxRiskCases

// ==================== 维度定义 ====================

interface CheckDimension {
  id: string
  name: string
  weight: number
  check: (company: CompanyProfile, transactions: TransactionRecord[], exports: ExportRecord[], invoices: InvoiceRecord[]) => {
    score: number
    issues: TaxIssue[]
  }
}

// ==================== 规则引擎 ====================

function calculateRiskLevel(score: number): RiskLevel {
  if (score < 30) return "critical"
  if (score < 50) return "high"
  if (score < 70) return "medium"
  if (score < 85) return "low"
  return "safe"
}

function createIssue(
  id: string, category: TaxIssueCategory, title: string,
  description: string, risk: RiskLevel, regulation: string,
  penalty: string, suggestion: string
): TaxIssue {
  return { id, category, title, description, risk, regulation, penalty, suggestion }
}

// ==================== 各维度检查规则 ====================

const dimensions: CheckDimension[] = [
  // 维度1：出口退税合规
  {
    id: "export_tax_refund",
    name: "出口退税合规",
    weight: 20,
    check: (company) => {
      const issues: TaxIssue[] = []
      let score = 100

      if (company.taxpayerType === "small_scale" && company.annualExportVolume > 500) {
        score -= 30
        issues.push(createIssue(
          "er-001", "export_tax_refund",
          "年出口超500万元但为小规模纳税人",
          `年出口额${company.annualExportVolume}万美元（约${(company.annualExportVolume * 7).toFixed(0)}万元人民币），超过500万元强制登记门槛，但当前为小规模纳税人，无法享受出口退税。`,
          "critical",
          "《增值税一般纳税人登记管理办法》第3条",
          "年多缴增值税约${(company.annualExportVolume * 7 * 0.1).toFixed(0)}万元，且丧失出口退税权利",
          "立即申请转为一般纳税人，同时办理出口退税备案"
        ))
      }

      if (!company.hasExportLicense && company.annualExportVolume > 50) {
        score -= 20
        issues.push(createIssue(
          "er-002", "export_tax_refund",
          "年出口超50万美元但未办理进出口经营权",
          `年出口额${company.annualExportVolume}万美元，但未取得进出口经营权，可能通过买单出口或挂靠出口，存在重大税务风险。`,
          "high",
          "《对外贸易法》第9条",
          "海关处罚+追缴税款+列入失信企业名单",
          "立即向商务部门申请对外贸易经营者备案登记，同步办理海关备案"
        ))
      }

      if (!company.hasCustomsDeclaration && company.annualExportVolume > 100) {
        score -= 25
        issues.push(createIssue(
          "er-003", "export_tax_refund",
          "未自行报关，存在买单出口风险",
          "企业未自行报关，年出口额超100万美元，可能通过货代买单出口。买单出口属于违法行为。",
          "critical",
          "《海关法》第24条",
          "追缴税款+罚款+刑事责任",
          "立即停止买单出口，办理进出口经营权后自行报关或委托正规报关行"
        ))
      }

      if (company.invoiceIssuanceMethod === "no_issuance" && company.annualExportVolume > 100) {
        score -= 15
        issues.push(createIssue(
          "er-004", "export_tax_refund",
          "未开票且年出口超100万美元，退税基础缺失",
          "企业未开具发票，出口退税需要进项发票作为抵扣凭证，无发票将导致退税失败。",
          "high",
          "《出口货物劳务增值税和消费税管理办法》第8条",
          "出口退税申报被驳回，转为内销补税",
          "建立发票管理制度，要求供应商开具增值税专用发票"
        ))
      }

      if (company.taxpayerType === "small_scale" && company.annualExportVolume > 100 && company.annualExportVolume <= 500) {
        issues.push(createIssue(
          "er-005", "export_tax_refund",
          "小规模纳税人可委托综服企业代办退税",
          `年出口额${company.annualExportVolume}万美元，虽为小规模纳税人，但可委托外贸综合服务企业代办退税，当前未利用此政策。`,
          "medium",
          "《关于跨境电子商务综合试验区零售出口货物税收政策的通知》",
          "年损失退税款约${(company.annualExportVolume * 7 * 0.1).toFixed(0)}万元",
          "选择有资质的综服企业签订代办退税协议"
        ))
      }

      return { score: Math.max(0, score), issues }
    }
  },

  // 维度2：发票合规
  {
    id: "invoice_compliance",
    name: "发票合规管理",
    weight: 15,
    check: (company, _transactions, _exports, invoices) => {
      const issues: TaxIssue[] = []
      let score = 100

      if (company.invoiceIssuanceMethod === "no_issuance") {
        score -= 25
        issues.push(createIssue(
          "ic-001", "invoice_compliance",
          "企业未开具发票，存在税务不合规风险",
          "企业未开具发票，可能大量交易未纳入税务管理体系，存在隐匿收入风险。",
          "high",
          "《发票管理办法》第19条",
          "补税+罚款+滞纳金",
          "建立发票管理制度，确保每笔交易开具发票"
        ))
      }

      if (company.bookkeepingMethod === "no_bookkeeping") {
        score -= 30
        issues.push(createIssue(
          "ic-002", "invoice_compliance",
          "企业未记账，严重违反财税法规",
          "企业未建立账簿，无法提供完整的财务记录，违反《会计法》规定。",
          "critical",
          "《会计法》第3条",
          "罚款+税务核定征收+纳税信用降级",
          "立即聘请会计或委托代理记账机构建立账簿"
        ))
      }

      if (invoices.length > 0) {
        const redFlagged = invoices.filter(i => i.status === "red_flagged")
        if (redFlagged.length > 0) {
          score -= redFlagged.length * 10
          issues.push(createIssue(
            "ic-003", "invoice_compliance",
            `存在${redFlagged.length}张异常发票`,
            `发票记录中有${redFlagged.length}张状态为异常/红冲，可能涉及发票违规。`,
            "high",
            "《发票管理办法》第22条",
            "进项转出+罚款+虚开认定风险",
            "立即核查异常发票原因，保留相关证明材料"
          ))
        }
      }

      return { score: Math.max(0, score), issues }
    }
  },

  // 维度3：四流一致
  {
    id: "four_flow_consistency",
    name: "四流一致性",
    weight: 20,
    check: (company, transactions) => {
      const issues: TaxIssue[] = []
      let score = 100

      const privatePayments = transactions.filter(t => t.paymentMethod === "private_account")
      if (privatePayments.length > 0) {
        const totalPrivateAmount = privatePayments.reduce((s, t) => s + t.amount, 0)
        score -= Math.min(40, privatePayments.length * 10)
        issues.push(createIssue(
          "fc-001", "four_flow_consistency",
          `存在${privatePayments.length}笔私户收款，金额约${totalPrivateAmount.toFixed(0)}万元`,
          `交易记录中有${privatePayments.length}笔通过个人账户收款，四流中的资金流与合同流不一致，且涉嫌隐匿收入。`,
          "critical",
          "《税收征收管理法》第63条",
          "补税+罚款0.5-5倍+滞纳金+银行账户冻结",
          "立即停止私户收款，所有货款通过对公账户收支"
        ))
      }

      const incompleteTransactions = transactions.filter(t =>
        !t.hasContract || !t.hasInvoice || !t.hasLogisticsRecord || !t.hasPaymentRecord
      )
      if (incompleteTransactions.length > 0) {
        const ratio = incompleteTransactions.length / transactions.length * 100
        score -= Math.min(30, ratio / 2)
        issues.push(createIssue(
          "fc-002", "four_flow_consistency",
          `${incompleteTransactions.length}笔交易四流不完整（占比${ratio.toFixed(0)}%）`,
          `部分交易缺少合同/发票/物流/资金记录中的一项或多项，四流不一致将导致进项抵扣和出口退税风险。`,
          "high",
          "国税发〔1995〕192号",
          "进项转出+补税+虚开认定",
          "建立四流匹配台账，每笔交易确保四流齐全"
        ))
      }

      const cashTransactions = transactions.filter(t => t.paymentMethod === "cash")
      if (cashTransactions.length > 0) {
        score -= 15
        issues.push(createIssue(
          "fc-003", "four_flow_consistency",
          `存在${cashTransactions.length}笔现金交易`,
          "现金交易无法形成完整的资金流证据链，金税四期重点监控大额现金交易。",
          "medium",
          "《金融机构大额交易和可疑交易报告管理办法》",
          "无法证明交易真实性，进项不得抵扣",
          "尽量避免现金交易，使用对公账户转账"
        ))
      }

      return { score: Math.max(0, score), issues }
    }
  },

  // 维度4：私户隐匿收入
  {
    id: "private_account",
    name: "私户收款与收入隐匿",
    weight: 15,
    check: (company, transactions) => {
      const issues: TaxIssue[] = []
      let score = 100

      const privatePayments = transactions.filter(t => t.paymentMethod === "private_account")
      const totalPrivate = privatePayments.reduce((s, t) => s + t.amount, 0)

      if (privatePayments.length > 0) {
        score -= Math.min(50, privatePayments.length * 8)
        issues.push(createIssue(
          "pa-001", "private_account",
          `私户收款总额约${totalPrivate.toFixed(0)}万元，涉嫌隐匿收入`,
          `通过个人账户收取货款${totalPrivate.toFixed(0)}万元，未入公账未申报，金税四期银税直连将自动预警。`,
          "critical",
          "《税收征收管理法》第63条",
          "补税+罚款+滞纳金+移送公安（金额巨大）",
          "立即自查自纠，主动补申报历史私户收入（自查从宽）"
        ))
      }

      if (company.platformStores.length > 0) {
        const platformRevenue = company.platformStores.reduce((s, p) => s + p.annualRevenue, 0)
        if (platformRevenue > 50 && privatePayments.length > 0) {
          issues.push(createIssue(
            "pa-002", "private_account",
            "平台收款与私户收款并存，收入完整性存疑",
            `平台年营收${platformRevenue.toFixed(0)}万美元，同时存在私户收款，可能部分平台收入也未完整申报。`,
            "high",
            "《税收征收管理法》第35条",
            "核定征收+从高适用税率",
            "确保所有平台收入进入对公账户，平台销售数据与申报数据一致"
          ))
        }
      }

      return { score: Math.max(0, score), issues }
    }
  },

  // 维度5：商品编码归类
  {
    id: "customs_code",
    name: "HS编码归类合规",
    weight: 10,
    check: (company, _transactions, exports) => {
      const issues: TaxIssue[] = []
      let score = 100

      if (exports.length > 0) {
        const noHSCode = exports.filter(e => !e.hsCode || e.hsCode === "")
        if (noHSCode.length > 0) {
          score -= 20
          issues.push(createIssue(
            "cc-001", "customs_code",
            `${noHSCode.length}笔出口记录缺少HS编码`,
            "部分出口记录未填写HS编码，可能导致归类错误或申报不实。",
            "medium",
            "《进出口商品归类管理规定》",
            "申报不实罚款+补税+海关降级",
            "建立卫浴产品HS编码对照表，确保每笔出口正确归类"
          ))
        }

        const invalidHSCode = exports.filter(e => e.hsCode && !/^\d{4}\.\d{2}$/.test(e.hsCode))
        if (invalidHSCode.length > 0) {
          score -= 15
          issues.push(createIssue(
            "cc-002", "customs_code",
            `${invalidHSCode.length}笔出口HS编码格式不正确`,
            "HS编码应为4位章号+2位目号格式（如6910.10），格式不正确可能导致申报被拒。",
            "medium",
            "《进出口税则》",
            "申报被退回+延误通关",
            "核对HS编码格式，确保符合海关要求"
          ))
        }
      }

      if (company.mainProducts.length >= 3 && exports.length > 0) {
        issues.push(createIssue(
          "cc-003", "customs_code",
          "多品类卫浴产品出口，注意HS编码差异",
          `企业主营${company.mainProducts.length}类卫浴产品，不同品类HS编码不同，退税率也可能不同，需确保正确归类。`,
          "low",
          "《进出口商品归类管理规定》",
          "错误归类导致退税率差异+罚款",
          "为每个产品品类建立独立的HS编码档案"
        ))
      }

      return { score: Math.max(0, score), issues }
    }
  },

  // 维度6：纳税人身份
  {
    id: "taxpayer_identity",
    name: "纳税人身份规划",
    weight: 10,
    check: (company) => {
      const issues: TaxIssue[] = []
      let score = 100

      const annualRevenueCNY = company.annualExportVolume * 7

      if (company.taxpayerType === "small_scale" && annualRevenueCNY > 500) {
        score -= 35
        issues.push(createIssue(
          "ti-001", "taxpayer_identity",
          "年销售额超500万元但未登记为一般纳税人",
          `年出口额约${annualRevenueCNY.toFixed(0)}万元人民币，超过500万元强制登记门槛。当前小规模纳税人身份不合规。`,
          "critical",
          "《增值税一般纳税人登记管理办法》第3条",
          "税务机关责令限期登记+按一般纳税人税率补税+罚款",
          "立即向税务机关申请转为一般纳税人"
        ))
      }

      if (company.taxpayerType === "small_scale" && annualRevenueCNY > 300 && annualRevenueCNY <= 500) {
        score -= 15
        issues.push(createIssue(
          "ti-002", "taxpayer_identity",
          "年销售额接近500万元门槛，建议提前规划纳税人身份",
          `年出口额约${annualRevenueCNY.toFixed(0)}万元，接近一般纳税人强制登记门槛。建议提前评估转登记影响。`,
          "medium",
          "《增值税一般纳税人登记管理办法》",
          "达到门槛未登记将面临处罚",
          "提前测算转一般纳税人后的税负变化，做好转登记准备"
        ))
      }

      if (company.taxpayerType === "general" && company.annualExportVolume > 0) {
        issues.push(createIssue(
          "ti-003", "taxpayer_identity",
          "确认是否已完成出口退税备案",
          "一般纳税人出口企业须在首次出口前完成出口退税备案，未备案将无法申报退税。",
          "low",
          "《出口货物劳务增值税和消费税管理办法》第3条",
          "无法申报出口退税",
          "确认已在税务机关完成出口退税备案"
        ))
      }

      return { score: Math.max(0, score), issues }
    }
  },

  // 维度7：海外VAT合规
  {
    id: "overseas_vat",
    name: "海外VAT/销售税合规",
    weight: 10,
    check: (company) => {
      const issues: TaxIssue[] = []
      let score = 100

      const amazonStores = company.platformStores.filter(s => s.platform === "amazon")
      if (amazonStores.length > 0) {
        const euStores = amazonStores.filter(s =>
          ["DE", "FR", "IT", "ES", "GB"].includes(s.registrationCountry)
        )
        if (euStores.length > 0) {
          score -= 20
          issues.push(createIssue(
            "ov-001", "overseas_vat",
            `在${euStores.length}个欧洲站点销售，须注册当地VAT`,
            `企业在${euStores.map(s => s.registrationCountry).join("、")}等欧洲国家亚马逊销售，须注册当地VAT并按时申报。`,
            "high",
            "欧盟增值税指令/各国VAT法",
            "补税+罚款+亚马逊封店+库存扣押",
            "立即在销售国注册VAT，聘请当地税务代理处理申报"
          ))
        }

        const ukStore = amazonStores.find(s => s.registrationCountry === "GB")
        if (ukStore && ukStore.annualRevenue > 8.5) {
          score -= 15
          issues.push(createIssue(
            "ov-002", "overseas_vat",
            "英国站年销售超£8.5万须注册英国VAT",
            `英国站年营收${ukStore.annualRevenue}万美元（约£${(ukStore.annualRevenue * 0.8).toFixed(0)}万），超过£85,000远程销售阈值。`,
            "high",
            "英国《增值税法》",
            "补税+罚款+亚马逊英国站封店",
            "立即注册英国VAT，补申报历史销售"
          ))
        }
      }

      if (company.hasForeignWarehouse && company.foreignWarehouseCountries.length > 0) {
        const euWarehouses = company.foreignWarehouseCountries.filter(c =>
          ["DE", "FR", "IT", "ES", "NL"].includes(c)
        )
        if (euWarehouses.length > 0) {
          score -= 20
          issues.push(createIssue(
            "ov-003", "overseas_vat",
            `在${euWarehouses.join("、")}等国设有海外仓，须注册当地VAT`,
            "在欧盟国家设立海外仓（含FBA仓）即构成物理关联，无论销售额多少均须注册当地VAT。",
            "critical",
            "各国VAT法",
            "补税+罚款+货物被扣押",
            "立即在海外仓所在国注册VAT"
          ))
        }
      }

      const usStores = company.platformStores.filter(s => s.registrationCountry === "US")
      if (usStores.length > 0) {
        const totalUSRevenue = usStores.reduce((s, st) => s + st.annualRevenue, 0)
        if (totalUSRevenue > 10) {
          issues.push(createIssue(
            "ov-004", "overseas_vat",
            "美国站年销售超10万美元，须关注各州Sales Tax",
            `美国站年营收${totalUSRevenue.toFixed(0)}万美元，超过多数州的经济关联阈值（10万美元/200笔），须在各州注册Sales Tax。`,
            "medium",
            "各州Sales Tax法",
            "补税+罚款+各州税务审计",
            "使用TaxJar或亚马逊VAT Services自动处理多州Sales Tax"
          ))
        }
      }

      return { score: Math.max(0, score), issues }
    }
  },

  // 维度8：金税四期风险
  {
    id: "golden_tax_phase4",
    name: "金税四期风险防控",
    weight: 10,
    check: (company, transactions) => {
      const issues: TaxIssue[] = []
      let score = 100

      const privatePayments = transactions.filter(t => t.paymentMethod === "private_account")
      if (privatePayments.length > 0) {
        score -= 25
        issues.push(createIssue(
          "gt-001", "golden_tax_phase4",
          "私户收款触发金税四期银税直连预警",
          "个人账户频繁收款将触发银行大额交易报告，银税直连后数据自动推送税务局。",
          "critical",
          "《金融机构大额交易和可疑交易报告管理办法》",
          "税务稽查+补税+罚款+账户冻结",
          "立即停止私户收款，历史私户收入主动补申报"
        ))
      }

      if (company.bookkeepingMethod === "no_bookkeeping" || company.bookkeepingMethod === "agency_bookkeeping") {
        if (!company.hasDedicatedTaxAccountant) {
          score -= 15
          issues.push(createIssue(
            "gt-002", "golden_tax_phase4",
            "无专职税务会计，金税四期下风险较高",
            "金税四期数据复杂度高，代理记账可能无法及时识别风险信号，建议配备专职税务人员。",
            "medium",
            "《税收征收管理法》",
            "未能及时应对税务预警导致处罚",
            "考虑聘请专职税务会计或选择专业的跨境电商税务服务机构"
          ))
        }
      }

      if (company.platformStores.length >= 3) {
        issues.push(createIssue(
          "gt-003", "golden_tax_phase4",
          "多平台多店铺经营，注意数据一致性",
          `企业在${company.platformStores.length}个平台/店铺销售，金税四期可交叉比对各平台数据，确保各店铺申报数据一致。`,
          "low",
          "《税收征收管理法》",
          "数据不一致触发稽查",
          "建立多店铺统一收入台账，确保各平台数据与申报一致"
        ))
      }

      return { score: Math.max(0, score), issues }
    }
  }
]

// ==================== 主引擎函数 ====================

export function runTaxHealthCheck(request: TaxHealthCheckRequest): TaxHealthCheckResult {
  const { company, recentTransactions = [], exportRecords = [], invoiceRecords = [] } = request

  const dimensionResults: TaxDimensionResult[] = dimensions.map(dim => {
    const { score, issues } = dim.check(company, recentTransactions, exportRecords, invoiceRecords)
    return {
      dimensionId: dim.id,
      dimensionName: dim.name,
      score,
      risk: calculateRiskLevel(score),
      weight: dim.weight,
      issues
    }
  })

  const totalWeight = dimensionResults.reduce((s, d) => s + d.weight, 0)
  const overallScore = Math.round(
    dimensionResults.reduce((s, d) => s + d.score * d.weight, 0) / totalWeight
  )

  const allIssues = dimensionResults.flatMap(d => d.issues)
  const criticalIssues = allIssues.filter(i => i.risk === "critical")
  const warnings = allIssues.filter(i => i.risk === "high" || i.risk === "medium")
  const suggestions = generateSuggestions(company, dimensionResults, allIssues)

  return {
    overallScore,
    overallRisk: calculateRiskLevel(overallScore),
    dimensions: dimensionResults,
    criticalIssues,
    warnings,
    suggestions,
    timestamp: new Date().toISOString()
  }
}

// ==================== 改进建议生成 ====================

function generateSuggestions(
  company: CompanyProfile,
  dimensions: TaxDimensionResult[],
  issues: TaxIssue[]
): TaxSuggestion[] {
  const suggestions: TaxSuggestion[] = []

  const criticalIssues = issues.filter(i => i.risk === "critical")
  if (criticalIssues.length > 0) {
    suggestions.push({
      id: "sug-urgent-001",
      priority: "urgent",
      title: "立即处理紧急税务风险",
      description: `发现${criticalIssues.length}项紧急税务风险，包括：${criticalIssues.slice(0, 3).map(i => i.title).join("、")}。建议立即整改。`,
      expectedBenefit: "避免税务处罚和刑事责任",
      estimatedCost: "视具体情况",
      difficulty: "medium",
      timeline: "1个月内"
    })
  }

  const annualRevenueCNY = company.annualExportVolume * 7
  if (company.taxpayerType === "small_scale" && annualRevenueCNY > 300) {
    suggestions.push({
      id: "sug-taxpayer-001",
      priority: "important",
      title: "评估转为一般纳税人",
      description: `年出口额${company.annualExportVolume}万美元，建议评估转为一般纳税人的税负变化。一般纳税人可享受出口退税，实际税负可能低于小规模。`,
      expectedBenefit: "年节省税款约" + (annualRevenueCNY * 0.03).toFixed(0) + "万元 + 退税现金流",
      estimatedCost: "会计核算成本增加约2-5万元/年",
      difficulty: "medium",
      timeline: "3个月内"
    })
  }

  if (!company.hasExportLicense && company.annualExportVolume > 50) {
    suggestions.push({
      id: "sug-license-001",
      priority: "urgent",
      title: "办理进出口经营权",
      description: "年出口额超50万美元，建议立即办理对外贸易经营者备案和海关备案，结束买单出口或挂靠出口的违规状态。",
      expectedBenefit: "合规经营+享受出口退税+避免处罚",
      estimatedCost: "办理费用约2000元",
      difficulty: "easy",
      timeline: "2周内"
    })
  }

  const amazonStores = company.platformStores.filter(s => s.platform === "amazon")
  const euStores = amazonStores.filter(s => ["DE", "FR", "IT", "ES", "GB"].includes(s.registrationCountry))
  if (euStores.length > 0) {
    suggestions.push({
      id: "sug-vat-001",
      priority: "important",
      title: "注册欧洲VAT并使用IOSS/OSS简化申报",
      description: `在${euStores.length}个欧洲站点销售，建议注册各国VAT并使用Import One-Stop Shop (IOSS) 简化清关和VAT申报流程。`,
      expectedBenefit: "避免封店风险+简化税务流程+节省税务代理费用",
      estimatedCost: "各国VAT注册费约5000-20000元/国，年申报费约5000-15000元/国",
      difficulty: "medium",
      timeline: "6个月内"
    })
  }

  const fourFlowDim = dimensions.find(d => d.dimensionId === "four_flow_consistency")
  if (fourFlowDim && fourFlowDim.score < 70) {
    suggestions.push({
      id: "sug-flow-001",
      priority: "important",
      title: "建立四流一致管理制度",
      description: "四流一致性评分较低，建议建立四流匹配台账制度，每笔出口业务确保合同、物流、发票、资金四流一致。",
      expectedBenefit: "确保进项抵扣和出口退税合规+避免虚开认定",
      estimatedCost: "制度建设成本约1-3万元",
      difficulty: "medium",
      timeline: "3个月内"
    })
  }

  if (!company.hasDedicatedTaxAccountant && company.annualExportVolume > 200) {
    suggestions.push({
      id: "sug-staff-001",
      priority: "suggested",
      title: "配备专职税务会计",
      description: "年出口额超200万美元，税务复杂度较高，建议配备专职税务会计或选择专业的跨境电商税务服务机构。",
      expectedBenefit: "及时应对税务政策变化+降低稽查风险",
      estimatedCost: "年薪约8-15万元或服务费约3-8万元/年",
      difficulty: "easy",
      timeline: "6个月内"
    })
  }

  suggestions.push({
    id: "sug-burden-001",
    priority: "suggested",
    title: "定期进行税负率分析",
    description: "建议每季度对比实际税负率与行业平均税负率（卫浴出口型0.5%-2.0%），偏离行业均值超30%时主动排查原因。",
    expectedBenefit: "及时发现税务异常+避免税负率异常触发预警",
    estimatedCost: "分析工作约0.5天/季度",
    difficulty: "easy",
    timeline: "持续进行"
  })

  return suggestions
}

export { dimensions }
