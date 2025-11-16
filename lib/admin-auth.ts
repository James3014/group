/**
 * Admin 認證工具
 */

/**
 * 驗證 admin token（給其他 API 使用）
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

/**
 * 從 Request headers 中取得並驗證 admin token
 */
export function verifyAdminFromRequest(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false

  const token = authHeader.replace('Bearer ', '')
  return verifyAdminToken(token)
}
