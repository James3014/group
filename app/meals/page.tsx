'use client'

import { useEffect, useState } from 'react'
import { Meal, Person } from '@/lib/types'

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    restaurant: '',
    meal_time: '',
    notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const [mealsRes, peopleRes] = await Promise.all([
      fetch('/api/meals'),
      fetch('/api/people')
    ])
    const [mealsData, peopleData] = await Promise.all([
      mealsRes.json(),
      peopleRes.json()
    ])
    setMeals(mealsData)
    setPeople(peopleData)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setFormData({ restaurant: '', meal_time: '', notes: '' })
    setShowForm(false)
    fetchData()
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

  if (loading) return <div className="p-4">載入中...</div>

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首頁</a>
        <h1 className="text-3xl font-bold mb-2">🍽️ 餐飲安排</h1>
        <p className="text-gray-600">共 {meals.length} 個用餐安排</p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
            />
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
            新增
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {meals.map(meal => (
          <div key={meal.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{meal.restaurant}</h3>
              <span className="text-sm text-gray-500">
                {formatDateTime(meal.meal_time)}
              </span>
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
          <div className="p-8 text-center text-gray-500">
            還沒有安排用餐
          </div>
        )}
      </div>
    </div>
  )
}
