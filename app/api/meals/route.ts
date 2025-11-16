import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 獲取所有餐飲安排
export async function GET() {
  const { data: meals, error } = await supabase
    .from('meals')
    .select('*')
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
  const body = await request.json()
  const { participant_ids, ...mealData } = body

  const { data: meal, error } = await supabase
    .from('meals')
    .insert([mealData])
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
