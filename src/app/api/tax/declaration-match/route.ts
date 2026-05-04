import { NextRequest, NextResponse } from "next/server"
import { matchDeclarationMode } from "@/lib/tax/declaration-matcher"
import type { DeclarationModeMatchRequest } from "@/lib/tax/types"

export async function POST(request: NextRequest) {
  try {
    const body: DeclarationModeMatchRequest = await request.json()

    if (!body.companyProfile || !body.exportDetails) {
      return NextResponse.json(
        { success: false, error: "缺少企业信息或出口详情" },
        { status: 400 }
      )
    }

    const result = matchDeclarationMode(body)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("报关模式匹配失败:", error)
    return NextResponse.json(
      { success: false, error: "报关模式匹配处理失败", details: String(error) },
      { status: 500 }
    )
  }
}
