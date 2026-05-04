"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { DeclarationModeMatchResult, BathroomProductCategory, ExportChannel } from "@/lib/tax/types"

const PRODUCT_OPTIONS = [
  { value: "toilet" as BathroomProductCategory, label: "马桶" },
  { value: "bathroom_cabinet" as BathroomProductCategory, label: "浴室柜" },
  { value: "shower_room" as BathroomProductCategory, label: "淋浴房" },
  { value: "shower_head" as BathroomProductCategory, label: "花洒" },
  { value: "faucet" as BathroomProductCategory, label: "水龙头" },
  { value: "hardware_fittings" as BathroomProductCategory, label: "五金配件" },
]

const COUNTRY_OPTIONS = [
  { value: "US", label: "美国" },
  { value: "DE", label: "德国" },
  { value: "GB", label: "英国" },
  { value: "FR", label: "法国" },
  { value: "JP", label: "日本" },
  { value: "AU", label: "澳大利亚" },
  { value: "SA", label: "沙特" },
  { value: "AE", label: "阿联酋" },
]

export function DeclarationModeCard() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DeclarationModeMatchResult | null>(null)
  const [form, setForm] = useState({
    productCategory: "toilet" as BathroomProductCategory,
    destinationCountry: "US",
    estimatedAnnualVolume: 100,
    hasOverseasWarehouse: false,
    overseasWarehouseCountry: "",
    isB2B: true,
    isB2C: false,
    hasPlatformStore: false,
    platformType: "" as ExportChannel | "",
    buyerType: "wholesaler" as string,
  })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/tax/declaration-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyProfile: {
            taxpayerType: "general",
            hasExportLicense: true,
            hasCustomsDeclaration: true,
            annualExportVolume: form.estimatedAnnualVolume,
            mainProducts: [form.productCategory],
          },
          exportDetails: form
        })
      })
      const data = await res.json()
      if (data.success) setResult(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const modeLabels: Record<string, string> = {
    "9710": "9710 B2B直接出口",
    "9810": "9810 海外仓出口",
    "0110": "0110 一般贸易",
    "1039": "1039 市场采购"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>报关模式智能匹配</CardTitle>
          <CardDescription>根据企业信息和出口详情，推荐最优报关模式</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">产品品类</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={form.productCategory}
                onChange={e => setForm(prev => ({ ...prev, productCategory: e.target.value as BathroomProductCategory }))}
              >
                {PRODUCT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">目标国家</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={form.destinationCountry}
                onChange={e => setForm(prev => ({ ...prev, destinationCountry: e.target.value }))}
              >
                {COUNTRY_OPTIONS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">年预计出口额（万美元）</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={form.estimatedAnnualVolume}
                onChange={e => setForm(prev => ({ ...prev, estimatedAnnualVolume: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">买家类型</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={form.buyerType}
                onChange={e => setForm(prev => ({ ...prev, buyerType: e.target.value }))}
              >
                <option value="wholesaler">批发商</option>
                <option value="distributor">经销商</option>
                <option value="retailer">零售商</option>
                <option value="end_user">终端消费者</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={form.hasOverseasWarehouse}
                onChange={e => setForm(prev => ({ ...prev, hasOverseasWarehouse: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm">有海外仓</span>
            </label>
            {form.hasOverseasWarehouse && (
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm ml-7"
                value={form.overseasWarehouseCountry}
                onChange={e => setForm(prev => ({ ...prev, overseasWarehouseCountry: e.target.value }))}
              >
                <option value="">选择海外仓所在国</option>
                {COUNTRY_OPTIONS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            )}
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={form.isB2B}
                onChange={e => setForm(prev => ({ ...prev, isB2B: e.target.checked, isB2C: !e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm">B2B交易</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={form.hasPlatformStore}
                onChange={e => setForm(prev => ({ ...prev, hasPlatformStore: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm">有平台店铺</span>
            </label>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "匹配中..." : "开始匹配"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-700">推荐方案</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-green-600">
                  {modeLabels[result.recommendedMode] || result.recommendedMode}
                </div>
                <p className="text-sm text-gray-600 mt-2">{result.analysis}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>退税资格评估</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">退税资格：</span>
                <Badge variant={result.taxRefundEligibility.eligible ? "success" : "danger"}>
                  {result.taxRefundEligibility.eligible ? "具备资格" : "不具备资格"}
                </Badge>
              </div>
              <div className="text-sm">
                <p>预计退税率：<strong>{result.taxRefundEligibility.estimatedRefundRate}%</strong></p>
                <p>预计年退税额：<strong>{result.taxRefundEligibility.estimatedAnnualRefund.toLocaleString()}万元</strong></p>
              </div>
              {result.taxRefundEligibility.conditions.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">满足条件：</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {result.taxRefundEligibility.conditions.map((c, i) => (
                      <li key={i} className="flex items-center gap-1">✅ {c}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.taxRefundEligibility.gaps.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-600 mb-1">不满足条件：</p>
                  <ul className="text-xs text-red-500 space-y-1">
                    {result.taxRefundEligibility.gaps.map((g, i) => (
                      <li key={i} className="flex items-center gap-1">❌ {g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>备选方案对比</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.alternatives.map(alt => (
                <div key={alt.mode} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{modeLabels[alt.mode] || alt.mode}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">匹配度</span>
                      <span className="text-sm font-bold">{alt.suitability}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{alt.reason}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-medium text-green-600 mb-1">优势：</p>
                      <ul className="space-y-0.5 text-gray-600">
                        {alt.pros.map((p, i) => (
                          <li key={i} className="flex items-start gap-1">• {p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-red-600 mb-1">劣势：</p>
                      <ul className="space-y-0.5 text-gray-600">
                        {alt.cons.map((c, i) => (
                          <li key={i} className="flex items-start gap-1">• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
