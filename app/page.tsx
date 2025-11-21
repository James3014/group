'use client'

import { useEffect, useState } from 'react'
import { TripSettings } from '@/lib/types'

export default function HomePage() {
  const [tripSettings, setTripSettings] = useState<TripSettings | null>(null)

  useEffect(() => {
    fetchTripSettings()
  }, [])

  async function fetchTripSettings() {
    try {
      const res = await fetch('/api/trip-settings')
      const data = await res.json()
      setTripSettings(data)
    } catch (err) {
      console.error('載入行程設定錯誤:', err)
    }
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
              <a
                href="/apply"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ✨ 申請使用
              </a>
              <a
                href="/admin/login"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                🔐 管理員登入
              </a>
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
                  <p>
                    這是一個專為滑雪團設計的協作工具，解決分組、交通、餐飲等協調痛點。<br/>
                    目前下方顯示的是 <strong>{tripSettings?.trip_name || 'James 的滑雪團'}</strong> 的實際運作畫面。
                    如果您也想為您的滑雪團建立一樣的系統，請點擊上方「申請使用」。
                  </p>
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
            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-normal">Trip ID: 1</span>
          </h2>
          <span className="text-sm text-gray-500">
            地點: {tripSettings?.location || '載入中...'}
          </span>
        </div>

        <nav className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <a href="/trip-settings" className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⛷️</div>
            <h2 className="font-bold text-gray-900">行程設定</h2>
            <p className="text-xs text-gray-500 mt-1">基本資訊管理</p>
          </a>
          <a href="/people" className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
            <h2 className="font-bold text-gray-900">人員管理</h2>
            <p className="text-xs text-gray-500 mt-1">名單與親子關係</p>
          </a>
          <a href="/groups" className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏂</div>
            <h2 className="font-bold text-gray-900">滑雪分組</h2>
            <p className="text-xs text-gray-500 mt-1">每日分組與教學</p>
          </a>
          <a href="/announcements" className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📢</div>
            <h2 className="font-bold text-gray-900">公告系統</h2>
            <p className="text-xs text-gray-500 mt-1">發布重要通知</p>
          </a>
          <a href="/meals" className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🍽️</div>
            <h2 className="font-bold text-gray-900">餐飲安排</h2>
            <p className="text-xs text-gray-500 mt-1">餐廳與座位</p>
          </a>
          <a href="/transport" className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🚗</div>
            <h2 className="font-bold text-gray-900">交通協調</h2>
            <p className="text-xs text-gray-500 mt-1">車輛與接送</p>
          </a>
          <a href="/tasks" className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">✅</div>
            <h2 className="font-bold text-gray-900">任務清單</h2>
            <p className="text-xs text-gray-500 mt-1">待辦事項追蹤</p>
          </a>
          <a href="/view/page" className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm hover:shadow-md transition border border-blue-100 group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👀</div>
            <h2 className="font-bold text-blue-900">訪客視角</h2>
            <p className="text-xs text-blue-700 mt-1">預覽參加者看到的畫面</p>
          </a>
        </nav>

        {/* 3. Comprehensive Sitemap Footer */}
        <footer className="border-t border-gray-200 pt-8 pb-12">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            🗺️ 網站導覽 (Sitemap)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">一般用戶</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-600 hover:text-blue-600">首頁 (Dashboard)</a></li>
                <li><a href="/apply" className="text-gray-600 hover:text-blue-600">申請使用</a></li>
                <li><a href="/view/page" className="text-gray-600 hover:text-blue-600">訪客唯讀模式</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">行程管理</h4>
              <ul className="space-y-2">
                <li><a href="/trip-settings" className="text-gray-600 hover:text-blue-600">行程設定</a></li>
                <li><a href="/people" className="text-gray-600 hover:text-blue-600">人員管理</a></li>
                <li><a href="/groups" className="text-gray-600 hover:text-blue-600">滑雪分組</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">後勤協調</h4>
              <ul className="space-y-2">
                <li><a href="/announcements" className="text-gray-600 hover:text-blue-600">公告</a></li>
                <li><a href="/meals" className="text-gray-600 hover:text-blue-600">餐飲</a></li>
                <li><a href="/transport" className="text-gray-600 hover:text-blue-600">交通</a></li>
                <li><a href="/tasks" className="text-gray-600 hover:text-blue-600">任務</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">系統管理</h4>
              <ul className="space-y-2">
                <li><a href="/admin/login" className="text-gray-600 hover:text-blue-600">Super Admin 登入</a></li>
                <li><a href="/admin/trips" className="text-gray-600 hover:text-blue-600">所有行程列表</a></li>
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
