"use client"

import { FeedbackForm } from "@/components/feedback/feedback-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Sparkles, Target, Users, HeartHandshake, ArrowRight } from "lucide-react"

const HIGHLIGHTS = [
  {
    icon: Target,
    title: "功能建议",
    desc: "告诉我们您需要的合规功能，我们会优先开发",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Users,
    title: "体验优化",
    desc: "使用中遇到任何不便，我们立即改进",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Sparkles,
    title: "内容完善",
    desc: "发现知识库有误或需要补充？请告诉我们",
    color: "bg-amber-50 text-amber-600",
  },
]

const PROCESS_STEPS = [
  { step: "1", title: "收集整理", desc: "定期汇总所有用户反馈", color: "bg-blue-500" },
  { step: "2", title: "评估优先级", desc: "按频次和影响排序", color: "bg-emerald-500" },
  { step: "3", title: "迭代开发", desc: "纳入下一版本开发计划", color: "bg-purple-500" },
  { step: "4", title: "更新公告", desc: "在版本更新中致谢反馈用户", color: "bg-amber-500" },
]

export function FeedbackPageClient() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 pb-safe-mobile">
      {/* Hero */}
      <div className="mb-8 sm:mb-12 text-center">
        <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-light)] px-3 sm:px-4 py-1 sm:py-1.5">
          <MessageSquare className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[var(--accent)]" />
          <span className="text-[10px] sm:text-xs font-medium text-[var(--accent)]">用户反馈</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text)] mb-2 sm:mb-3">
          帮助我们做得更好
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto">
          CertifyBot 还在持续迭代中，您的每一条反馈都是我们前进的动力
        </p>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-5">
        {/* Left: Form */}
        <div className="lg:col-span-3">
          <FeedbackForm />
        </div>

        {/* Right: Process & highlights */}
        <div className="space-y-4 sm:space-y-5 lg:col-span-2">
          {/* Process card */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-[var(--accent)]" />
                我们会认真对待
              </CardTitle>
              <CardDescription>每一条反馈的处理流程</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              {PROCESS_STEPS.map((item, i) => (
                <div key={item.step} className="flex items-start gap-3 pb-3 sm:pb-4 last:pb-0 relative">
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  <span className={`relative z-10 flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full text-[9px] sm:text-[10px] font-bold text-white ${item.color}`}>
                    {item.step}
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-[var(--text)]">{item.title}</p>
                    <p className="text-[10px] sm:text-xs text-[var(--muted)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Highlight cards */}
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title} className="card-hover active:scale-[0.98] transition-transform">
                <CardContent className="flex items-start gap-3 py-3 sm:py-4">
                  <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                    <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-[var(--text)]">{item.title}</p>
                    <p className="text-[10px] sm:text-xs text-[var(--muted)] mt-0.5">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--muted)] shrink-0 mt-1" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
