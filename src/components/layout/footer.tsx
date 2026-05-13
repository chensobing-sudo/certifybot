"use client"

import Link from "next/link"
import { useState } from "react"
import { Shield, ChevronDown, MessageSquareHeart } from "lucide-react"

const FOOTER_LINKS = [
  {
    title: "快速链接",
    items: [
      { label: "首页", href: "/" },
      { label: "合规报告", href: "/report" },
      { label: "税务合规", href: "/tax" },
      { label: "MD 格式免费转换", href: "https://md-tools-site.vercel.app/", external: true },
    ],
  },
  {
    title: "关于",
    items: [
      { label: "反馈建议", href: "/feedback" },
      { label: "数据来源: IAPMO", href: "#", external: true },
    ],
  },
]

function CollapsibleSection({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="collapse-header w-full"
      >
        <span className="text-sm font-semibold text-[var(--text)]">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-[var(--muted)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className="collapse-body"
        style={{
          maxHeight: open ? "200px" : "0",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="pb-2 space-y-2">
          {children}
        </div>
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] pb-safe">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Desktop: 3-col grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-[var(--text)]">CertifyBot</span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              卫浴/五金出口合规 AI Agent — 标准查询 · 税务合规 · 智能报告
            </p>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.label}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile: accordion */}
        <div className="md:hidden divide-y divide-[var(--border)]">
          <CollapsibleSection title="快速链接">
            {FOOTER_LINKS[0].items.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors py-1.5"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors py-1.5"
                >
                  {item.label}
                </Link>
              )
            )}
          </CollapsibleSection>

          <CollapsibleSection title="关于">
            {FOOTER_LINKS[1].items.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors py-1.5"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors py-1.5"
                >
                  {item.label}
                </Link>
              )
            )}
          </CollapsibleSection>

          {/* Brand info in mobile */}
          <div className="pt-4 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <Shield className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-[var(--text)]">CertifyBot</span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              卫浴/五金出口合规 AI Agent
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <p className="text-[10px] text-center text-[var(--muted)]">
            &copy; {new Date().getFullYear()} CertifyBot. 数据来源 IAPMO，仅供参考。
          </p>
        </div>
      </div>
    </footer>
  )
}
