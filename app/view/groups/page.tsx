'use client'

import { useEffect, useState } from 'react'
import { Person, SkiGroup, SkiSession } from '@/lib/types'

import { useSearchParams } from 'next/navigation'

export default function ViewGroupsPage() {
  const searchParams = useSearchParams()
  const tripId = searchParams.get('trip_id') || process.env.NEXT_PUBLIC_DEMO_TRIP_ID || '1'

  const [groups, setGroups] = useState<SkiGroup[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSession, setSelectedSession] = useState<SkiSession | ''>('')
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    fetchData()
  }, [tripId])

  async function fetchData() {
    try {
      const [groupsRes, peopleRes] = await Promise.all([
        fetch(`/api/ski-groups?trip_id=${tripId}`),
        fetch(`/api/people?trip_id=${tripId}`)
      ])
      const [groupsData, peopleData] = await Promise.all([
        groupsRes.json(),
        peopleRes.json()
      ])
      setGroups(groupsData)
      setPeople(peopleData)
      setLoading(false)
    } catch (err) {
      console.error('載入資料錯誤:', err)
      setLoading(false)
    }
  }

  function getSessionText(session?: SkiSession): string {
    if (!session) return '未指定時段'
    const sessionMap = {
      morning: '🌅 上午',
      afternoon: '☀️ 下午',
      evening: '🌙 晚上'
    }
    return sessionMap[session] || ''
  }

  // 篩選組別
  const filteredGroups = groups.filter(group => {
    if (selectedDate && group.group_date !== selectedDate) return false
    if (selectedSession && group.session !== selectedSession) return false

    // 如果有搜尋名字，只顯示包含該成員的組別
    if (searchName) {
      const members = people.filter(p => group.member_ids?.includes(p.id))
      return members.some(m => m.name.toLowerCase().includes(searchName.toLowerCase()))
    }

    return true
  })

  // 獲取所有唯一日期（排序）
  const uniqueDates = Array.from(
    new Set(groups.map(g => g.group_date).filter(d => d))
  ).sort()

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-xl text-gray-600">載入中...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-green-500 mb-6">
        <div className="max-w-6xl mx-auto p-6">
          <a href="/view" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回首頁
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🏂 滑雪分組</h1>

          {/* 篩選器 */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">選擇日期</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              >
                <option value="">所有日期</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">選擇時段</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value as SkiSession | '')}
                className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              >
                <option value="">所有時段</option>
                <option value="morning">🌅 上午</option>
                <option value="afternoon">☀️ 下午</option>
                <option value="evening">🌙 晚上</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">搜尋成員</label>
              <input
                type="text"
                placeholder="輸入姓名..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pb-8">
        {/* 分組列表 */}
        {filteredGroups.length > 0 ? (
          <div className="grid gap-6">
            {filteredGroups.map(group => {
              const members = people.filter(p => group.member_ids?.includes(p.id))
              const radioCount = members.filter(m => m.has_radio).length

              return (
                <div key={group.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
                  {/* 組別標題 */}
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{group.name}</h2>
                        <div className="flex items-center gap-4 text-sm">
                          {group.group_date && (
                            <span className="flex items-center gap-1">
                              📅 {group.group_date}
                            </span>
                          )}
                          {group.session && (
                            <span className="flex items-center gap-1">
                              {getSessionText(group.session)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{members.length}</div>
                        <div className="text-sm opacity-90">人</div>
                      </div>
                    </div>
                    {group.notes && (
                      <p className="mt-3 text-sm bg-white/20 rounded p-2">
                        💡 {group.notes}
                      </p>
                    )}
                  </div>

                  {/* 成員列表 */}
                  <div className="p-5">
                    {radioCount > 0 && (
                      <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                        <p className="text-sm text-green-800 font-bold">
                          📻 本組有 {radioCount} 人配備無線電
                        </p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {members.map(person => (
                        <MemberCard
                          key={person.id}
                          person={person}
                          people={people}
                          highlight={!!searchName && person.name.toLowerCase().includes(searchName.toLowerCase())}
                        />
                      ))}
                    </div>

                    {members.length === 0 && (
                      <p className="text-gray-400 text-center py-8">此組尚無成員</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">沒有找到分組</h3>
            <p className="text-gray-500">
              {selectedDate || selectedSession || searchName
                ? '試試調整篩選條件'
                : '目前還沒有任何分組資料'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function MemberCard({ person, people, highlight }: { person: Person; people: Person[]; highlight: boolean }) {
  // 親子關係
  const children = people.filter(p => p.father_id === person.id || p.mother_id === person.id)
  const father = person.father_id ? people.find(p => p.id === person.father_id) : null
  const mother = person.mother_id ? people.find(p => p.id === person.mother_id) : null

  return (
    <div className={`p-3 rounded-lg border-2 transition-all ${highlight
        ? 'bg-yellow-50 border-yellow-400 shadow-lg'
        : 'bg-gray-50 border-gray-200'
      }`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-bold text-gray-900">
          {person.name}
          {person.age_group === 'child' && ' 👶'}
        </h4>
        {person.has_radio && (
          <span className="text-green-600 text-lg" title="有無線電">📻</span>
        )}
      </div>

      <div className="text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded font-bold ${person.ski_level === 'beginner' ? 'bg-yellow-100 text-yellow-800' :
              person.ski_level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
            }`}>
            {person.ski_level === 'beginner' && '初級'}
            {person.ski_level === 'intermediate' && '中級'}
            {person.ski_level === 'advanced' && '高級'}
          </span>
          <span className="text-gray-600">
            {person.board_type === 'ski' ? '🎿 雙板' : '🏂 單板'}
          </span>
        </div>

        {/* 親子關係顯示 */}
        {(father || mother) && (
          <p className="text-blue-700 bg-blue-50 rounded px-2 py-1">
            {father && `👨 ${father.name}`}
            {father && mother && ' | '}
            {mother && `👩 ${mother.name}`}
          </p>
        )}
        {children.length > 0 && (
          <p className="text-purple-700 bg-purple-50 rounded px-2 py-1">
            👶 {children.map(c => c.name).join('、')}
          </p>
        )}
      </div>
    </div>
  )
}
