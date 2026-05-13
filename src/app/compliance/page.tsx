"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Building2,
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  Globe,
  Beaker,
  Droplets,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ComplianceResult, CompliancePath } from "@/data/compliance/decision-tree/rules";

const MARKET_LABELS: Record<string, string> = {
  US: "美国",
  EU: "欧盟",
  CA: "加州",
  UK: "英国",
  AU: "澳大利亚",
};

const PRIORITY_CONFIG = {
  critical: { label: "强制要求", color: "var(--red)", bg: "bg-[var(--red-light)]", border: "border-red-200", icon: XCircle },
  recommended: { label: "建议办理", color: "var(--yellow)", bg: "bg-[var(--yellow-light)]", border: "border-yellow-200", icon: AlertTriangle },
  optional: { label: "可选提升", color: "var(--green)", bg: "bg-[var(--green-light)]", border: "border-green-200", icon: CheckCircle2 },
};

function PathCard({ path, defaultOpen }: { path: CompliancePath; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const config = PRIORITY_CONFIG[path.priority];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-xl border ${path.alreadyHeld ? "border-[var(--green)] bg-[var(--green-light)]/30" : config.border} bg-[var(--surface)] overflow-hidden transition-all`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 px-4 py-3.5 text-left"
      >
        <span className="mt-0.5">
          {path.alreadyHeld ? (
            <CheckCircle2 className="h-5 w-5 text-[var(--green)]" />
          ) : (
            <Icon className="h-5 w-5" style={{ color: config.color }} />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[var(--text)]">{path.certName}</span>
            {path.alreadyHeld && (
              <span className="inline-flex items-center rounded-full bg-[var(--green-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--green)]">
                已持有
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
              <Globe className="h-3 w-3" />
              {MARKET_LABELS[path.market] ?? path.market}
            </span>
            <span className="text-[10px] text-[var(--muted)]">{path.agency}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs font-semibold text-[var(--text)]">{path.fee}</div>
          <div className="text-[10px] text-[var(--muted)]">{path.timeline}</div>
        </div>
        <div className="shrink-0 self-center">
          {open ? <ChevronUp className="h-4 w-4 text-[var(--muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--muted)]" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-0 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-3 mb-3">
            {path.rationale}
          </p>

          {path.applicationSteps.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                申请步骤
              </p>
              <ol className="space-y-1.5">
                {path.applicationSteps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[9px] font-bold text-[var(--muted)]">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CompliancePage() {
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [checklist, setChecklist] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("compliance_result");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setResult(data.result);
        setChecklist(data.checklist);
      } catch {}
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-4">
        <FileText className="h-12 w-12 text-[var(--muted)]" />
        <p className="text-sm text-[var(--text-secondary)]">暂无合规评估数据</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] text-white px-4 py-2 text-sm font-medium hover:bg-[var(--accent-dark)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          开始评估
        </Link>
      </div>
    );
  }

  const criticalPaths = result.paths.filter((p) => p.priority === "critical" && !p.alreadyHeld);
  const recommendedPaths = result.paths.filter((p) => p.priority === "recommended" && !p.alreadyHeld);
  const optionalPaths = result.paths.filter((p) => p.priority === "optional" && !p.alreadyHeld);
  const heldPaths = result.paths.filter((p) => p.alreadyHeld);

  const displayPaths = showAll
    ? result.paths
    : [...criticalPaths, ...recommendedPaths.slice(0, 3)];

  return (
    <main className="min-h-[calc(100vh-8rem)] max-w-3xl mx-auto px-4 py-6 sm:py-8 sm:px-6 pb-safe-mobile">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)]">合规路径</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
              <Beaker className="h-3 w-3" />
              {result.productParams.productType}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
              <Droplets className="h-3 w-3" />
              {result.productParams.material}
            </span>
            {result.productParams.targetMarkets.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]"
              >
                <Globe className="h-3 w-3" />
                {MARKET_LABELS[m] ?? m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8">
        <div className="rounded-xl border border-red-200 bg-[var(--red-light)] p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <XCircle className="h-4 w-4 text-[var(--red)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--red)]">强制</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[var(--red)]">{result.summary.critical}</p>
          <p className="text-[10px] text-[var(--red)]/70">项待办</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-[var(--yellow-light)] p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="h-4 w-4 text-[var(--yellow)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--yellow)]">建议</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[var(--yellow)]">{result.summary.recommended}</p>
          <p className="text-[10px] text-[var(--yellow)]/70">项待办</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-[var(--green-light)] p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="h-4 w-4 text-[var(--green)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--green)]">已持有</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[var(--green)]">{result.summary.alreadyHeld}</p>
          <p className="text-[10px] text-[var(--green)]/70">项认证</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="h-4 w-4 text-[var(--text-secondary)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">预估</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[var(--text)]">{result.summary.totalEstimatedCost}</p>
          <p className="text-[10px] text-[var(--muted)]">{result.summary.totalEstimatedTimeline}</p>
        </div>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-semibold text-orange-600">警告</span>
          </div>
          {result.warnings.map((w, i) => (
            <p key={i} className="text-xs text-orange-700">{w}</p>
          ))}
        </div>
      )}

      {/* Critical Paths */}
      {criticalPaths.length > 0 && (
        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--red)] mb-3">
            <XCircle className="h-4 w-4" />
            强制认证要求 ({criticalPaths.length})
          </h2>
          <div className="space-y-2">
            {criticalPaths.map((path, i) => (
              <PathCard key={`critical-${i}`} path={path} defaultOpen={true} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended Paths */}
      {recommendedPaths.length > 0 && (
        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--yellow)] mb-3">
            <AlertTriangle className="h-4 w-4" />
            建议办理 ({recommendedPaths.length})
          </h2>
          <div className="space-y-2">
            {(showAll ? recommendedPaths : recommendedPaths.slice(0, 3)).map((path, i) => (
              <PathCard key={`rec-${i}`} path={path} defaultOpen={false} />
            ))}
            {recommendedPaths.length > 3 && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full rounded-xl border border-dashed border-[var(--border)] py-3 text-xs text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
              >
                查看全部 {recommendedPaths.length} 项建议
              </button>
            )}
          </div>
        </section>
      )}

      {/* Optional Paths */}
      {optionalPaths.length > 0 && showAll && (
        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--green)] mb-3">
            <CheckCircle2 className="h-4 w-4" />
            可选提升 ({optionalPaths.length})
          </h2>
          <div className="space-y-2">
            {optionalPaths.map((path, i) => (
              <PathCard key={`opt-${i}`} path={path} defaultOpen={false} />
            ))}
          </div>
        </section>
      )}

      {/* Already Held */}
      {heldPaths.length > 0 && (
        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--green)] mb-3">
            <CheckCircle2 className="h-4 w-4" />
            已持有认证 ({heldPaths.length})
          </h2>
          <div className="space-y-2">
            {heldPaths.map((path, i) => (
              <PathCard key={`held-${i}`} path={path} defaultOpen={false} />
            ))}
          </div>
        </section>
      )}

      {/* Download Checklist */}
      {checklist && (
        <div className="mb-6">
          <button
            onClick={() => {
              const blob = new Blob([checklist], { type: "text/markdown" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `compliance-checklist-${result.productParams.productType}.md`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full rounded-xl border-2 border-dashed border-[var(--border)] py-3.5 text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            下载合规路径清单 (Markdown)
          </button>
        </div>
      )}

      {/* Back */}
      <div className="mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-[var(--border)]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          评估其他产品
        </Link>
      </div>
    </main>
  );
}
