'use client'

import { useEffect, useState } from 'react'
import { Meal, Person, TripSettings } from '@/lib/types'

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [tripSettings, setTripSettings] = useState<TripSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    restaurant: '',
    meal_time: '',
    notes: '',
  })

  useEffect(() => {
    const tripId = localStorage.getItem('organizer_trip_id')
    if (!tripId) {
      window.location.href = '/organizer/login'
      return
    }
    fetchData(tripId)
  }, [])

  async function fetchData(tripId: string) {
    try {
      const [mealsRes, peopleRes, tripRes] = await Promise.all([
        fetch(`/api/meals?trip_id=${tripId}`),
        fetch(`/api/people?trip_id=${tripId}`),
        fetch(`/api/trip-settings?trip_id=${tripId}`)
      ])
      const [mealsData, peopleData, tripData] = await Promise.all([
        mealsRes.json(),
        peopleRes.json(),
        tripRes.json()
      ])
      setMeals(mealsData)
      setPeople(peopleData)
      setTripSettings(tripData)
      setLoading(false)
    } catch (err) {
      console.error('載入資料錯誤:', err)
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({ restaurant: '', meal_time: '', notes: '' })
    setEditingId(null)
  }

  function startEdit(meal: Meal) {
    setFormData({
      restaurant: meal.restaurant,
      meal_time: meal.meal_time.substring(0, 16),
      notes: meal.notes || '',
    })
    setEditingId(meal.id)
    setShowForm(true)
  }

  async function deleteMeal(id: number, name: string) {
    if (!confirm(`確定要刪除「${name}」嗎？`)) return

    try {
      const response = await fetch(`/api/meals/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        alert('刪除失敗')
        return
      }

      await fetchData(localStorage.getItem('organizer_trip_id') || '')
    } catch (err) {
      console.error('刪除餐飲錯誤:', err)
      alert('刪除失敗，請稍後再試')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const isEditing = editingId !== null
    const url = isEditing ? `/api/meals/${editingId}` : '/api/meals'
    const method = isEditing ? 'PATCH' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    resetForm()
    setShowForm(false)
    const tripId = localStorage.getItem('organizer_trip_id')
    if (tripId) fetchData(tripId)
  }

  function formatDateTime(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 取得日期時間選擇器的 min 和 max 值
  function getDateTimeLimits() {
    if (!tripSettings) return { min: '', max: '' }

    const min = `${tripSettings.start_date}T00:00`
    const max = `${tripSettings.end_date}T23:59`

    return { min, max }
  }

  if (loading) return <div className="p-4">載入中...</div>

  const { min, max } = getDateTimeLimits()

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首頁</a>
        <h1 className="text-3xl font-bold mb-2">🍽️ 餐飲安排</h1>
        <p className="text-gray-600">共 {meals.length} 個用餐安排</p>
      </div>

      {!tripSettings && (
        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <p className="font-bold">⚠️ 提示</p>
          <p className="text-sm">請先到<a href="/trip-settings" className="text-blue-600 underline">行程設定</a>頁面設定行程日期</p>
        </div>
      )}

      <button
        onClick={() => {
          if (showForm) {
            resetForm()
          }
          setShowForm(!showForm)
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={!tripSettings}
      >
        {showForm ? '取消' : '+ 新增用餐'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="mb-3">
            <label className="block mb-1 font-bold">餐廳名稱 *</label>
            <input
              type="text"
              required
              value={formData.restaurant}
              onChange={e => setFormData({ ...formData, restaurant: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="例如：神居滑雪場餐廳"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">用餐時間 *</label>
            <input
              type="datetime-local"
              required
              value={formData.meal_time}
              onChange={e => setFormData({ ...formData, meal_time: e.target.value })}
              className="w-full p-2 border rounded"
              min={min}
              max={max}
            />
            {tripSettings && (
              <p className="text-xs text-gray-500 mt-1">
                限制在行程期間：{tripSettings.start_date} ~ {tripSettings.end_date}
              </p>
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">備註</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="飲食限制、預算、訂位資訊等"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            {editingId ? '更新' : '新增'}
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {meals.map(meal => (
          <div key={meal.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{meal.restaurant}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {formatDateTime(meal.meal_time)}
                </span>
                <button
                  onClick={() => startEdit(meal)}
                  className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  編輯
                </button>
                <button
                  onClick={() => deleteMeal(meal.id, meal.restaurant)}
                  className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  刪除
                </button>
              </div>
            </div>
            {meal.notes && (
              <p className="text-gray-600 text-sm mb-2">{meal.notes}</p>
            )}
            <div className="flex items-center text-sm text-gray-600">
              <span>預計人數：{meal.participant_ids?.length || 0} 人</span>
            </div>
          </div>
        ))}

        {meals.length === 0 && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
            還沒有安排用餐
          </div>
        )}
      </div>
    </div>
  )
}
