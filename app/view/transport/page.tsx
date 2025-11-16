'use client'

import { useEffect, useState } from 'react'
import { Transport, Person } from '@/lib/types'

export default function ViewTransportPage() {
  const [transports, setTransports] = useState<Transport[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const [transportsRes, peopleRes] = await Promise.all([
      fetch('/api/transport'),
      fetch('/api/people')
    ])
    const [transportsData, peopleData] = await Promise.all([
      transportsRes.json(),
      peopleRes.json()
    ])
    setTransports(transportsData)
    setPeople(peopleData)
    setLoading(false)
  }

  function formatDepartureTime(timeString: string) {
    const date = new Date(timeString)
    return {
      date: date.toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit', weekday: 'short' }),
      time: date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
      <div className="text-xl text-gray-600">載入中...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <header className="bg-white shadow-sm border-b-4 border-red-500 mb-6">
        <div className="max-w-4xl mx-auto p-6">
          <a href="/view" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首頁</a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚗 交通協調</h1>
          <p className="text-gray-600">共 {transports.length} 台車</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pb-8">
        {transports.length > 0 ? (
          <div className="grid gap-4">
            {transports.map(transport => {
              const driver = people.find(p => p.id === transport.driver_id)
              const passengers = people.filter(p => transport.passenger_ids?.includes(p.id))
              const { date, time } = formatDepartureTime(transport.departure_time)
              const availableSeats = transport.seats - passengers.length

              return (
                <div key={transport.id} className="bg-white rounded-lg shadow-md border-l-4 border-red-400 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        🚗 駕駛：{driver?.name || '未指定'}
                      </h3>
                      <p className="text-lg text-red-700 font-bold">
                        📅 {date} ⏰ {time} 出發
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${availableSeats > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {availableSeats}
                      </div>
                      <div className="text-sm text-gray-600">剩餘座位</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-700">座位數：</span>
                      <span>{transport.seats} 位</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-700">已預約：</span>
                      <span>{passengers.length} 人</span>
                    </div>
                  </div>

                  {passengers.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-2">乘客：</p>
                      <div className="flex flex-wrap gap-2">
                        {passengers.map(person => (
                          <span key={person.id} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                            {person.name}{person.age_group === 'child' && ' 👶'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">目前沒有交通安排</h3>
          </div>
        )}
      </div>
    </div>
  )
}
