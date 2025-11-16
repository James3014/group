'use client'

import { useEffect, useState } from 'react'
import { Person } from '@/lib/types'

export default function GroupsPage() {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [manualMode, setManualMode] = useState(false)

  useEffect(() => {
    fetchPeople()
  }, [])

  async function fetchPeople() {
    const res = await fetch('/api/people')
    const data = await res.json()
    setPeople(data)
    setLoading(false)
  }

  async function changeGroup(personId: number, newLevel: 'beginner' | 'intermediate' | 'advanced') {
    try {
      const response = await fetch(`/api/people/${personId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ski_level: newLevel }),
      })

      if (response.ok) {
        await fetchPeople()
      }
    } catch (err) {
      console.error('更新分組錯誤:', err)
      alert('更新失敗，請稍後再試')
    }
  }

  const beginners = people.filter(p => p.ski_level === 'beginner')
  const intermediate = people.filter(p => p.ski_level === 'intermediate')
  const advanced = people.filter(p => p.ski_level === 'advanced')

  function renderPersonCard(
    person: Person,
    bgColor: string,
    borderColor: string,
    currentLevel: 'beginner' | 'intermediate' | 'advanced'
  ) {
    return (
      <div key={person.id} className={`p-3 ${bgColor} rounded border ${borderColor} relative`}>
        <p className="font-medium">
          {person.name}
          {person.age_group === 'child' && ' 👶'}
          {person.has_radio && ' 📻'}
        </p>
        <p className="text-xs text-gray-600">
          {person.board_type === 'ski' ? '🎿 雙板' : '🏂 單板'}
          {' · '}
          {person.equipment === 'own' ? '自備' : '租借'}
        </p>
        {manualMode && (
          <div className="mt-2 flex gap-1">
            {currentLevel !== 'beginner' && (
              <button
                onClick={() => changeGroup(person.id, 'beginner')}
                className="px-2 py-1 text-xs bg-green-200 text-green-800 rounded hover:bg-green-300"
                title="移至初級組"
              >
                →初級
              </button>
            )}
            {currentLevel !== 'intermediate' && (
              <button
                onClick={() => changeGroup(person.id, 'intermediate')}
                className="px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
                title="移至中級組"
              >
                →中級
              </button>
            )}
            {currentLevel !== 'advanced' && (
              <button
                onClick={() => changeGroup(person.id, 'advanced')}
                className="px-2 py-1 text-xs bg-red-200 text-red-800 rounded hover:bg-red-300"
                title="移至高級組"
              >
                →高級
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  // 統計資訊
  const skiCount = people.filter(p => p.board_type === 'ski').length
  const snowboardCount = people.filter(p => p.board_type === 'snowboard').length
  const rentalCount = people.filter(p => p.equipment === 'rental').length
  const childCount = people.filter(p => p.age_group === 'child').length
  const radioCount = people.filter(p => p.has_radio).length

  if (loading) return <div className="p-4">載入中...</div>

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首頁</a>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold">🏂 滑雪分組</h1>
            <p className="text-gray-600">
              {manualMode ? '人工調整模式' : '依據滑雪水平自動分組'}
            </p>
          </div>
          <button
            onClick={() => setManualMode(!manualMode)}
            className={`px-4 py-2 rounded font-bold ${
              manualMode
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {manualMode ? '✏️ 人工模式' : '🔄 切換到人工模式'}
          </button>
        </div>
      </div>

      {/* 統計資訊 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
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
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold">📻 {radioCount}</p>
          <p className="text-sm text-gray-600">無線電</p>
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
            {beginners.map(person => renderPersonCard(person, 'bg-green-50', 'border-green-200', 'beginner'))}
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
            {intermediate.map(person => renderPersonCard(person, 'bg-blue-50', 'border-blue-200', 'intermediate'))}
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
            {advanced.map(person => renderPersonCard(person, 'bg-red-50', 'border-red-200', 'advanced'))}
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
