import { NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import { getTripIdFromRequest } from '@/lib/trip-context'

// 獲取所有滑雪組
export async function GET(request: Request) {
  const tripId = getTripIdFromRequest(request)
  try {
    const { data: groups, error } = await supabase
      .from('ski_groups')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Ski groups GET 錯誤:', error)
      return NextResponse.json([])
    }

    if (!groups || groups.length === 0) {
      return NextResponse.json([])
    }

    // 獲取每個組的成員
    const groupsWithMembers = await Promise.all(
      groups.map(async (group) => {
        const { data: members } = await supabase
          .from('ski_group_members')
          .select('person_id')
          .eq('group_id', group.id)

        return {
          ...group,
          member_ids: members?.map(m => m.person_id) || []
        }
      })
    )

    return NextResponse.json(groupsWithMembers)
  } catch (err) {
    console.error('GET /api/ski-groups 錯誤:', err)
    return NextResponse.json([])
  }
}

// 新增滑雪組
export async function POST(request: Request) {
  const tripId = getTripIdFromRequest(request)
  try {
    const body = await request.json()
    const { member_ids, ...groupData } = body

    // 自動加上 trip_id
    const dataWithTripId = {
      ...groupData,
      trip_id: tripId
    }

    const { data: group, error } = await supabase
      .from('ski_groups')
      .insert([dataWithTripId])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 添加成員
    if (member_ids && member_ids.length > 0) {
      const members = member_ids.map((pid: number) => ({
        group_id: group.id,
        person_id: pid
      }))

      await supabase.from('ski_group_members').insert(members)
    }

    return NextResponse.json(group)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
