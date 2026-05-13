"use client"

import { useState } from "react"
import { TaxHealthForm } from "@/components/tax/tax-health-form"
import { DeclarationModeCard } from "@/components/tax/declaration-mode-card"
import { TaxKnowledgePanel } from "@/components/tax/tax-knowledge-panel"
import { Receipt, Search, BookOpen, FileSearch } from "lucide-react"

type Tab = "health-check" | "declaration" | "knowledge"

export function TaxClient() {
  const [activeTab, setActiveTab] = useState<Tab>("health-check")

  const tabs: { key: Tab; label: string; description: string; icon: typeof Receipt }[] = [
    { key: "health-check", label: "税务合规体检", description: "一键自查税务风险", icon: Receipt },
    { key: "declaration", label: "报关模式匹配", description: "智能推荐最优报关方式", icon: FileSearch },
    { key: "knowledge", label: "税务知识库", description: "案例·法规·VAT指引·HS编码", icon: BookOpen },
  ]

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-50 to-white pb-safe-mobile">
      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 py-5 sm:py-8 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm">
              T
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-[var(--text)]">税务合规</h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">卫浴行业跨境电商出口税务合规智能助手</p>
            </div>
          </div>

          {/* Tab navigation - mobile: horizontal scroll, desktop: flex */}
          <div className="flex gap-2 mt-4 sm:mt-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0
                    ${isActive
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 shadow-sm"
                      : "text-[var(--text-secondary)] hover:bg-gray-100 hover:text-[var(--text)]"
                    }
                  `}
                >
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? "text-emerald-600" : "text-[var(--muted)]"}`} />
                  <div className="text-left">
                    <div>{tab.label}</div>
                    <div className="text-[9px] sm:text-[10px] font-normal opacity-70">{tab.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 sm:px-6">
        {activeTab === "health-check" && <TaxHealthForm />}
        {activeTab === "declaration" && <DeclarationModeCard />}
        {activeTab === "knowledge" && <TaxKnowledgePanel />}
      </div>
    </div>
  )
}
