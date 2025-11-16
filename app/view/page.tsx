'use client'

import { useEffect, useState } from 'react'
import { TripSettings } from '@/lib/types'

export default function ParticipantHomePage() {
  const [tripSettings, setTripSettings] = useState<TripSettings | null>(null)
  const [todayDate] = useState(new Date().toISOString().split('T')[0])

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-blue-500">
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">
                🏂 {tripSettings?.trip_name || '滑雪團行程'}
              </h1>
              <p className="text-lg text-gray-600">
                📍 {tripSettings?.location || '載入中...'}
              </p>
              {tripSettings?.start_date && tripSettings?.end_date && (
                <p className="text-sm text-gray-500 mt-1">
                  📅 {tripSettings.start_date} ~ {tripSettings.end_date}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">今天</p>
              <p className="text-2xl font-bold text-blue-600">{todayDate}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        {/* 快速資訊卡片 */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-3xl mb-2">📢</div>
            <h3 className="font-bold text-lg mb-1">最新公告</h3>
            <p className="text-sm text-gray-600">查看重要通知</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-3xl mb-2">🏂</div>
            <h3 className="font-bold text-lg mb-1">今日分組</h3>
            <p className="text-sm text-gray-600">我在哪一組？</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="text-3xl mb-2">🍽️</div>
            <h3 className="font-bold text-lg mb-1">餐飲安排</h3>
            <p className="text-sm text-gray-600">今天吃什麼？</p>
          </div>
        </div>

        {/* 功能導航 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 行程資訊</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/view/people"
              className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-all border-2 border-transparent hover:border-blue-300"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">👥</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600">
                    參加人員名單
                  </h3>
                  <p className="text-sm text-gray-600">查看所有參加者資訊</p>
                </div>
              </div>
            </a>

            <a
              href="/view/groups"
              className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-md transition-all border-2 border-transparent hover:border-green-300"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">🏂</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600">
                    滑雪分組
                  </h3>
                  <p className="text-sm text-gray-600">查看每日分組安排</p>
                </div>
              </div>
            </a>

            <a
              href="/view/announcements"
              className="group p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg hover:shadow-md transition-all border-2 border-transparent hover:border-yellow-300"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">📢</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-yellow-600">
                    公告事項
                  </h3>
                  <p className="text-sm text-gray-600">重要通知與提醒</p>
                </div>
              </div>
            </a>

            <a
              href="/view/meals"
              className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-all border-2 border-transparent hover:border-purple-300"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">🍽️</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600">
                    餐飲安排
                  </h3>
                  <p className="text-sm text-gray-600">每日用餐時間地點</p>
                </div>
              </div>
            </a>

            <a
              href="/view/transport"
              className="group p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg hover:shadow-md transition-all border-2 border-transparent hover:border-red-300"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">🚗</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600">
                    交通協調
                  </h3>
                  <p className="text-sm text-gray-600">接送安排與車輛資訊</p>
                </div>
              </div>
            </a>

            <a
              href="/view/tasks"
              className="group p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg hover:shadow-md transition-all border-2 border-transparent hover:border-indigo-300"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">✅</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600">
                    任務清單
                  </h3>
                  <p className="text-sm text-gray-600">待辦事項與準備工作</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* 提示區 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">參加者模式</h3>
              <p className="text-sm text-blue-800">
                這是唯讀瀏覽模式，您可以查看所有行程資訊但無法編輯。<br />
                如需修改資料，請聯繫管理員或前往
                <a href="/" className="underline font-bold ml-1 hover:text-blue-600">
                  管理後台
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
