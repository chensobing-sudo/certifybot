"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Shield, MessageSquareHeart, FileSearch, Receipt, Menu, X, Home, Globe } from "lucide-react"

const NAV_ITEMS = [
  { href: "/", label: "首页", icon: Home },
  { href: "/compliance", label: "合规路径", icon: Globe },
  { href: "/report", label: "合规报告", icon: FileSearch },
  { href: "/tax", label: "税务合规", icon: Receipt },
  { href: "/feedback", label: "反馈", icon: MessageSquareHeart },
]

// 底部 Tab Bar 显示的 4 个工具
const TAB_ITEMS = [
  { href: "/", label: "首页", icon: Home },
  { href: "/compliance", label: "合规", icon: Globe },
  { href: "/report", label: "报告", icon: FileSearch },
  { href: "/tax", label: "税务", icon: Receipt },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* ===== 顶部导航栏 ===== */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-lg safe-area-top">
        <div className="mx-auto flex h-12 md:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm transition-transform group-hover:scale-105">
              <Shield className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base md:text-lg font-bold text-[var(--text)]">CertifyBot</span>
              <span className="hidden sm:inline text-[10px] md:text-xs text-[var(--muted)]">出口合规通</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[var(--accent-light)] text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:bg-gray-100 hover:text-[var(--text)]"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center rounded-lg p-2 text-[var(--text-secondary)] hover:bg-gray-100 transition-colors touch-target"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 space-y-1 animate-in slide-in-from-top-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-light)] text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:bg-gray-100"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </header>

      {/* ===== 移动端底部 Tab Bar ===== */}
      <nav className="md:hidden bottom-tab-bar">
        {TAB_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="bottom-tab-item"
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[var(--accent)]" />
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
