# 階段1遷移指南：Multi-Tenant 資料庫改造

## 📋 總覽

這個階段將為專案加入 Multi-Tenant 支援，讓多個團主可以各自管理自己的滑雪團。

**核心變更：**
- 新增 `trips` 主表
- 所有表新增 `trip_id` 欄位
- 現有資料歸入 `trip_id = 1`
- **保證：現有功能完全正常運作！**

---

## 🚀 執行步驟（TDD 方式）

### 步驟 1：執行遷移

有兩種方式執行遷移：

#### 方式 A：自動執行（推薦）

```bash
npm run migrate:stage1
```

如果出現錯誤，會自動切換到方式 B。

#### 方式 B：手動執行（最可靠）

1. 開啟 Supabase Dashboard
2. 進入 **SQL Editor** > **New Query**
3. 複製 `lib/migrations/001_add_multi_tenant.sql` 的內容
4. 貼上並執行

---

### 步驟 2：執行測試

```bash
npm run test:stage1
```

測試內容包含：
- ✅ trips 表存在且欄位正確
- ✅ 所有表都有 trip_id 欄位
- ✅ 現有資料都有 trip_id = 1
- ✅ 所有 API 查詢正常（people, groups, announcements 等）
- ✅ 可以新增資料
- ✅ 資料隔離測試（不同 trip 的資料不會混在一起）

**預期結果：**
```
✅ trips 表存在
✅ trips 表有正確欄位 (id, slug, trip_name, owner_email, is_active)
✅ people 表有 trip_id 欄位
✅ ski_groups 表有 trip_id 欄位
✅ announcements 表有 trip_id 欄位
✅ meals 表有 trip_id 欄位
✅ transport 表有 trip_id 欄位
✅ tasks 表有 trip_id 欄位
✅ trip_settings 表有 trip_id 欄位
✅ 預設 trip 存在 (id=1, slug=default)
✅ people 表的現有資料都有 trip_id = 1
✅ ski_groups 表的現有資料都有 trip_id = 1
✅ announcements 表的現有資料都有 trip_id = 1
✅ meals 表的現有資料都有 trip_id = 1
✅ transport 表的現有資料都有 trip_id = 1
✅ tasks 表的現有資料都有 trip_id = 1
✅ trip_settings 表的現有資料都有 trip_id = 1
✅ people API 查詢正常
✅ ski_groups API 查詢正常
✅ announcements API 查詢正常
✅ 可以新增 people 記錄
✅ 可以創建新的 trip
✅ 可以在新 trip 中新增 people
✅ 不同 trip 的資料完全隔離

📊 測試結果：23 通過, 0 失敗

✅ 所有測試通過！可以開始實作階段2
```

---

### 步驟 3：手動驗證

啟動開發伺服器：

```bash
npm run dev
```

打開 http://localhost:3000 並測試：
- ✅ 人員管理頁面正常
- ✅ 分組頁面正常
- ✅ 公告頁面正常
- ✅ 餐飲頁面正常
- ✅ 交通頁面正常
- ✅ 任務頁面正常

**所有現有功能應該完全正常運作！**

---

## 🔍 資料庫結構變更

### 新增 trips 表

```sql
CREATE TABLE trips (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,       -- 例如：ski2025
  trip_name VARCHAR(100) NOT NULL,        -- 例如：神居雪場滑雪團
  owner_email VARCHAR(255) NOT NULL,      -- 團主 email
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 現有表新增 trip_id

所有以下表格都新增了 `trip_id INT REFERENCES trips(id)` 欄位：

- `people`
- `ski_groups`
- `announcements`
- `meals`
- `transport`
- `tasks`
- `trip_settings`

---

## ⚠️ 疑難排解

### 測試失敗：trips 表不存在

**原因：** SQL 遷移未執行成功

**解決方式：**
1. 確認 Supabase 連線正常
2. 手動在 SQL Editor 執行 `lib/migrations/001_add_multi_tenant.sql`

---

### 測試失敗：某些表沒有 trip_id 欄位

**原因：** 部分 ALTER TABLE 語句失敗

**解決方式：**
1. 檢查錯誤訊息中是哪個表
2. 手動執行：
   ```sql
   ALTER TABLE <table_name>
   ADD COLUMN IF NOT EXISTS trip_id INT REFERENCES trips(id) ON DELETE CASCADE;
   ```

---

### 測試失敗：現有資料的 trip_id 不是 1

**原因：** UPDATE 語句未執行

**解決方式：**
```sql
UPDATE <table_name> SET trip_id = 1 WHERE trip_id IS NULL;
```

---

## ✅ 完成檢查清單

在繼續階段2之前，確認：

- [ ] `npm run test:stage1` 全部通過
- [ ] `npm run dev` 啟動正常
- [ ] 所有現有頁面功能正常
- [ ] Supabase Dashboard 可以看到 trips 表
- [ ] trips 表有一筆 id=1 的記錄

---

## 📚 下一步：階段2

階段1完成後，就可以開始階段2：

1. 建立 `lib/trip-context.ts` - 從 URL 取得 trip_id
2. 修改所有 API routes - 加入 trip_id 過濾
3. 修改所有前端頁面 - 使用 trip context
4. 測試多租戶資料隔離

---

## 🆘 需要協助？

如果遇到問題：

1. 檢查 `.env.local` 檔案是否有正確的 Supabase 配置
2. 查看測試輸出的錯誤訊息
3. 在 Supabase Dashboard > Table Editor 檢查資料庫結構
4. 詢問我！
