'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TripSettings } from '@/lib/types'
import { useSearchParams } from 'next/navigation'

export default function ViewPageContent() {
    const searchParams = useSearchParams()
    const tripId = searchParams.get('trip_id') || process.env.NEXT_PUBLIC_DEMO_TRIP_ID || '1'

    const [tripSettings, setTripSettings] = useState<TripSettings | null>(null)
    const [todayDate] = useState(new Date().toISOString().split('T')[0])

    useEffect(() => {
        fetchTripSettings()
    }, [tripId])

    async function fetchTripSettings() {
        try {
            const res = await fetch(`/api/trip-settings?trip_id=${tripId}`)
            const data = await res.json()
            setTripSettings(data)
        } catch (err) {
            console.error('載入行程設定錯誤:', err)
        }
    }

    if (!tripSettings) return <div className="p-4 text-center">載入中...</div>

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 md:p-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {tripSettings.trip_name || '滑雪團行程'}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-blue-100 text-sm md:text-base">
                        <div className="flex items-center gap-1">
                            <span>📍</span>
                            <span>{tripSettings.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>📅</span>
                            <span>{tripSettings.start_date} ~ {tripSettings.end_date}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="max-w-4xl mx-auto px-4 -mt-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                    <Link href={`/view/groups?trip_id=${tripId}`} className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center justify-center text-center h-32 md:h-40">
                        <span className="text-3xl md:text-4xl mb-2">🏂</span>
                        <span className="font-bold text-gray-800">滑雪分組</span>
                        <span className="text-xs text-gray-500 mt-1">查看每日分組</span>
                    </Link>

                    <Link href={`/view/people?trip_id=${tripId}`} className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center justify-center text-center h-32 md:h-40">
                        <span className="text-3xl md:text-4xl mb-2">👥</span>
                        <span className="font-bold text-gray-800">人員名單</span>
                        <span className="text-xs text-gray-500 mt-1">認識團員</span>
                    </Link>

                    <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center h-32 md:h-40 opacity-50 cursor-not-allowed">
                        <span className="text-3xl md:text-4xl mb-2">📅</span>
                        <span className="font-bold text-gray-800">每日行程</span>
                        <span className="text-xs text-gray-500 mt-1">即將開放</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center h-32 md:h-40 opacity-50 cursor-not-allowed">
                        <span className="text-3xl md:text-4xl mb-2">ℹ️</span>
                        <span className="font-bold text-gray-800">詳細資訊</span>
                        <span className="text-xs text-gray-500 mt-1">即將開放</span>
                    </div>
                </div>
            </div>

            {/* Announcements Section */}
            <div className="max-w-4xl mx-auto px-4 mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>📢</span> 最新公告
                </h2>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-400">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">歡迎參加本次滑雪團！</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{todayDate}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        請大家務必確認自己的分組資訊，如果有任何問題請隨時聯繫團主。
                        集合時間為每日早上 8:30 在飯店大廳。
                    </p>
                </div>
            </div>
        </div>
    )
}
