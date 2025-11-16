import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTripIdFromRequest } from '@/lib/trip-context'

// 刪除交通工具
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tripId = getTripIdFromRequest(request)
  try {
    const id = parseInt(params.id)

    // 先刪除乘客關聯
    await supabase
      .from('transport_passengers')
      .delete()
      .eq('transport_id', id)

    // 刪除交通工具
    const { error } = await supabase
      .from('transport')
      .delete()
      .eq('id', id)
      .eq('trip_id', tripId)  // 只能刪除自己 trip 的資料

    if (error) {
      console.error('刪除交通工具錯誤:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE /api/transport/[id] 錯誤:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// 更新交通工具
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tripId = getTripIdFromRequest(request)
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { passenger_ids, ...transportData } = body

    // 更新交通工具基本資料
    const { data: transport, error } = await supabase
      .from('transport')
      .update(transportData)
      .eq('id', id)
      .eq('trip_id', tripId)  // 只能更新自己 trip 的資料
      .select()
      .single()

    if (error) {
      console.error('更新交通工具錯誤:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 更新乘客（先刪除舊的，再新增新的）
    if (passenger_ids !== undefined) {
      // 刪除舊乘客
      await supabase
        .from('transport_passengers')
        .delete()
        .eq('transport_id', id)

      // 新增新乘客
      if (passenger_ids.length > 0) {
        const passengers = passenger_ids.map((pid: number) => ({
          transport_id: id,
          person_id: pid
        }))

        const { error: passengerError } = await supabase
          .from('transport_passengers')
          .insert(passengers)

        if (passengerError) {
          console.error('更新乘客錯誤:', passengerError)
        }
      }
    }

    return NextResponse.json(transport)
  } catch (err: any) {
    console.error('PATCH /api/transport/[id] 錯誤:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
