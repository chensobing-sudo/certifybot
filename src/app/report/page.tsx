"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Report, CertStatus } from "@/lib/types";
import { MARKET_MAP } from "@/lib/market-config";

function ScoreBadge({ score }: { score: Report["competitiveScore"] }) {
  const map = {
    green: { label: "GREEN", color: "var(--green)" },
    yellow: { label: "YELLOW", color: "var(--yellow)" },
    red: { label: "RED", color: "var(--red)" },
  };
  const { label, color } = map[score];
  return (
    <span
      className="text-xs font-bold tracking-widest px-3 py-1 border"
      style={{ borderColor: color, color }}
    >
      {label}
    </span>
  );
}

function CertRow({ cert, marketLabel }: { cert: CertStatus; marketLabel: string }) {
  const icon =
    cert.status === "present" ? "✅" : cert.status === "partial" ? "⚠️" : "❌";
  return (
    <div
      className={`flex items-start justify-between py-4 border-b border-[var(--border)] ${
        cert.status === "missing" ? "opacity-80" : ""
      }`}
    >
      <div className="flex gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-sm font-medium">{cert.name}</p>
          <p className="text-xs text-[var(--muted)] mt-1">{cert.detail}</p>
          {cert.certifiedCompanies && (
            <p className="text-xs text-[var(--muted)] mt-1">
              {cert.certifiedCompanies} companies with this cert in {marketLabel} market
            </p>
          )}
        </div>
      </div>
      <div className="text-right shrink-0 ml-4">
        {cert.status === "present" ? (
          <span className="text-xs text-[var(--green)]">CERTIFIED</span>
        ) : (
          <span className="text-xs text-[var(--red)]">MISSING</span>
        )}
      </div>
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--muted)]">
          No report found.{" "}
          <Link href="/" className="text-[var(--accent)] underline">
            Upload a PDF
          </Link>
        </p>
      </div>
    );
  }

  const missingCerts = report.certStatuses.filter((c) => c.status === "missing");
  const presentCerts = report.certStatuses.filter(
    (c) => c.status === "present"
  );

  return (
    <main className="min-h-screen max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compliance Report</h1>
          <p className="text-[var(--muted)] text-xs mt-1 uppercase tracking-widest">
            {report.product.productType ?? "Product"} · {MARKET_MAP[report.market]?.label ?? report.market} Market
          </p>
          {report.product.modelNumber && (
            <p className="text-[var(--muted)] text-xs mt-1">
              Model: {report.product.modelNumber}
            </p>
          )}
          {report.product.companyName && (
            <p className="text-[var(--muted)] text-xs mt-1">
              Company: {report.product.companyName}
            </p>
          )}
        </div>
        <ScoreBadge score={report.competitiveScore} />
      </div>

      {/* Competitive assessment */}
      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
          Market Assessment
        </h2>
        <div
          className="border border-[var(--border)] p-5"
          style={{
            borderColor:
              report.competitiveScore === "green"
                ? "var(--green)"
                : report.competitiveScore === "yellow"
                ? "var(--yellow)"
                : "var(--red)",
          }}
        >
          <p className="text-sm leading-relaxed">{report.competitiveDetail}</p>
        </div>
      </section>

      {/* Certification status */}
      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
          Certification Status
        </h2>

        {presentCerts.length > 0 && (
          <>
            <p className="text-xs text-[var(--green)] mb-2">
              ✅ Certified ({presentCerts.length})
            </p>
            <div className="border border-[var(--border)]">
              {presentCerts.map((cert) => (
                <CertRow key={cert.name} cert={cert} marketLabel={MARKET_MAP[report.market]?.label ?? report.market} />
              ))}
            </div>
          </>
        )}

        {missingCerts.length > 0 && (
          <>
            <p className="text-xs text-[var(--red)] mt-4 mb-2">
              ❌ Missing ({missingCerts.length})
            </p>
            <div className="border border-[var(--border)]">
              {missingCerts.map((cert) => (
                <CertRow key={cert.name} cert={cert} marketLabel={MARKET_MAP[report.market]?.label ?? report.market} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Cost estimates */}
      {report.costEstimate && report.costEstimate.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
            Estimated Costs &amp; Timeline
          </h2>
          <div className="border border-[var(--border)]">
            {report.costEstimate.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-4 border-b border-[var(--border)] last:border-0"
              >
                <div>
                  <p className="text-sm">{item.cert}</p>
                  <p className="text-xs text-[var(--muted)]">{item.timeline}</p>
                </div>
                <span className="text-sm font-bold">{item.usd}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
            Recommendations
          </h2>
          <div className="space-y-2">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-[var(--accent)] shrink-0">→</span>
                <p className="text-sm text-[var(--text)] leading-relaxed">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Source companies */}
      {report.sourceCompanies && report.sourceCompanies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
            Certified Competitors in {MARKET_MAP[report.market]?.label ?? report.market} Market
          </h2>
          <div className="space-y-2">
            {report.sourceCompanies.map((co, i) => (
              <div
                key={i}
                className="border border-[var(--border)] px-4 py-3"
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium">{co.company_name}</p>
                  <span className="text-xs text-[var(--muted)]">
                    {co.cert_count} certs
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {co.products?.slice(0, 3).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Raw parsed info (debug) */}
      {report.product && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
            Parsed Product Info
          </h2>
          <div className="border border-[var(--border)] p-4">
            {Object.entries(report.product)
              .filter(([k]) => k !== "rawText")
              .map(([key, val]) =>
                val ? (
                  <div
                    key={key}
                    className="flex gap-2 text-xs py-1 border-b border-[var(--border)] last:border-0"
                  >
                    <span className="text-[var(--muted)] capitalize w-28 shrink-0">
                      {key}:
                    </span>
                    <span className="text-[var(--text)]">
                      {Array.isArray(val) ? val.join(", ") : String(val)}
                    </span>
                  </div>
                ) : null
              )}
          </div>
        </section>
      )}

      {/* Back */}
      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <Link
          href="/"
          className="text-sm text-[var(--muted)] underline hover:text-[var(--text)]"
        >
          ← Analyze another product
        </Link>
      </div>
    </main>
  );
}
