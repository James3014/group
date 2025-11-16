/**
 * 階段3：Trip 申請系統
 *
 * Linus 原則：
 * - Simple: 只記錄申請的核心資料
 * - Direct: 直接解決團主申請問題
 * - Good Taste: 狀態清楚、易於管理
 */

-- ============================================================
-- 建立 trip_applications 表
-- ============================================================

CREATE TABLE IF NOT EXISTS trip_applications (
  id SERIAL PRIMARY KEY,

  -- 申請人資料
  applicant_email VARCHAR(255) NOT NULL,
  trip_name VARCHAR(100) NOT NULL,
  proposed_slug VARCHAR(50),              -- 申請人建議的 slug（可選）

  -- 申請狀態
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),

  -- 備註
  notes TEXT,                             -- 申請人的說明
  admin_notes TEXT,                       -- 管理員備註（拒絕原因等）

  -- 審核資訊
  reviewed_at TIMESTAMP,                  -- 審核時間
  reviewed_by VARCHAR(255),               -- 審核者 email

  -- 核准後的 trip_id
  trip_id INT REFERENCES trips(id) ON DELETE SET NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 建立索引
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_trip_applications_email ON trip_applications(applicant_email);
CREATE INDEX IF NOT EXISTS idx_trip_applications_status ON trip_applications(status);
CREATE INDEX IF NOT EXISTS idx_trip_applications_created_at ON trip_applications(created_at DESC);

-- ============================================================
-- 啟用 RLS（階段3先簡單處理）
-- ============================================================

ALTER TABLE trip_applications ENABLE ROW LEVEL SECURITY;

-- 政策：所有人都可以新增申請
CREATE POLICY "Anyone can create applications"
ON trip_applications FOR INSERT
WITH CHECK (true);

-- 政策：申請人可以查看自己的申請
CREATE POLICY "Users can view their own applications"
ON trip_applications FOR SELECT
USING (applicant_email = current_setting('request.jwt.claim.email', true));

-- 政策：Super Admin 可以查看所有申請
CREATE POLICY "Admin can view all applications"
ON trip_applications FOR SELECT
USING (current_setting('request.jwt.claim.email', true) IN (
  SELECT owner_email FROM trips WHERE slug = 'default'
));

-- 政策：Super Admin 可以更新申請（審核）
CREATE POLICY "Admin can update applications"
ON trip_applications FOR UPDATE
USING (current_setting('request.jwt.claim.email', true) IN (
  SELECT owner_email FROM trips WHERE slug = 'default'
))
WITH CHECK (true);

-- ============================================================
-- 完成訊息
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Trip Applications 表建立完成！';
  RAISE NOTICE '   - 申請狀態：pending（待審核）/ approved（已核准）/ rejected（已拒絕）';
  RAISE NOTICE '   - RLS 政策已啟用（基本版）';
  RAISE NOTICE '';
  RAISE NOTICE '📝 下一步：實作申請頁面和 API';
END $$;
