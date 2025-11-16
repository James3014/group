import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * 拒絕 Trip 申請
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { admin_notes } = body

    if (!admin_notes) {
      return NextResponse.json(
        { error: '請提供拒絕原因' },
        { status: 400 }
      )
    }

    // 1. 檢查申請是否存在
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

    // 2. 更新申請狀態為 rejected
    const { error: updateError } = await supabase
      .from('trip_applications')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin', // TODO: 可以從 token 取得 admin email
        admin_notes,
      })
      .eq('id', params.id)

    if (updateError) {
      console.error('更新申請狀態錯誤:', updateError.message)
      return NextResponse.json(
        { error: '更新申請狀態失敗' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '已拒絕申請',
    })
  } catch (err: any) {
    console.error('拒絕申請錯誤:', err.message)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}
