"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FeedbackCategory, FeedbackFormData } from "@/lib/feedback/types"
import { MessageSquare, Star, Send, CheckCircle, Bug, Lightbulb, Heart, FileText, MessageCircle } from "lucide-react"

const CATEGORIES: { value: FeedbackCategory; label: string; icon: typeof Bug }[] = [
  { value: "bug", label: "功能异常", icon: Bug },
  { value: "feature", label: "功能建议", icon: Lightbulb },
  { value: "experience", label: "使用体验", icon: Heart },
  { value: "content", label: "内容纠错", icon: FileText },
  { value: "other", label: "其他", icon: MessageCircle },
]

const RATING_LABELS = ["", "很差", "较差", "一般", "较好", "非常好"]

export function FeedbackForm() {
  const [step, setStep] = useState<"form" | "success">("form")
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<FeedbackFormData>({
    category: "experience",
    rating: 4,
    title: "",
    content: "",
    contact: "",
    page: typeof window !== "undefined" ? window.location.pathname : "",
  })

  const canSubmit = form.title.trim().length >= 2 && form.content.trim().length >= 5

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("提交失败")
      setStep("success")
    } catch {
      alert("提交失败，请稍后重试")
    } finally {
      setSubmitting(false)
    }
  }

  if (step === "success") {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl">感谢您的反馈！</CardTitle>
          <CardDescription className="text-center max-w-sm">
            您的每一条建议都是我们迭代升级的重要参考。我们会定期整理用户反馈，持续优化 CertifyBot。
          </CardDescription>
          <Button
            variant="outline"
            onClick={() => {
              setStep("form")
              setForm({ category: "experience", rating: 4, title: "", content: "", contact: "", page: window.location.pathname })
            }}
          >
            再写一条
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">反馈建议</CardTitle>
        </div>
        <CardDescription>
          帮助我们做得更好 — 您的每一条反馈都会被认真对待
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">反馈类型</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const selected = form.category === cat.value
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                    selected
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            评分 <span className="text-gray-400">（{RATING_LABELS[form.rating]}）</span>
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= form.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="用一句话概括您的建议..."
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            maxLength={100}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            详细描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="请详细描述您的建议、遇到的问题或改进想法..."
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            maxLength={2000}
          />
          <p className="mt-1 text-xs text-gray-400">{form.content.length}/2000</p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            联系方式 <span className="text-gray-400">（选填，方便我们进一步沟通）</span>
          </label>
          <input
            type="text"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            placeholder="邮箱、微信或手机号..."
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="w-full"
        >
          {submitting ? (
            "提交中..."
          ) : (
            <>
              <Send className="mr-1.5 h-4 w-4" />
              提交反馈
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
