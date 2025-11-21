'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TripSettings } from '@/lib/types'

export default function HomePage() {
  const [tripSettings, setTripSettings] = useState<TripSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSettingUp, setIsSettingUp] = useState(false)

  useEffect(() => {
    fetchTripSettings()
  }, [])

  async function fetchTripSettings() {
    try {
      setIsLoading(true)
      // 直接從環境變數取得 trip_id，確保 API 端點正確查詢
      const tripId = process.env.NEXT_PUBLIC_DEMO_TRIP_ID || '1'
      const res = await fetch(`/api/trip-settings?trip_id=${tripId}`)
      const data = await res.json()
      setTripSettings(data)
    } catch (err) {
      console.error('載入行程設定錯誤:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Empty State / Setup Needed
  if (!isLoading && !tripSettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <div className="text-5xl mb-4">🏔️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">尚未建立行程資料</h1>
          <p className="text-gray-600 mb-6">
            系統找不到目前的行程設定。這可能是因為這是第一次執行，或者環境變數設定有誤。
          </p>

          <div className="bg-blue-50 p-4 rounded-lg text-left text-sm mb-6">
            <p className="font-bold text-blue-900 mb-2">除錯資訊：</p>
            <ul className="space-y-1 text-blue-800">
              <li>Env Trip ID: {process.env.NEXT_PUBLIC_DEMO_TRIP_ID || '未設定'}</li>
            </ul>
          </div>

          <button
            onClick={async () => {
              setIsSettingUp(true)
              try {
                const res = await fetch('/api/admin/setup-demo', { method: 'POST' })
                const result = await res.json()
                if (result.success) {
                  alert(result.message + '\n\n' + result.instruction)
                  window.location.reload()
                } else {
                  alert('建立失敗: ' + (result.error || '未知錯誤'))
                }
              } catch (e) {
                alert('系統錯誤')
              } finally {
                setIsSettingUp(false)
              }
            }}
            disabled={isSettingUp}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition"
          >
            {isSettingUp ? '建立中...' : '🚀 一鍵建立 Demo 資料'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Global Navigation / Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🏂 DIY Ski Trip Planner</h1>
              <p className="text-sm text-gray-500">滑雪團行程協調系統 - 讓多人滑雪更簡單</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/apply"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ✨ 申請使用
              </Link>
              <Link
                href="/admin/login"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                🔐 管理員登入
              </Link>
            </div>
          </div>

          {/* Introduction Banner */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-blue-400 text-xl">ℹ️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">關於本系統</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <div className="space-y-2">
                    <p>這是一個專為滑雪團設計的協作工具，解決分組、交通、餐飲等協調痛點。</p>
                    <div className="mt-2 p-3 bg-blue-100 rounded-md text-blue-900">
                      <p className="font-bold mb-1">👇 您可以這樣開始：</p>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        <li><strong>體驗功能</strong>：下方是實際運作中的範例行程，您可以隨意瀏覽。</li>
                        <li><strong>了解更多</strong>：點擊上方「申請使用」，內有完整的 <span className="underline">系統功能介紹</span>。</li>
                        <li><strong>立即開團</strong>：如果您是團主，請直接申請建立您的專屬行程。</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Current Trip Dashboard (The "Demo") */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            📍 當前行程看板
            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-normal">
              Trip ID: {tripSettings?.trip_id || '...'}
            </span>
          </h2>
          <span className="text-sm text-gray-500">
            地點: {tripSettings?.location || '載入中...'}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {/* 團主入口 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all group">
            <div className="bg-blue-600 p-6 text-white text-center">
              <div className="text-5xl mb-4">�</div>
              <h2 className="text-2xl font-bold">我是團主</h2>
              <p className="text-blue-100 mt-2">管理行程、人員與分組</p>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-6">
                登入後可編輯所有行程細節，<br />包含人員名單、滑雪分組與公告發布。
              </p>
              <Link
                href="/organizer/login"
                className="inline-block w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
              >
                團主登入 →
              </Link>
            </div>
          </div>

          {/* 訪客入口 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-green-500 transition-all group">
            <div className="bg-green-600 p-6 text-white text-center">
              <div className="text-5xl mb-4">�</div>
              <h2 className="text-2xl font-bold">我是參加者</h2>
              <p className="text-green-100 mt-2">查看分組、行程與公告</p>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-6">
                無需登入即可查看公開資訊，<br />包含每日分組、餐廳與交通安排。
              </p>
              <Link
                href="/view"
                className="inline-block w-full py-3 px-6 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-md"
              >
                進入訪客視角 →
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Comprehensive Sitemap Footer */}
        <footer className="border-t border-gray-200 pt-8 pb-12">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            🗺️ 網站導覽 (Sitemap)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">一般用戶</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-blue-600">首頁 (Dashboard)</Link></li>
                <li><Link href="/apply" className="text-gray-600 hover:text-blue-600">申請使用</Link></li>
                <li><Link href="/view" className="text-gray-600 hover:text-blue-600">訪客唯讀模式</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">行程管理</h4>
              <ul className="space-y-2">
                <li><Link href="/trip-settings" className="text-gray-600 hover:text-blue-600">行程設定</Link></li>
                <li><Link href="/people" className="text-gray-600 hover:text-blue-600">人員管理</Link></li>
                <li><Link href="/groups" className="text-gray-600 hover:text-blue-600">滑雪分組</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">後勤協調</h4>
              <ul className="space-y-2">
                <li><Link href="/announcements" className="text-gray-600 hover:text-blue-600">公告</Link></li>
                <li><Link href="/meals" className="text-gray-600 hover:text-blue-600">餐飲</Link></li>
                <li><Link href="/transport" className="text-gray-600 hover:text-blue-600">交通</Link></li>
                <li><Link href="/tasks" className="text-gray-600 hover:text-blue-600">任務</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">系統管理</h4>
              <ul className="space-y-2">
                <li><Link href="/admin/login" className="text-gray-600 hover:text-blue-600">Super Admin 登入</Link></li>
                <li><Link href="/admin/trips" className="text-gray-600 hover:text-blue-600">所有行程列表</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
            <p>&copy; 2025 DIY Ski Trip Planner. Built with ❤️ by James.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
