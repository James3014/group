import { NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import { getTripIdFromRequest } from '@/lib/trip-context'

// 獲取所有餐飲安排
export async function GET(request: Request) {
  const tripId = getTripIdFromRequest(request)

  const { data: meals, error } = await supabase
    .from('meals')
    .select('*')
    .eq('trip_id', tripId)
    .order('meal_time', { ascending: true })

  if (error) {
    console.error('Meals API 錯誤:', error.message)
    return NextResponse.json([])
  }

  if (!meals || meals.length === 0) {
    return NextResponse.json([])
  }

  // 獲取每個餐飲的參與者
  const mealsWithParticipants = await Promise.all(
    meals.map(async (meal) => {
      const { data: participants } = await supabase
        .from('meal_participants')
        .select('person_id')
        .eq('meal_id', meal.id)

      return {
        ...meal,
        participant_ids: participants?.map(p => p.person_id) || []
      }
    })
  )

  return NextResponse.json(mealsWithParticipants)
}

// 新增餐飲安排
export async function POST(request: Request) {
  const tripId = getTripIdFromRequest(request)
  const body = await request.json()
  const { participant_ids, ...mealData } = body

  // 自動加上 trip_id
  const dataWithTripId = {
    ...mealData,
    trip_id: tripId
  }

  const { data: meal, error } = await supabase
    .from('meals')
    .insert([dataWithTripId])
    .select()
    .single()

  if (error) {
    console.error('新增餐飲錯誤:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 添加參與者
  if (participant_ids && participant_ids.length > 0) {
    const participants = participant_ids.map((pid: number) => ({
      meal_id: meal.id,
      person_id: pid
    }))

    await supabase.from('meal_participants').insert(participants)
  }

  return NextResponse.json(meal)
}
