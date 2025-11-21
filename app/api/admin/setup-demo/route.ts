import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * 一鍵建立 Demo Trip - Linus 原則
 * Simple: 單一 API 呼叫完成所有設定
 * Direct: 檢查 → 建立 Trip → 建立範例資料
 * Good Taste: 冪等性操作，可重複執行
 */
export async function POST(request: Request) {
    try {
        // 1. 檢查是否已存在 Demo Trip
        const { data: existingTrip } = await supabaseAdmin
            .from('trips')
            .select('id, trip_name, slug')
            .eq('slug', 'demo-trip-2025')
            .single()

        if (existingTrip) {
            return NextResponse.json({
                success: true,
                message: 'Demo Trip 已存在',
                trip: existingTrip,
                instruction: `請在 Zeabur 環境變數中設定: NEXT_PUBLIC_DEMO_TRIP_ID=${existingTrip.id}`
            })
        }

        // 2. 建立 Demo Trip
        const { data: newTrip, error: tripError } = await supabaseAdmin
            .from('trips')
            .insert([
                {
                    slug: 'demo-trip-2025',
                    trip_name: '🏔️ 2025 北海道滑雪團 Demo',
                    owner_email: 'demo@diyski.example.com',
                    is_active: true,
                },
            ])
            .select()
            .single()

        if (tripError) {
            console.error('建立 Demo Trip 錯誤:', tripError)
            return NextResponse.json({ error: '建立 Demo Trip 失敗', details: tripError }, { status: 500 })
        }

        // 3. 建立範例資料 - Trip Settings
        const { error: settingsError } = await supabaseAdmin
            .from('trip_settings')
            .insert([
                {
                    trip_id: newTrip.id,
                    trip_name: '🏔️ 2025 北海道滑雪團 Demo',
                    start_date: '2025-02-01',
                    end_date: '2025-02-07',
                    location: '北海道二世谷',
                    description: '這是系統示範用的範例行程，展示所有功能運作'
                }
            ])

        if (settingsError) {
            console.error('建立 Trip Settings 錯誤:', settingsError)
        }

        // 4. 建立範例參加者
        const demoParticipants = [
            { trip_id: newTrip.id, name: '王小明', email: 'ming@example.com', level: 'beginner', notes: '新手' },
            { trip_id: newTrip.id, name: '李大華', email: 'david@example.com', level: 'intermediate', notes: '中級，偏好新雪谷' },
            { trip_id: newTrip.id, name: '張美玲', email: 'may@example.com', level: 'advanced', notes: '高級滑手' },
        ]

        const { error: peopleError } = await supabaseAdmin
            .from('people')
            .insert(demoParticipants)

        if (peopleError) {
            console.error('建立範例參加者錯誤:', peopleError)
        }

        // 5. 建立範例公告
        const { error: announcementError } = await supabaseAdmin
            .from('announcements')
            .insert([
                {
                    trip_id: newTrip.id,
                    title: '歡迎來到 Demo 系統！',
                    content: '這是一個示範用的滑雪團行程。你可以自由瀏覽所有功能，包括分組、交通、餐飲等管理工具。',
                    is_important: true
                }
            ])

        if (announcementError) {
            console.error('建立範例公告錯誤:', announcementError)
        }

        return NextResponse.json({
            success: true,
            message: 'Demo Trip 建立成功！',
            trip: newTrip,
            instruction: `✅ 請在 Zeabur 環境變數中新增: NEXT_PUBLIC_DEMO_TRIP_ID=${newTrip.id}`,
            nextSteps: [
                '1. 前往 Zeabur 專案設定',
                `2. 新增環境變數: NEXT_PUBLIC_DEMO_TRIP_ID=${newTrip.id}`,
                '3. 重新部署應用',
                '4. 首頁將自動顯示此 Demo Trip',
                `5. 你的個人 Trip 可用 ?trip_id=1 訪問`
            ]
        })
    } catch (err: any) {
        console.error('建立 Demo Trip 錯誤:', err)
        return NextResponse.json({ error: '系統錯誤', details: err.message }, { status: 500 })
    }
}
