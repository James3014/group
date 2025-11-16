'use client'

import { useEffect, useState } from 'react'
import { Person, SkiLevel, BoardType, AgeGroup, Equipment } from '@/lib/types'

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    ski_level: 'beginner' as SkiLevel,
    board_type: 'ski' as BoardType,
    age_group: 'adult' as AgeGroup,
    equipment: 'rental' as Equipment,
  })

  useEffect(() => {
    fetchPeople()
  }, [])

  async function fetchPeople() {
    const res = await fetch('/api/people')
    const data = await res.json()
    setPeople(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setFormData({
      name: '',
      phone: '',
      ski_level: 'beginner',
      board_type: 'ski',
      age_group: 'adult',
      equipment: 'rental'
    })
    setShowForm(false)
    fetchPeople()
  }

  async function toggleConfirm(id: number, current: boolean) {
    await fetch(`/api/people/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_confirmed: !current }),
    })
    fetchPeople()
  }

  const confirmed = people.filter(p => p.is_confirmed).length
  const total = people.length

  if (loading) return <div className="p-4">加载中...</div>

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首页</a>
        <h1 className="text-3xl font-bold mb-2">👥 人员管理</h1>
        <p className="text-gray-600">
          已确认：{confirmed}/{total} 人
        </p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? '取消' : '+ 添加成员'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="mb-3">
            <label className="block mb-1 font-bold">姓名 *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">电话</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">滑雪水平</label>
            <select
              value={formData.ski_level}
              onChange={e => setFormData({ ...formData, ski_level: e.target.value as SkiLevel })}
              className="w-full p-2 border rounded"
            >
              <option value="beginner">初級</option>
              <option value="intermediate">中級</option>
              <option value="advanced">高級</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">單板/雙板</label>
            <select
              value={formData.board_type}
              onChange={e => setFormData({ ...formData, board_type: e.target.value as BoardType })}
              className="w-full p-2 border rounded"
            >
              <option value="ski">雙板 Ski</option>
              <option value="snowboard">單板 Snowboard</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">年齡</label>
            <select
              value={formData.age_group}
              onChange={e => setFormData({ ...formData, age_group: e.target.value as AgeGroup })}
              className="w-full p-2 border rounded"
            >
              <option value="adult">大人</option>
              <option value="child">小孩</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">裝備</label>
            <select
              value={formData.equipment}
              onChange={e => setFormData({ ...formData, equipment: e.target.value as Equipment })}
              className="w-full p-2 border rounded"
            >
              <option value="own">自備</option>
              <option value="rental">租借</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            確認新增
          </button>
        </form>
      )}

      <div className="grid gap-3">
        {people.map(person => (
          <div key={person.id} className="p-4 bg-white rounded-lg shadow flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">
                {person.name}
                {person.age_group === 'child' && ' 👶'}
              </h3>
              <p className="text-sm text-gray-600">{person.phone || '未填寫電話'}</p>
              <div className="flex gap-3 text-sm mt-1">
                <span>
                  {person.ski_level === 'beginner' && '初級'}
                  {person.ski_level === 'intermediate' && '中級'}
                  {person.ski_level === 'advanced' && '高級'}
                </span>
                <span>|</span>
                <span>
                  {person.board_type === 'ski' ? '🎿 雙板' : '🏂 單板'}
                </span>
                <span>|</span>
                <span>
                  {person.equipment === 'own' ? '✓ 自備裝備' : '📦 租借裝備'}
                </span>
              </div>
            </div>
            <div>
              <button
                onClick={() => toggleConfirm(person.id, person.is_confirmed)}
                className={`px-4 py-2 rounded ${
                  person.is_confirmed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {person.is_confirmed ? '✓ 已确认' : '未确认'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
