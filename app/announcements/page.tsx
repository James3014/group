'use client'

import { useEffect, useState } from 'react'
import { Announcement } from '@/lib/types'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author_id: 1, // 臨時使用，之後會加入認證
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  async function fetchAnnouncements() {
    const res = await fetch('/api/announcements')
    const data = await res.json()
    setAnnouncements(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setFormData({ title: '', content: '', author_id: 1 })
    setShowForm(false)
    fetchAnnouncements()
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) return <div className="p-4">載入中...</div>

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首頁</a>
        <h1 className="text-3xl font-bold mb-2">📢 公告</h1>
        <p className="text-gray-600">共 {announcements.length} 則公告</p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? '取消' : '+ 發布公告'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="mb-3">
            <label className="block mb-1 font-bold">標題 *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="例如：集合時間變更通知"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">內容 *</label>
            <textarea
              required
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-2 border rounded h-32"
              placeholder="公告詳細內容..."
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            發布
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {announcements.map(announcement => (
          <div key={announcement.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{announcement.title}</h3>
              <span className="text-sm text-gray-500">
                {formatDate(announcement.created_at)}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap mb-2">{announcement.content}</p>
            <p className="text-sm text-gray-500">
              發布者：{announcement.author?.name || '系統'}
            </p>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            還沒有任何公告
          </div>
        )}
      </div>
    </div>
  )
}
