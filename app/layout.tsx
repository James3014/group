import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SkiGroup Manager - 滑雪團行程協調系統',
  description: '專為滑雪團設計的協作工具，輕鬆管理分組、交通、餐飲',
  openGraph: {
    title: 'SkiGroup Manager',
    description: '專為滑雪團設計的協作工具，輕鬆管理分組、交通、餐飲',
    type: 'website',
    locale: 'zh_TW',
  },
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
