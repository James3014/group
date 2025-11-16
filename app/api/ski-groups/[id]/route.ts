import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 刪除滑雪組
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)

  // CASCADE 會自動刪除 ski_group_members
  const { error } = await supabase
    .from('ski_groups')
    .delete()
    .eq('id', id)

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
  const id = parseInt(params.id)
  const body = await request.json()
  const { member_ids, ...groupData } = body

  // 更新組資料
  const { data: group, error } = await supabase
    .from('ski_groups')
    .update(groupData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 更新成員（先刪除舊的，再新增新的）
  if (member_ids !== undefined) {
    await supabase
      .from('ski_group_members')
      .delete()
      .eq('group_id', id)

    if (member_ids.length > 0) {
      const members = member_ids.map((pid: number) => ({
        group_id: id,
        person_id: pid
      }))

      await supabase.from('ski_group_members').insert(members)
    }
  }

  return NextResponse.json(group)
}
