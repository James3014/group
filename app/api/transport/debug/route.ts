import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: []
  }

  // 測試 1: 直接查詢 transport 表（不含 JOIN）
  try {
    const { data, error, count } = await supabase
      .from('transport')
      .select('*', { count: 'exact' })

    results.tests.push({
      name: 'Simple SELECT from transport',
      success: !error,
      error: error ? {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      } : null,
      rowCount: count,
      dataLength: data?.length || 0,
      sampleData: data?.slice(0, 2)
    })
  } catch (err: any) {
    results.tests.push({
      name: 'Simple SELECT from transport',
      success: false,
      error: err.message
    })
  }

  // 測試 2: 查詢 transport 含 JOIN
  try {
    const { data, error } = await supabase
      .from('transport')
      .select('*, driver:people(name)')

    results.tests.push({
      name: 'SELECT with JOIN to people',
      success: !error,
      error: error ? {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      } : null,
      dataLength: data?.length || 0,
      sampleData: data?.slice(0, 2)
    })
  } catch (err: any) {
    results.tests.push({
      name: 'SELECT with JOIN to people',
      success: false,
      error: err.message
    })
  }

  // 測試 3: 查詢 people 表
  try {
    const { data, error, count } = await supabase
      .from('people')
      .select('*', { count: 'exact' })

    results.tests.push({
      name: 'SELECT from people',
      success: !error,
      error: error ? error.message : null,
      rowCount: count,
      dataLength: data?.length || 0
    })
  } catch (err: any) {
    results.tests.push({
      name: 'SELECT from people',
      success: false,
      error: err.message
    })
  }

  // 測試 4: 查詢 transport_passengers 表
  try {
    const { data, error, count } = await supabase
      .from('transport_passengers')
      .select('*', { count: 'exact' })

    results.tests.push({
      name: 'SELECT from transport_passengers',
      success: !error,
      error: error ? error.message : null,
      rowCount: count,
      dataLength: data?.length || 0,
      sampleData: data?.slice(0, 5)
    })
  } catch (err: any) {
    results.tests.push({
      name: 'SELECT from transport_passengers',
      success: false,
      error: err.message
    })
  }

  // 測試 5: 檢查環境變數
  results.environment = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...'
  }

  return NextResponse.json(results, { status: 200 })
}
