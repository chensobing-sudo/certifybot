"use client";

import { ShieldCheck, FileText, Globe, Zap } from "lucide-react";
import ProductForm from "@/components/compliance/product-form";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex flex-col items-center px-4 py-8 sm:py-12 sm:px-6 pb-safe-mobile">
      {/* Hero */}
      <div className="text-center mb-8 sm:mb-10 max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-light)] px-3 sm:px-4 py-1 sm:py-1.5 mb-3 sm:mb-4">
          <ShieldCheck className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[var(--accent)]" />
          <span className="text-[10px] sm:text-xs font-medium text-[var(--accent)]">
            亚马逊卫浴合规 AI Agent
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text)] mb-2 sm:mb-3">
          ComplianceGuard
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)]">
          输入产品参数，分钟级输出多国合规路径与认证清单
        </p>
      </div>

      {/* Product Form */}
      <ProductForm />

      {/* Features */}
      <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl w-full">
        {[
          {
            icon: Globe,
            title: "5 大市场覆盖",
            desc: "美国 · 欧盟 · 加州 · 英国 · 澳大利亚",
          },
          {
            icon: Zap,
            title: "AI 决策树引擎",
            desc: "材质 × 产品类型 × 市场交叉判断合规需求",
          },
          {
            icon: FileText,
            title: "完整操作清单",
            desc: "认证机构 · 费用估算 · 申请步骤 · 时间线",
          },
        ].map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 text-center card-hover active:scale-[0.97] transition-transform"
            >
              <div className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-[var(--accent-light)] mb-2 sm:mb-3">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--accent)]" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-[var(--text)] mb-0.5 sm:mb-1">
                {feature.title}
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--muted)]">{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
