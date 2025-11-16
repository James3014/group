import { supabase } from './supabase'

/**
 * Slug 生成器 - Linus 原則
 * - Simple: 簡單的轉換規則
 * - Direct: 直接生成不重複的 slug
 * - Good Taste: 可讀性優先，回退到隨機值
 */

/**
 * 生成唯一的 slug
 * @param baseName - 基礎名稱（例如：行程名稱）
 * @param proposed - 用戶建議的 slug（可選）
 * @returns 唯一的 slug
 */
export async function generateUniqueSlug(
  baseName: string,
  proposed?: string
): Promise<string> {
  // 1. 如果有用戶建議的 slug，優先使用
  if (proposed) {
    const cleaned = cleanSlug(proposed)
    if (cleaned && !(await slugExists(cleaned))) {
      return cleaned
    }
  }

  // 2. 嘗試從 baseName 生成
  const baseSlug = generateBaseSlug(baseName)
  if (baseSlug && !(await slugExists(baseSlug))) {
    return baseSlug
  }

  // 3. 基礎 slug 重複，加數字後綴
  if (baseSlug) {
    for (let i = 2; i <= 99; i++) {
      const slug = `${baseSlug}-${i}`
      if (!(await slugExists(slug))) {
        return slug
      }
    }
  }

  // 4. 全部失敗，生成隨機 slug
  return generateRandomSlug()
}

/**
 * 從名稱生成基礎 slug
 * - 英文/數字：保留，轉小寫
 * - 空格/底線：轉成 -
 * - 其他字元：移除
 * - 中文：返回 null（改用隨機 slug）
 */
function generateBaseSlug(name: string): string | null {
  // 檢查是否包含中文
  if (/[\u4e00-\u9fa5]/.test(name)) {
    return null
  }

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')           // 空格 → -
    .replace(/_/g, '-')             // 底線 → -
    .replace(/[^a-z0-9-]/g, '')     // 移除非英數字和 -
    .replace(/-+/g, '-')            // 多個 - 合併
    .replace(/^-|-$/g, '')          // 移除首尾的 -

  return slug.length >= 3 ? slug : null
}

/**
 * 清理用戶輸入的 slug
 */
function cleanSlug(slug: string): string | null {
  const cleaned = slug
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return cleaned.length >= 3 ? cleaned : null
}

/**
 * 檢查 slug 是否已存在
 */
async function slugExists(slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('trips')
    .select('id')
    .eq('slug', slug)
    .single()

  return !error && data !== null
}

/**
 * 生成隨機 slug（格式：trip-xxxxxx，6位隨機英數字）
 */
function generateRandomSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let random = ''
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `trip-${random}`
}
