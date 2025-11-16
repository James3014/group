import { NextResponse } from 'next/server'

/**
 * Admin 認證 API - Linus 原則
 * - Simple: 密碼比對，返回 token
 * - Direct: 無複雜加密，環境變數存密碼
 * - Good Taste: 清楚的錯誤訊息
 */

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    // 從環境變數讀取管理員密碼
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    // 驗證密碼
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: '密碼錯誤' },
        { status: 401 }
      )
    }

    // 生成簡單的 token（當前時間戳 + 密碼的簡單 hash）
    // 註：這是簡化版，生產環境應使用 JWT
    const token = Buffer.from(`admin:${Date.now()}:${password}`).toString('base64')

    return NextResponse.json({ token })
  } catch (err: any) {
    console.error('認證錯誤:', err.message)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}
