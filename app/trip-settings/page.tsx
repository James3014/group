'use client'

import { useEffect, useState } from 'react'
import { TripSettings } from '@/lib/types'
import { buildApiUrl } from '@/lib/trip-context'

export default function TripSettingsPage() {
  const [settings, setSettings] = useState<TripSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    trip_name: '',
    start_date: '',
    end_date: '',
    location: '神居滑雪場',
    notes: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const res = await fetch(buildApiUrl('/api/trip-settings'))
    const data = await res.json()
    setSettings(data)
    setLoading(false)

    // 如果有現有設定，填入表單
    if (data) {
      setFormData({
        trip_name: data.trip_name || '',
        start_date: data.start_date,
        end_date: data.end_date,
        location: data.location || '神居滑雪場',
        notes: data.notes || '',
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await fetch(buildApiUrl('/api/trip-settings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`儲存失敗：${errorData.error || '未知錯誤'}`)
        return
      }

      setShowForm(false)
      fetchSettings()
    } catch (error) {
      console.error('提交錯誤:', error)
      alert('儲存失敗，請檢查網路連線或查看控制台錯誤訊息')
    }
  }

  function calculateDays() {
    if (!settings) return 0
    const start = new Date(settings.start_date)
    const end = new Date(settings.end_date)
    const diff = end.getTime() - start.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  if (loading) return <div className="p-4">載入中...</div>

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首頁</a>
        <h1 className="text-3xl font-bold mb-2">⛷️ 行程設定</h1>
        <p className="text-gray-600">
          設定滑雪團的日期和基本資訊
        </p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? '取消' : (settings ? '修改設定' : '+ 新增設定')}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="mb-3">
            <label className="block mb-1 font-bold">行程名稱</label>
            <input
              type="text"
              value={formData.trip_name}
              onChange={e => setFormData({ ...formData, trip_name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="例如：聖誕節 30人團隊行程管理"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">開始日期 *</label>
            <input
              type="date"
              required
              value={formData.start_date}
              onChange={e => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">結束日期 *</label>
            <input
              type="date"
              required
              value={formData.end_date}
              onChange={e => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">地點</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="例如：神居滑雪場"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">備註</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border rounded h-24"
              placeholder="其他注意事項..."
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            儲存
          </button>
        </form>
      )}

      {settings ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">{settings.trip_name || settings.location}</h2>
          <div className="grid gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📍</span>
              <div>
                <p className="text-sm text-gray-600">地點</p>
                <p className="text-lg font-bold">{settings.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">📅</span>
              <div>
                <p className="text-sm text-gray-600">行程日期</p>
                <p className="text-lg font-bold">
                  {formatDate(settings.start_date)} - {formatDate(settings.end_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">⏰</span>
              <div>
                <p className="text-sm text-gray-600">天數</p>
                <p className="text-lg font-bold">{calculateDays()} 天</p>
              </div>
            </div>
          </div>
          {settings.notes && (
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="font-bold mb-1">備註</p>
              <p className="text-gray-700 whitespace-pre-wrap">{settings.notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
          還沒有設定行程，請點擊上方按鈕新增
        </div>
      )}
    </div>
  )
}
