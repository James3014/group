import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 獲取所有公告
export async function GET() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*, author:people(name)')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// 新增公告
export async function POST(request: Request) {
  const body = await request.json()

  const { data, error } = await supabase
    .from('announcements')
    .insert([body])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
