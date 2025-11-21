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
        const { data: tripSettings, error } = await supabase
            .from('trip_settings')
            .select('id, password, trip_name, trip_id')
            .eq('trip_id', trip_id)
            .single()

        if (error || !tripSettings) {
            return NextResponse.json({ error: '找不到此行程' }, { status: 404 })
        }

        // 驗證密碼
        const dbPassword = tripSettings.password || '123456'

        if (password !== dbPassword) {
            return NextResponse.json({ error: '密碼錯誤' }, { status: 401 })
        }

        // 登入成功，回傳 Token
        // Token 格式: trip_id:timestamp（使用 trips.id，不是 trip_settings.id）
        const token = Buffer.from(`${tripSettings.trip_id}:${Date.now()}`).toString('base64')

        return NextResponse.json({
            success: true,
            token,
            trip_name: tripSettings.trip_name,
            trip_id: tripSettings.trip_id  // 使用 trip_settings.trip_id（關聯到 trips.id）
        })

    } catch (err: any) {
        console.error('登入錯誤:', err)
        return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
    }
}
