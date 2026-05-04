"use client"

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      <Footer />
    </>
  );
}
