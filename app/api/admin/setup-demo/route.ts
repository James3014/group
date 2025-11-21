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
        // 0. 特殊處理：如果環境變數指定了 ID，我們先檢查該 ID 是否存在且有資料
        const targetId = process.env.NEXT_PUBLIC_DEMO_TRIP_ID ? parseInt(process.env.NEXT_PUBLIC_DEMO_TRIP_ID) : null

        if (targetId) {
            // 直接嘗試檢查和修復：如果 settings 不存在就插入
            const { data: settings, error: settingsCheckError } = await supabaseAdmin
                .from('trip_settings')
                .select('*')
                .eq('trip_id', targetId)
                .limit(1)
                .maybeSingle()

            if (!settings) {
                // 需要插入 settings，但先確保 trip 存在
                const { data: trip } = await supabaseAdmin
                    .from('trips')
                    .select('id')
                    .eq('id', targetId)
                    .maybeSingle()

                if (!trip) {
                    // Trip 不存在，創建一個新的（自動 ID）
                    const { data: newTrip, error: tripCreateError } = await supabaseAdmin
                        .from('trips')
                        .insert([{
                            slug: `demo-trip-${Date.now()}`,
                            trip_name: '🏔️ Demo 行程',
                            owner_email: 'demo@diyski.example.com',
                            is_active: true,
                        }])
                        .select()
                        .single()

                    if (tripCreateError) {
                        console.error('建立 Trip 失敗:', tripCreateError)
                        return NextResponse.json({
                            success: false,
                            error: '無法建立行程',
                            details: tripCreateError.message
                        }, { status: 500 })
                    }

                    // 使用新建立的 trip ID
                    const newTripId = newTrip.id
                    const { error: insertError } = await supabaseAdmin
                        .from('trip_settings')
                        .insert([{
                            trip_id: newTripId,
                            trip_name: '🏔️ Demo 行程',
                            start_date: '2025-02-01',
                            end_date: '2025-02-07',
                            location: '北海道二世谷'
                        }])

                    if (insertError) {
                        console.error('插入 trip_settings 失敗:', insertError)
                        return NextResponse.json({
                            success: false,
                            error: '無法建立行程設定',
                            details: insertError.message
                        }, { status: 500 })
                    }

                    return NextResponse.json({
                        success: true,
                        message: `✅ Demo 行程已建立 (ID: ${newTripId})`,
                        instruction: `請在 Zeabur 環境變數設定 NEXT_PUBLIC_DEMO_TRIP_ID=${newTripId}，然後重新部署`
                    })
                }

                // Trip 存在，直接插入 settings
                const { error: insertError } = await supabaseAdmin.from('trip_settings').insert([{
                    trip_id: targetId,
                    trip_name: '已修復的 Demo 行程',
                    start_date: '2025-02-01',
                    end_date: '2025-02-07',
                    location: '北海道二世谷'
                }])

                if (insertError) {
                    console.error('插入 trip_settings 失敗:', insertError)
                    return NextResponse.json({
                        success: false,
                        error: '無法修復資料',
                        details: insertError.message
                    }, { status: 500 })
                }

                return NextResponse.json({
                    success: true,
                    message: `已修復 Trip ID ${targetId} 的資料`,
                    instruction: '請重新整理頁面'
                })
            }

            // Settings 已存在，返回成功
            return NextResponse.json({
                success: true,
                message: `Trip ID ${targetId} 的資料已就緒`,
                instruction: '請重新整理頁面'
            })
        }

        // 1. 檢查是否已存在 Demo Trip (by slug)
        const { data: existingTrip } = await supabaseAdmin
            .from('trips')
            .select('id, trip_name, slug')
            .eq('slug', 'demo-trip-2025')
            .single()

        if (existingTrip) {
            // 如果已存在，但 ID 不符，我們應該提示使用者更新環境變數
            // 或者，如果使用者堅持要用 ID 5，我們可以考慮強制更新 existingTrip 的 ID (這在 SQL 很危險)
            // 
            // 更好的做法：檢查是否已經有 trip_settings
            const { data: settings } = await supabaseAdmin
                .from('trip_settings')
                .select('id')
                .eq('trip_id', existingTrip.id)
                .single()

            if (!settings) {
                // 如果有 Trip 但沒 Settings，補上 Settings
                await supabaseAdmin.from('trip_settings').insert([{
                    trip_id: existingTrip.id,
                    trip_name: existingTrip.trip_name,
                    start_date: '2025-02-01',
                    end_date: '2025-02-07',
                    location: '北海道二世谷'
                }])
            }

            return NextResponse.json({
                success: true,
                message: 'Demo Trip 已存在',
                trip: existingTrip,
                instruction: `請確認 Zeabur 環境變數 NEXT_PUBLIC_DEMO_TRIP_ID=${existingTrip.id} (目前設定為: ${process.env.NEXT_PUBLIC_DEMO_TRIP_ID})`
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
                    location: '北海道二世谷'
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
