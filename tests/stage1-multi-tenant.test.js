/**
 * 階段1測試：Multi-Tenant 資料庫改造
 *
 * 測試策略（Linus 原則）：
 * - Simple: 直接測試 SQL 結構和 API 行為
 * - Direct: 每個測試只驗證一件事
 * - Good Taste: 測試要能在任何環境執行
 */

const { createClient } = require('@supabase/supabase-js')

// 從環境變數讀取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 錯誤：請設定 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 測試結果統計
let passed = 0
let failed = 0

// 簡單的測試框架
async function test(name, fn) {
  try {
    await fn()
    console.log(`✅ ${name}`)
    passed++
  } catch (error) {
    console.error(`❌ ${name}`)
    console.error(`   ${error.message}`)
    failed++
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`)
  }
}

// ============================================================
// 測試套件 1：資料庫結構驗證
// ============================================================

async function testDatabaseStructure() {
  console.log('\n📦 測試套件 1：資料庫結構驗證\n')

  // 測試 1.1：trips 表存在且有正確欄位
  await test('trips 表存在', async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .limit(1)

    assert(!error, `trips 表不存在: ${error?.message}`)
  })

  // 測試 1.2：trips 表有正確的欄位
  await test('trips 表有正確欄位 (id, slug, trip_name, owner_email, is_active)', async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('id, slug, trip_name, owner_email, is_active, created_at')
      .limit(1)

    assert(!error, `trips 表欄位不正確: ${error?.message}`)
  })

  // 測試 1.3-1.9：所有表都有 trip_id 欄位
  const tables = ['people', 'ski_groups', 'announcements', 'meals', 'transport', 'tasks', 'trip_settings']

  for (const table of tables) {
    await test(`${table} 表有 trip_id 欄位`, async () => {
      // 嘗試查詢 trip_id 欄位
      const { data, error } = await supabase
        .from(table)
        .select('trip_id')
        .limit(1)

      assert(!error, `${table} 表沒有 trip_id 欄位: ${error?.message}`)
    })
  }
}

// ============================================================
// 測試套件 2：資料遷移驗證
// ============================================================

async function testDataMigration() {
  console.log('\n📦 測試套件 2：資料遷移驗證\n')

  // 測試 2.1：預設 trip 存在 (id=1, slug='default')
  await test('預設 trip 存在 (id=1, slug=default)', async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', 1)
      .single()

    assert(!error, `預設 trip 不存在: ${error?.message}`)
    assertEqual(data.slug, 'default', 'slug 應該是 "default"')
    assert(data.trip_name, 'trip_name 不應為空')
    assert(data.owner_email, 'owner_email 不應為空')
  })

  // 測試 2.2-2.8：所有現有資料都有 trip_id = 1
  const tables = ['people', 'ski_groups', 'announcements', 'meals', 'transport', 'tasks', 'trip_settings']

  for (const table of tables) {
    await test(`${table} 表的現有資料都有 trip_id = 1`, async () => {
      const { data, error } = await supabase
        .from(table)
        .select('id, trip_id')

      assert(!error, `查詢 ${table} 失敗: ${error?.message}`)

      // 如果有資料，檢查是否都有 trip_id = 1
      if (data && data.length > 0) {
        const invalidRecords = data.filter(record => record.trip_id !== 1)
        assert(
          invalidRecords.length === 0,
          `${table} 有 ${invalidRecords.length} 筆資料的 trip_id 不是 1`
        )
      }
    })
  }
}

// ============================================================
// 測試套件 3：現有功能回歸測試
// ============================================================

async function testExistingFunctionality() {
  console.log('\n📦 測試套件 3：現有功能回歸測試\n')

  // 測試 3.1：people API 仍然正常工作
  await test('people API 查詢正常', async () => {
    const { data, error } = await supabase
      .from('people')
      .select('*')

    assert(!error, `people API 查詢失敗: ${error?.message}`)
    assert(Array.isArray(data), 'people 應該返回陣列')
  })

  // 測試 3.2：ski_groups API 正常
  await test('ski_groups API 查詢正常', async () => {
    const { data, error } = await supabase
      .from('ski_groups')
      .select('*')

    assert(!error, `ski_groups API 查詢失敗: ${error?.message}`)
    assert(Array.isArray(data), 'ski_groups 應該返回陣列')
  })

  // 測試 3.3：announcements API 正常
  await test('announcements API 查詢正常', async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')

    assert(!error, `announcements API 查詢失敗: ${error?.message}`)
    assert(Array.isArray(data), 'announcements 應該返回陣列')
  })

  // 測試 3.4：可以新增 people（帶 trip_id）
  await test('可以新增 people 記錄', async () => {
    const testPerson = {
      name: 'Test User',
      ski_level: 'intermediate',
      board_type: 'snowboard',
      age_group: 'adult',
      equipment: 'own',
      has_radio: true,
      is_admin: false,
      is_confirmed: false,
      trip_id: 1
    }

    const { data, error } = await supabase
      .from('people')
      .insert(testPerson)
      .select()
      .single()

    assert(!error, `新增 people 失敗: ${error?.message}`)
    assertEqual(data.trip_id, 1, 'trip_id 應該是 1')

    // 清理：刪除測試資料
    await supabase.from('people').delete().eq('id', data.id)
  })
}

// ============================================================
// 測試套件 4：資料隔離測試
// ============================================================

async function testDataIsolation() {
  console.log('\n📦 測試套件 4：資料隔離測試\n')

  let testTripId = null
  let testPersonId = null

  // 測試 4.1：可以創建第二個 trip
  await test('可以創建新的 trip', async () => {
    const { data, error } = await supabase
      .from('trips')
      .insert({
        slug: 'test-trip',
        trip_name: '測試滑雪團',
        owner_email: 'test@example.com',
        is_active: true
      })
      .select()
      .single()

    assert(!error, `創建 trip 失敗: ${error?.message}`)
    assert(data.id > 1, 'trip id 應該大於 1')
    testTripId = data.id
  })

  // 測試 4.2：可以在新 trip 中新增 people
  await test('可以在新 trip 中新增 people', async () => {
    const { data, error } = await supabase
      .from('people')
      .insert({
        name: 'Test User Trip 2',
        ski_level: 'beginner',
        board_type: 'ski',
        age_group: 'adult',
        equipment: 'rental',
        has_radio: false,
        is_admin: false,
        is_confirmed: false,
        trip_id: testTripId
      })
      .select()
      .single()

    assert(!error, `新增 people 到新 trip 失敗: ${error?.message}`)
    assertEqual(data.trip_id, testTripId, `trip_id 應該是 ${testTripId}`)
    testPersonId = data.id
  })

  // 測試 4.3：trip 1 和 trip 2 的資料不會混在一起
  await test('不同 trip 的資料完全隔離', async () => {
    // 查詢 trip 1 的 people
    const { data: trip1People, error: error1 } = await supabase
      .from('people')
      .select('*')
      .eq('trip_id', 1)

    // 查詢 trip 2 的 people
    const { data: trip2People, error: error2 } = await supabase
      .from('people')
      .select('*')
      .eq('trip_id', testTripId)

    assert(!error1 && !error2, '查詢失敗')

    // trip 1 應該不包含 trip 2 的人
    const trip1HasTrip2Person = trip1People.some(p => p.id === testPersonId)
    assert(!trip1HasTrip2Person, 'trip 1 不應該包含 trip 2 的資料')

    // trip 2 應該只有一個人
    assertEqual(trip2People.length, 1, 'trip 2 應該只有一個人')
    assertEqual(trip2People[0].id, testPersonId, 'trip 2 的人應該是測試新增的')
  })

  // 清理測試資料
  if (testPersonId) {
    await supabase.from('people').delete().eq('id', testPersonId)
  }
  if (testTripId) {
    await supabase.from('trips').delete().eq('id', testTripId)
  }
}

// ============================================================
// 主測試執行器
// ============================================================

async function runAllTests() {
  console.log('\n🧪 開始執行階段1測試套件')
  console.log('='.repeat(60))

  await testDatabaseStructure()
  await testDataMigration()
  await testExistingFunctionality()
  await testDataIsolation()

  console.log('\n' + '='.repeat(60))
  console.log(`\n📊 測試結果：${passed} 通過, ${failed} 失敗\n`)

  if (failed > 0) {
    console.log('❌ 有測試失敗，請先修復後再繼續實作\n')
    process.exit(1)
  } else {
    console.log('✅ 所有測試通過！可以開始實作階段2\n')
    process.exit(0)
  }
}

// 執行測試
runAllTests().catch(error => {
  console.error('❌ 測試執行出錯:', error)
  process.exit(1)
})
