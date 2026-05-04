import { NextRequest, NextResponse } from "next/server"
import { submitFeedback, getFeedbackStats } from "@/lib/feedback/store"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { category, rating, title, content, contact, page } = body

    if (!category || !title || !content) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 })
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "评分必须在 1-5 之间" }, { status: 400 })
    }
    if (title.trim().length < 2) {
      return NextResponse.json({ error: "标题至少 2 个字符" }, { status: 400 })
    }
    if (content.trim().length < 5) {
      return NextResponse.json({ error: "内容至少 5 个字符" }, { status: 400 })
    }

    const entry = await submitFeedback({
      category,
      rating,
      title: title.trim(),
      content: content.trim(),
      contact: contact?.trim() || undefined,
      page: page?.trim() || undefined,
    })

    return NextResponse.json({ success: true, data: entry })
  } catch (error) {
    console.error("Feedback submit error:", error)
    return NextResponse.json({ error: "提交失败" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const stats = await getFeedbackStats()
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error("Feedback stats error:", error)
    return NextResponse.json({ error: "获取统计失败" }, { status: 500 })
  }
}
