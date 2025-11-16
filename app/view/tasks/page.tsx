'use client'

import { useEffect, useState } from 'react'
import { Task, Person } from '@/lib/types'

export default function ViewTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const [tasksRes, peopleRes] = await Promise.all([
      fetch('/api/tasks'),
      fetch('/api/people')
    ])
    const [tasksData, peopleData] = await Promise.all([
      tasksRes.json(),
      peopleRes.json()
    ])
    setTasks(tasksData)
    setPeople(peopleData)
    setLoading(false)
  }

  const pending = tasks.filter(t => !t.is_completed)
  const completed = tasks.filter(t => t.is_completed)

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
      <div className="text-xl text-gray-600">載入中...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <header className="bg-white shadow-sm border-b-4 border-indigo-500 mb-6">
        <div className="max-w-4xl mx-auto p-6">
          <a href="/view" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首頁</a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">✅ 任務清單</h1>
          <div className="flex gap-4 text-gray-600">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-bold">
              待辦：{pending.length}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold">
              已完成：{completed.length}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pb-8 space-y-6">
        {/* 待辦任務 */}
        {pending.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 待辦事項</h2>
            <div className="space-y-3">
              {pending.map(task => {
                const assignee = task.assignee_id ? people.find(p => p.id === task.assignee_id) : null
                return (
                  <div key={task.id} className="bg-white rounded-lg shadow-md border-l-4 border-yellow-400 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg text-gray-900">{task.description}</p>
                        {assignee && (
                          <p className="text-sm text-gray-600 mt-1">
                            👤 負責人：{assignee.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 已完成任務 */}
        {completed.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-800">✓ 已完成</h2>
            <div className="space-y-3">
              {completed.map(task => {
                const assignee = task.assignee_id ? people.find(p => p.id === task.assignee_id) : null
                return (
                  <div key={task.id} className="bg-white rounded-lg shadow-md border-l-4 border-green-400 p-4 opacity-75">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs">✓</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg text-gray-700 line-through">{task.description}</p>
                        {assignee && (
                          <p className="text-sm text-gray-500 mt-1">👤 {assignee.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">目前沒有任務</h3>
          </div>
        )}
      </div>
    </div>
  )
}
