import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTripIdFromRequest } from '@/lib/trip-context'

// 獲取所有任務
export async function GET(request: Request) {
  const tripId = getTripIdFromRequest(request)

  const { data, error } = await supabase
    .from('tasks')
    .select('*, assignee:people(name)')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Tasks API 錯誤:', error.message)
    return NextResponse.json([])
  }

  return NextResponse.json(data || [])
}

// 新增任務
export async function POST(request: Request) {
  const tripId = getTripIdFromRequest(request)
  const body = await request.json()

  // 自動加上 trip_id
  const dataWithTripId = {
    ...body,
    trip_id: tripId
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([dataWithTripId])
    .select()
    .single()

  if (error) {
    console.error('新增任務錯誤:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
