'use client'

import { useEffect, useState } from 'react'
import { Person } from '@/lib/types'

import { useSearchParams } from 'next/navigation'

export default function ViewPeoplePage() {
  const searchParams = useSearchParams()
  const tripId = searchParams.get('trip_id') || process.env.NEXT_PUBLIC_DEMO_TRIP_ID || '1'

  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPeople()
  }, [tripId])

  async function fetchPeople() {
    try {
      const res = await fetch(`/api/people?trip_id=${tripId}`)
      const data = await res.json()
      setPeople(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch people:", error)
      setLoading(false)
    }
  }

  // 將有親子關係的人排在一起
  function sortByFamily(peopleList: Person[]): Person[] {
    const sorted: Person[] = []
    const processed = new Set<number>()

    // 先處理有子女的父母（一家人一起）
    peopleList.forEach(person => {
      if (person.age_group === 'adult' && !processed.has(person.id)) {
        const children = peopleList.filter(p =>
          p.father_id === person.id || p.mother_id === person.id
        )

        if (children.length > 0) {
          // 找配偶（如果子女有另一個父母）
          const spouse = children[0].father_id === person.id
            ? peopleList.find(p => p.id === children[0].mother_id)
            : peopleList.find(p => p.id === children[0].father_id)

          // 父母先
          sorted.push(person)
          processed.add(person.id)
          if (spouse && !processed.has(spouse.id)) {
            sorted.push(spouse)
            processed.add(spouse.id)
          }

          // 子女緊接著
          children.forEach(child => {
            if (!processed.has(child.id)) {
              sorted.push(child)
              processed.add(child.id)
            }
          })
        }
      }
    })

    // 再處理沒有子女的成人
    peopleList.forEach(person => {
      if (person.age_group === 'adult' && !processed.has(person.id)) {
        sorted.push(person)
        processed.add(person.id)
      }
    })

    // 最後處理沒有父母資訊的小孩
    peopleList.forEach(person => {
      if (!processed.has(person.id)) {
        sorted.push(person)
        processed.add(person.id)
      }
    })

    return sorted
  }

  const confirmed = people.filter(p => p.is_confirmed)
  const pending = people.filter(p => !p.is_confirmed)

  // 搜尋過濾並按家庭排序
  const filteredConfirmed = sortByFamily(
    confirmed.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  const filteredPending = sortByFamily(
    pending.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-xl text-gray-600">載入中...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-blue-500 mb-6">
        <div className="max-w-5xl mx-auto p-6">
          <a href="/view" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回首頁
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 參加人員名單</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold">
              ✓ 已確認：{confirmed.length} 人
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-bold">
              待確認：{pending.length} 人
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">
              總計：{people.length} 人
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pb-8">
        {/* 搜尋框 */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 搜尋姓名..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>

        {/* 已確認人員 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">
            <span>✓</span>
            <span>已確認參加</span>
            <span className="text-lg text-gray-500">({filteredConfirmed.length})</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {filteredConfirmed.map(person => (
              <PersonCard key={person.id} person={person} people={people} />
            ))}
          </div>
          {filteredConfirmed.length === 0 && (
            <p className="text-gray-400 text-center py-8">沒有符合的結果</p>
          )}
        </div>

        {/* 待確認人員 */}
        {filteredPending.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-600 flex items-center gap-2">
              <span>⏳</span>
              <span>待確認</span>
              <span className="text-lg text-gray-500">({filteredPending.length})</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPending.map(person => (
                <PersonCard key={person.id} person={person} people={people} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PersonCard({ person, people }: { person: Person; people: Person[] }) {
  return (
    <div className={`p-5 rounded-lg shadow-md border-l-4 ${person.is_confirmed
      ? 'bg-white border-green-500'
      : 'bg-gray-50 border-gray-400'
      }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {person.name}
            {person.age_group === 'child' && ' 👶'}
          </h3>
          {person.phone && (
            <p className="text-sm text-gray-600 mt-1">📱 {person.phone}</p>
          )}
        </div>
        {person.is_confirmed && (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-bold">
            ✓
          </span>
        )}
      </div>

      {/* 親子關係 */}
      {(person.father_id || person.mother_id) && (
        <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
          <p className="text-blue-800">
            {person.father_id && (
              <span>👨 父親：{people.find(p => p.id === person.father_id)?.name}</span>
            )}
            {person.father_id && person.mother_id && ' | '}
            {person.mother_id && (
              <span>👩 母親：{people.find(p => p.id === person.mother_id)?.name}</span>
            )}
          </p>
        </div>
      )}

      {/* 子女 */}
      {person.age_group === 'adult' && (
        (() => {
          const children = people.filter(
            p => p.father_id === person.id || p.mother_id === person.id
          )
          return children.length > 0 ? (
            <div className="mb-3 p-2 bg-purple-50 rounded text-sm">
              <p className="text-purple-800">
                👶 子女：{children.map(c => c.name).join('、')}
              </p>
            </div>
          ) : null
        })()
      )}

      {/* 技術資訊 */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700">技術等級：</span>
          <span className={`px-2 py-0.5 rounded font-bold ${person.ski_level === 'beginner' ? 'bg-yellow-100 text-yellow-800' :
            person.ski_level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
              'bg-purple-100 text-purple-800'
            }`}>
            {person.ski_level === 'beginner' && '初級'}
            {person.ski_level === 'intermediate' && '中級'}
            {person.ski_level === 'advanced' && '高級'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700">板型：</span>
          <span>
            {person.board_type === 'ski' ? '🎿 雙板' : '🏂 單板'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700">裝備：</span>
          <span>
            {person.equipment === 'own' ? '✓ 自備' : '📦 租借'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {person.has_radio && (
            <span className="text-green-600 font-bold">📻 有無線電</span>
          )}
        </div>
      </div>
    </div>
  )
}
