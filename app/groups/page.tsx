'use client'

import { useEffect, useState } from 'react'
import { Person, SkiGroup } from '@/lib/types'

export default function GroupsPage() {
  const [groups, setGroups] = useState<SkiGroup[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    group_date: '',
    notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [groupsRes, peopleRes] = await Promise.all([
        fetch('/api/ski-groups'),
        fetch('/api/people')
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

  function resetForm() {
    setFormData({ name: '', group_date: '', notes: '' })
    setEditingId(null)
  }

  function startEdit(group: SkiGroup) {
    setFormData({
      name: group.name,
      group_date: group.group_date || '',
      notes: group.notes || '',
    })
    setEditingId(group.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const isEditing = editingId !== null
    const url = isEditing ? `/api/ski-groups/${editingId}` : '/api/ski-groups'
    const method = isEditing ? 'PATCH' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`儲存失敗：${errorData.error || '未知錯誤'}\n\n請確認：\n1. 資料庫中已有 ski_groups 和 ski_group_members 表格\n2. 表格的 RLS 政策已設定`)
        return
      }

      resetForm()
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('提交錯誤:', error)
      alert('儲存失敗，請檢查網路連線或查看控制台錯誤訊息')
    }
  }

  async function deleteGroup(id: number, name: string) {
    if (!confirm(`確定要刪除「${name}」嗎？所有成員分配將被清除。`)) return

    await fetch(`/api/ski-groups/${id}`, { method: 'DELETE' })
    fetchData()
  }

  async function addMemberToGroup(groupId: number, personId: number) {
    const group = groups.find(g => g.id === groupId)
    if (!group) return

    const newMemberIds = [...(group.member_ids || []), personId]

    await fetch(`/api/ski-groups/${groupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_ids: newMemberIds }),
    })

    fetchData()
  }

  async function removeMemberFromGroup(groupId: number, personId: number) {
    const group = groups.find(g => g.id === groupId)
    if (!group) return

    const newMemberIds = (group.member_ids || []).filter(id => id !== personId)

    await fetch(`/api/ski-groups/${groupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_ids: newMemberIds }),
    })

    fetchData()
  }

  // 計算未分組的人員
  const assignedPeopleIds = new Set(
    groups.flatMap(g => g.member_ids || [])
  )
  const unassignedPeople = people.filter(p => !assignedPeopleIds.has(p.id))

  // 統計資訊
  const radioCount = people.filter(p => p.has_radio).length

  // 獲取親子關係資訊
  function getRelationshipInfo(person: Person): string {
    const relations: string[] = []

    // 如果是小孩，顯示父母
    if (person.age_group === 'child') {
      if (person.father_id) {
        const father = people.find(p => p.id === person.father_id)
        if (father) relations.push(`👨 ${father.name}`)
      }
      if (person.mother_id) {
        const mother = people.find(p => p.id === person.mother_id)
        if (mother) relations.push(`👩 ${mother.name}`)
      }
    }

    // 如果是大人，顯示子女
    if (person.age_group === 'adult') {
      const children = people.filter(p =>
        p.father_id === person.id || p.mother_id === person.id
      )
      if (children.length > 0) {
        relations.push(`👶 ${children.map(c => c.name).join('、')}`)
      }
    }

    return relations.join(' | ')
  }

  if (loading) return <div className="p-4">載入中...</div>

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <a href="/" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首頁</a>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold">🏂 滑雪分組</h1>
            <p className="text-gray-600">
              自由分配成員到不同組別 | 共 {people.length} 人，{radioCount} 人有無線電
            </p>
          </div>
          <button
            onClick={() => {
              if (showForm) {
                resetForm()
              }
              setShowForm(!showForm)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showForm ? '取消' : '+ 新增分組'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-3">{editingId ? '編輯分組' : '新增分組'}</h3>
          <div className="mb-3">
            <label className="block mb-1 font-bold">組別名稱 *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="例如：A組、B組、初學者組等"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">日期</label>
            <input
              type="date"
              value={formData.group_date}
              onChange={e => setFormData({ ...formData, group_date: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-bold">備註</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="集合地點、教練資訊等"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            {editingId ? '更新' : '新增'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：分組列表 */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">分組列表 ({groups.length} 組)</h2>

          {groups.map(group => {
            const members = people.filter(p => group.member_ids?.includes(p.id))

            return (
              <div key={group.id} className="p-4 bg-white rounded-lg shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{group.name}</h3>
                    {group.group_date && (
                      <p className="text-sm text-gray-500">📅 {group.group_date}</p>
                    )}
                    {group.notes && (
                      <p className="text-sm text-gray-600 mt-1">{group.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(group)}
                      className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => deleteGroup(group.id, group.name)}
                      className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      刪除
                    </button>
                  </div>
                </div>

                <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-bold">成員 ({members.length} 人)：</span>
                  {members.filter(m => m.has_radio).length > 0 && (
                    <span className="text-green-600">📻 {members.filter(m => m.has_radio).length} 人有無線電</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  {members.map(person => {
                    const relationInfo = getRelationshipInfo(person)
                    return (
                      <div key={person.id} className="flex items-start justify-between p-2 bg-gray-50 rounded text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">
                            {person.name}
                            {person.age_group === 'child' && ' 👶'}
                            {person.has_radio && ' 📻'}
                          </p>
                          {relationInfo && (
                            <p className="text-xs text-gray-600 mt-0.5 truncate" title={relationInfo}>
                              {relationInfo}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeMemberFromGroup(group.id, person.id)}
                          className="text-red-600 hover:text-red-800 text-xs ml-2 flex-shrink-0"
                          title="移除"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  })}
                  {members.length === 0 && (
                    <p className="col-span-full text-gray-400 text-sm">尚無成員</p>
                  )}
                </div>

                {/* 添加成員下拉選單 */}
                {unassignedPeople.length > 0 && (
                  <div className="mt-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addMemberToGroup(group.id, parseInt(e.target.value))
                          e.target.value = '' // 重置選擇
                        }
                      }}
                      className="text-sm p-2 border rounded w-full md:w-auto"
                    >
                      <option value="">+ 添加成員...</option>
                      {unassignedPeople.map(person => (
                        <option key={person.id} value={person.id}>
                          {person.name} ({person.ski_level === 'beginner' ? '初級' : person.ski_level === 'intermediate' ? '中級' : '高級'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )
          })}

          {groups.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
              還沒有任何分組，點擊「新增分組」開始建立
            </div>
          )}
        </div>

        {/* 右側：未分組人員 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">未分組人員 ({unassignedPeople.length})</h2>

          <div className="bg-white rounded-lg shadow p-4">
            {unassignedPeople.length > 0 ? (
              <div className="space-y-2">
                {unassignedPeople.map(person => {
                  const relationInfo = getRelationshipInfo(person)
                  return (
                    <div key={person.id} className="p-2 bg-gray-50 rounded text-sm">
                      <p className="font-medium">
                        {person.name}
                        {person.age_group === 'child' && ' 👶'}
                        {person.has_radio && ' 📻'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {person.ski_level === 'beginner' && '初級'}
                        {person.ski_level === 'intermediate' && '中級'}
                        {person.ski_level === 'advanced' && '高級'}
                        {' | '}
                        {person.board_type === 'ski' ? '雙板' : '單板'}
                      </p>
                      {relationInfo && (
                        <p className="text-xs text-blue-600 mt-1">
                          {relationInfo}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">
                所有人員都已分組 ✓
              </p>
            )}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-bold text-sm mb-1">💡 使用提示</p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• 點擊「新增分組」建立組別</li>
              <li>• 在每組下方選擇成員添加到該組</li>
              <li>• 點擊成員旁的 ✕ 可移除成員</li>
              <li>• 未分組人員會顯示在右側</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
