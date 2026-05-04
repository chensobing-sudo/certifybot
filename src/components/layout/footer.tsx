"use client"

import Link from "next/link"
import { MessageSquareHeart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <p className="text-sm text-gray-500">
              CertifyBot 出口合规通 — 卫浴/五金出口合规 AI Agent
            </p>
            <Link
              href="/feedback"
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-amber-600 transition-colors"
            >
              <MessageSquareHeart className="h-3 w-3" />
              提交反馈 · 帮助我们改进
            </Link>
          </div>
          <p className="text-xs text-gray-400">
            数据来源：IAPMO 实时数据 · 各国官方标准机构公开信息 · 仅供参考，不构成法律建议
          </p>
        </div>
      </div>
    </footer>
  )
}
