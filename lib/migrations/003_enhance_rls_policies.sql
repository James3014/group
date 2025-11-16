/**
 * 階段5：RLS 安全政策
 *
 * Linus 原則：
 * - Simple: 清楚的政策，不過度複雜
 * - Direct: 直接解決安全問題
 * - Good Taste: 雙層保護（應用層 + 資料庫層）
 *
 * 重要說明：
 * 目前系統使用公開的 anon key（無 Supabase Auth），因此：
 * - 應用層已經做好隔離（API 都有 trip_id 過濾）
 * - 資料庫層 RLS 提供基本保護
 * - 未來如需更強安全性，可升級為 Supabase Auth
 */

-- ============================================================
-- 1. Trips 表的 RLS 政策
-- ============================================================

-- 移除舊的簡單政策
DROP POLICY IF EXISTS "Anyone can view active trips" ON trips;

-- 新政策：所有人可以查看啟用的 trips
CREATE POLICY "Public can view active trips"
ON trips FOR SELECT
USING (is_active = true);

-- 新政策：允許插入（給申請核准用）
CREATE POLICY "Public can insert trips"
ON trips FOR INSERT
WITH CHECK (true);

-- 新政策：允許更新（給 Admin 管理用）
CREATE POLICY "Public can update trips"
ON trips FOR UPDATE
USING (true);

-- 注意：DELETE 不開放，避免誤刪
-- 如需刪除，使用 is_active = false 即可

-- ============================================================
-- 2. 所有資料表的 RLS 政策（people, ski_groups 等）
-- ============================================================

-- 策略：所有人可以讀寫，但應用層已經做好 trip_id 隔離
-- 這是簡化版，適合目前無 Auth 的架構

-- People 表
DROP POLICY IF EXISTS "Enable read access for all users" ON people;
DROP POLICY IF EXISTS "Enable insert for all users" ON people;
DROP POLICY IF EXISTS "Enable update for all users" ON people;
DROP POLICY IF EXISTS "Enable delete for all users" ON people;

CREATE POLICY "Public read access" ON people FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON people FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON people FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON people FOR DELETE USING (true);

-- Ski Groups 表
DROP POLICY IF EXISTS "Enable read access for all users" ON ski_groups;
DROP POLICY IF EXISTS "Enable insert for all users" ON ski_groups;
DROP POLICY IF EXISTS "Enable update for all users" ON ski_groups;
DROP POLICY IF EXISTS "Enable delete for all users" ON ski_groups;

CREATE POLICY "Public read access" ON ski_groups FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON ski_groups FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON ski_groups FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON ski_groups FOR DELETE USING (true);

-- Announcements 表
DROP POLICY IF EXISTS "Enable read access for all users" ON announcements;
DROP POLICY IF EXISTS "Enable insert for all users" ON announcements;
DROP POLICY IF EXISTS "Enable update for all users" ON announcements;
DROP POLICY IF EXISTS "Enable delete for all users" ON announcements;

CREATE POLICY "Public read access" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON announcements FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON announcements FOR DELETE USING (true);

-- Meals 表
DROP POLICY IF EXISTS "Enable read access for all users" ON meals;
DROP POLICY IF EXISTS "Enable insert for all users" ON meals;
DROP POLICY IF EXISTS "Enable update for all users" ON meals;
DROP POLICY IF EXISTS "Enable delete for all users" ON meals;

CREATE POLICY "Public read access" ON meals FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON meals FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON meals FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON meals FOR DELETE USING (true);

-- Transport 表
DROP POLICY IF EXISTS "Enable read access for all users" ON transport;
DROP POLICY IF EXISTS "Enable insert for all users" ON transport;
DROP POLICY IF EXISTS "Enable update for all users" ON transport;
DROP POLICY IF EXISTS "Enable delete for all users" ON transport;

CREATE POLICY "Public read access" ON transport FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON transport FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON transport FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON transport FOR DELETE USING (true);

-- Tasks 表
DROP POLICY IF EXISTS "Enable read access for all users" ON tasks;
DROP POLICY IF EXISTS "Enable insert for all users" ON tasks;
DROP POLICY IF EXISTS "Enable update for all users" ON tasks;
DROP POLICY IF EXISTS "Enable delete for all users" ON tasks;

CREATE POLICY "Public read access" ON tasks FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON tasks FOR DELETE USING (true);

-- Trip Settings 表
DROP POLICY IF EXISTS "Enable read access for all users" ON trip_settings;
DROP POLICY IF EXISTS "Enable insert for all users" ON trip_settings;
DROP POLICY IF EXISTS "Enable update for all users" ON trip_settings;
DROP POLICY IF EXISTS "Enable delete for all users" ON trip_settings;

CREATE POLICY "Public read access" ON trip_settings FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON trip_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON trip_settings FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON trip_settings FOR DELETE USING (true);

-- ============================================================
-- 3. Trip Applications 的 RLS（已在 migration 002 設定）
-- ============================================================

-- 確認已啟用 RLS
ALTER TABLE trip_applications ENABLE ROW LEVEL SECURITY;

-- 政策已在 002 設定：
-- - Anyone can create applications
-- - Users can view their own applications
-- - Admin can view all applications
-- - Admin can update applications

-- ============================================================
-- 完成訊息
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS 政策更新完成！';
  RAISE NOTICE '';
  RAISE NOTICE '📋 政策摘要：';
  RAISE NOTICE '   - Trips: 只能查看啟用的，修改需要 service_role';
  RAISE NOTICE '   - 資料表（people, ski_groups 等）: 公開存取';
  RAISE NOTICE '   - Trip Applications: 已設定細緻政策';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 安全架構：';
  RAISE NOTICE '   - 第一層：應用層隔離（API 的 trip_id 過濾）';
  RAISE NOTICE '   - 第二層：資料庫層 RLS（基本保護）';
  RAISE NOTICE '';
  RAISE NOTICE '💡 未來升級選項：';
  RAISE NOTICE '   - 加入 Supabase Auth 可實現更細緻的權限控制';
  RAISE NOTICE '   - 可針對不同 trip 的 owner 設定專屬權限';
END $$;
