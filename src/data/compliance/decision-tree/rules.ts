// Decision tree rules engine for compliance requirements
// Cross-references: material × product type × target market
// Returns specific certification requirements with rationale

export type MaterialCategory =
  | "metal"           // brass, stainless steel, copper, zinc alloy
  | "plastic"         // ABS, PVC, PEX, PP, nylon
  | "ceramic"         // vitreous china, porcelain
  | "glass"           // tempered glass, borosilicate
  | "composite"       // engineered stone, solid surface, acrylic
  | "rubber"          // gaskets, seals, O-rings
  | "other";

export type WaterContactLevel =
  | "potable"         // drinking water contact (faucets, valves, pipes)
  | "non-potable"     // wastewater, toilet, non-drinking
  | "no-contact";     // exterior surfaces, handles, decorative

export type ProductCategory =
  | "faucet"
  | "shower_head"
  | "shower_tray"
  | "toilet"
  | "bidet"
  | "bathtub"
  | "washbasin"
  | "valve"
  | "water_heater"
  | "water_treatment"
  | "pipe"
  | "fitting"
  | "urinal"
  | "flushometer"
  | "drain"
  | "trap"
  | "other";

export interface ProductParams {
  productType: ProductCategory;
  material: MaterialCategory;
  waterContact: WaterContactLevel;
  targetMarkets: string[];
  hasElectricalComponents: boolean;
  intendedUse: "residential" | "commercial" | "industrial";
  certificationsHeld: string[]; // already obtained certs
}

export interface DecisionRule {
  condition: string;           // human-readable condition
  market: string;
  certKey: string;             // key into MarketConfig.standards
  priority: "critical" | "recommended" | "optional";
  rationale: string;           // why this cert is needed
  materialExclusions?: MaterialCategory[];
  materialRequirements?: MaterialCategory[];
}

export interface CompliancePath {
  market: string;
  certKey: string;
  certName: string;
  priority: "critical" | "recommended" | "optional";
  rationale: string;
  agency: string;
  fee: string;
  timeline: string;
  applicationSteps: string[];
  alreadyHeld: boolean;
}

export interface ComplianceResult {
  productParams: ProductParams;
  paths: CompliancePath[];
  summary: {
    critical: number;
    recommended: number;
    optional: number;
    alreadyHeld: number;
    totalEstimatedCost: string;
    totalEstimatedTimeline: string;
  };
  warnings: string[];
}

// ─── Decision tree engine ───

import { getMarket, getCertCosts } from "@/lib/market-config";
import { getAgenciesForCert } from "../cert-agencies/agencies";
import type { MarketConfig } from "@/lib/market-config";

/**
 * Evaluate compliance requirements based on product parameters.
 * Uses a rule-based decision tree with material × product type × market cross-references.
 */
export function evaluateCompliance(params: ProductParams): ComplianceResult {
  const paths: CompliancePath[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();

  for (const marketCode of params.targetMarkets) {
    const market = getMarket(marketCode);
    if (!market) {
      warnings.push(`未知市场: ${marketCode}`);
      continue;
    }

    // Get base requirements from product type mapping
    const baseReqs = getBaseRequirements(market, params);

    // Apply material-specific rules
    const materialRules = getMaterialRules(market, params);

    // Apply water contact rules
    const waterRules = getWaterContactRules(market, params);

    // Merge all rules
    const allRules = [...baseReqs, ...materialRules, ...waterRules];

    // Deduplicate
    const uniqueRules = allRules.filter((r) => {
      const key = `${r.market}:${r.certKey}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Convert to CompliancePath
    for (const rule of uniqueRules) {
      const std = market.standards[rule.certKey];
      if (!std) continue;

      const agencies = getAgenciesForCert(rule.certKey);
      const agency = agencies.length > 0 ? agencies[0].shortName : "待确认";

      paths.push({
        market: rule.market,
        certKey: rule.certKey,
        certName: std.name,
        priority: rule.priority,
        rationale: rule.rationale,
        agency,
        fee: std.fee,
        timeline: std.timeline,
        applicationSteps: agencies.length > 0 ? agencies[0].applicationProcess : [],
        alreadyHeld: params.certificationsHeld.some(
          (h) =>
            h.toLowerCase().includes(rule.certKey.toLowerCase()) ||
            std.name.toLowerCase().includes(h.toLowerCase())
        ),
      });
    }
  }

  // Sort: critical first, then recommended, then optional
  paths.sort((a, b) => {
    const order = { critical: 0, recommended: 1, optional: 2 };
    return order[a.priority] - order[b.priority];
  });

  // Summary
  const critical = paths.filter((p) => p.priority === "critical" && !p.alreadyHeld);
  const recommended = paths.filter((p) => p.priority === "recommended" && !p.alreadyHeld);
  const optional = paths.filter((p) => p.priority === "optional" && !p.alreadyHeld);
  const alreadyHeld = paths.filter((p) => p.alreadyHeld);

  // Estimate total cost and timeline (rough sum)
  const totalCostMin = paths
    .filter((p) => !p.alreadyHeld)
    .reduce((sum, p) => {
      const match = p.fee.match(/\$?€?£?(\d[\d,]*)/);
      return sum + (match ? parseInt(match[1].replace(/,/g, "")) : 0);
    }, 0);

  const totalTimelineMax = paths
    .filter((p) => !p.alreadyHeld)
    .reduce((max, p) => {
      const match = p.timeline.match(/(\d+)/g);
      return match ? Math.max(max, parseInt(match[match.length - 1])) : max;
    }, 0);

  return {
    productParams: params,
    paths,
    summary: {
      critical: critical.length,
      recommended: recommended.length,
      optional: optional.length,
      alreadyHeld: alreadyHeld.length,
      totalEstimatedCost: `$${totalCostMin.toLocaleString()}+`,
      totalEstimatedTimeline: `${totalTimelineMax}+ weeks`,
    },
    warnings,
  };
}

// ─── Rule generators ───

function getBaseRequirements(
  market: MarketConfig,
  params: ProductParams
): DecisionRule[] {
  const rules: DecisionRule[] = [];
  const reqs = market.productTypeRequirements[params.productType] ?? market.productTypeRequirements.default;

  if (reqs) {
    for (const key of reqs.required) {
      const std = market.standards[key];
      if (!std) continue;
      rules.push({
        condition: `${params.productType} in ${market.code}`,
        market: market.code,
        certKey: key,
        priority: "critical",
        rationale: `${std.name} 是 ${market.label} 市场对 ${params.productType} 类产品的强制性认证要求。`,
      });
    }
    for (const key of reqs.optional) {
      const std = market.standards[key];
      if (!std) continue;
      rules.push({
        condition: `${params.productType} in ${market.code} (optional)`,
        market: market.code,
        certKey: key,
        priority: "recommended",
        rationale: `${std.name} 非强制要求，但可提升产品在 ${market.label} 市场的竞争力。`,
      });
    }
  }

  return rules;
}

function getMaterialRules(
  market: MarketConfig,
  params: ProductParams
): DecisionRule[] {
  const rules: DecisionRule[] = [];

  // Metal products → stricter lead content requirements
  if (params.material === "metal" && params.waterContact === "potable") {
    if (market.code === "US" || market.code === "CA") {
      const nsf372 = market.standards["NSF/ANSI/CAN 372"];
      if (nsf372) {
        rules.push({
          condition: `metal + potable water in ${market.code}`,
          market: market.code,
          certKey: "NSF/ANSI/CAN 372",
          priority: "critical",
          rationale: `金属材质接触饮用水必须通过 NSF/ANSI/CAN 372 无铅认证，加权平均铅含量 ≤ 0.25%。`,
        });
      }
    }
    if (market.code === "EU") {
      const reach = market.standards["REACH"];
      if (reach) {
        rules.push({
          condition: `metal in ${market.code}`,
          market: market.code,
          certKey: "REACH",
          priority: "critical",
          rationale: `金属材质产品在欧盟销售必须符合 REACH 法规，限制铅、镉、六价铬等重金属含量。`,
        });
      }
    }
  }

  // Plastic products → specific material testing
  if (params.material === "plastic" && params.waterContact === "potable") {
    if (market.code === "EU") {
      const dvgw = market.standards["DVGW"];
      if (dvgw) {
        rules.push({
          condition: `plastic + potable water in EU`,
          market: market.code,
          certKey: "DVGW",
          priority: "recommended",
          rationale: `塑料材质接触饮用水建议通过 DVGW 认证（德国标准），含 KTW 材料卫生测试。`,
        });
      }
    }
    if (market.code === "UK") {
      const bs6920 = market.standards["BS_6920"];
      if (bs6920) {
        rules.push({
          condition: `plastic + potable water in UK`,
          market: market.code,
          certKey: "BS_6920",
          priority: "recommended",
          rationale: `塑料材质接触饮用水建议通过 BS 6920 非金属材料卫生测试。`,
        });
      }
    }
  }

  // Ceramic → specific standards
  if (params.material === "ceramic") {
    if (market.code === "US") {
      const asme = market.standards["ASME A112.19.2"];
      if (asme && (params.productType === "toilet" || params.productType === "urinal")) {
        rules.push({
          condition: `ceramic toilet/urinal in US`,
          market: market.code,
          certKey: "ASME A112.19.2",
          priority: "recommended",
          rationale: `陶瓷马桶/小便器建议通过 ASME A112.19.2 冲水性能认证。`,
        });
      }
    }
    if (market.code === "EU") {
      const en997 = market.standards["EN_997"];
      if (en997 && params.productType === "toilet") {
        rules.push({
          condition: `ceramic toilet in EU`,
          market: market.code,
          certKey: "EN_997",
          priority: "recommended",
          rationale: `陶瓷马桶在欧盟销售建议通过 EN 997 冲水性能标准认证。`,
        });
      }
    }
  }

  return rules;
}

function getWaterContactRules(
  market: MarketConfig,
  params: ProductParams
): DecisionRule[] {
  const rules: DecisionRule[] = [];

  if (params.waterContact === "potable") {
    // All potable water products need basic material safety
    if (market.code === "US" || market.code === "CA") {
      const nsf61 = market.standards["NSF/ANSI/CAN 61"];
      if (nsf61) {
        rules.push({
          condition: `potable water contact in ${market.code}`,
          market: market.code,
          certKey: "NSF/ANSI/CAN 61",
          priority: "critical",
          rationale: `接触饮用水的产品必须通过 NSF/ANSI/CAN 61 饮用水系统组件安全认证。`,
        });
      }
    }
    if (market.code === "UK") {
      const wras = market.standards["WRAS"];
      if (wras) {
        rules.push({
          condition: `potable water contact in UK`,
          market: market.code,
          certKey: "WRAS",
          priority: "critical",
          rationale: `接触饮用水的产品在英国必须通过 WRAS 水务法规认证。`,
        });
      }
    }
    if (market.code === "EU") {
      const en1717 = market.standards["EN_1717"];
      if (en1717) {
        rules.push({
          condition: `potable water contact in EU`,
          market: market.code,
          certKey: "EN_1717",
          priority: "critical",
          rationale: `接触饮用水的产品在欧盟必须符合 EN 1717 饮用水防污染保护标准。`,
        });
      }
    }
    if (market.code === "AU") {
      const wmark = market.standards["WaterMark"];
      if (wmark) {
        rules.push({
          condition: `potable water contact in AU`,
          market: market.code,
          certKey: "WaterMark",
          priority: "critical",
          rationale: `接触饮用水的产品在澳大利亚必须通过 WaterMark 认证。`,
        });
      }
    }
  }

  // California-specific: all products need Prop 65
  if (market.code === "CA") {
    const prop65 = market.standards["CA_Prop65"];
    if (prop65) {
      rules.push({
        condition: `any product in California`,
        market: market.code,
        certKey: "CA_Prop65",
        priority: "critical",
        rationale: `所有在加州销售的产品必须符合 Proposition 65 要求，对铅、镉、邻苯二甲酸酯等有害物质进行披露。`,
      });
    }
  }

  return rules;
}

// ─── Utility: generate human-readable compliance checklist ───

export function generateChecklist(result: ComplianceResult): string {
  const lines: string[] = [];
  lines.push("# ComplianceGuard 合规路径清单\n");

  const uniqueMarkets = Array.from(new Set(result.paths.map((p) => p.market)));
  for (const market of uniqueMarkets) {
    const marketPaths = result.paths.filter((p) => p.market === market);
    lines.push(`## ${market} 市场\n`);

    for (const priority of ["critical", "recommended", "optional"] as const) {
      const items = marketPaths.filter((p) => p.priority === priority && !p.alreadyHeld);
      if (items.length === 0) continue;

      const label =
        priority === "critical"
          ? "🔴 强制要求"
          : priority === "recommended"
          ? "🟡 建议办理"
          : "🟢 可选提升";

      lines.push(`### ${label}`);
      for (const item of items) {
        lines.push(`- **${item.certName}**`);
        lines.push(`  - 认证机构: ${item.agency}`);
        lines.push(`  - 费用: ${item.fee}`);
        lines.push(`  - 周期: ${item.timeline}`);
        lines.push(`  - 说明: ${item.rationale}`);
        if (item.applicationSteps.length > 0) {
          lines.push(`  - 申请步骤:`);
          item.applicationSteps.forEach((step, i) => {
            lines.push(`    ${i + 1}. ${step}`);
          });
        }
        lines.push("");
      }
    }

    // Already held
    const held = marketPaths.filter((p) => p.alreadyHeld);
    if (held.length > 0) {
      lines.push(`### ✅ 已持有`);
      for (const item of held) {
        lines.push(`- ${item.certName}`);
      }
      lines.push("");
    }
  }

  lines.push("---");
  lines.push(`**总计**: ${result.summary.critical} 项强制 + ${result.summary.recommended} 项建议 + ${result.summary.optional} 项可选`);
  lines.push(`**预估总费用**: ${result.summary.totalEstimatedCost}`);
  lines.push(`**预估总周期**: ${result.summary.totalEstimatedTimeline}`);

  if (result.warnings.length > 0) {
    lines.push("\n**⚠️ 警告**:");
    result.warnings.forEach((w) => lines.push(`- ${w}`));
  }

  return lines.join("\n");
}
