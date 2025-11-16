import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '神居雪场滑雪团 - 行程管理',
  description: '30人滑雪团队协调工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
