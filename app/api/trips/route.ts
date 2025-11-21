import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Trips API - 獲取所有 trips（Admin only）
 */
export async function GET(request: Request) {
  try {
    const { data, error } = await supabaseAdmin
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('查詢 trips 錯誤:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error('API 錯誤:', err.message)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}
