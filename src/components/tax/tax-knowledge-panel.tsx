"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { taxRiskCases, taxKnowledgeEntries, overseasVATGuides, hsCodeTable } from "@/data/tax/tax-knowledge-base"
import type { TaxIssueCategory } from "@/lib/tax/types"

const CATEGORY_LABELS: Record<TaxIssueCategory, string> = {
  export_tax_refund: "出口退税",
  invoice_compliance: "发票合规",
  four_flow_consistency: "四流一致",
  private_account: "私户收款",
  customs_code: "商品编码",
  taxpayer_identity: "纳税人身份",
  overseas_vat: "海外VAT",
  golden_tax_phase4: "金税四期",
  declaration_mode: "报关模式",
  transfer_pricing: "转让定价",
  document_compliance: "单证合规",
  general: "通用",
}

const CATEGORY_COLORS: Record<TaxIssueCategory, string> = {
  export_tax_refund: "bg-red-50 border-red-200",
  invoice_compliance: "bg-yellow-50 border-yellow-200",
  four_flow_consistency: "bg-orange-50 border-orange-200",
  private_account: "bg-red-50 border-red-200",
  customs_code: "bg-blue-50 border-blue-200",
  taxpayer_identity: "bg-purple-50 border-purple-200",
  overseas_vat: "bg-green-50 border-green-200",
  golden_tax_phase4: "bg-pink-50 border-pink-200",
  declaration_mode: "bg-indigo-50 border-indigo-200",
  transfer_pricing: "bg-teal-50 border-teal-200",
  document_compliance: "bg-cyan-50 border-cyan-200",
  general: "bg-gray-50 border-gray-200",
}

type Tab = "cases" | "knowledge" | "vat" | "hscode"

export function TaxKnowledgePanel() {
  const [activeTab, setActiveTab] = useState<Tab>("cases")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<TaxIssueCategory | "all">("all")

  const tabs: { key: Tab; label: string }[] = [
    { key: "cases", label: "风险案例" },
    { key: "knowledge", label: "知识词条" },
    { key: "vat", label: "海外VAT指引" },
    { key: "hscode", label: "HS编码对照" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b pb-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
          placeholder="搜索关键词..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {activeTab === "cases" && (
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as TaxIssueCategory | "all")}
          >
            <option value="all">全部分类</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        )}
      </div>

      {activeTab === "cases" && <CasesPanel searchQuery={searchQuery} selectedCategory={selectedCategory} />}
      {activeTab === "knowledge" && <KnowledgePanel searchQuery={searchQuery} />}
      {activeTab === "vat" && <VATPanel searchQuery={searchQuery} />}
      {activeTab === "hscode" && <HSCodePanel searchQuery={searchQuery} />}
    </div>
  )
}

function CasesPanel({ searchQuery, selectedCategory }: { searchQuery: string; selectedCategory: TaxIssueCategory | "all" }) {
  const filtered = taxRiskCases.filter(c => {
    const matchSearch = !searchQuery || c.title.includes(searchQuery) || c.scenario.includes(searchQuery) || c.lesson.includes(searchQuery)
    const matchCategory = selectedCategory === "all" || c.category === selectedCategory
    return matchSearch && matchCategory
  })

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">共 {filtered.length} 个案例</p>
      {filtered.map(caseItem => (
        <Card key={caseItem.id} className={CATEGORY_COLORS[caseItem.category]}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={caseItem.severity === "critical" ? "danger" : caseItem.severity === "high" ? "warning" : "info"}>
                {caseItem.severity === "critical" ? "重大" : caseItem.severity === "high" ? "高危" : "警示"}
              </Badge>
              <Badge variant="info">{CATEGORY_LABELS[caseItem.category]}</Badge>
              <span className="text-xs text-gray-400">{caseItem.year}年 · {caseItem.region}</span>
            </div>
            <CardTitle className="text-base">{caseItem.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <span className="font-medium text-gray-700">场景：</span>
              <span className="text-gray-600">{caseItem.scenario}</span>
            </div>
            <div>
              <span className="font-medium text-red-600">违规：</span>
              <span className="text-gray-600">{caseItem.violation}</span>
            </div>
            <div>
              <span className="font-medium text-red-600">处罚：</span>
              <span className="text-gray-600">{caseItem.penalty}</span>
            </div>
            <div>
              <span className="font-medium text-green-600">教训：</span>
              <span className="text-gray-600">{caseItem.lesson}</span>
            </div>
            <div className="pt-2">
              <span className="font-medium text-sm">预防措施：</span>
              <ul className="mt-1 space-y-1">
                {caseItem.prevention.map((p, i) => (
                  <li key={i} className="flex items-start gap-1 text-xs text-gray-500">✅ {p}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function KnowledgePanel({ searchQuery }: { searchQuery: string }) {
  const filtered = taxKnowledgeEntries.filter(e =>
    !searchQuery || e.title.includes(searchQuery) || e.summary.includes(searchQuery) || e.tags.some(t => t.includes(searchQuery))
  )

  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">共 {filtered.length} 条知识</p>
      {filtered.map(entry => (
        <Card key={entry.id}>
          <CardHeader
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
          >
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="info">{CATEGORY_LABELS[entry.category]}</Badge>
              {entry.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
            <CardTitle className="text-base">{entry.title}</CardTitle>
            <CardDescription>{entry.summary}</CardDescription>
          </CardHeader>
          {expandedId === entry.id && (
            <CardContent className="text-sm space-y-3 border-t pt-4">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-600">
                {entry.content}
              </div>
              <div>
                <span className="font-medium text-sm">法规依据：</span>
                <ul className="mt-1 space-y-1">
                  {entry.regulations.map((reg, i) => (
                    <li key={i} className="text-xs text-blue-600">📜 {reg}</li>
                  ))}
                </ul>
              </div>
              <div className="text-xs text-gray-400">
                适用场景：{entry.applicableScenarios.join("、")} · 最后更新：{entry.lastUpdated}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}

function VATPanel({ searchQuery }: { searchQuery: string }) {
  const filtered = overseasVATGuides.filter(g =>
    !searchQuery || g.country.includes(searchQuery) || g.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const [expandedCountry, setExpandedCountry] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">共 {filtered.length} 个国家/地区</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(guide => (
          <Card
            key={guide.countryCode}
            className={`cursor-pointer transition-colors ${expandedCountry === guide.countryCode ? "ring-2 ring-blue-300" : ""}`}
            onClick={() => setExpandedCountry(expandedCountry === guide.countryCode ? null : guide.countryCode)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{guide.country} ({guide.countryCode})</CardTitle>
                <div className="text-right">
                  <div className="text-lg font-bold">{guide.vatRate}%</div>
                  <div className="text-xs text-gray-500">VAT/GST</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-500">关税：</span>{guide.dutyRate}%</div>
                <div><span className="text-gray-500">申报频率：</span>
                  {guide.filingFrequency === "monthly" ? "月度" : guide.filingFrequency === "quarterly" ? "季度" : "年度"}
                </div>
                <div><span className="text-gray-500">注册阈值：</span>{guide.registrationThreshold.toLocaleString()}</div>
                <div><span className="text-gray-500">免税阈值：</span>{guide.dutyFreeThreshold.toLocaleString()}</div>
              </div>
              {guide.taxRepresentativeRequired && (
                <div className="mt-2">
                  <Badge variant="warning">须指定税务代表</Badge>
                </div>
              )}
            </CardContent>
            {expandedCountry === guide.countryCode && (
              <CardContent className="border-t pt-3 space-y-3 text-xs">
                <div>
                  <span className="font-medium">特殊规则：</span>
                  <ul className="mt-1 space-y-1">
                    {guide.specialRules.map((r, i) => (
                      <li key={i} className="text-gray-600">• {r}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-red-600">常见错误：</span>
                  <ul className="mt-1 space-y-1">
                    {guide.commonMistakes.map((m, i) => (
                      <li key={i} className="text-gray-600">• {m}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-green-600">建议：</span>
                  <ul className="mt-1 space-y-1">
                    {guide.tips.map((t, i) => (
                      <li key={i} className="text-gray-600">• {t}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

function HSCodePanel({ searchQuery }: { searchQuery: string }) {
  const filtered = hsCodeTable.filter(h =>
    !searchQuery || h.productName.includes(searchQuery) || h.hsCode.includes(searchQuery)
  )

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">共 {filtered.length} 条编码</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-3 py-2 font-medium">HS编码</th>
              <th className="text-left px-3 py-2 font-medium">产品名称</th>
              <th className="text-left px-3 py-2 font-medium">退税率</th>
              <th className="text-left px-3 py-2 font-medium">进口关税</th>
              <th className="text-left px-3 py-2 font-medium">备注</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((h, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 font-mono text-blue-600">{h.hsCode}</td>
                <td className="px-3 py-2">{h.productName}</td>
                <td className="px-3 py-2">
                  <Badge variant="success">{h.exportTaxRebateRate}%</Badge>
                </td>
                <td className="px-3 py-2">{h.importTariffRate}%</td>
                <td className="px-3 py-2 text-xs text-gray-500">{h.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
