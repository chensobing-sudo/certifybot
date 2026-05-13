import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "./client-layout";

export const metadata: Metadata = {
  title: "CertifyBot — 出口合规通",
  description: "卫浴/五金出口合规 AI Agent — 标准查询 · 税务合规 · 智能报告",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
