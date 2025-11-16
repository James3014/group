import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 更新人员
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()

  const { data, error } = await supabase
    .from('people')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// 删除人员
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase
    .from('people')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
