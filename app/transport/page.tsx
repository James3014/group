'use client'

import { useEffect, useState } from 'react'
import { Transport, Person, TripSettings } from '@/lib/types'

export default function TransportPage() {
  const [transports, setTransports] = useState<Transport[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [tripSettings, setTripSettings] = useState<TripSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string>('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    driver_id: undefined as number | undefined,
    seats: 4,
    departure_time: '',
    passenger_ids: [] as number[],
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
      console.log('開始載入資料...')
      const [transportsRes, peopleRes, tripRes] = await Promise.all([
        fetch(`/api/transport?trip_id=${tripId}`),
        fetch(`/api/people?trip_id=${tripId}`),
        fetch(`/api/trip-settings?trip_id=${tripId}`)
      ])
      const [transportsData, peopleData, tripData] = await Promise.all([
        transportsRes.json(),
        peopleRes.json(),
        tripRes.json()
      ])
      console.log('載入完成 - 交通工具:', transportsData.length, '人員:', peopleData.length, '行程設定:', tripData ? '有' : '無')
      setTransports(transportsData)
      setPeople(peopleData)
      setTripSettings(tripData)
      setLoading(false)
    } catch (err) {
      console.error('載入資料錯誤:', err)
      setLoading(false)
    }
  }

  // 初始化表單預設值
  function initializeForm() {
    let defaultTime = ''
    if (tripSettings) {
      // 設定為行程第一天早上 07:30
      defaultTime = `${tripSettings.start_date}T07:30`
    }

    setFormData({
      driver_id: undefined,
      seats: 4,
      departure_time: defaultTime,
      passenger_ids: []
    })
    setEditingId(null)
    setError('')
  }

  function startEdit(transport: Transport) {
    setFormData({
      driver_id: transport.driver_id,
      seats: transport.seats,
      departure_time: transport.departure_time.substring(0, 16), // 轉換為 datetime-local 格式
      passenger_ids: transport.passenger_ids || []
    })
    setEditingId(transport.id)
    setShowForm(true)
    setError('')
  }

  async function deleteTransport(id: number, name: string) {
    if (!confirm(`確定要刪除「${name}」嗎？`)) return

    try {
      const response = await fetch(`/api/transport/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        alert(`刪除失敗：${data.error}`)
        return
      }

      await fetchData(localStorage.getItem('organizer_trip_id') || '')
    } catch (err) {
      console.error('刪除交通工具錯誤:', err)
      alert('刪除失敗，請稍後再試')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // 驗證司機已選擇
    if (!formData.driver_id) {
      setError('請選擇司機')
      return
    }

    // 驗證出發時間
    if (!formData.departure_time) {
      setError('請選擇出發時間')
      return
    }

    // 找出司機名稱
    const driver = people.find(p => p.id === formData.driver_id)
    if (!driver) {
      setError('找不到選擇的司機，請重新選擇')
      return
    }
    const vehicle_name = `${driver.name}的車`

    const payload = {
      vehicle_name,
      driver_id: formData.driver_id,
      seats: formData.seats,
      departure_time: formData.departure_time,
      passenger_ids: formData.passenger_ids,
    }

    const tripId = localStorage.getItem('organizer_trip_id')
    if (!tripId) {
      alert('請先登入')
      window.location.href = '/organizer/login'
      return
    }

    // 手動驗證日期範圍 (針對手機版)
    if (tripSettings) {
      const selectedTime = new Date(formData.departure_time).getTime()
      const startTime = new Date(`${tripSettings.start_date}T00:00`).getTime()
      const endTime = new Date(`${tripSettings.end_date}T23:59`).getTime()

      if (selectedTime < startTime || selectedTime > endTime) {
        setError(`日期必須在行程期間內：${tripSettings.start_date} ~ ${tripSettings.end_date}`)
        return
      }
    }

    const isEditing = editingId !== null
    console.log(isEditing ? '準備更新交通工具:' : '準備新增交通工具:', payload)

    try {
      const url = isEditing
        ? `/api/transport/${editingId}?trip_id=${tripId}`
        : `/api/transport?trip_id=${tripId}`
      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('API 回應狀態:', response.status)

      const data = await response.json()
      console.log('API 回應資料:', data)

      if (!response.ok) {
        const errorMsg = data.error || `${isEditing ? '更新' : '新增'}失敗 (${response.status})`
        console.error(`${isEditing ? '更新' : '新增'}失敗:`, errorMsg)
        setError(errorMsg)
        return
      }

      // 檢查是否有警告訊息
      if (data.warning) {
        console.warn('操作成功但有警告:', data.warning)
      }

      console.log(`✅ 交通工具${isEditing ? '更新' : '新增'}成功`)

      // 成功後才關閉表單
      initializeForm()
      setShowForm(false)
      await fetchData(tripId)
    } catch (err: any) {
      const errorMsg = err.message || '網路錯誤，請稍後再試'
      console.error(`${isEditing ? '更新' : '新增'}車輛錯誤:`, err)
      setError(errorMsg)
    }
  }

  function togglePassenger(personId: number) {
    if (formData.passenger_ids.includes(personId)) {
      setFormData({
        ...formData,
        passenger_ids: formData.passenger_ids.filter(id => id !== personId)
      })
    } else {
      setFormData({
        ...formData,
        passenger_ids: [...formData.passenger_ids, personId]
      })
    }
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

    // 將日期轉換為 datetime-local 格式 (YYYY-MM-DDTHH:MM)
    const startDate = new Date(tripSettings.start_date)
    const endDate = new Date(tripSettings.end_date)

    // 設定開始時間為當天 00:00
    const min = `${tripSettings.start_date}T00:00`

    // 設定結束時間為當天 23:59
    const max = `${tripSettings.end_date}T23:59`

    return { min, max }
  }

  if (loading) return <div className="p-4">載入中...</div>

  const totalSeats = transports.reduce((sum, t) => sum + t.seats, 0)
  const occupiedSeats = transports.reduce((sum, t) => sum + (t.passenger_ids?.length || 0), 0)

  // 取得司機對象
  const driver = formData.driver_id ? people.find(p => p.id === formData.driver_id) : null
  const { min, max } = getDateTimeLimits()

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首頁</a>
        <h1 className="text-3xl font-bold mb-2">🚗 交通協調</h1>
        <p className="text-gray-600">
          車輛：{transports.length} 台 | 座位：{occupiedSeats}/{totalSeats}
        </p>
      </div>

      {!tripSettings && (
        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <p className="font-bold">⚠️ 提示</p>
          <p className="text-sm">請先到<a href="/trip-settings" className="text-blue-600 underline">行程設定</a>頁面設定行程日期</p>
        </div>
      )}

      <button
        onClick={() => {
          if (!showForm) {
            initializeForm()
          } else {
            initializeForm()
            setShowForm(false)
          }
          setShowForm(!showForm)
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={!tripSettings}
      >
        {showForm ? '取消' : '+ 新增車輛'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              ❌ {error}
            </div>
          )}
          <div className="mb-3">
            <label className="block mb-1 font-bold">司機 *</label>
            <select
              required
              value={formData.driver_id || ''}
              onChange={e => setFormData({ ...formData, driver_id: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full p-2 border rounded"
            >
              <option value="">請選擇司機</option>
              {people.map(person => (
                <option key={person.id} value={person.id}>{person.name}</option>
              ))}
            </select>
            {driver && (
              <p className="text-sm text-gray-600 mt-1">車輛名稱：{driver.name}的車</p>
            )}
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
            <label className="block mb-2 font-bold">乘客（可選）</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded p-2">
              {people.filter(p => p.id !== formData.driver_id).map(person => (
                <label key={person.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={formData.passenger_ids.includes(person.id)}
                    onChange={() => togglePassenger(person.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{person.name}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-1">已選擇 {formData.passenger_ids.length} 人</p>
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            {editingId ? '更新' : '新增'}
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {transports.map(transport => {
          const occupied = transport.passenger_ids?.length || 0
          const available = transport.seats - occupied
          const passengers = people.filter(p => transport.passenger_ids?.includes(p.id))

          return (
            <div key={transport.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{transport.vehicle_name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {formatDateTime(transport.departure_time)}
                  </span>
                  <button
                    onClick={() => startEdit(transport)}
                    className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => deleteTransport(transport.id, transport.vehicle_name)}
                    className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    刪除
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm mb-2">
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
              {passengers.length > 0 && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">乘客：</span>
                  <span className="text-gray-800">{passengers.map(p => p.name).join('、')}</span>
                </div>
              )}
            </div>
          )
        })}

        {transports.length === 0 && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
            還沒有安排交通工具
          </div>
        )}
      </div>
    </div>
  )
}
