"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const MARKETS = [
  {
    code: "US",
    label: "United States",
    sublabel: "cUPC · NSF/ANSI 61 · NSF/ANSI 372",
    color: "#3b82f6",
  },
  {
    code: "AU",
    label: "Australia",
    sublabel: "WELS · WaterMark · AS/NZS Standards",
    color: "#22c55e",
  },
  {
    code: "UK",
    label: "United Kingdom",
    sublabel: "WRAS · UKCA · BS Standards",
    color: "#ef4444",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [market, setMarket] = useState("US");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type === "application/pdf" || f.name.endsWith(".pdf")) {
      setFile(f);
      setError(null);
    } else {
      setError("Please upload a PDF file");
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      // Step 1: Parse PDF → LLM
      const parseForm = new FormData();
      parseForm.append("file", file);

      const parseRes = await fetch("/api/parse", {
        method: "POST",
        body: parseForm,
      });

      if (!parseRes.ok) {
        const err = await parseRes.json();
        throw new Error(err.detail ? `${err.error}: ${err.detail}` : err.error ?? "Parse failed");
      }

      const { product, rawTextFull } = await parseRes.json();

      // Step 2: Generate compliance report for selected market
      const queryRes = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, rawText: rawTextFull, market }),
      });

      if (!queryRes.ok) {
        const err = await queryRes.json();
        throw new Error(err.error ?? "Query failed");
      }

      const { report } = await queryRes.json();

      // Step 3: Navigate to report
      sessionStorage.setItem("certifybot_report", JSON.stringify(report));
      router.push("/report");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          CertifyBot
        </h1>
        <p className="text-[var(--muted)] text-sm tracking-widest uppercase">
          出口合规通 · SpecFit
        </p>
      </div>

      {/* Upload card */}
      <div className="w-full max-w-lg">
        <div
          className={`
            border-2 border-dashed rounded-none p-12 text-center cursor-pointer transition-colors
            ${file ? "border-[var(--accent)]" : "border-[var(--border)] hover:border-[var(--muted)]"}
          `}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="text-3xl">📄</div>
              <p className="text-[var(--text)] font-medium">{file.name}</p>
              <p className="text-[var(--muted)] text-xs">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                className="text-xs text-[var(--muted)] underline mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="text-3xl">⬆</div>
              <p className="text-[var(--text)]">
                Drop PDF here or click to upload
              </p>
              <p className="text-[var(--muted)] text-xs">
                Product spec sheet, specification sheet, or catalog page
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-[var(--red)] text-sm mt-4 text-center">{error}</p>
        )}

        {/* Market selector */}
        <div className="mt-6">
          <label className="text-xs text-[var(--muted)] uppercase tracking-widest mb-3 block">
            Target Market
          </label>
          <div className="grid grid-cols-3 gap-2">
            {MARKETS.map((m) => (
              <button
                key={m.code}
                onClick={() => setMarket(m.code)}
                className={`
                  border px-3 py-3 text-left transition-colors text-xs
                  ${
                    market === m.code
                      ? "border-[var(--accent)] bg-[var(--accent)]/5"
                      : "border-[var(--border)] hover:border-[var(--muted)]"
                  }
                `}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        market === m.code ? "var(--accent)" : "var(--muted)",
                    }}
                  />
                  <span className="font-bold">{m.code}</span>
                </div>
                <div className="text-[10px] text-[var(--muted)] leading-tight">
                  {m.label}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-2 px-2 py-2 border border-[var(--border)] text-[10px] text-[var(--muted)]">
            {MARKETS.find((m) => m.code === market)?.sublabel}
          </div>
        </div>

        {/* CTA */}
        <button
          className={`
            w-full mt-6 py-4 text-sm font-bold tracking-widest uppercase transition-colors
            ${
              file && !loading
                ? "bg-[var(--accent)] text-black hover:bg-[var(--accent)]/90"
                : "bg-[var(--border)] text-[var(--muted)] cursor-not-allowed"
            }
          `}
          disabled={!file || loading}
          onClick={handleUpload}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">◌</span>
              Analyzing...
            </span>
          ) : (
            `Analyze for ${MARKETS.find((m) => m.code === market)?.label}`
          )}
        </button>

        <p className="text-[var(--muted)] text-xs text-center mt-3">
          ~3 minutes · Official certification database
        </p>
      </div>

      {/* Supported certs */}
      <div className="mt-12 text-center">
        <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3">
          Supported Certifications
        </p>
        <div className="flex flex-wrap gap-2 justify-center max-w-md">
          {market === "US" &&
            ["cUPC", "NSF/ANSI 61", "NSF/ANSI 372", "WaterSense", "IAPMO Z124"].map(
              (c) => (
                <span
                  key={c}
                  className="text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--muted)]"
                >
                  {c}
                </span>
              )
            )}
          {market === "AU" &&
            ["WELS", "WaterMark", "AS/NZS 4020", "AS/NZS 3718"].map((c) => (
              <span
                key={c}
                className="text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--muted)]"
              >
                {c}
              </span>
            ))}
          {market === "UK" &&
            ["WRAS", "UKCA", "BS 6920", "KIWA", "BS EN 817"].map((c) => (
              <span
                key={c}
                className="text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--muted)]"
              >
                {c}
              </span>
            ))}
        </div>
      </div>
    </main>
  );
}
