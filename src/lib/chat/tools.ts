// ─── Agent Tool Definitions ───
// Function calling tools for the compliance chat agent

import type { ProductParams, MaterialCategory, WaterContactLevel, ProductCategory } from "@/data/compliance/decision-tree/rules";

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export const COMPLIANCE_TOOLS: ToolDefinition[] = [
  {
    name: "evaluate_compliance",
    description: "根据产品参数评估合规要求，返回认证路径清单。在用户提供了产品类型、材质、水接触情况和目标市场后调用。",
    parameters: {
      type: "object",
      properties: {
        productType: {
          type: "string",
          enum: [
            "faucet", "shower_head", "shower_tray", "toilet", "bidet",
            "bathtub", "washbasin", "valve", "water_heater", "water_treatment",
            "pipe", "fitting", "urinal", "flushometer", "drain", "trap", "other"
          ],
          description: "产品类型"
        },
        material: {
          type: "string",
          enum: ["metal", "plastic", "ceramic", "glass", "composite", "rubber", "other"],
          description: "主要材质"
        },
        waterContact: {
          type: "string",
          enum: ["potable", "non-potable", "no-contact"],
          description: "与水接触情况：potable=接触饮用水, non-potable=接触非饮用水, no-contact=不接触水"
        },
        targetMarkets: {
          type: "array",
          items: { type: "string", enum: ["US", "EU", "CA", "UK", "AU"] },
          description: "目标市场（可多选）：US=美国, EU=欧盟, CA=加州, UK=英国, AU=澳大利亚"
        },
        intendedUse: {
          type: "string",
          enum: ["residential", "commercial", "industrial"],
          description: "预期用途：residential=家用, commercial=商用, industrial=工业用"
        },
        hasElectrical: {
          type: "boolean",
          description: "是否含电气组件（如智能马桶盖、电热水器等）"
        },
        certificationsHeld: {
          type: "array",
          items: { type: "string" },
          description: "已持有的认证列表（可选）"
        }
      },
      required: ["productType", "material", "waterContact", "targetMarkets"]
    }
  },
  {
    name: "get_market_info",
    description: "获取某个目标市场的合规要求概览，包括该市场需要的主要认证和特点。",
    parameters: {
      type: "object",
      properties: {
        market: {
          type: "string",
          enum: ["US", "EU", "CA", "UK", "AU"],
          description: "市场代码"
        }
      },
      required: ["market"]
    }
  },
  {
    name: "get_cert_agency_info",
    description: "查询某个认证对应的认证机构信息，包括申请流程、周期和费用。",
    parameters: {
      type: "object",
      properties: {
        certName: {
          type: "string",
          description: "认证名称，如 NSF/ANSI 61, WRAS, CE_CPR 等"
        }
      },
      required: ["certName"]
    }
  }
];

// ─── Tool Implementations ───

import { evaluateCompliance, generateChecklist } from "@/data/compliance/decision-tree/rules";
import { getMarket } from "@/lib/market-config";
import { getAgenciesForCert } from "@/data/compliance/cert-agencies/agencies";

export async function executeToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<{ result: unknown; error?: string }> {
  try {
    switch (name) {
      case "evaluate_compliance": {
        const params: ProductParams = {
          productType: args.productType as ProductCategory,
          material: args.material as MaterialCategory,
          waterContact: args.waterContact as WaterContactLevel,
          targetMarkets: args.targetMarkets as string[],
          intendedUse: (args.intendedUse as "residential" | "commercial" | "industrial") ?? "residential",
          hasElectricalComponents: (args.hasElectrical as boolean) ?? false,
          certificationsHeld: (args.certificationsHeld as string[]) ?? [],
        };
        const result = evaluateCompliance(params);
        const checklist = generateChecklist(result);
        return {
          result: {
            summary: result.summary,
            paths: result.paths.map((p) => ({
              certName: p.certName,
              market: p.market,
              priority: p.priority,
              rationale: p.rationale,
              agency: p.agency,
              fee: p.fee,
              timeline: p.timeline,
              alreadyHeld: p.alreadyHeld,
            })),
            warnings: result.warnings,
            checklist,
          },
        };
      }

      case "get_market_info": {
        const market = getMarket(args.market as string);
        if (!market) return { result: null, error: `未知市场: ${args.market}` };
        const standards = Object.entries(market.standards).map(([key, std]) => ({
          key,
          name: std.name,
          issuer: std.issuer,
          fee: std.fee,
          timeline: std.timeline,
          required: std.required,
        }));
        return {
          result: {
            code: market.code,
            label: market.label,
            currency: market.currency,
            standards,
            standardCount: standards.length,
          },
        };
      }

      case "get_cert_agency_info": {
        const agencies = getAgenciesForCert(args.certName as string);
        if (agencies.length === 0) return { result: null, error: `未找到认证机构: ${args.certName}` };
        return {
          result: agencies.map((a) => ({
            name: a.shortName,
            type: a.type,
            regions: a.regions,
            website: a.website,
            estimatedTimeline: a.estimatedLeadTime,
            applicationProcess: a.applicationProcess,
          })),
        };
      }

      default:
        return { result: null, error: `未知工具: ${name}` };
    }
  } catch (err: any) {
    return { result: null, error: err.message ?? "工具执行失败" };
  }
}
