'use client'

import { useEffect, useState } from 'react'
import { Transport, Person } from '@/lib/types'

export default function TransportPage() {
  const [transports, setTransports] = useState<Transport[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    vehicle_name: '',
    seats: 4,
    departure_time: '',
    departure_location: '',
  })

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/transport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setFormData({ vehicle_name: '', seats: 4, departure_time: '', departure_location: '' })
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

  const totalSeats = transports.reduce((sum, t) => sum + t.seats, 0)
  const occupiedSeats = transports.reduce((sum, t) => sum + (t.passenger_ids?.length || 0), 0)

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首頁</a>
        <h1 className="text-3xl font-bold mb-2">🚗 交通協調</h1>
        <p className="text-gray-600">
          車輛：{transports.length} 台 | 座位：{occupiedSeats}/{totalSeats}
        </p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? '取消' : '+ 新增車輛'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="mb-3">
            <label className="block mb-1 font-bold">車輛名稱 *</label>
            <input
              type="text"
              required
              value={formData.vehicle_name}
              onChange={e => setFormData({ ...formData, vehicle_name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="例如：小明的車"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">座位數 *</label>
            <input
              type="number"
              required
              min="1"
              value={formData.seats}
              onChange={e => setFormData({ ...formData, seats: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">出發時間 *</label>
            <input
              type="datetime-local"
              required
              value={formData.departure_time}
              onChange={e => setFormData({ ...formData, departure_time: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">出發地點 *</label>
            <input
              type="text"
              required
              value={formData.departure_location}
              onChange={e => setFormData({ ...formData, departure_location: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="例如：台北車站東三門"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            新增
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {transports.map(transport => {
          const occupied = transport.passenger_ids?.length || 0
          const available = transport.seats - occupied

          return (
            <div key={transport.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{transport.vehicle_name}</h3>
                <span className="text-sm text-gray-500">
                  {formatDateTime(transport.departure_time)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                📍 {transport.departure_location}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className={available > 0 ? 'text-green-600' : 'text-red-600'}>
                  座位：{occupied}/{transport.seats}
                </span>
                {available > 0 && (
                  <span className="text-green-600">還有 {available} 個空位</span>
                )}
                {available === 0 && (
                  <span className="text-red-600">已滿</span>
                )}
              </div>
            </div>
          )
        })}

        {transports.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            還沒有安排交通工具
          </div>
        )}
      </div>
    </div>
  )
}
