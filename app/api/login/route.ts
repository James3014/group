import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { trip_id, password } = body

        if (!trip_id || !password) {
            return NextResponse.json({ error: '請輸入行程 ID 和密碼' }, { status: 400 })
        }

        // 查詢行程
        const { data: trip, error } = await supabase
            .from('trip_settings')
            .select('id, password, trip_name')
            .eq('trip_id', trip_id) // 注意：這裡是 trip_id (string)
            .single()

        if (error || !trip) {
            return NextResponse.json({ error: '找不到此行程' }, { status: 404 })
        }

        // 驗證密碼
        // 注意：為了簡單起見，這裡使用明文比對。生產環境應使用 Hash。
        // 預設密碼為 '123456' (如果資料庫欄位是 NULL，這裡會失敗，所以必須先執行 Migration)
        const dbPassword = trip.password || '123456'

        if (password !== dbPassword) {
            return NextResponse.json({ error: '密碼錯誤' }, { status: 401 })
        }

        // 登入成功，回傳 Token
        // 這裡使用簡單的 Base64 Token: trip_id:timestamp
        const token = Buffer.from(`${trip.id}:${Date.now()}`).toString('base64')

        // 設定 Cookie (HttpOnly)
        const response = NextResponse.json({ success: true, trip_name: trip.trip_name })

        // 注意：在 Next.js App Router API Route 中設定 Cookie 需要用 cookies() helper 或 response headers
        // 這裡我們簡單回傳 token，讓前端存入 localStorage 或 Cookie
        // 為了更安全，我們建議前端存入 localStorage，並在每次 API 請求帶上

        return NextResponse.json({
            success: true,
            token,
            trip_name: trip.trip_name,
            trip_id: trip_id
        })

    } catch (err: any) {
        console.error('登入錯誤:', err)
        return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
    }
}
