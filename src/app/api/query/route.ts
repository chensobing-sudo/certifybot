// API: Query certification database and generate compliance report for any supported market
// Inputs: parsed product from /api/parse
// Outputs: full compliance report per market

import { NextRequest, NextResponse } from "next/server";
import { searchIAPMO, findCompanyCerts } from "@/lib/iapmo";
import type { CertStatus, Report } from "@/lib/types";
import {
  getMarket,
  getRequirementsForProductType,
  getCertCosts,
} from "@/lib/market-config";

export const runtime = "nodejs";

// Load local cert data (US only for now)
function loadLocalCerts(): any[] {
  try {
    const fs = require("fs");
    const path = require("path");
    const certPath = path.join(process.cwd(), "src/lib/cert-data.json");
    if (fs.existsSync(certPath)) {
      return JSON.parse(fs.readFileSync(certPath, "utf-8"));
    }
  } catch {}
  return [];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product, rawText, market: marketCode = "US" } = body as {
      product: any;
      rawText?: string;
      market?: string;
    };

    if (!product) {
      return NextResponse.json({ error: "No product data" }, { status: 400 });
    }

    const market = getMarket(marketCode);
    if (!market) {
      return NextResponse.json(
        { error: `Unsupported market: ${marketCode}` },
        { status: 400 }
      );
    }

    const companyName = product.companyName ?? product.brandName ?? null;
    const productType = product.productType ?? "faucet";

    // ── 1. Get required certs for this product type in this market ──
    const { required: requiredCertKeys, optional: optionalCertKeys } =
      getRequirementsForProductType(market, productType);
    const allCertKeys = [...requiredCertKeys, ...optionalCertKeys];

    // ── 2. Query IAPMO (US market only for now) ──
    let companyCerts: any[] = [];
    let matchedLocal: any[] = [];

    if (marketCode === "US" || marketCode === "US") {
      try {
        if (companyName) {
          companyCerts = await findCompanyCerts(companyName, 10);
        }
      } catch {}

      const localCerts = loadLocalCerts();
      if (companyName) {
        matchedLocal = localCerts.filter((c: any) =>
          c.company_name.toLowerCase().includes(companyName.toLowerCase())
        );
      }
    }

    // ── 3. Query IAPMO for product competitive landscape ──
    let productCertCount = 0;
    try {
      const result = await searchIAPMO(productType, "productDescription", 1, 5);
      productCertCount = result.totalRecords ?? 0;
    } catch {}

    // ── 4. Build cert statuses ──
    const certStatuses: CertStatus[] = allCertKeys
      .map((stdKey) => {
        const std = market.standards[stdKey];
        if (!std) return null;

        let hasCert = false;
        if (marketCode === "US") {
          hasCert =
            companyCerts.some(
              (c) =>
                c.standardDisplayValue?.includes(stdKey) ||
                c.standard?.includes(stdKey)
            ) ||
            matchedLocal.some(
              (c: any) =>
                c.standards?.some((s: string) => s.includes(stdKey)) ?? false
            );
        }

        return {
          name: std.name,
          status: hasCert ? ("present" as const) : ("missing" as const),
          detail: hasCert
            ? `Found matching certification in ${market.label} database.`
            : `Required for ${market.label} market entry.`,
          certifiedCompanies:
            marketCode === "US"
              ? matchedLocal.length
              : undefined,
        } as CertStatus;
      })
      .filter((c): c is CertStatus => c !== null);

    // ── 5. Competitive score ──
    const missingCount = certStatuses.filter(
      (c) => c.status === "missing"
    ).length;
    const requiredMissing = certStatuses.filter(
      (c) =>
        c.status === "missing" &&
        (market.standards[c.name]?.required ?? false)
    ).length;

    let competitiveScore: "red" | "yellow" | "green";
    let competitiveDetail: string;

    if (missingCount === 0) {
      competitiveScore = "green";
      competitiveDetail = `Fully compliant for ${market.label} market.`;
    } else if (requiredMissing === 0) {
      competitiveScore = "green";
      competitiveDetail = `Only optional certifications missing. Core compliance met for ${market.label}.`;
    } else if (requiredMissing <= 2) {
      competitiveScore = "yellow";
      competitiveDetail = `Missing ${requiredMissing} required certifications. Market entry possible with gap-filling.`;
    } else {
      competitiveScore = "red";
      competitiveDetail = `Missing ${requiredMissing} required certifications. Full compliance requires ${requiredMissing > 3 ? "6+ months" : "3-6 months"}.`;
    }

    // ── 6. Cost estimates ──
    const costEstimate = getCertCosts(market, allCertKeys);

    // ── 7. Market-specific recommendations ──
    const recommendations: string[] = [];
    const missingRequired = certStatuses.filter(
      (c) =>
        c.status === "missing" &&
        (market.standards[c.name]?.required ?? false)
    );

    if (missingRequired.length > 0) {
      recommendations.push(
        `Priority: Obtain ${missingRequired[0].name} — ${missingRequired[0].detail}`
      );
    }

    if (!companyName && productType) {
      recommendations.push(
        `Product type detected as "${productType}". Submit brand name for more accurate certification matching.`
      );
    }

    if (marketCode === "AU") {
      recommendations.push(
        "Australia requires WELS star rating for all showerheads, taps and toilets. Higher star rating = premium pricing advantage."
      );
    }
    if (marketCode === "UK") {
      recommendations.push(
        "UKCA marking is mandatory from January 2025 for most plumbing products. WRAS + UKCA dual certification is recommended."
      );
    }

    // ── 8. Source companies ──
    const sourceCompanies = matchedLocal.slice(0, 5).map((c: any) => ({
      company_name: c.company_name,
      cert_count: c.cert_count,
      products: c.products?.slice(0, 3),
      standards: c.standards?.slice(0, 3),
    }));

    const report: Report = {
      id: crypto.randomUUID(),
      uploadedAt: new Date().toISOString(),
      product,
      market: marketCode,
      certStatuses,
      productType,
      marketGaps: missingRequired.map((c) => c.name),
      competitiveScore,
      competitiveDetail,
      costEstimate,
      recommendations,
      sourceCompanies,
    };

    return NextResponse.json({
      report,
      market: market.label,
      companyCerts,
      matchedLocal,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
