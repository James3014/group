import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 獲取行程設定
export async function GET() {
  const { data, error } = await supabase
    .from('trip_settings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    // 如果沒有設定，返回 null
    return NextResponse.json(null)
  }

  return NextResponse.json(data)
}

// 新增或更新行程設定
export async function POST(request: Request) {
  const body = await request.json()

  // 先刪除所有舊設定（簡單做法：只保留最新一筆）
  await supabase.from('trip_settings').delete().neq('id', 0)

  const { data, error } = await supabase
    .from('trip_settings')
    .insert([body])
    .select()
    .single()

  if (error) {
    console.error('新增行程設定錯誤:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
