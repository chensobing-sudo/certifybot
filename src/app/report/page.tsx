"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Report, CertStatus } from "@/lib/types";
import { MARKET_MAP } from "@/lib/market-config";
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Building2, Clock, Lightbulb, FileText, TrendingUp } from "lucide-react";

function ScoreBadge({ score }: { score: Report["competitiveScore"] }) {
  const map = {
    green: { label: "GREEN", color: "var(--green)", bg: "bg-[var(--green-light)]", border: "border-[var(--green)]" },
    yellow: { label: "YELLOW", color: "var(--yellow)", bg: "bg-[var(--yellow-light)]", border: "border-[var(--yellow)]" },
    red: { label: "RED", color: "var(--red)", bg: "bg-[var(--red-light)]", border: "border-[var(--red)]" },
  };
  const { label, color, bg, border } = map[score];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg ${bg} ${border} border px-3 py-1.5 text-xs font-bold tracking-wider`}
      style={{ color }}
    >
      <TrendingUp className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function CertRow({ cert, marketLabel }: { cert: CertStatus; marketLabel: string }) {
  const isPresent = cert.status === "present";
  const isPartial = cert.status === "partial";
  return (
    <div className={`flex items-start justify-between py-4 border-b border-[var(--border)] last:border-0 ${!isPresent ? "opacity-80" : ""}`}>
      <div className="flex gap-3">
        <span className="mt-0.5">
          {isPresent ? (
            <CheckCircle2 className="h-5 w-5 text-[var(--green)]" />
          ) : isPartial ? (
            <AlertTriangle className="h-5 w-5 text-[var(--yellow)]" />
          ) : (
            <XCircle className="h-5 w-5 text-[var(--red)]" />
          )}
        </span>
        <div>
          <p className="text-sm font-medium text-[var(--text)]">{cert.name}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{cert.detail}</p>
          {cert.certifiedCompanies && (
            <p className="text-xs text-[var(--muted)] mt-1">
              {cert.certifiedCompanies} 家公司已获得此认证（{marketLabel}市场）
            </p>
          )}
        </div>
      </div>
      <div className="text-right shrink-0 ml-4">
        {isPresent ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--green-light)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--green)]">
            <CheckCircle2 className="h-3 w-3" />
            已认证
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--red-light)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--red)]">
            <XCircle className="h-3 w-3" />
            缺失
          </span>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, count, color }: { icon: any; title: string; count?: number; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="h-4 w-4" style={{ color }} />
      <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
        {title}
        {count !== undefined && ` (${count})`}
      </h2>
    </div>
  );
}

export default function ReportPage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("certifybot_report");
    if (raw) {
      try {
        setReport(JSON.parse(raw));
      } catch {}
    }
  }, []);

  if (!report) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-4">
        <FileText className="h-12 w-12 text-[var(--muted)]" />
        <p className="text-sm text-[var(--text-secondary)]">暂无报告数据</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] text-white px-4 py-2 text-sm font-medium hover:bg-[var(--accent-dark)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          上传 PDF 开始分析
        </Link>
      </div>
    );
  }

  const missingCerts = report.certStatuses.filter((c) => c.status === "missing");
  const presentCerts = report.certStatuses.filter((c) => c.status === "present" || c.status === "partial");
  const marketLabel = MARKET_MAP[report.market]?.label ?? report.market;

  return (
    <main className="min-h-[calc(100vh-8rem)] max-w-3xl mx-auto px-4 py-6 sm:py-8 sm:px-6 pb-safe-mobile">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)]">合规报告</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
              {report.product.productType ?? "产品"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
              {marketLabel} 市场
            </span>
            {report.product.modelNumber && (
              <span className="text-[10px] text-[var(--muted)]">型号: {report.product.modelNumber}</span>
            )}
          </div>
          {report.product.companyName && (
            <p className="text-xs text-[var(--muted)] mt-1.5">
              <Building2 className="inline h-3 w-3 mr-1" />
              {report.product.companyName}
            </p>
          )}
        </div>
        <ScoreBadge score={report.competitiveScore} />
      </div>

      {/* Market Assessment */}
      <section className="mb-6 sm:mb-8">
        <SectionHeader icon={TrendingUp} title="市场评估" color="var(--text-secondary)" />
        <div
          className="rounded-xl border-2 p-4 sm:p-5 bg-[var(--surface)]"
          style={{
            borderColor:
              report.competitiveScore === "green"
                ? "var(--green)"
                : report.competitiveScore === "yellow"
                ? "var(--yellow)"
                : "var(--red)",
          }}
        >
          <p className="text-sm leading-relaxed text-[var(--text)]">{report.competitiveDetail}</p>
        </div>
      </section>

      {/* Certification Status */}
      <section className="mb-6 sm:mb-8">
        <SectionHeader icon={CheckCircle2} title="认证状态" count={report.certStatuses.length} color="var(--text-secondary)" />

        {presentCerts.length > 0 && (
          <div className="mb-4">
            <SectionHeader icon={CheckCircle2} title="已认证" count={presentCerts.length} color="var(--green)" />
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)] px-3 sm:px-4">
              {presentCerts.map((cert) => (
                <CertRow key={cert.name} cert={cert} marketLabel={marketLabel} />
              ))}
            </div>
          </div>
        )}

        {missingCerts.length > 0 && (
          <div>
            <SectionHeader icon={XCircle} title="缺失" count={missingCerts.length} color="var(--red)" />
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)] px-3 sm:px-4">
              {missingCerts.map((cert) => (
                <CertRow key={cert.name} cert={cert} marketLabel={marketLabel} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Cost & Timeline */}
      {report.costEstimate && report.costEstimate.length > 0 && (
        <section className="mb-6 sm:mb-8">
          <SectionHeader icon={Clock} title="费用与时间估算" color="var(--text-secondary)" />
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden table-scroll-x">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="bg-gray-50 border-b border-[var(--border)]">
                  <th className="text-left px-3 sm:px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">认证项目</th>
                  <th className="text-left px-3 sm:px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">时间周期</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">费用 (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {report.costEstimate.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-3 sm:px-4 py-3 text-sm text-[var(--text)]">{item.cert}</td>
                    <td className="px-3 sm:px-4 py-3 text-xs text-[var(--text-secondary)]">{item.timeline}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm font-semibold text-right text-[var(--text)]">{item.usd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <section className="mb-6 sm:mb-8">
          <SectionHeader icon={Lightbulb} title="改进建议" color="var(--text-secondary)" />
          <div className="space-y-2">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 items-start rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 sm:px-4 py-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-light)] text-[10px] font-bold text-[var(--accent)]">
                  {i + 1}
                </span>
                <p className="text-sm text-[var(--text)] leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Competitors */}
      {report.sourceCompanies && report.sourceCompanies.length > 0 && (
        <section className="mb-6 sm:mb-8">
          <SectionHeader icon={Building2} title={`${marketLabel}市场已认证竞争对手`} color="var(--text-secondary)" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.sourceCompanies.map((co, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 card-hover active:scale-[0.98] transition-transform">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-medium text-[var(--text)]">{co.company_name}</p>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
                    {co.cert_count} 项认证
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)]">
                  {co.products?.slice(0, 3).join("、")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Parsed Product Info */}
      {report.product && (
        <section className="mb-6 sm:mb-8">
          <SectionHeader icon={FileText} title="解析产品信息" color="var(--text-secondary)" />
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[var(--border)]">
                {Object.entries(report.product)
                  .filter(([k]) => k !== "rawText")
                  .map(([key, val]) =>
                    val ? (
                      <tr key={key} className="hover:bg-gray-50/50">
                        <td className="px-3 sm:px-4 py-2.5 text-xs font-medium text-[var(--text-secondary)] capitalize w-24 sm:w-28">
                          {key}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 text-sm text-[var(--text)]">
                          {Array.isArray(val) ? val.join(", ") : String(val)}
                        </td>
                      </tr>
                    ) : null
                  )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Back */}
      <div className="mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-[var(--border)]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors font-medium touch-target"
        >
          <ArrowLeft className="h-4 w-4" />
          分析其他产品
        </Link>
      </div>
    </main>
  );
}
