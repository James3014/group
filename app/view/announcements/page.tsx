'use client'

import { useEffect, useState } from 'react'
import { Announcement } from '@/lib/types'

export default function ViewAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  async function fetchAnnouncements() {
    const res = await fetch('/api/announcements')
    const data = await res.json()
    setAnnouncements(data)
    setLoading(false)
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center">
      <div className="text-xl text-gray-600">載入中...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-yellow-500 mb-6">
        <div className="max-w-4xl mx-auto p-6">
          <a href="/view" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回首頁
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📢 公告事項</h1>
          <p className="text-gray-600">共 {announcements.length} 則公告</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pb-8">
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div
                key={announcement.id}
                className={`bg-white rounded-xl shadow-lg border-l-4 p-6 ${
                  index === 0 ? 'border-red-500' : 'border-yellow-400'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {index === 0 && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                          最新
                        </span>
                      )}
                      <h2 className="text-2xl font-bold text-gray-900">
                        {announcement.title}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500">
                      📅 {formatDate(announcement.created_at)}
                      {announcement.author?.name && (
                        <span className="ml-3">
                          👤 {announcement.author.name}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                    {announcement.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">目前沒有公告</h3>
            <p className="text-gray-500">有新公告時會顯示在這裡</p>
          </div>
        )}
      </div>
    </div>
  )
}
