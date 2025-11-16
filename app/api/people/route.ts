import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 获取所有人员
export async function GET() {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// 添加新人员
export async function POST(request: Request) {
  const body = await request.json()

  const { data, error } = await supabase
    .from('people')
    .insert([body])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
