'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function OrganizerDashboard() {
    const [tripName, setTripName] = useState('')
    const [tripId, setTripId] = useState('')

    useEffect(() => {
        // 檢查登入狀態
        const storedTripId = localStorage.getItem('organizer_trip_id')
        if (!storedTripId) {
            window.location.href = '/organizer/login'
            return
        }
        setTripId(storedTripId)

        // 獲取行程名稱 (Optional)
        // 這裡簡單處理，實際可以 call API
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('organizer_token')
        localStorage.removeItem('organizer_trip_id')
        document.cookie = 'trip_token=; path=/; max-age=0'
        window.location.href = '/'
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">👑</div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">團主管理後台</h1>
                            <p className="text-xs text-gray-500">Trip ID: {tripId}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        登出
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* 核心管理功能 */}
                    <Link href="/trip-settings" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-blue-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg text-2xl group-hover:scale-110 transition">⛷️</div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">設定</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">行程設定</h3>
                        <p className="text-sm text-gray-600">修改行程名稱、日期、地點與備註資訊。</p>
                    </Link>

                    <Link href="/people" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-indigo-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 rounded-lg text-2xl group-hover:scale-110 transition">👥</div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">人員</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">人員管理</h3>
                        <p className="text-sm text-gray-600">新增、編輯成員名單，設定親子關係與裝備需求。</p>
                    </Link>

                    <Link href="/groups" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-green-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-50 rounded-lg text-2xl group-hover:scale-110 transition">🏂</div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">分組</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">滑雪分組</h3>
                        <p className="text-sm text-gray-600">每日滑雪分組安排，拖拉分配成員與教練。</p>
                    </Link>

                    {/* 後勤功能 */}
                    <Link href="/announcements" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-yellow-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-yellow-50 rounded-lg text-2xl group-hover:scale-110 transition">📢</div>
                            <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">公告</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">公告系統</h3>
                        <p className="text-sm text-gray-600">發布重要通知，所有參加者都能在首頁看到。</p>
                    </Link>

                    <Link href="/meals" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-purple-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 rounded-lg text-2xl group-hover:scale-110 transition">🍽️</div>
                            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">餐飲</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">餐飲安排</h3>
                        <p className="text-sm text-gray-600">管理每日餐廳訂位、菜單與座位分配。</p>
                    </Link>

                    <Link href="/transport" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-red-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-50 rounded-lg text-2xl group-hover:scale-110 transition">🚗</div>
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">交通</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">交通協調</h3>
                        <p className="text-sm text-gray-600">安排接送車輛、分配乘客與行李。</p>
                    </Link>

                    <Link href="/tasks" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-gray-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg text-2xl group-hover:scale-110 transition">✅</div>
                            <span className="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded">任務</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">任務清單</h3>
                        <p className="text-sm text-gray-600">追蹤待辦事項，分配任務給工作人員。</p>
                    </Link>

                    {/* 預覽 */}
                    <Link href="/view" target="_blank" className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition text-white">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/10 rounded-lg text-2xl group-hover:scale-110 transition">👀</div>
                            <span className="text-xs font-bold text-white/80 bg-white/20 px-2 py-1 rounded">預覽</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">訪客視角</h3>
                        <p className="text-sm text-gray-300">在新分頁開啟訪客模式，預覽參加者看到的畫面。</p>
                    </Link>

                </div>
            </main>
        </div>
    )
}
