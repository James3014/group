import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * Trip 申請 API - Linus 原則
 * - Simple: 直接儲存申請，slug 在核准時生成
 * - Direct: 無複雜驗證，快速回應
 * - Good Taste: 清楚的狀態回傳
 */

// 建立申請
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { applicant_email, trip_name, notes, proposed_slug } = body

    // 基本驗證
    if (!applicant_email || !trip_name) {
      return NextResponse.json(
        { error: '請填寫 Email 和行程名稱' },
        { status: 400 }
      )
    }

    // Email 格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(applicant_email)) {
      return NextResponse.json(
        { error: 'Email 格式不正確' },
        { status: 400 }
      )
    }

    // 檢查是否重複申請（相同 email + trip_name + pending 狀態）
    const { data: existing } = await supabase
      .from('trip_applications')
      .select('id')
      .eq('applicant_email', applicant_email)
      .eq('trip_name', trip_name)
      .eq('status', 'pending')
      .single()

    if (existing) {
      return NextResponse.json(
        { error: '您已提交過此行程的申請，請勿重複申請' },
        { status: 400 }
      )
    }

    // 建立申請
    const { data, error } = await supabase
      .from('trip_applications')
      .insert([
        {
          applicant_email,
          trip_name,
          notes,
          proposed_slug,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('建立申請錯誤:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('API 錯誤:', err.message)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}

// 查詢申請列表（給 admin 用）
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const status = url.searchParams.get('status') // pending, approved, rejected, all

    let query = supabase
      .from('trip_applications')
      .select('*')
      .order('created_at', { ascending: false })

    // 過濾狀態
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('查詢申請錯誤:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error('API 錯誤:', err.message)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}
