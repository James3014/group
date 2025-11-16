import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTripIdFromRequest } from '@/lib/trip-context'

// 刪除滑雪組
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tripId = getTripIdFromRequest(request)
  const id = parseInt(params.id)

  // CASCADE 會自動刪除 ski_group_members
  const { error } = await supabase
    .from('ski_groups')
    .delete()
    .eq('id', id)
    .eq('trip_id', tripId)  // 只能刪除自己 trip 的資料

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// 更新滑雪組
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tripId = getTripIdFromRequest(request)
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { member_ids, ...groupData } = body

    // 只有當有組資料要更新時才執行 update
    if (Object.keys(groupData).length > 0) {
      const { error: updateError } = await supabase
        .from('ski_groups')
        .update(groupData)
        .eq('id', id)
        .eq('trip_id', tripId)  // 只能更新自己 trip 的資料

      if (updateError) {
        console.error('更新組資料錯誤:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    // 更新成員（先刪除舊的，再新增新的）
    if (member_ids !== undefined) {
      const { error: deleteError } = await supabase
        .from('ski_group_members')
        .delete()
        .eq('group_id', id)

      if (deleteError) {
        console.error('刪除舊成員錯誤:', deleteError)
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }

      if (member_ids.length > 0) {
        const members = member_ids.map((pid: number) => ({
          group_id: id,
          person_id: pid
        }))

        const { error: insertError } = await supabase
          .from('ski_group_members')
          .insert(members)

        if (insertError) {
          console.error('新增成員錯誤:', insertError)
          return NextResponse.json({ error: insertError.message }, { status: 500 })
        }
      }
    }

    // 返回更新後的組資料
    const { data: group, error: selectError } = await supabase
      .from('ski_groups')
      .select('*')
      .eq('id', id)
      .eq('trip_id', tripId)
      .single()

    if (selectError) {
      console.error('查詢組資料錯誤:', selectError)
      return NextResponse.json({ error: selectError.message }, { status: 500 })
    }

    return NextResponse.json(group)
  } catch (err: any) {
    console.error('PATCH ski-groups 錯誤:', err)
    return NextResponse.json({ error: err.message || '未知錯誤' }, { status: 500 })
  }
}
