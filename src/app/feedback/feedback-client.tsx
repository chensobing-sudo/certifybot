"use client"

import { FeedbackForm } from "@/components/feedback/feedback-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Sparkles, Target, Users } from "lucide-react"

const HIGHLIGHTS = [
  {
    icon: Target,
    title: "功能建议",
    desc: "告诉我们您需要的合规功能，我们会优先开发",
  },
  {
    icon: Users,
    title: "体验优化",
    desc: "使用中遇到任何不便，我们立即改进",
  },
  {
    icon: Sparkles,
    title: "内容完善",
    desc: "发现知识库有误或需要补充？请告诉我们",
  },
]

export function FeedbackPageClient() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
          <MessageSquare className="h-4 w-4" />
          用户反馈
        </div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          帮助我们做得更好
        </h1>
        <p className="mt-3 text-base text-gray-500">
          CertifyBot 还在持续迭代中，您的每一条反馈都是我们前进的动力
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <FeedbackForm />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">我们会认真对待</CardTitle>
              <CardDescription>每一条反馈的处理流程</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">1</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">收集整理</p>
                  <p className="text-xs text-gray-500">定期汇总所有用户反馈</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">评估优先级</p>
                  <p className="text-xs text-gray-500">按频次和影响排序</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">3</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">迭代开发</p>
                  <p className="text-xs text-gray-500">纳入下一版本开发计划</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">4</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">更新公告</p>
                  <p className="text-xs text-gray-500">在版本更新中致谢反馈用户</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title}>
                <CardContent className="flex items-start gap-3 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Icon className="h-4.5 w-4.5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
