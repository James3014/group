import { NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import { getTripIdFromRequest } from '@/lib/trip-context'

// 獲取所有公告
export async function GET(request: Request) {
  const tripId = getTripIdFromRequest(request)

  const { data, error } = await supabase
    .from('announcements')
    .select('*, author:people(name)')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Announcements API 錯誤:', error.message)
    return NextResponse.json([])
  }

  return NextResponse.json(data || [])
}

// 新增公告
export async function POST(request: Request) {
  const tripId = getTripIdFromRequest(request)
  const body = await request.json()

  // 自動加上 trip_id
  const dataWithTripId = {
    ...body,
    trip_id: tripId
  }

  const { data, error } = await supabase
    .from('announcements')
    .insert([dataWithTripId])
    .select()
    .single()

  if (error) {
    console.error('新增公告錯誤:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
