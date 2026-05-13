"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  ChevronRight,
  ShieldCheck,
  Upload,
  FileText,
  X,
  Download,
  Beaker,
  Droplets,
  Zap,
  Building2,
  Home,
  Factory,
} from "lucide-react";
import type { ProductParams, MaterialCategory, WaterContactLevel, ProductCategory } from "@/data/compliance/decision-tree/rules";

// ─── Data ───

const MARKETS = [
  { code: "US", label: "美国", sublabel: "cUPC · NSF · ASME", color: "#3b82f6" },
  { code: "EU", label: "欧盟", sublabel: "CE · DVGW · EN 标准", color: "#1a56db" },
  { code: "CA", label: "加州", sublabel: "CEC · Prop 65", color: "#f59e0b" },
  { code: "UK", label: "英国", sublabel: "WRAS · UKCA · BS", color: "#ef4444" },
  { code: "AU", label: "澳大利亚", sublabel: "WELS · WaterMark", color: "#10b981" },
];

const PRODUCT_TYPES: { value: ProductCategory; label: string }[] = [
  { value: "faucet", label: "水龙头/龙头" },
  { value: "shower_head", label: "花洒/淋浴头" },
  { value: "shower_tray", label: "淋浴底盘" },
  { value: "toilet", label: "马桶/坐便器" },
  { value: "bidet", label: "妇洗器/智能马桶盖" },
  { value: "bathtub", label: "浴缸" },
  { value: "washbasin", label: "洗手盆/面盆" },
  { value: "valve", label: "阀门/角阀" },
  { value: "water_heater", label: "热水器" },
  { value: "water_treatment", label: "净水器/水处理" },
  { value: "pipe", label: "管材/管道" },
  { value: "fitting", label: "管件/接头" },
  { value: "urinal", label: "小便器" },
  { value: "flushometer", label: "冲洗阀" },
  { value: "drain", label: "地漏/排水器" },
  { value: "trap", label: "存水弯" },
  { value: "other", label: "其他" },
];

const MATERIALS: { value: MaterialCategory; label: string }[] = [
  { value: "metal", label: "金属（铜/不锈钢/锌合金）" },
  { value: "plastic", label: "塑料（ABS/PVC/PP）" },
  { value: "ceramic", label: "陶瓷" },
  { value: "glass", label: "玻璃" },
  { value: "composite", label: "复合材料（人造石/亚克力）" },
  { value: "rubber", label: "橡胶/密封件" },
  { value: "other", label: "其他" },
];

const WATER_CONTACTS: { value: WaterContactLevel; label: string; desc: string }[] = [
  { value: "potable", label: "接触饮用水", desc: "水龙头、阀门、管道等" },
  { value: "non-potable", label: "接触非饮用水", desc: "马桶、地漏、排水管等" },
  { value: "no-contact", label: "不接触水", desc: "外部装饰件、把手等" },
];

const USE_TYPES = [
  { value: "residential" as const, label: "家用", icon: Home },
  { value: "commercial" as const, label: "商用", icon: Building2 },
  { value: "industrial" as const, label: "工业用", icon: Factory },
];

// ─── Component ───

export default function ProductForm() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "upload">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [productType, setProductType] = useState<ProductCategory | "">("");
  const [material, setMaterial] = useState<MaterialCategory | "">("");
  const [waterContact, setWaterContact] = useState<WaterContactLevel | "">("");
  const [targetMarkets, setTargetMarkets] = useState<string[]>([]);
  const [intendedUse, setIntendedUse] = useState<"residential" | "commercial" | "industrial">("residential");
  const [hasElectrical, setHasElectrical] = useState(false);
  const [certificationsHeld, setCertificationsHeld] = useState("");

  // PDF upload state
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useState<HTMLInputElement | null>(null);

  const toggleMarket = (code: string) => {
    setTargetMarkets((prev) =>
      prev.includes(code) ? prev.filter((m) => m !== code) : [...prev, code]
    );
  };

  const isFormValid = productType && material && waterContact && targetMarkets.length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setError(null);

    try {
      const params: ProductParams = {
        productType: productType as ProductCategory,
        material: material as MaterialCategory,
        waterContact: waterContact as WaterContactLevel,
        targetMarkets,
        hasElectricalComponents: hasElectrical,
        intendedUse,
        certificationsHeld: certificationsHeld
          .split(/[,，、]/)
          .map((s) => s.trim())
          .filter(Boolean),
      };

      // If also uploading a PDF, parse it first
      let parsedProduct = null;
      if (file) {
        const parseForm = new FormData();
        parseForm.append("file", file);

        const parseRes = await fetch("/api/parse", {
          method: "POST",
          body: parseForm,
        });

        if (parseRes.ok) {
          parsedProduct = await parseRes.json();
        }
      }

      // Call compliance evaluation API
      const res = await fetch("/api/compliance/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ params, parsedProduct }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "评估失败");
      }

      const result = await res.json();
      sessionStorage.setItem("compliance_result", JSON.stringify(result));
      router.push("/compliance");
    } catch (err: any) {
      setError(err.message ?? "出错了，请稍后重试");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mode toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setStep("input")}
          className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
            step === "input"
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200"
          }`}
        >
          填写产品参数
        </button>
        <button
          onClick={() => setStep("upload")}
          className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
            step === "upload"
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200"
          }`}
        >
          上传 PDF 规格书
        </button>
      </div>

      {step === "upload" ? (
        /* ─── PDF Upload Mode ─── */
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm p-5 sm:p-8">
          <div
            className={`relative rounded-xl border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-[var(--accent)] bg-[var(--accent-light)]"
                : file
                ? "border-[var(--green)] bg-[var(--green-light)]"
                : "border-[var(--border)] hover:border-[var(--muted)] hover:bg-gray-50/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) {
                if (f.type === "application/pdf" || f.name.endsWith(".pdf")) {
                  setFile(f);
                  setError(null);
                } else {
                  setError("请上传 PDF 格式的文件");
                }
              }
            }}
            onClick={() => document.getElementById("pdf-upload")?.click()}
          >
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  setError(null);
                }
              }}
            />
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--green-light)]">
                  <FileText className="h-6 w-6 text-[var(--green)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{file.name}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--red)] transition-colors"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >
                  <X className="h-3 w-3" />
                  移除文件
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Upload className={`h-6 w-6 transition-colors ${isDragOver ? "text-[var(--accent)]" : "text-[var(--muted)]"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    {isDragOver ? "松开以上传文件" : "拖拽 PDF 到此处，或点击上传"}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    产品规格书、认证证书或产品目录
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-center">
            <a
              href="/产品规格书范本.docx"
              download
              className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            >
              <Download className="h-3 w-3" />
              下载产品规格书范本
            </a>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-[var(--red-light)] border border-red-200 px-4 py-3">
              <p className="text-xs text-[var(--red)]">{error}</p>
            </div>
          )}

          {/* Market selector (also needed in upload mode) */}
          <div className="mt-5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] mb-2.5">
              <Globe className="h-3.5 w-3.5" />
              选择目标市场（可多选）
            </label>
            <div className="flex flex-wrap gap-2">
              {MARKETS.map((m) => {
                const isActive = targetMarkets.includes(m.code);
                return (
                  <button
                    key={m.code}
                    onClick={() => toggleMarket(m.code)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
                      isActive
                        ? "bg-blue-50 border-2 border-blue-300 text-blue-700"
                        : "border-2 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--muted)]"
                    }`}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: isActive ? m.color : "#d1d5db" }}
                    />
                    {m.code}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            className={`w-full mt-5 rounded-xl py-3.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              file && targetMarkets.length > 0 && !loading
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-800 active:scale-[0.97]"
                : "bg-gray-100 text-[var(--muted)] cursor-not-allowed"
            }`}
            disabled={!file || targetMarkets.length === 0 || loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                正在分析...
              </span>
            ) : (
              <>
                开始分析
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* ─── Parameter Input Mode ─── */
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm p-5 sm:p-8">
          {/* Product Type */}
          <div className="mb-5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] mb-2">
              <Beaker className="h-3.5 w-3.5" />
              产品类型
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PRODUCT_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => setProductType(pt.value)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-all active:scale-[0.97] text-left ${
                    productType === pt.value
                      ? "bg-blue-50 border border-blue-300 text-blue-700"
                      : "bg-gray-50 border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--muted)]"
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Material */}
          <div className="mb-5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] mb-2">
              <Beaker className="h-3.5 w-3.5" />
              主要材质
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {MATERIALS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMaterial(m.value)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-all active:scale-[0.97] text-left ${
                    material === m.value
                      ? "bg-blue-50 border border-blue-300 text-blue-700"
                      : "bg-gray-50 border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--muted)]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Water Contact */}
          <div className="mb-5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] mb-2">
              <Droplets className="h-3.5 w-3.5" />
              与水接触情况
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {WATER_CONTACTS.map((wc) => (
                <button
                  key={wc.value}
                  onClick={() => setWaterContact(wc.value)}
                  className={`rounded-lg px-3 py-2.5 text-xs font-medium transition-all active:scale-[0.97] ${
                    waterContact === wc.value
                      ? "bg-blue-50 border border-blue-300 text-blue-700"
                      : "bg-gray-50 border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--muted)]"
                  }`}
                >
                  <div className="font-medium">{wc.label}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{wc.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Markets */}
          <div className="mb-5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] mb-2">
              <Globe className="h-3.5 w-3.5" />
              目标市场（可多选）
            </label>
            <div className="flex flex-wrap gap-2">
              {MARKETS.map((m) => {
                const isActive = targetMarkets.includes(m.code);
                return (
                  <button
                    key={m.code}
                    onClick={() => toggleMarket(m.code)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
                      isActive
                        ? "bg-blue-50 border-2 border-blue-300 text-blue-700"
                        : "border-2 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--muted)]"
                    }`}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: isActive ? m.color : "#d1d5db" }}
                    />
                    {m.label}
                    <span className="text-[10px] opacity-60 ml-0.5">{m.sublabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Intended Use */}
          <div className="mb-5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] mb-2">
              <Home className="h-3.5 w-3.5" />
              预期用途
            </label>
            <div className="flex gap-2">
              {USE_TYPES.map((ut) => {
                const Icon = ut.icon;
                const isActive = intendedUse === ut.value;
                return (
                  <button
                    key={ut.value}
                    onClick={() => setIntendedUse(ut.value)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
                      isActive
                        ? "bg-blue-50 border-2 border-blue-300 text-blue-700"
                        : "border-2 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--muted)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {ut.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Electrical */}
          <div className="mb-5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] mb-2">
              <Zap className="h-3.5 w-3.5" />
              是否含电气组件
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setHasElectrical(true)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
                  hasElectrical
                    ? "bg-blue-50 border-2 border-blue-300 text-blue-700"
                    : "border-2 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--muted)]"
                }`}
              >
                是（智能马桶盖、电热水器等）
              </button>
              <button
                onClick={() => setHasElectrical(false)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
                  !hasElectrical
                    ? "bg-blue-50 border-2 border-blue-300 text-blue-700"
                    : "border-2 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--muted)]"
                }`}
              >
                否
              </button>
            </div>
          </div>

          {/* Already Held Certifications */}
          <div className="mb-5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              已持有的认证（可选）
            </label>
            <input
              type="text"
              value={certificationsHeld}
              onChange={(e) => setCertificationsHeld(e.target.value)}
              placeholder="例如: NSF/ANSI 61, cUPC, CE"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
            <p className="text-[10px] text-[var(--muted)] mt-1">多个认证用逗号分隔</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-[var(--red-light)] border border-red-200 px-4 py-3">
              <p className="text-xs text-[var(--red)]">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            className={`w-full rounded-xl py-3.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              isFormValid && !loading
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-800 active:scale-[0.97]"
                : "bg-gray-100 text-[var(--muted)] cursor-not-allowed"
            }`}
            disabled={!isFormValid || loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                正在评估...
              </span>
            ) : (
              <>
                生成合规路径
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-[10px] text-[var(--muted)] text-center mt-3">
            基于多国法规知识库 · 分钟级输出完整合规路径
          </p>
        </div>
      )}
    </div>
  );
}
