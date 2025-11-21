const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 缺少 Supabase 環境變數');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('🚀 開始資料庫遷移...');

    // 1. 檢查 password 欄位是否存在
    // 注意：Supabase JS 客戶端無法直接執行 DDL (ALTER TABLE)，
    // 但我們可以透過 RPC 或者直接在 SQL Editor 執行。
    // 這裡我們嘗試用一個 workaround：透過 Postgres Function (如果有的話) 或者提示用戶。

    // 由於我們是在客戶端環境，最穩健的方式是提供 SQL 讓用戶在 Supabase Dashboard 執行，
    // 或者如果我們有 Service Role Key 且啟用了 SQL 執行功能。

    // 但為了自動化，我們假設用戶有權限。
    // 這裡我們將創建一個 SQL 檔案，讓用戶手動執行，或者嘗試透過 API (如果支援)。

    console.log(`
  ⚠️ 請在 Supabase SQL Editor 執行以下 SQL 指令：

  ALTER TABLE trip_settings 
  ADD COLUMN IF NOT EXISTS password TEXT DEFAULT '123456';

  -- 驗證
  SELECT id, trip_name, password FROM trip_settings LIMIT 5;
  `);

    // 為了確保程式碼能運行，我們這裡模擬遷移成功
    console.log('✅ 遷移腳本已生成。請手動執行 SQL。');
}

migrate();
