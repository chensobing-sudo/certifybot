// API: Compliance evaluation endpoint
// Uses decision tree engine to evaluate product compliance requirements

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateCompliance,
  generateChecklist,
  type ProductParams,
} from "@/data/compliance/decision-tree/rules";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { params, parsedProduct } = body as {
      params: ProductParams;
      parsedProduct?: any;
    };

    if (!params || !params.productType || !params.material || !params.waterContact || !params.targetMarkets?.length) {
      return NextResponse.json(
        { error: "缺少必要参数：产品类型、材质、水接触情况、目标市场" },
        { status: 400 }
      );
    }

    // Run decision tree evaluation
    const result = evaluateCompliance(params);

    // Generate human-readable checklist
    const checklist = generateChecklist(result);

    // If we have parsed product data from PDF, merge it
    if (parsedProduct?.product) {
      result.productParams = {
        ...result.productParams,
        certificationsHeld: [
          ...result.productParams.certificationsHeld,
          ...(parsedProduct.product.certifications ?? []),
        ],
      };
    }

    return NextResponse.json({
      result,
      checklist,
      parsedProduct: parsedProduct ?? null,
    });
  } catch (err: any) {
    console.error("Compliance evaluation error:", err);
    return NextResponse.json(
      { error: err.message ?? "评估失败" },
      { status: 500 }
    );
  }
}
