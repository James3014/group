'use client'

import { useEffect, useState } from 'react'
import { Meal, Person } from '@/lib/types'

export default function ViewMealsPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)

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

  function formatMealTime(timeString: string) {
    const date = new Date(timeString)
    return {
      date: date.toLocaleDateString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        weekday: 'short'
      }),
      time: date.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
      <div className="text-xl text-gray-600">載入中...</div>
    </div>
  )

  // 按日期分組
  const mealsByDate = meals.reduce((acc, meal) => {
    const { date } = formatMealTime(meal.meal_time)
    if (!acc[date]) acc[date] = []
    acc[date].push(meal)
    return acc
  }, {} as Record<string, Meal[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-purple-500 mb-6">
        <div className="max-w-4xl mx-auto p-6">
          <a href="/view" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回首頁
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🍽️ 餐飲安排</h1>
          <p className="text-gray-600">共 {meals.length} 個用餐安排</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pb-8">
        {Object.keys(mealsByDate).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(mealsByDate).map(([date, dateMeals]) => (
              <div key={date}>
                <h2 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <span>📅</span>
                  <span>{date}</span>
                </h2>
                <div className="space-y-3">
                  {dateMeals.map(meal => {
                    const { time } = formatMealTime(meal.meal_time)
                    const attendees = people.filter(p => meal.attendee_ids?.includes(p.id))

                    return (
                      <div
                        key={meal.id}
                        className="bg-white rounded-lg shadow-md border-l-4 border-purple-400 p-5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              🍴 {meal.restaurant}
                            </h3>
                            <p className="text-lg text-purple-700 font-bold">
                              ⏰ {time}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">
                              {attendees.length}
                            </div>
                            <div className="text-sm text-gray-600">人用餐</div>
                          </div>
                        </div>

                        {meal.notes && (
                          <div className="mb-3 p-3 bg-purple-50 rounded">
                            <p className="text-sm text-purple-900">💡 {meal.notes}</p>
                          </div>
                        )}

                        {attendees.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-bold text-gray-700 mb-2">
                              參加人員：
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {attendees.map(person => (
                                <span
                                  key={person.id}
                                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                >
                                  {person.name}
                                  {person.age_group === 'child' && ' 👶'}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">目前沒有餐飲安排</h3>
            <p className="text-gray-500">有新安排時會顯示在這裡</p>
          </div>
        )}
      </div>
    </div>
  )
}
