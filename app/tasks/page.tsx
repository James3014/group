'use client'

import { useEffect, useState } from 'react'
import { Task, Person } from '@/lib/types'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    assignee_id: undefined as number | undefined,
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
    const [tasksRes, peopleRes] = await Promise.all([
      fetch(`/api/tasks?trip_id=${tripId}`),
      fetch(`/api/people?trip_id=${tripId}`)
    ])
    const [tasksData, peopleData] = await Promise.all([
      tasksRes.json(),
      peopleRes.json()
    ])
    setTasks(tasksData)
    setPeople(peopleData)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const tripId = localStorage.getItem('organizer_trip_id')
    if (!tripId) {
      alert('請先登入')
      window.location.href = '/organizer/login'
      return
    }

    await fetch(`/api/tasks?trip_id=${tripId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setFormData({ description: '', assignee_id: undefined })
    setShowForm(false)
    fetchData(tripId)
  }

  async function toggleComplete(id: number, current: boolean) {
    const tripId = localStorage.getItem('organizer_trip_id')
    if (!tripId) return

    await fetch(`/api/tasks/${id}?trip_id=${tripId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_completed: !current }),
    })
    fetchData(tripId)
  }

  async function deleteTask(id: number) {
    if (!confirm('確定要刪除這個任務嗎？')) return

    const tripId = localStorage.getItem('organizer_trip_id')
    if (!tripId) return

    await fetch(`/api/tasks/${id}?trip_id=${tripId}`, { method: 'DELETE' })
    fetchData(tripId)
  }

  if (loading) return <div className="p-4">載入中...</div>

  const pending = tasks.filter(t => !t.is_completed)
  const completed = tasks.filter(t => t.is_completed)

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/organizer/dashboard" className="text-blue-600 hover:underline mb-2 inline-block">← 返回管理首頁</a>
        <h1 className="text-3xl font-bold mb-2">✅ 任務清單</h1>
        <p className="text-gray-600">
          待辦：{pending.length} | 已完成：{completed.length}
        </p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? '取消' : '+ 新增任務'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="mb-3">
            <label className="block mb-1 font-bold">任務描述 *</label>
            <textarea
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="例如：訂購午餐便當"
              rows={3}
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">負責人（可選）</label>
            <select
              value={formData.assignee_id || ''}
              onChange={e => setFormData({ ...formData, assignee_id: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full p-2 border rounded"
            >
              <option value="">未指定</option>
              {people.map(person => (
                <option key={person.id} value={person.id}>{person.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            新增
          </button>
        </form>
      )}

      {/* 待辦任務 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">⏳ 待辦事項</h2>
        <div className="grid gap-3">
          {pending.map(task => (
            <div key={task.id} className="p-4 bg-white rounded-lg shadow flex items-start gap-3">
              <input
                type="checkbox"
                checked={false}
                onChange={() => toggleComplete(task.id, task.is_completed)}
                className="mt-1 w-5 h-5 cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-gray-800">{task.description}</p>
                {task.assignee && (
                  <p className="text-sm text-gray-500 mt-1">負責人：{task.assignee.name}</p>
                )}
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                刪除
              </button>
            </div>
          ))}
          {pending.length === 0 && (
            <p className="text-gray-400 text-center py-4">沒有待辦事項</p>
          )}
        </div>
      </div>

      {/* 已完成任務 */}
      <div>
        <h2 className="text-xl font-bold mb-3">✓ 已完成</h2>
        <div className="grid gap-3">
          {completed.map(task => (
            <div key={task.id} className="p-4 bg-gray-50 rounded-lg flex items-start gap-3 opacity-75">
              <input
                type="checkbox"
                checked={true}
                onChange={() => toggleComplete(task.id, task.is_completed)}
                className="mt-1 w-5 h-5 cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-gray-600 line-through">{task.description}</p>
                {task.assignee && (
                  <p className="text-sm text-gray-500 mt-1">負責人：{task.assignee.name}</p>
                )}
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                刪除
              </button>
            </div>
          ))}
          {completed.length === 0 && (
            <p className="text-gray-400 text-center py-4">還沒有完成任何任務</p>
          )}
        </div>
      </div>
    </div>
  )
}
