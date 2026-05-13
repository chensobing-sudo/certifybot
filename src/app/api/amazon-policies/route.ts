// API: Amazon Policy Updates
// Returns structured policy updates for compliance monitoring

import { NextRequest, NextResponse } from "next/server";
import {
  getPolicyUpdates,
  getCriticalUpdates,
  getUpdatesForProduct,
} from "@/data/compliance/amazon-policies/policies";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const market = searchParams.get("market") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const severity = searchParams.get("severity") ?? undefined;
  const productType = searchParams.get("productType") ?? undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!, 10)
    : undefined;

  try {
    if (productType) {
      const updates = getUpdatesForProduct(productType);
      return NextResponse.json({
        count: updates.length,
        updates,
      });
    }

    if (severity === "critical") {
      const updates = getCriticalUpdates();
      return NextResponse.json({
        count: updates.length,
        updates,
      });
    }

    const updates = getPolicyUpdates({ market, category, severity, limit });
    return NextResponse.json({
      count: updates.length,
      updates,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "获取政策更新失败" },
      { status: 500 }
    );
  }
}
