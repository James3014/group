'use client'

import { useEffect, useState } from 'react'
import { Person } from '@/lib/types'

export default function GroupsPage() {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPeople()
  }, [])

  async function fetchPeople() {
    const res = await fetch('/api/people')
    const data = await res.json()
    setPeople(data)
    setLoading(false)
  }

  const beginners = people.filter(p => p.ski_level === 'beginner')
  const intermediate = people.filter(p => p.ski_level === 'intermediate')
  const advanced = people.filter(p => p.ski_level === 'advanced')

  // 統計資訊
  const skiCount = people.filter(p => p.board_type === 'ski').length
  const snowboardCount = people.filter(p => p.board_type === 'snowboard').length
  const rentalCount = people.filter(p => p.equipment === 'rental').length
  const childCount = people.filter(p => p.age_group === 'child').length

  if (loading) return <div className="p-4">載入中...</div>

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首頁</a>
        <h1 className="text-3xl font-bold mb-2">🏂 滑雪分組</h1>
        <p className="text-gray-600">依據滑雪水平自動分組</p>
      </div>

      {/* 統計資訊 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold">🎿 {skiCount}</p>
          <p className="text-sm text-gray-600">雙板</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold">🏂 {snowboardCount}</p>
          <p className="text-sm text-gray-600">單板</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold">📦 {rentalCount}</p>
          <p className="text-sm text-gray-600">需租借</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold">👶 {childCount}</p>
          <p className="text-sm text-gray-600">小孩</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* 初級組 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">🟢</span>
            <div>
              <h2 className="text-2xl font-bold">初級組</h2>
              <p className="text-gray-600">共 {beginners.length} 人</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {beginners.map(person => (
              <div key={person.id} className="p-3 bg-green-50 rounded border border-green-200">
                <p className="font-medium">
                  {person.name}
                  {person.age_group === 'child' && ' 👶'}
                </p>
                <p className="text-xs text-gray-600">
                  {person.board_type === 'ski' ? '🎿 雙板' : '🏂 單板'}
                  {' · '}
                  {person.equipment === 'own' ? '自備' : '租借'}
                </p>
              </div>
            ))}
            {beginners.length === 0 && (
              <p className="text-gray-400 col-span-full">暫無成員</p>
            )}
          </div>
        </div>

        {/* 中級組 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">🔵</span>
            <div>
              <h2 className="text-2xl font-bold">中級組</h2>
              <p className="text-gray-600">共 {intermediate.length} 人</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {intermediate.map(person => (
              <div key={person.id} className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="font-medium">
                  {person.name}
                  {person.age_group === 'child' && ' 👶'}
                </p>
                <p className="text-xs text-gray-600">
                  {person.board_type === 'ski' ? '🎿 雙板' : '🏂 單板'}
                  {' · '}
                  {person.equipment === 'own' ? '自備' : '租借'}
                </p>
              </div>
            ))}
            {intermediate.length === 0 && (
              <p className="text-gray-400 col-span-full">暫無成員</p>
            )}
          </div>
        </div>

        {/* 高級組 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">🔴</span>
            <div>
              <h2 className="text-2xl font-bold">高級組</h2>
              <p className="text-gray-600">共 {advanced.length} 人</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {advanced.map(person => (
              <div key={person.id} className="p-3 bg-red-50 rounded border border-red-200">
                <p className="font-medium">
                  {person.name}
                  {person.age_group === 'child' && ' 👶'}
                </p>
                <p className="text-xs text-gray-600">
                  {person.board_type === 'ski' ? '🎿 雙板' : '🏂 單板'}
                  {' · '}
                  {person.equipment === 'own' ? '自備' : '租借'}
                </p>
              </div>
            ))}
            {advanced.length === 0 && (
              <p className="text-gray-400 col-span-full">暫無成員</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
        <p className="font-bold mb-1">💡 提示</p>
        <p className="text-sm text-gray-700">
          滑雪水平可以在「人員管理」頁面進行調整
        </p>
      </div>
    </div>
  )
}
