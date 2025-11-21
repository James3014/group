import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * 更新 Trip（啟用/停用等）
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('trips')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('更新 trip 錯誤:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('API 錯誤:', err.message)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}

/**
 * 刪除 Trip
 * 注意：ID=5 是 Demo 資料，受保護不可刪除
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = parseInt(params.id)

    // 保護 Demo Trip (ID=5)
    if (tripId === 5) {
      return NextResponse.json(
        { error: 'Demo Trip (ID=5) 受保護，不可刪除' },
        { status: 403 }
      )
    }

    const { error, count } = await supabaseAdmin
      .from('trips')
      .delete({ count: 'exact' })
      .eq('id', tripId)

    if (error) {
      console.error('刪除 trip 錯誤:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (count === 0) {
      return NextResponse.json(
        { error: '找不到該 Trip' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: '刪除成功' })
  } catch (err: any) {
    console.error('API 錯誤:', err.message)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}
