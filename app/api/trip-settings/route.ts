import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTripIdFromRequest } from '@/lib/trip-context'

// 獲取行程設定
export async function GET(request: Request) {
  const tripId = getTripIdFromRequest(request)

  const { data, error } = await supabase
    .from('trip_settings')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    // 如果沒有設定，返回 null
    return NextResponse.json(null)
  }

  const response = NextResponse.json(data || null)

  // Debug headers
  response.headers.set('X-Debug-Trip-ID', String(tripId))
  response.headers.set('X-Debug-Env-Var', process.env.NEXT_PUBLIC_DEMO_TRIP_ID || 'undefined')

  return response
}

// 新增或更新行程設定
export async function POST(request: Request) {
  const tripId = getTripIdFromRequest(request)
  const body = await request.json()

  // 先刪除當前 trip 的舊設定（只保留最新一筆）
  await supabase.from('trip_settings').delete().eq('trip_id', tripId)

  // 自動加上 trip_id
  const dataWithTripId = {
    ...body,
    trip_id: tripId
  }

  const { data, error } = await supabase
    .from('trip_settings')
    .insert([dataWithTripId])
    .select()
    .single()

  if (error) {
    console.error('新增行程設定錯誤:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
