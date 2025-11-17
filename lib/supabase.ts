import { createClient } from '@supabase/supabase-js'

// Supabase 客戶端 - 簡單直接
// 提供預設值避免 build 階段報錯
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'

// 公開客戶端（受 RLS 限制）
export const supabase = createClient(supabaseUrl, supabaseKey)

// 管理客戶端（繞過 RLS，僅用於後端 API）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
