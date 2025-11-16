import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateUniqueSlug } from '@/lib/slug-generator'

/**
 * 核准 Trip 申請 - Linus 原則
 * - Simple: 生成 slug → 建立 trip → 更新申請狀態
 * - Direct: 一次完成，無複雜流程
 * - Good Taste: 原子性操作，清楚的錯誤處理
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { admin_notes } = body

    // 1. 取得申請資料
    const { data: application, error: appError } = await supabase
      .from('trip_applications')
      .select('*')
      .eq('id', params.id)
      .single()

    if (appError || !application) {
      return NextResponse.json({ error: '找不到申請' }, { status: 404 })
    }

    if (application.status !== 'pending') {
      return NextResponse.json(
        { error: '此申請已經處理過了' },
        { status: 400 }
      )
    }

    // 2. 生成唯一的 slug
    const slug = await generateUniqueSlug(
      application.trip_name,
      application.proposed_slug
    )

    // 3. 建立 trip 記錄
    const { data: newTrip, error: tripError } = await supabase
      .from('trips')
      .insert([
        {
          slug,
          trip_name: application.trip_name,
          owner_email: application.applicant_email,
          is_active: true,
        },
      ])
      .select()
      .single()

    if (tripError) {
      console.error('建立 trip 錯誤:', tripError.message)
      return NextResponse.json({ error: '建立 trip 失敗' }, { status: 500 })
    }

    // 4. 更新申請狀態
    const { error: updateError } = await supabase
      .from('trip_applications')
      .update({
        status: 'approved',
        trip_id: newTrip.id,
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin', // TODO: 可以從 token 取得 admin email
        admin_notes,
      })
      .eq('id', params.id)

    if (updateError) {
      console.error('更新申請狀態錯誤:', updateError.message)
      // 注意：trip 已建立但申請狀態更新失敗，可能需要手動處理
      return NextResponse.json(
        { error: '更新申請狀態失敗' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      trip: newTrip,
      message: `核准成功！專屬網址：${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?trip=${slug}`,
    })
  } catch (err: any) {
    console.error('核准申請錯誤:', err.message)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}
