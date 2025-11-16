import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 獲取所有人員
export async function GET() {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('People API 錯誤:', error.message)
    // 返回空陣列避免前端崩潰
    return NextResponse.json([])
  }

  return NextResponse.json(data || [])
}

// 新增人員
export async function POST(request: Request) {
  const body = await request.json()

  const { data, error } = await supabase
    .from('people')
    .insert([body])
    .select()
    .single()

  if (error) {
    console.error('新增人員錯誤:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
