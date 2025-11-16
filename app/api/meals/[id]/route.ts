import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTripIdFromRequest } from '@/lib/trip-context'

// 刪除餐飲
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tripId = getTripIdFromRequest(request)
  const id = parseInt(params.id)
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id)
    .eq('trip_id', tripId)  // 只能刪除自己 trip 的資料

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// 更新餐飲
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tripId = getTripIdFromRequest(request)
  const id = parseInt(params.id)
  const body = await request.json()

  const { data, error } = await supabase
    .from('meals')
    .update(body)
    .eq('id', id)
    .eq('trip_id', tripId)  // 只能更新自己 trip 的資料
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
