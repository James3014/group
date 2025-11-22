'use client'

import { useEffect, useState } from 'react'
import { Announcement } from '@/lib/types'
import { buildApiUrl } from '@/lib/trip-context'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author_id: 1, // 臨時使用，之後會加入認證
  })

  useEffect(() => {
    const tripId = localStorage.getItem('organizer_trip_id')
    if (!tripId) {
      window.location.href = '/organizer/login'
      return
    }
    fetchAnnouncements(tripId)
  }, [])

  async function fetchAnnouncements(tripId: string) {
    try {
      const res = await fetch(`/api/announcements?trip_id=${tripId}`)
      const data = await res.json()
      setAnnouncements(data)
      setLoading(false)
    } catch (err) {
      console.error('載入公告錯誤:', err)
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({ title: '', content: '', author_id: 1 })
    setEditingId(null)
  }

  function startEdit(announcement: Announcement) {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      author_id: announcement.author_id || 1,
    })
    setEditingId(announcement.id)
    setShowForm(true)
  }

  async function deleteAnnouncement(id: number, title: string) {
    if (!confirm(`確定要刪除「${title}」嗎？`)) return

    const tripId = localStorage.getItem('organizer_trip_id')
    if (!tripId) return

    try {
      const response = await fetch(`/api/announcements/${id}?trip_id=${tripId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        alert('刪除失敗')
        return
      }

      await fetchAnnouncements(localStorage.getItem('organizer_trip_id') || '')
    } catch (err) {
      console.error('刪除公告錯誤:', err)
      alert('刪除失敗，請稍後再試')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const tripId = localStorage.getItem('organizer_trip_id')
    if (!tripId) {
      alert('請先登入')
      window.location.href = '/organizer/login'
      return
    }

    const isEditing = editingId !== null
    const url = isEditing
      ? `/api/announcements/${editingId}?trip_id=${tripId}`
      : `/api/announcements?trip_id=${tripId}`
    const method = isEditing ? 'PATCH' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    resetForm()
    setShowForm(false)
    fetchAnnouncements(tripId)
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
        <a href="/organizer/dashboard" className="text-blue-600 hover:underline mb-2 inline-block">← 返回管理首頁</a>
        <h1 className="text-3xl font-bold mb-2">📢 公告</h1>
        <p className="text-gray-600">共 {announcements.length} 則公告</p>
      </div>

      <button
        onClick={() => {
          if (showForm) {
            resetForm()
          }
          setShowForm(!showForm)
        }}
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
            {editingId ? '更新' : '發布'}
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {announcements.map(announcement => (
          <div key={announcement.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{announcement.title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {formatDate(announcement.created_at)}
                </span>
                <button
                  onClick={() => startEdit(announcement)}
                  className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  編輯
                </button>
                <button
                  onClick={() => deleteAnnouncement(announcement.id, announcement.title)}
                  className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  刪除
                </button>
              </div>
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
