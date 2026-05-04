"use client"

import { useState } from "react"
import { TaxHealthForm } from "@/components/tax/tax-health-form"
import { DeclarationModeCard } from "@/components/tax/declaration-mode-card"
import { TaxKnowledgePanel } from "@/components/tax/tax-knowledge-panel"

type Tab = "health-check" | "declaration" | "knowledge"

export function TaxClient() {
  const [activeTab, setActiveTab] = useState<Tab>("health-check")

  const tabs: { key: Tab; label: string; description: string }[] = [
    { key: "health-check", label: "税务合规体检", description: "一键自查税务风险" },
    { key: "declaration", label: "报关模式匹配", description: "智能推荐最优报关方式" },
    { key: "knowledge", label: "税务知识库", description: "案例·法规·VAT指引·HS编码" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <div>
              <h1 className="text-2xl font-bold">税务合规</h1>
              <p className="text-sm text-gray-500">卫浴行业跨境电商出口税务合规智能助手</p>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div>{tab.label}</div>
                <div className="text-xs font-normal opacity-70">{tab.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "health-check" && <TaxHealthForm />}
        {activeTab === "declaration" && <DeclarationModeCard />}
        {activeTab === "knowledge" && <TaxKnowledgePanel />}
      </div>
    </div>
  )
}
