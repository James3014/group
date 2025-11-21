'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OrganizerLoginPage() {
    const [tripId, setTripId] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trip_id: tripId, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || '登入失敗')
            }

            // 登入成功
            // 1. 儲存 Token
            localStorage.setItem('organizer_token', data.token)
            localStorage.setItem('organizer_trip_id', data.trip_id)

            // 2. 設定 Cookie (為了 Middleware)
            document.cookie = `trip_token=${data.token}; path=/; max-age=86400; SameSite=Strict`

            // 3. 跳轉到管理首頁 (目前暫定為 /trip-settings 或新的 /organizer/dashboard)
            // 為了兼容現有路徑，我們先跳轉到 /trip-settings，但這需要我們在下一步保護該頁面
            router.push('/trip-settings')

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-2">👑</div>
                    <h1 className="text-2xl font-bold text-gray-900">團主登入</h1>
                    <p className="text-gray-500">請輸入您的行程 ID 與密碼</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Trip ID</label>
                        <input
                            type="text"
                            required
                            value={tripId}
                            onChange={(e) => setTripId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="例如：1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">密碼</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="預設為 123456"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? '登入中...' : '登入管理'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
                        ← 返回首頁
                    </a>
                </div>
            </div>
        </div>
    )
}
