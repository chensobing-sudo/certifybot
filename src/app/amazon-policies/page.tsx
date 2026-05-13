"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  Info,
  ExternalLink,
  Calendar,
  Globe,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  Clock,
} from "lucide-react";
import type { AmazonPolicyUpdate } from "@/data/compliance/amazon-policies/types";

const SEVERITY_CONFIG = {
  critical: {
    label: "紧急",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: AlertTriangle,
  },
  warning: {
    label: "警告",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertTriangle,
  },
  info: {
    label: "通知",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Info,
  },
} as const;

const MARKET_LABELS: Record<string, string> = {
  US: "美国",
  EU: "欧盟",
  UK: "英国",
  CA: "加州",
  AU: "澳大利亚",
  global: "全球",
};

const CATEGORY_LABELS: Record<string, string> = {
  compliance: "合规要求",
  listing: "Listing 规则",
  safety: "产品安全",
  labeling: "标签要求",
  restricted: "受限商品",
  other: "其他",
};

function PolicyCard({ update }: { update: AmazonPolicyUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const SeverityIcon = SEVERITY_CONFIG[update.severity].icon;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-shadow hover:shadow-sm">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-gray-50/50 transition-colors"
      >
        <div
          className={`shrink-0 rounded-lg p-2 ${
            SEVERITY_CONFIG[update.severity].color
          }`}
        >
          <SeverityIcon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                SEVERITY_CONFIG[update.severity].color
              }`}
            >
              {SEVERITY_CONFIG[update.severity].label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
              <Globe className="h-3 w-3" />
              {MARKET_LABELS[update.market] ?? update.market}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
              {CATEGORY_LABELS[update.category] ?? update.category}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[var(--text)] leading-snug">
            {update.title}
          </h3>
          <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">
            {update.summary}
          </p>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--muted)]">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              生效：{update.effectiveDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              发布：{update.publishedAt}
            </span>
          </div>
        </div>
        <div className="shrink-0 mt-1 text-[var(--muted)]">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-5 pb-4 border-t border-[var(--border)]">
          <div className="mt-3 space-y-3">
            {/* Affected Products */}
            <div>
              <p className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5">
                受影响产品
              </p>
              <div className="flex flex-wrap gap-1.5">
                {update.affectedProducts.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                  >
                    {p.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <p className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5">
                详细内容
              </p>
              <div className="rounded-lg bg-gray-50 p-3">
                <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap font-sans leading-relaxed">
                  {update.details}
                </pre>
              </div>
            </div>

            {/* Source Link */}
            <a
              href={update.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              <ExternalLink className="h-3 w-3" />
              查看原文
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AmazonPoliciesPage() {
  const [updates, setUpdates] = useState<AmazonPolicyUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterMarket, setFilterMarket] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const fetchUpdates = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterMarket !== "all") params.set("market", filterMarket);
      if (filterSeverity !== "all") params.set("severity", filterSeverity);

      const res = await fetch(`/api/amazon-policies?${params.toString()}`);
      if (!res.ok) throw new Error("获取政策更新失败");
      const data = await res.json();
      setUpdates(data.updates);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [filterMarket, filterSeverity]);

  const criticalCount = updates.filter((u) => u.severity === "critical").length;

  return (
    <main className="min-h-[calc(100vh-8rem)] px-4 py-8 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)]">
              亚马逊政策预警
            </h1>
            <p className="text-sm text-[var(--muted)]">
              实时追踪亚马逊各站点卫浴产品合规政策更新
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-[10px] text-[var(--muted)]">紧急更新</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">
              {updates.filter((u) => u.severity === "warning").length}
            </p>
            <p className="text-[10px] text-[var(--muted)]">警告</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
            <p className="text-2xl font-bold text-[var(--text)]">
              {updates.length}
            </p>
            <p className="text-[10px] text-[var(--muted)]">全部更新</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-[var(--muted)]" />
        <select
          value={filterMarket}
          onChange={(e) => setFilterMarket(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">全部市场</option>
          <option value="US">美国</option>
          <option value="EU">欧盟</option>
          <option value="UK">英国</option>
          <option value="CA">加州</option>
          <option value="AU">澳大利亚</option>
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">全部级别</option>
          <option value="critical">紧急</option>
          <option value="warning">警告</option>
          <option value="info">通知</option>
        </select>
        <button
          onClick={fetchUpdates}
          disabled={loading}
          className="ml-auto inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          刷新
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-[var(--muted)]" />
            <p className="text-sm text-[var(--muted)]">加载政策更新...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={fetchUpdates}
            className="mt-2 text-xs text-red-600 underline hover:no-underline"
          >
            重试
          </button>
        </div>
      ) : updates.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <Shield className="h-8 w-8 text-[var(--muted)] mx-auto mb-3" />
          <p className="text-sm font-medium text-[var(--text)]">暂无政策更新</p>
          <p className="text-xs text-[var(--muted)] mt-1">
            当前筛选条件下没有政策更新
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map((update) => (
            <PolicyCard key={update.id} update={update} />
          ))}
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            政策信息来源于亚马逊卖家中心和各监管机构公告。建议定期查看此页面以获取最新合规要求变更。
            实际执行日期以亚马逊官方通知为准。
          </p>
        </div>
      </div>
    </main>
  );
}
