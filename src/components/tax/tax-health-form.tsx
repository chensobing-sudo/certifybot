"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type {
  CompanyProfile, TaxpayerType, BathroomProductCategory,
  ExportChannel, CustomsDeclarationMode, BookkeepingMethod,
  InvoiceIssuanceMethod, SupplyChainStructure
} from "@/lib/tax/types"
import type { TaxHealthCheckResult } from "@/lib/tax/types"

const PRODUCT_OPTIONS: { value: BathroomProductCategory; label: string }[] = [
  { value: "toilet", label: "马桶" },
  { value: "bathroom_cabinet", label: "浴室柜" },
  { value: "shower_room", label: "淋浴房" },
  { value: "shower_head", label: "花洒" },
  { value: "faucet", label: "水龙头" },
  { value: "kitchen_sink", label: "水槽" },
  { value: "bath_tub", label: "浴缸" },
  { value: "hardware_fittings", label: "五金配件" },
  { value: "bidet", label: "智能马桶盖" },
  { value: "towel_rack", label: "毛巾架" },
  { value: "mirror", label: "浴室镜" },
  { value: "other", label: "其他" },
]

const EXPORT_CHANNEL_OPTIONS: { value: ExportChannel; label: string }[] = [
  { value: "amazon", label: "Amazon" },
  { value: "ebay", label: "eBay" },
  { value: "walmart", label: "Walmart" },
  { value: "shopify_independent_station", label: "Shopify独立站" },
  { value: "alibaba_international", label: "阿里国际站" },
  { value: "made_in_china", label: "中国制造网" },
  { value: "overseas_warehouse", label: "海外仓" },
  { value: "general_trade_b2b", label: "一般贸易B2B" },
  { value: "cross_border_b2b", label: "跨境B2B" },
]

const COUNTRY_OPTIONS = [
  { value: "US", label: "美国" },
  { value: "DE", label: "德国" },
  { value: "GB", label: "英国" },
  { value: "FR", label: "法国" },
  { value: "IT", label: "意大利" },
  { value: "JP", label: "日本" },
  { value: "SA", label: "沙特阿拉伯" },
  { value: "AE", label: "阿联酋" },
  { value: "AU", label: "澳大利亚" },
  { value: "CA", label: "加拿大" },
]

export function TaxHealthForm() {
  const [step, setStep] = useState<"form" | "result">("form")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TaxHealthCheckResult | null>(null)
  const [form, setForm] = useState<CompanyProfile>({
    companyName: "",
    unifiedSocialCreditCode: "",
    taxpayerType: "small_scale",
    registeredCapital: 100,
    exportStartYear: new Date().getFullYear(),
    annualExportVolume: 100,
    mainProducts: [],
    exportChannels: [],
    hasExportLicense: false,
    hasCustomsDeclaration: false,
    customsDeclarationMode: "unknown",
    hasForeignWarehouse: false,
    foreignWarehouseCountries: [],
    platformStores: [],
    hasDedicatedTaxAccountant: false,
    bookkeepingMethod: "agency_bookkeeping",
    invoiceIssuanceMethod: "self_issuance",
    supplyChainStructure: "pure_trading",
  })

  const [newStore, setNewStore] = useState({ platform: "amazon" as ExportChannel, storeName: "", annualRevenue: 0, registrationCountry: "US" })

  const updateForm = <K extends keyof CompanyProfile>(key: K, value: CompanyProfile[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const toggleProduct = (product: BathroomProductCategory) => {
    setForm(prev => ({
      ...prev,
      mainProducts: prev.mainProducts.includes(product)
        ? prev.mainProducts.filter(p => p !== product)
        : [...prev.mainProducts, product]
    }))
  }

  const toggleChannel = (channel: ExportChannel) => {
    setForm(prev => ({
      ...prev,
      exportChannels: prev.exportChannels.includes(channel)
        ? prev.exportChannels.filter(c => c !== channel)
        : [...prev.exportChannels, channel]
    }))
  }

  const addStore = () => {
    if (newStore.storeName) {
      setForm(prev => ({
        ...prev,
        platformStores: [...prev.platformStores, { ...newStore, annualRevenue: newStore.annualRevenue }]
      }))
      setNewStore({ platform: "amazon", storeName: "", annualRevenue: 0, registrationCountry: "US" })
    }
  }

  const removeStore = (index: number) => {
    setForm(prev => ({
      ...prev,
      platformStores: prev.platformStores.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/tax/health-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: form })
      })
      const data = await res.json()
      if (data.success) {
        setResult(data.data)
        setStep("result")
      }
    } catch (err) {
      console.error("体检失败:", err)
    } finally {
      setLoading(false)
    }
  }

  if (step === "result" && result) {
    return <TaxHealthResult result={result} onBack={() => setStep("form")} />
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>企业基本信息</CardTitle>
          <CardDescription>填写企业基础信息，用于税务合规评估</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">企业名称</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="如：佛山市XX卫浴有限公司"
                value={form.companyName}
                onChange={e => updateForm("companyName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">统一社会信用代码</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="18位统一信用代码"
                value={form.unifiedSocialCreditCode}
                onChange={e => updateForm("unifiedSocialCreditCode", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">纳税人身份</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={form.taxpayerType}
                onChange={e => updateForm("taxpayerType", e.target.value as TaxpayerType)}
              >
                <option value="small_scale">小规模纳税人</option>
                <option value="general">一般纳税人</option>
                <option value="unregistered">未登记</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">注册资本（万元）</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={form.registeredCapital}
                onChange={e => updateForm("registeredCapital", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">首次出口年份</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={form.exportStartYear}
                onChange={e => updateForm("exportStartYear", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">年出口额（万美元）</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={form.annualExportVolume}
                onChange={e => updateForm("annualExportVolume", Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>主营产品与出口渠道</CardTitle>
          <CardDescription>选择企业主营的卫浴品类和出口渠道</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">主营卫浴品类（可多选）</label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => toggleProduct(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    form.mainProducts.includes(opt.value)
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">出口渠道（可多选）</label>
            <div className="flex flex-wrap gap-2">
              {EXPORT_CHANNEL_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => toggleChannel(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    form.exportChannels.includes(opt.value)
                      ? "bg-green-50 border-green-300 text-green-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>经营资质与合规状态</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={form.hasExportLicense}
                onChange={e => updateForm("hasExportLicense", e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">已办理进出口经营权</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={form.hasCustomsDeclaration}
                onChange={e => updateForm("hasCustomsDeclaration", e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">自行报关</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={form.hasForeignWarehouse}
                onChange={e => updateForm("hasForeignWarehouse", e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">有海外仓</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={form.hasDedicatedTaxAccountant}
                onChange={e => updateForm("hasDedicatedTaxAccountant", e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">有专职税务会计</span>
            </label>
          </div>

          {form.hasForeignWarehouse && (
            <div>
              <label className="block text-sm font-medium mb-2">海外仓所在国家</label>
              <div className="flex flex-wrap gap-2">
                {COUNTRY_OPTIONS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => {
                      const countries = form.foreignWarehouseCountries.includes(c.value)
                        ? form.foreignWarehouseCountries.filter(cc => cc !== c.value)
                        : [...form.foreignWarehouseCountries, c.value]
                      updateForm("foreignWarehouseCountries", countries)
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                      form.foreignWarehouseCountries.includes(c.value)
                        ? "bg-purple-50 border-purple-300 text-purple-700"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">记账方式</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={form.bookkeepingMethod}
                onChange={e => updateForm("bookkeepingMethod", e.target.value as BookkeepingMethod)}
              >
                <option value="in_house_full_time">自有全职会计</option>
                <option value="in_house_part_time">自有兼职会计</option>
                <option value="agency_bookkeeping">代理记账</option>
                <option value="no_bookkeeping">未记账</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">开票方式</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={form.invoiceIssuanceMethod}
                onChange={e => updateForm("invoiceIssuanceMethod", e.target.value as InvoiceIssuanceMethod)}
              >
                <option value="self_issuance">自开票</option>
                <option value="tax_bureau_agent">税务局代开</option>
                <option value="no_issuance">不开票</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">供应链结构</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={form.supplyChainStructure}
                onChange={e => updateForm("supplyChainStructure", e.target.value as SupplyChainStructure)}
              >
                <option value="self_production_full">自有工厂全链条</option>
                <option value="self_production_partial">自有工厂部分工序</option>
                <option value="outsourcing_assembly">外协组装</option>
                <option value="pure_trading">纯贸易商</option>
                <option value="platform_only">仅平台销售</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">报关模式</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={form.customsDeclarationMode}
                onChange={e => updateForm("customsDeclarationMode", e.target.value as CustomsDeclarationMode)}
              >
                <option value="unknown">未确定</option>
                <option value="9710">9710 B2B直接出口</option>
                <option value="9810">9810 海外仓出口</option>
                <option value="0110">0110 一般贸易</option>
                <option value="1039">1039 市场采购</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>平台店铺信息</CardTitle>
          <CardDescription>添加企业在各平台的店铺信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.platformStores.map((store, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Badge variant="info">{store.platform}</Badge>
              <span className="text-sm flex-1">{store.storeName}</span>
              <span className="text-sm text-gray-500">{store.registrationCountry}</span>
              <span className="text-sm text-gray-500">{store.annualRevenue}万美元/年</span>
              <button onClick={() => removeStore(i)} className="text-red-500 text-xs hover:text-red-700">删除</button>
            </div>
          ))}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <select
              className="px-3 py-2 border rounded-lg text-sm"
              value={newStore.platform}
              onChange={e => setNewStore(prev => ({ ...prev, platform: e.target.value as ExportChannel }))}
            >
              {EXPORT_CHANNEL_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input
              type="text"
              className="px-3 py-2 border rounded-lg text-sm"
              placeholder="店铺名称"
              value={newStore.storeName}
              onChange={e => setNewStore(prev => ({ ...prev, storeName: e.target.value }))}
            />
            <select
              className="px-3 py-2 border rounded-lg text-sm"
              value={newStore.registrationCountry}
              onChange={e => setNewStore(prev => ({ ...prev, registrationCountry: e.target.value }))}
            >
              {COUNTRY_OPTIONS.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <input
              type="number"
              className="px-3 py-2 border rounded-lg text-sm"
              placeholder="年营收（万美元）"
              value={newStore.annualRevenue || ""}
              onChange={e => setNewStore(prev => ({ ...prev, annualRevenue: Number(e.target.value) }))}
            />
            <Button onClick={addStore} variant="outline" size="sm">添加店铺</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={loading || !form.companyName}
          size="lg"
        >
          {loading ? "体检分析中..." : "开始税务合规体检"}
        </Button>
      </div>
    </div>
  )
}

function TaxHealthResult({ result, onBack }: { result: TaxHealthCheckResult; onBack: () => void }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getProgressVariant = (score: number) => {
    if (score >= 80) return "success" as const
    if (score >= 60) return "default" as const
    return "warning" as const
  }

  const getRiskBadge = (risk: string) => {
    const map: Record<string, { variant: "danger" | "warning" | "info" | "success"; label: string }> = {
      critical: { variant: "danger", label: "紧急" },
      high: { variant: "warning", label: "高危" },
      medium: { variant: "info", label: "中危" },
      low: { variant: "info", label: "低危" },
      safe: { variant: "success", label: "安全" },
    }
    return map[risk] || { variant: "info", label: risk }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">税务合规体检报告</h2>
          <p className="text-sm text-gray-500">生成时间：{new Date(result.timestamp).toLocaleString("zh-CN")}</p>
        </div>
        <Button onClick={onBack} variant="outline" size="sm">重新体检</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}>
              {result.overallScore}
            </div>
            <div className="text-sm text-gray-500 mt-1">综合评分</div>
            <Badge variant={getRiskBadge(result.overallRisk).variant} className="mt-2">
              {getRiskBadge(result.overallRisk).label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>各维度评分</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.dimensions.map(dim => (
            <div key={dim.dimensionId}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{dim.dimensionName}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${getScoreColor(dim.score)}`}>{dim.score}分</span>
                  <Badge variant={getRiskBadge(dim.risk).variant}>
                    {getRiskBadge(dim.risk).label}
                  </Badge>
                </div>
              </div>
              <Progress value={dim.score} variant={getProgressVariant(dim.score)} />
              {dim.issues.length > 0 && (
                <div className="mt-1 text-xs text-gray-500">
                  {dim.issues.length}个问题
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {result.criticalIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">⚠ 紧急问题（{result.criticalIssues.length}项）</CardTitle>
            <CardDescription>这些问题须立即处理，否则将面临严重处罚</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.criticalIssues.map(issue => (
              <div key={issue.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Badge variant="danger">紧急</Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{issue.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{issue.description}</p>
                    <div className="mt-2 text-xs space-y-1">
                      <p><span className="font-medium">依据：</span>{issue.regulation}</p>
                      <p><span className="font-medium text-red-600">处罚：</span>{issue.penalty}</p>
                      <p><span className="font-medium text-green-600">建议：</span>{issue.suggestion}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {result.warnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600">⚠ 警告问题（{result.warnings.length}项）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.warnings.slice(0, 5).map(issue => (
              <div key={issue.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Badge variant={getRiskBadge(issue.risk).variant}>
                    {getRiskBadge(issue.risk).label}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{issue.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{issue.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
            {result.warnings.length > 5 && (
              <p className="text-xs text-gray-500 text-center">还有{result.warnings.length - 5}项警告...</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>改进建议</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.suggestions.map(sug => (
            <div key={sug.id} className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={
                  sug.priority === "urgent" ? "danger" :
                  sug.priority === "important" ? "warning" : "info"
                }>
                  {sug.priority === "urgent" ? "紧急" : sug.priority === "important" ? "重要" : "建议"}
                </Badge>
                <h4 className="font-medium text-sm">{sug.title}</h4>
              </div>
              <p className="text-xs text-gray-600">{sug.description}</p>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span>预期收益：{sug.expectedBenefit}</span>
                <span>预估成本：{sug.estimatedCost}</span>
                <span>难度：{sug.difficulty === "easy" ? "简单" : sug.difficulty === "medium" ? "中等" : "困难"}</span>
                <span>时间：{sug.timeline}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
