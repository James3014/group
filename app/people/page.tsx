'use client'

import { useEffect, useState } from 'react'
import { Person, SkiLevel, BoardType, AgeGroup, Equipment } from '@/lib/types'
import { buildApiUrl } from '@/lib/trip-context'

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    line_id: '',
    ski_level: 'intermediate' as SkiLevel,
    board_type: 'snowboard' as BoardType,
    age_group: 'adult' as AgeGroup,
    equipment: 'own' as Equipment,
    has_radio: true,
    father_id: undefined as number | undefined,
    mother_id: undefined as number | undefined,
  })

  useEffect(() => {
    const tripId = localStorage.getItem('organizer_trip_id')
    if (!tripId) {
      window.location.href = '/organizer/login'
      return
    }
    fetchPeople(tripId)
  }, [])

  async function fetchPeople(tripId: string) {
    const res = await fetch(`/api/people?trip_id=${tripId}`)
    const data = await res.json()
    setPeople(data)
    setLoading(false)
  }

  function resetForm() {
    setFormData({
      name: '',
      line_id: '',
      ski_level: 'intermediate',
      board_type: 'snowboard',
      age_group: 'adult',
      equipment: 'own',
      has_radio: true,
      father_id: undefined,
      mother_id: undefined
    })
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const tripId = localStorage.getItem('organizer_trip_id')
    if (!tripId) {
      alert('請先登入')
      window.location.href = '/organizer/login'
      return
    }

    if (editingId) {
      // 編輯現有人員
      await fetch(`/api/people/${editingId}?trip_id=${tripId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    } else {
      // 新增人員
      await fetch(`/api/people?trip_id=${tripId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    }

    resetForm()
    setShowForm(false)
    fetchPeople(tripId)
  }

  function startEdit(person: Person) {
    setFormData({
      name: person.name,
      line_id: person.line_id || '',
      ski_level: person.ski_level,
      board_type: person.board_type,
      age_group: person.age_group,
      equipment: person.equipment,
      has_radio: person.has_radio,
      father_id: person.father_id,
      mother_id: person.mother_id,
    })
    setEditingId(person.id)
    setShowForm(true)
    // 滾動到頁面頂部讓用戶看到表單
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function deletePerson(id: number, name: string) {
    if (!confirm(`確定要刪除 ${name} 嗎？`)) return

    const tripId = localStorage.getItem('organizer_trip_id')
    if (!tripId) return

    await fetch(`/api/people/${id}?trip_id=${tripId}`, {
      method: 'DELETE',
    })
    fetchPeople(tripId)
  }

  function handleCancel() {
    resetForm()
    setShowForm(false)
  }

  if (loading) return <div className="p-4">載入中...</div>

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/organizer/dashboard" className="text-blue-600 hover:underline mb-2 inline-block">← 返回管理首頁</a>
        <h1 className="text-3xl font-bold mb-2">👥 人員管理</h1>
        <p className="text-gray-600">
          總人數：{people.length} 人
        </p>
      </div>

      <button
        onClick={() => {
          resetForm()
          setShowForm(!showForm)
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? '取消' : '+ 新增成員'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-3">{editingId ? '編輯成員' : '新增成員'}</h3>
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
            <label className="block mb-1 font-bold">LINE ID</label>
            <input
              type="text"
              value={formData.line_id}
              onChange={e => setFormData({ ...formData, line_id: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="選填，例如：@username"
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
              onChange={e => {
                const newAgeGroup = e.target.value as AgeGroup
                setFormData({
                  ...formData,
                  age_group: newAgeGroup,
                  father_id: newAgeGroup === 'adult' ? undefined : formData.father_id,
                  mother_id: newAgeGroup === 'adult' ? undefined : formData.mother_id
                })
              }}
              className="w-full p-2 border rounded"
            >
              <option value="adult">大人</option>
              <option value="child">小孩</option>
            </select>
          </div>
          {formData.age_group === 'child' && (
            <>
              <div className="mb-3">
                <label className="block mb-1 font-bold">父親</label>
                <select
                  value={formData.father_id || ''}
                  onChange={e => setFormData({ ...formData, father_id: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">未指定父親</option>
                  {people
                    .filter(p => p.age_group === 'adult' && p.id !== editingId)
                    .map(adult => (
                      <option key={adult.id} value={adult.id}>{adult.name}</option>
                    ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-bold">母親</label>
                <select
                  value={formData.mother_id || ''}
                  onChange={e => setFormData({ ...formData, mother_id: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">未指定母親</option>
                  {people
                    .filter(p => p.age_group === 'adult' && p.id !== editingId)
                    .map(adult => (
                      <option key={adult.id} value={adult.id}>{adult.name}</option>
                    ))}
                </select>
              </div>
            </>
          )}
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
          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.has_radio}
                onChange={e => setFormData({ ...formData, has_radio: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="font-bold">📻 有無線電</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              {editingId ? '儲存' : '確認新增'}
            </button>
            <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              取消
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3">
        {people.map(person => (
          <div key={person.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {person.name}
                  {person.age_group === 'child' && ' 👶'}
                </h3>
                {person.line_id && <p className="text-sm text-gray-600">LINE: {person.line_id}</p>}
                {(person.father_id || person.mother_id) && (
                  <p className="text-sm text-gray-500">
                    {person.father_id && `父親：${people.find(p => p.id === person.father_id)?.name || '未知'}`}
                    {person.father_id && person.mother_id && ' | '}
                    {person.mother_id && `母親：${people.find(p => p.id === person.mother_id)?.name || '未知'}`}
                  </p>
                )}
                <div className="flex gap-3 text-sm mt-1 flex-wrap">
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
                  {person.has_radio && (
                    <>
                      <span>|</span>
                      <span className="text-green-600">📻 有無線電</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-col ml-4">
                <button
                  onClick={() => startEdit(person)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                >
                  編輯
                </button>
                <button
                  onClick={() => deletePerson(person.id, person.name)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                >
                  刪除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
