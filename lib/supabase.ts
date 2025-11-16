import { createClient } from '@supabase/supabase-js'

// Supabase 客戶端 - 簡單直接
// 提供預設值避免 build 階段報錯
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
