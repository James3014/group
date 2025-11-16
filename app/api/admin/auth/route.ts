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

/**
 * 驗證 token（給其他 API 使用）
 */
export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [prefix, timestamp, password] = decoded.split(':')

    if (prefix !== 'admin') return false

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    if (password !== adminPassword) return false

    // Token 有效期：24 小時
    const tokenAge = Date.now() - parseInt(timestamp, 10)
    const maxAge = 24 * 60 * 60 * 1000
    if (tokenAge > maxAge) return false

    return true
  } catch {
    return false
  }
}
