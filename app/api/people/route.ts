import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTripIdFromRequest } from '@/lib/trip-context'

// 獲取所有人員
export async function GET(request: Request) {
  const tripId = getTripIdFromRequest(request)

  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('trip_id', tripId)
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
  const tripId = getTripIdFromRequest(request)
  const body = await request.json()

  // 自動加上 trip_id
  const dataWithTripId = {
    ...body,
    trip_id: tripId
  }

  const { data, error } = await supabase
    .from('people')
    .insert([dataWithTripId])
    .select()
    .single()

  if (error) {
    console.error('新增人員錯誤:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
