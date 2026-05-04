import { NextRequest, NextResponse } from "next/server"
import { runTaxHealthCheck } from "@/lib/tax/health-check-engine"
import type { TaxHealthCheckRequest } from "@/lib/tax/types"

export async function POST(request: NextRequest) {
  try {
    const body: TaxHealthCheckRequest = await request.json()

    if (!body.company) {
      return NextResponse.json(
        { success: false, error: "缺少企业信息" },
        { status: 400 }
      )
    }

    const result = runTaxHealthCheck(body)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("税务体检失败:", error)
    return NextResponse.json(
      { success: false, error: "税务体检处理失败", details: String(error) },
      { status: 500 }
    )
  }
}
