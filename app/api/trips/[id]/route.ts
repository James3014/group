import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * 更新 Trip（啟用/停用等）
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('trips')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('更新 trip 錯誤:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('API 錯誤:', err.message)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}
