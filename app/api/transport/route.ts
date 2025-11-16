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
  try {
    const body = await request.json()
    const { passenger_ids, ...transportData } = body

    console.log('收到新增交通請求:', JSON.stringify(transportData, null, 2))

    // 驗證必填欄位
    if (!transportData.vehicle_name || !transportData.seats || !transportData.departure_time) {
      return NextResponse.json({
        error: '缺少必填欄位'
      }, { status: 400 })
    }

    const { data: transport, error } = await supabase
      .from('transport')
      .insert([transportData])
      .select()
      .single()

    if (error) {
      console.error('新增交通錯誤:', error)
      return NextResponse.json({
        error: `資料庫錯誤: ${error.message}`
      }, { status: 500 })
    }

    if (!transport) {
      console.error('交通工具建立失敗：沒有回傳資料')
      return NextResponse.json({
        error: '建立失敗，請稍後再試'
      }, { status: 500 })
    }

    console.log('交通工具建立成功:', transport.id)

    // 添加乘客
    if (passenger_ids && passenger_ids.length > 0) {
      const passengers = passenger_ids.map((pid: number) => ({
        transport_id: transport.id,
        person_id: pid
      }))

      const { error: passengerError } = await supabase
        .from('transport_passengers')
        .insert(passengers)

      if (passengerError) {
        console.error('新增乘客錯誤:', passengerError)
        // 乘客新增失敗不影響主要結果，但要記錄
        return NextResponse.json({
          ...transport,
          warning: '車輛建立成功，但部分乘客新增失敗'
        })
      }
    }

    console.log('成功建立交通工具，共 ' + (passenger_ids?.length || 0) + ' 位乘客')
    return NextResponse.json(transport)
  } catch (err: any) {
    console.error('POST /api/transport 錯誤:', err)
    return NextResponse.json({
      error: `伺服器錯誤: ${err.message}`
    }, { status: 500 })
  }
}
