/**
 * 資料庫遷移執行器
 *
 * 用法：npm run migrate:stage1
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// 從環境變數讀取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 錯誤：請設定 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  console.log('\n🔄 開始執行資料庫遷移...\n')

  // 讀取 SQL 檔案
  const sqlPath = path.join(__dirname, '../lib/migrations/001_add_multi_tenant.sql')

  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ 找不到遷移檔案：${sqlPath}`)
    process.exit(1)
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf-8')

  console.log('📄 讀取遷移檔案：001_add_multi_tenant.sql')
  console.log('⏳ 執行 SQL...\n')

  try {
    // 使用 Supabase RPC 執行原始 SQL
    // 注意：這需要 Service Role Key 或者在 Supabase 中建立一個 RPC function
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sqlContent })

    if (error) {
      // 如果沒有 exec_sql function，嘗試逐行執行
      console.log('⚠️  未找到 exec_sql function，改用直接執行方式')
      console.log('📝 請手動在 Supabase SQL Editor 中執行以下 SQL：\n')
      console.log('=' .repeat(60))
      console.log(sqlContent)
      console.log('='.repeat(60))
      console.log('\n✅ 請複製上方 SQL 到 Supabase Dashboard 執行')
      console.log('📍 位置：Supabase Dashboard > SQL Editor > New Query\n')
      process.exit(0)
    }

    console.log('✅ 遷移執行成功！\n')
    console.log('🧪 請執行測試：npm run test:stage1\n')

  } catch (err) {
    console.error('❌ 執行遷移時發生錯誤：')
    console.error(err.message)
    console.log('\n📝 請手動在 Supabase SQL Editor 中執行 SQL：')
    console.log(`   ${sqlPath}\n`)
    process.exit(1)
  }
}

runMigration()
