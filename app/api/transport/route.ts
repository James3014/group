import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 獲取所有交通安排
export async function GET() {
  try {
    console.log('開始查詢交通工具...')

    const { data: transports, error } = await supabase
      .from('transport')
      .select('*, driver:people(name)')
      .order('departure_time', { ascending: true })

    if (error) {
      console.error('Transport GET 錯誤:', error)
      console.error('錯誤詳情:', JSON.stringify(error, null, 2))
      return NextResponse.json([])
    }

    console.log(`查詢到 ${transports?.length || 0} 筆交通工具`)

    if (!transports || transports.length === 0) {
      console.log('沒有交通工具資料，返回空陣列')
      return NextResponse.json([])
    }

    console.log('開始載入乘客資料...')

    // 獲取每個交通工具的乘客
    const transportsWithPassengers = await Promise.all(
      transports.map(async (transport) => {
        const { data: passengers, error: passengerError } = await supabase
          .from('transport_passengers')
          .select('person_id')
          .eq('transport_id', transport.id)

        if (passengerError) {
          console.error(`載入交通工具 ${transport.id} 的乘客時出錯:`, passengerError)
        }

        return {
          ...transport,
          passenger_ids: passengers?.map(p => p.person_id) || []
        }
      })
    )

    console.log(`成功返回 ${transportsWithPassengers.length} 筆交通工具（含乘客資料）`)
    return NextResponse.json(transportsWithPassengers)
  } catch (err: any) {
    console.error('GET /api/transport 發生錯誤:', err)
    console.error('錯誤堆疊:', err.stack)
    return NextResponse.json([])
  }
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
