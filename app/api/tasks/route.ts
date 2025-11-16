import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 獲取所有任務
export async function GET() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, assignee:people(name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Tasks API 錯誤:', error.message)
    return NextResponse.json([])
  }

  return NextResponse.json(data || [])
}

// 新增任務
export async function POST(request: Request) {
  const body = await request.json()

  const { data, error } = await supabase
    .from('tasks')
    .insert([body])
    .select()
    .single()

  if (error) {
    console.error('新增任務錯誤:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
