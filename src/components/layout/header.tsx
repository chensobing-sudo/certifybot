"use client"

import Link from "next/link"
import { Shield, MessageSquareHeart, FileSearch, Receipt } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">CertifyBot</span>
            <span className="ml-2 text-xs text-gray-500">出口合规通</span>
          </div>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            首页
          </Link>
          <Link
            href="/report"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FileSearch className="h-3.5 w-3.5" />
            合规报告
          </Link>
          <Link
            href="/tax"
            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            <Receipt className="h-3.5 w-3.5" />
            税务合规
          </Link>
          <Link
            href="/feedback"
            className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3.5 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
          >
            <MessageSquareHeart className="h-3.5 w-3.5" />
            反馈
          </Link>
        </nav>
      </div>
    </header>
  )
}
