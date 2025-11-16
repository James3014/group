'use client'

/**
 * Super Admin - Trip 管理頁面
 * - Simple: 清楚的列表，一目了然
 * - Direct: 快速操作，即時反饋
 * - Good Taste: 表格清晰，狀態明確
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trip, TripApplication } from '@/lib/types'

export default function AdminTripsPage() {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [applications, setApplications] = useState<TripApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'trips' | 'applications'>('applications')

  useEffect(() => {
    // 檢查登入狀態
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // 載入 trips
      const tripsRes = await fetch('/api/trips')
      const tripsData = await tripsRes.json()
      setTrips(tripsData)

      // 載入申請（pending 狀態）
      const appsRes = await fetch('/api/trip-applications?status=pending')
      const appsData = await appsRes.json()
      setApplications(appsData)
    } catch (error) {
      console.error('載入資料失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">載入中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🔐 Super Admin</h1>
              <p className="text-sm text-gray-600">滑雪團系統管理後台</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              登出
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">總 Trips 數量</div>
            <div className="text-3xl font-bold text-gray-900">{trips.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">待審核申請</div>
            <div className="text-3xl font-bold text-orange-600">{applications.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">啟用中的 Trips</div>
            <div className="text-3xl font-bold text-green-600">
              {trips.filter((t) => t.is_active).length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                待審核申請 {applications.length > 0 && `(${applications.length})`}
              </button>
              <button
                onClick={() => setActiveTab('trips')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'trips'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                所有 Trips ({trips.length})
              </button>
            </nav>
          </div>

          {/* Applications List */}
          {activeTab === 'applications' && (
            <div className="p-6">
              {applications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">✅</div>
                  <p>目前沒有待審核的申請</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      onReload={loadData}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Trips List */}
          {activeTab === 'trips' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      行程名稱
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      團主 Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      狀態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trips.map((trip) => (
                    <TripRow key={trip.id} trip={trip} onReload={loadData} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// 申請卡片元件
function ApplicationCard({
  application,
  onReload,
}: {
  application: TripApplication
  onReload: () => void
}) {
  const [processing, setProcessing] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')

  const handleApprove = async () => {
    if (!confirm(`確定要核准「${application.trip_name}」的申請嗎？`)) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/trip-applications/${application.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes }),
      })

      if (!response.ok) throw new Error('核准失敗')

      alert('✅ 核准成功！')
      onReload()
    } catch (error: any) {
      alert(`❌ ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    const reason = prompt('請輸入拒絕原因（會發送給申請人）：')
    if (!reason) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/trip-applications/${application.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: reason }),
      })

      if (!response.ok) throw new Error('拒絕失敗')

      alert('✅ 已拒絕申請')
      onReload()
    } catch (error: any) {
      alert(`❌ ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{application.trip_name}</h3>
          <p className="text-sm text-gray-600">{application.applicant_email}</p>
        </div>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
          待審核
        </span>
      </div>

      {application.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded border-l-4 border-gray-300">
          <p className="text-sm text-gray-700">{application.notes}</p>
        </div>
      )}

      <div className="text-xs text-gray-500 mb-4">
        申請時間：{new Date(application.created_at).toLocaleString('zh-TW')}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleApprove}
          disabled={processing}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          ✓ 核准
        </button>
        <button
          onClick={handleReject}
          disabled={processing}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
        >
          ✗ 拒絕
        </button>
      </div>
    </div>
  )
}

// Trip 列表行元件
function TripRow({ trip, onReload }: { trip: Trip; onReload: () => void }) {
  const [processing, setProcessing] = useState(false)

  const handleToggleActive = async () => {
    const action = trip.is_active ? '停用' : '啟用'
    if (!confirm(`確定要${action}「${trip.trip_name}」嗎？`)) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/trips/${trip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !trip.is_active }),
      })

      if (!response.ok) throw new Error(`${action}失敗`)

      alert(`✅ ${action}成功！`)
      onReload()
    } catch (error: any) {
      alert(`❌ ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-900">{trip.id}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{trip.trip_name}</td>
      <td className="px-6 py-4 text-sm text-gray-600">
        <code className="px-2 py-1 bg-gray-100 rounded text-xs">{trip.slug}</code>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{trip.owner_email}</td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            trip.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {trip.is_active ? '啟用中' : '已停用'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">
        <button
          onClick={handleToggleActive}
          disabled={processing}
          className={`px-3 py-1 rounded text-xs font-medium ${
            trip.is_active
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } disabled:opacity-50`}
        >
          {trip.is_active ? '停用' : '啟用'}
        </button>
      </td>
    </tr>
  )
}
