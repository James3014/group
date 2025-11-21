/**
 * Trip Context - Multi-Tenant 核心邏輯
 *
 * Linus 原則：
 * - Simple: 只做一件事 - 從 URL 取得 trip_id
 * - Direct: 直接解決問題，不過度設計
 * - Good Taste: 向後相容，沒有 trip 參數時預設為 1
 */

import { Trip } from './types'

/**
 * 從 URL 取得當前的 trip slug
 * 例如：?trip=ski2025 → 'ski2025'
 */
export function getCurrentTripSlug(): string | null {
  if (typeof window === 'undefined') return null // SSR 環境

  const params = new URLSearchParams(window.location.search)
  return params.get('trip')
}

/**
 * 從 URL 取得當前的 trip_id（客戶端）
 *
 * 使用方式：
 * const tripId = getCurrentTripId()
 * fetch(`/api/people?trip_id=${tripId}`)
 */
export function getCurrentTripId(): number {
  if (typeof window === 'undefined') {
    // SSR: 嘗試讀取環境變數，否則回傳 1
    const envTripId = process.env.NEXT_PUBLIC_DEMO_TRIP_ID
    if (envTripId) {
      const parsed = parseInt(envTripId, 10)
      if (!isNaN(parsed) && parsed > 0) return parsed
    }
    return 1
  }

  const params = new URLSearchParams(window.location.search)
  const tripIdParam = params.get('trip_id')

  // 1. 優先檢查直接的 trip_id 參數
  if (tripIdParam) {
    const parsed = parseInt(tripIdParam, 10)
    if (!isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }

  // 2. 檢查 slug (目前尚未實作完整查詢，先保留介面)
  const slug = params.get('trip')
  if (slug && slug !== 'default') {
    // TODO: 實作 slug -> id 查詢
    // 目前暫時回傳預設值 (動態讀取)
    const envTripId = process.env.NEXT_PUBLIC_DEMO_TRIP_ID
    if (envTripId) {
      const parsed = parseInt(envTripId, 10)
      if (!isNaN(parsed) && parsed > 0) return parsed
    }
    return 1
  }

  // 3. 回傳預設值
  // 修正：動態讀取環境變數
  const envTripId = process.env.NEXT_PUBLIC_DEMO_TRIP_ID
  if (envTripId) {
    const parsed = parseInt(envTripId, 10)
    if (!isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }

  return 1
}

/**
 * 從 Request 取得 trip_id（伺服器端 API）
 *
 * 使用方式：
 * export async function GET(request: Request) {
 *   const tripId = getTripIdFromRequest(request)
 *   const data = await supabase.from('people').select('*').eq('trip_id', tripId)
 * }
 */
export function getTripIdFromRequest(request: Request): number {
  const url = new URL(request.url)
  const tripIdParam = url.searchParams.get('trip_id')

  if (tripIdParam) {
    const parsed = parseInt(tripIdParam, 10)
    if (!isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }

  // 沒有 trip_id 參數，使用預設值
  // 修正：在函式內動態讀取環境變數，確保 Runtime 能抓到值
  const envTripId = process.env.NEXT_PUBLIC_DEMO_TRIP_ID
  if (envTripId) {
    const parsed = parseInt(envTripId, 10)
    if (!isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }

  return 1 // Fallback to 1
}

/**
 * 建立帶有 trip_id 的 API URL
 *
 * 使用方式：
 * const url = buildApiUrl('/api/people')
 * // → '/api/people?trip_id=1'
 */
export function buildApiUrl(path: string): string {
  const tripId = getCurrentTripId()
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}trip_id=${tripId}`
}

/**
 * Cache for trip slug → id mapping
 * 避免重複查詢
 */
const tripCache = new Map<string, number>()

/**
 * 根據 slug 查詢 trip_id（未來實作）
 *
 * @param slug - trip 的短網址（例如：'ski2025'）
 * @returns trip_id
 */
export async function getTripIdBySlug(slug: string): Promise<number> {
  // 檢查 cache
  if (tripCache.has(slug)) {
    return tripCache.get(slug)!
  }

  // 預設 slug 直接返回預設 ID
  if (slug === 'default') {
    const envTripId = process.env.NEXT_PUBLIC_DEMO_TRIP_ID
    if (envTripId) {
      const parsed = parseInt(envTripId, 10)
      if (!isNaN(parsed) && parsed > 0) return parsed
    }
    return 1
  }

  // TODO: 在階段3實作從 Supabase 查詢
  // const { data } = await supabase
  //   .from('trips')
  //   .select('id')
  //   .eq('slug', slug)
  //   .single()
  //
  // if (data) {
  //   tripCache.set(slug, data.id)
  //   return data.id
  // }

  // 找不到，使用預設值
  const envTripId = process.env.NEXT_PUBLIC_DEMO_TRIP_ID
  if (envTripId) {
    const parsed = parseInt(envTripId, 10)
    if (!isNaN(parsed) && parsed > 0) return parsed
  }
  return 1
}
