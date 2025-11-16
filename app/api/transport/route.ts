import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 獲取所有交通安排
export async function GET() {
  const { data: transports, error } = await supabase
    .from('transport')
    .select('*, driver:people(name)')
    .order('departure_time', { ascending: true })

  if (error) {
    console.error('Transport API 錯誤:', error.message)
    return NextResponse.json([])
  }

  if (!transports || transports.length === 0) {
    return NextResponse.json([])
  }

  // 獲取每個交通工具的乘客
  const transportsWithPassengers = await Promise.all(
    transports.map(async (transport) => {
      const { data: passengers } = await supabase
        .from('transport_passengers')
        .select('person_id')
        .eq('transport_id', transport.id)

      return {
        ...transport,
        passenger_ids: passengers?.map(p => p.person_id) || []
      }
    })
  )

  return NextResponse.json(transportsWithPassengers)
}

// 新增交通安排
export async function POST(request: Request) {
  const body = await request.json()
  const { passenger_ids, ...transportData } = body

  const { data: transport, error } = await supabase
    .from('transport')
    .insert([transportData])
    .select()
    .single()

  if (error) {
    console.error('新增交通錯誤:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 添加乘客
  if (passenger_ids && passenger_ids.length > 0) {
    const passengers = passenger_ids.map((pid: number) => ({
      transport_id: transport.id,
      person_id: pid
    }))

    await supabase.from('transport_passengers').insert(passengers)
  }

  return NextResponse.json(transport)
}
