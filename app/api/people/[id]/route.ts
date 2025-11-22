import { NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import { getTripIdFromRequest } from '@/lib/trip-context'

// 更新人員
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tripId = getTripIdFromRequest(request)
  const body = await request.json()

  const { data, error } = await supabase
    .from('people')
    .update(body)
    .eq('id', params.id)
    .eq('trip_id', tripId)  // 只能更新自己 trip 的資料
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// 刪除人員
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tripId = getTripIdFromRequest(request)

  const { error, count } = await supabase
    .from('people')
    .delete({ count: 'exact' })
    .eq('id', params.id)
    .eq('trip_id', tripId)  // 只能刪除自己 trip 的資料

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (count === 0) {
    return NextResponse.json({
      error: `刪除失敗：找不到資料或權限不足 (ID: ${params.id}, TripID: ${tripId})`
    }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
