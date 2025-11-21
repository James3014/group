const { createClient } = require('@supabase/supabase-js');

// 直接使用您提供的 Key
const supabaseUrl = 'https://ycqidgwunrvqdlfibxyy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcWlkZ3d1bnJ2cWRsZmlieHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzY5MjYsImV4cCI6MjA3ODgxMjkyNn0.sYZFny_D3Cvr6xai4LK_5DF3qH7UNz1BsUJ0Z3R6Xv0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDatabase() {
    console.log('🔍 正在檢查資料庫狀態...');

    // 1. 檢查神居團 (ID=1) 是否存在
    const { data: trip, error: tripError } = await supabase
        .from('trip_settings')
        .select('id, trip_id, trip_name, password')
        .eq('trip_id', '1')
        .single();

    if (tripError) {
        console.error('❌ 查詢錯誤:', tripError.message);

        // 如果是找不到欄位，會報錯
        if (tripError.message.includes('does not exist')) {
            console.log('🚨 診斷結果：password 欄位不存在！');
        }
    } else if (trip) {
        console.log(`✅ 找到行程 ID=1: ${trip.trip_name}`);
        console.log(`🔑 目前密碼: [${trip.password}]`);

        if (!trip.password) {
            console.log('⚠️ 密碼為空！這就是為什麼您無法登入。');
        } else {
            console.log('✅ 密碼已設定。請確認您輸入的密碼與上方括號內完全一致。');
        }
    } else {
        console.log('❌ 找不到 ID=1 的行程。');
    }

    // 列出所有行程以供參考
    const { data: allTrips } = await supabase.from('trip_settings').select('trip_id, trip_name, password');
    if (allTrips && allTrips.length > 0) {
        console.log('\n📋 所有行程列表:');
        allTrips.forEach(t => {
            console.log(`- ID: ${t.trip_id}, Name: ${t.trip_name}, Password: ${t.password}`);
        });
    }
}

fixDatabase();
