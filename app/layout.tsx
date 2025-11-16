import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '神居雪場滑雪團 - 行程管理',
  description: '30人滑雪團隊協調工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
