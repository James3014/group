/**
 * 階段1：Multi-Tenant 資料庫遷移
 *
 * 遵循 Linus 原則：
 * - Simple: 只加一個 trip_id 欄位
 * - Direct: 直接解決資料隔離問題
 * - Good Taste: 向後相容，現有功能不受影響
 */

-- ============================================================
-- 步驟 1：建立 trips 主表
-- ============================================================

CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,          -- URL 短網址（例如：ski2025）
  trip_name VARCHAR(100) NOT NULL,           -- 行程名稱
  owner_email VARCHAR(255) NOT NULL,         -- 團主 email
  is_active BOOLEAN DEFAULT true,            -- 是否啟用
  created_at TIMESTAMP DEFAULT NOW()
);

-- 為 slug 建立索引（查詢優化）
CREATE INDEX IF NOT EXISTS idx_trips_slug ON trips(slug);
CREATE INDEX IF NOT EXISTS idx_trips_owner_email ON trips(owner_email);

-- ============================================================
-- 步驟 2：所有表新增 trip_id 欄位
-- ============================================================

-- 2.1 people 表
ALTER TABLE people
ADD COLUMN IF NOT EXISTS trip_id INT REFERENCES trips(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_people_trip_id ON people(trip_id);

-- 2.2 ski_groups 表
ALTER TABLE ski_groups
ADD COLUMN IF NOT EXISTS trip_id INT REFERENCES trips(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_ski_groups_trip_id ON ski_groups(trip_id);

-- 2.3 announcements 表
ALTER TABLE announcements
ADD COLUMN IF NOT EXISTS trip_id INT REFERENCES trips(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_announcements_trip_id ON announcements(trip_id);

-- 2.4 meals 表
ALTER TABLE meals
ADD COLUMN IF NOT EXISTS trip_id INT REFERENCES trips(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_meals_trip_id ON meals(trip_id);

-- 2.5 transport 表
ALTER TABLE transport
ADD COLUMN IF NOT EXISTS trip_id INT REFERENCES trips(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_transport_trip_id ON transport(trip_id);

-- 2.6 tasks 表
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS trip_id INT REFERENCES trips(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_tasks_trip_id ON tasks(trip_id);

-- 2.7 trip_settings 表
ALTER TABLE trip_settings
ADD COLUMN IF NOT EXISTS trip_id INT REFERENCES trips(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_trip_settings_trip_id ON trip_settings(trip_id);

-- ============================================================
-- 步驟 3：建立預設 trip 並遷移現有資料
-- ============================================================

-- 插入預設 trip（如果不存在）
INSERT INTO trips (id, slug, trip_name, owner_email, is_active)
VALUES (1, 'default', '神居雪場滑雪團', 'admin@example.com', true)
ON CONFLICT (id) DO NOTHING;

-- 重置 sequence 以確保下一個 ID 從 2 開始
SELECT setval('trips_id_seq', (SELECT MAX(id) FROM trips));

-- 將所有現有資料歸入 trip_id = 1
UPDATE people SET trip_id = 1 WHERE trip_id IS NULL;
UPDATE ski_groups SET trip_id = 1 WHERE trip_id IS NULL;
UPDATE announcements SET trip_id = 1 WHERE trip_id IS NULL;
UPDATE meals SET trip_id = 1 WHERE trip_id IS NULL;
UPDATE transport SET trip_id = 1 WHERE trip_id IS NULL;
UPDATE tasks SET trip_id = 1 WHERE trip_id IS NULL;
UPDATE trip_settings SET trip_id = 1 WHERE trip_id IS NULL;

-- ============================================================
-- 步驟 4：啟用 RLS（Row Level Security）
-- ============================================================

-- 啟用 trips 表的 RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- 政策：所有人都可以查看啟用的 trips（用於團主申請驗證）
CREATE POLICY "Anyone can view active trips"
ON trips FOR SELECT
USING (is_active = true);

-- 政策：只有 super admin 可以新增/編輯/刪除 trips
-- 註：這個階段先允許所有操作，階段5再加強權限控制
CREATE POLICY "Enable all operations for trips"
ON trips FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================================
-- 完成訊息
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Multi-Tenant 遷移完成！';
  RAISE NOTICE '   - trips 表已建立';
  RAISE NOTICE '   - 所有表已新增 trip_id 欄位';
  RAISE NOTICE '   - 現有資料已歸入 trip_id = 1';
  RAISE NOTICE '   - RLS 政策已啟用';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 請執行測試：npm run test:stage1';
END $$;
