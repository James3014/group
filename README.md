# 🏂 滑雪團行程管理系統

多日滑雪團隊協調管理工具，支援**多租戶架構**、人員管理、滑雪分組、交通餐飲安排等完整功能。

## ✨ 系統特色

### 🌐 多租戶架構（Multi-Tenant）
- 每個團主都有專屬的管理網址（例如：`/?trip=ski2025`）
- 資料完全隔離，互不干擾
- 支援 Trip 申請系統，任何人都可申請成為團主
- Super Admin 後台統一管理所有 Trips

### 👥 雙層權限系統
- **團主（Owner）**：管理自己行程的所有資料
- **參與者（Participant）**：只讀查看行程資訊（`/view` 路徑）
- **Super Admin**：審核 Trip 申請、管理所有 Trips

### 🎿 核心功能
- ⛷️ **行程設定** - 自訂行程名稱、地點、日期
- 👥 **人員管理** - 支援親子關係、滑雪程度、裝備等詳細資料
- 🏂 **滑雪分組** - 按日期/時段（上午/下午/晚上）分組，支援複製和成員管理
- 📢 **公告系統** - 團隊公告發布
- 🍽️ **餐飲安排** - 餐廳、時間、參與人員管理
- 🚗 **交通協調** - 車輛、司機、乘客安排
- ✅ **任務清單** - 待辦事項追蹤

---

## 📱 系統頁面導航

### 🌐 公開頁面（無需登入）

#### 申請成為團主
```
/apply
```
填寫 Email、行程名稱，提交申請給 Super Admin 審核。

#### 參與者只讀頁面（需要 ?trip=行程代碼）
```
/view?trip=xxx              - 行程總覽
/view/people?trip=xxx       - 成員名單
/view/groups?trip=xxx       - 滑雪分組
/view/meals?trip=xxx        - 用餐安排
/view/transport?trip=xxx    - 交通安排
/view/tasks?trip=xxx        - 任務列表
/view/announcements?trip=xxx - 公告列表
```

### 👤 團主管理頁面（需要 ?trip=行程代碼）

```
/?trip=xxx                  - 主控台
/people?trip=xxx            - 成員管理（新增/編輯/刪除）
/groups?trip=xxx            - 分組管理（建立分組、分配成員）
/meals?trip=xxx             - 用餐管理
/transport?trip=xxx         - 交通管理
/tasks?trip=xxx             - 任務管理
/announcements?trip=xxx     - 公告管理
/trip-settings?trip=xxx     - 行程設定
```

### 🔐 Super Admin 後台（需要登入）

```
/admin/login                - 管理員登入
/admin/trips                - 管理所有 Trips、審核申請
```

---

## 🎿 滑雪分組功能（核心特色）

### 時段管理
- 支援三個時段：**上午** / **下午** / **晚上**
- 每個時段獨立分組，同一人可在不同時段分配到不同組
- **智能未分組計算**：僅顯示當前時段還沒被分配的人員

### 工作流程
```
1. 選擇工作日期（例如：2025-01-15）
2. 選擇工作時段（例如：上午）
3. 查看該時段的分組和未分組人員
4. 新增分組 - 自動帶入當前日期和時段
5. 從未分組人員中選擇成員加入組別
6. 切換到下午 - 同樣的人員又可用於分組
```

### 快速複製
- 點擊「複製」按鈕
- 輸入目標日期和時段
- 自動複製組別名稱和所有成員

### 親子關係顯示
- 小孩會顯示：👨 父親名字 | 👩 母親名字
- 大人會顯示：👶 子女名字
- 方便將家庭成員安排在同一組

---

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 配置 Supabase

#### 2.1 建立 Supabase 專案
1. 前往 [Supabase](https://supabase.com) 創建新專案（免費方案即可）
2. 在專案設定中獲取 API 憑證：
   - Project Settings → API → Project URL
   - Project Settings → API → Project API keys
     - `anon/public` key（公開金鑰）
     - `service_role` key（管理金鑰，⚠️ 保密）

#### 2.2 設定環境變數
```bash
cp .env.example .env.local
```

編輯 `.env.local`：
```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://你的專案.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...你的anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...你的service-role-key

# 簡單密碼保護（可選）
ADMIN_PASSWORD=your-admin-password
```

⚠️ **重要**：`SUPABASE_SERVICE_ROLE_KEY` 必須配置，否則核准申請功能會失敗！

### 3. 建立資料庫

在 Supabase Dashboard → SQL Editor 中依序執行以下遷移檔案：

```bash
# 按順序執行：
1. lib/migrations/001_add_multi_tenant.sql       # Multi-Tenant 架構
2. lib/migrations/002_add_trip_applications.sql  # Trip 申請系統
3. lib/migrations/003_enhance_rls_policies.sql   # RLS 安全政策
```

或者使用 Supabase CLI（推薦）：
```bash
# 安裝 Supabase CLI
npm install -g supabase

# 登入
supabase login

# 連結專案
supabase link --project-ref 你的專案ID

# 執行遷移
supabase db push
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

訪問 http://localhost:3000

### 5. 開始使用

#### 方式一：申請成為團主
1. 訪問 `/apply`
2. 填寫 Email 和行程名稱
3. 提交申請
4. 以 Super Admin 身份登入 `/admin/login` 審核申請
5. 核准後取得專屬網址：`/?trip=你的行程代碼`

#### 方式二：直接在資料庫建立 Trip
```sql
INSERT INTO trips (slug, trip_name, owner_email, is_active)
VALUES ('ski2025', '2025滑雪團', 'your@email.com', true);
```

然後訪問：`/?trip=ski2025`

---

## 🚢 部署到 Zeabur

### 方式一：快速部署（推薦）

1. **推送代碼到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <你的GitHub倉庫>
   git push -u origin main
   ```

2. **在 Zeabur 部署**
   - 前往 [Zeabur](https://zeabur.com)
   - 點擊「New Project」
   - 選擇「Import from GitHub」
   - 選擇你的倉庫

3. **設定環境變數**（⚠️ 必須）
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://你的專案.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...（必須！）
   ADMIN_PASSWORD=你的管理員密碼
   ```

4. **驗證部署**
   - Zeabur 會自動分配一個網址（例如：`yourapp.zeabur.app`）
   - 訪問網址確認功能正常

### 方式二：使用 Vercel

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel

# 設定環境變數
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add ADMIN_PASSWORD

# 重新部署
vercel --prod
```

---

## 📁 專案結構

```
滑雪團系統/
├── app/                                # Next.js App Router
│   ├── page.tsx                        # 團主主控台
│   ├── apply/page.tsx                  # Trip 申請頁面
│   │
│   ├── admin/                          # Super Admin 後台
│   │   ├── login/page.tsx              # Admin 登入
│   │   └── trips/page.tsx              # Trip 管理、申請審核
│   │
│   ├── view/                           # 參與者只讀頁面
│   │   ├── page.tsx                    # 行程總覽
│   │   ├── people/page.tsx             # 成員名單
│   │   ├── groups/page.tsx             # 滑雪分組
│   │   ├── meals/page.tsx              # 用餐安排
│   │   ├── transport/page.tsx          # 交通安排
│   │   ├── tasks/page.tsx              # 任務列表
│   │   └── announcements/page.tsx      # 公告列表
│   │
│   ├── people/page.tsx                 # 人員管理
│   ├── groups/page.tsx                 # 滑雪分組（核心功能）
│   ├── announcements/page.tsx          # 公告管理
│   ├── meals/page.tsx                  # 餐飲安排
│   ├── transport/page.tsx              # 交通協調
│   ├── tasks/page.tsx                  # 任務清單
│   ├── trip-settings/page.tsx          # 行程設定
│   │
│   └── api/                            # API Routes
│       ├── trips/                      # Trips API
│       │   ├── route.ts                # GET, POST
│       │   └── [id]/route.ts           # PATCH
│       ├── trip-applications/          # 申請 API
│       │   ├── route.ts                # GET, POST
│       │   └── [id]/
│       │       ├── approve/route.ts    # POST 核准
│       │       └── reject/route.ts     # POST 拒絕
│       ├── ski-groups/                 # 滑雪組 API
│       ├── people/                     # 人員 API
│       ├── admin/auth/route.ts         # Admin 認證
│       └── ...                         # 其他 API
│
├── lib/
│   ├── migrations/                     # 資料庫遷移檔案
│   │   ├── 001_add_multi_tenant.sql    # Multi-Tenant 架構
│   │   ├── 002_add_trip_applications.sql # Trip 申請系統
│   │   └── 003_enhance_rls_policies.sql  # RLS 政策
│   ├── supabase.ts                     # Supabase 客戶端
│   ├── types.ts                        # TypeScript 型別定義
│   └── slug-generator.ts               # Slug 生成器
│
├── .env.example                        # 環境變數範例
├── .env.local                          # 本地環境變數（不提交）
├── README.md                           # 本文件
├── DEPLOY.md                           # 詳細部署指南
└── claude.md                           # 開發原則與規範
```

---

## 💻 技術棧

- **前端框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **資料庫**: Supabase (PostgreSQL)
- **認證**: 簡單密碼（Admin）+ Multi-Tenant 隔離
- **部署**: Zeabur / Vercel
- **開發原則**: Linus Torvalds 哲學（詳見 `claude.md`）

---

## 🏗️ 資料庫架構

### 核心表格

#### 1. `trips` - Trips（滑雪團）
```sql
CREATE TABLE trips (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,        -- 短網址代碼
  trip_name VARCHAR(100) NOT NULL,         -- 行程名稱
  owner_email VARCHAR(255) NOT NULL,       -- 團主 Email
  is_active BOOLEAN DEFAULT true,          -- 是否啟用
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. `trip_applications` - Trip 申請
```sql
CREATE TABLE trip_applications (
  id SERIAL PRIMARY KEY,
  applicant_email VARCHAR(255) NOT NULL,   -- 申請人 Email
  trip_name VARCHAR(100) NOT NULL,         -- 申請的行程名稱
  proposed_slug VARCHAR(50),               -- 建議的 slug
  status VARCHAR(20) DEFAULT 'pending',    -- pending/approved/rejected
  notes TEXT,                              -- 申請說明
  admin_notes TEXT,                        -- 管理員備註
  reviewed_at TIMESTAMP,                   -- 審核時間
  reviewed_by VARCHAR(255),                -- 審核者
  trip_id INT REFERENCES trips(id),        -- 核准後的 Trip ID
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Multi-Tenant 資料表（所有表格都有 `trip_id`）
- `people` - 人員（含親子關係）
- `ski_groups` - 滑雪分組（含時段）
- `ski_group_members` - 分組成員（多對多）
- `announcements` - 公告
- `meals` - 餐飲
- `transport` - 交通
- `tasks` - 任務
- `trip_settings` - 行程設定

---

## 🔒 安全架構

### Row Level Security (RLS)

系統使用雙層安全架構：

#### 第一層：應用層隔離
- 所有 API 都使用 `?trip=xxx` 參數過濾
- 前端只能存取當前 Trip 的資料

#### 第二層：資料庫層 RLS
```sql
-- Trips 表：只能查看啟用的 trips
CREATE POLICY "Public can view active trips"
ON trips FOR SELECT
USING (is_active = true);

-- 資料表：公開存取（應用層已隔離）
CREATE POLICY "Public read access"
ON people FOR SELECT USING (true);
```

### Admin 權限
- Trip 申請的**核准/拒絕**使用 `supabaseAdmin`（service_role key）
- 繞過 RLS 限制，確保更新成功
- 只在後端 API 使用，前端無法存取

---

## 🧪 開發原則（Linus 哲學）

本專案遵循 Linus Torvalds 的代碼哲學：

### 1. Simple（簡單）
```typescript
// ✅ Good - 直接使用 fetch
const response = await fetch('/api/people')
const data = await response.json()

// ❌ Bad - 引入 Axios、Redux 等重量級工具
```

### 2. Direct（直接）
```typescript
// ✅ Good - 直接計算
const unassigned = people.filter(p =>
  !currentSessionGroups.some(g => g.member_ids?.includes(p.id))
)

// ❌ Bad - 過度抽象、複雜的 Helper 函數
```

### 3. Good Taste（好品味）
```typescript
// ✅ Good - 重置表單時自動帶入工作日期/時段
const resetForm = () => {
  setFormData({
    name: '',
    group_date: workingDate,    // 自動帶入
    session: workingSession,    // 自動帶入
    notes: '',
  })
}
```

### 4. No Over-Engineering（不過度工程化）
- 不使用 Redux/MobX 等狀態管理
- 直接用 `useState` + `useEffect`
- 資料結構優先，UI 只是呈現

詳細開發規範請參考 `claude.md`。

---

## 🐛 常見問題

### Q1: 核准申請後狀態沒更新？
**A**: 檢查環境變數是否設定 `SUPABASE_SERVICE_ROLE_KEY`。這是必須的，否則 RLS 會阻止更新。

### Q2: 404 錯誤 - `/api/trip-applications/[id]/approve`
**A**: 確認部署的分支是否包含最新代碼。請確保部署了包含 Admin 功能的分支。

### Q3: 如何取得 trip 的 slug？
**A**:
- 方式一：申請成為團主，核准後自動生成
- 方式二：直接在 Supabase 的 `trips` 表中查看
- 方式三：以 Super Admin 身份在 `/admin/trips` 查看所有 Trips

### Q4: 親子關係沒有顯示？
**A**: 確保資料庫執行了 `001_add_multi_tenant.sql`，包含 `father_id` 和 `mother_id` 欄位。

### Q5: 未分組人員顯示不正確？
**A**: 確保已選擇「工作日期」和「工作時段」，系統會只顯示該時段未分配的人員。

### Q6: 多個 Trip 資料混在一起？
**A**:
- 檢查網址是否有正確的 `?trip=xxx` 參數
- 確認資料庫遷移正確執行，所有表格都有 `trip_id` 欄位
- 查看 API 是否正確過濾 `trip_id`

### Q7: Super Admin 密碼是什麼？
**A**: 在 `.env.local` 或部署平台設定 `ADMIN_PASSWORD` 環境變數。

---

## 📊 使用流程圖

```
用戶想成為團主
    ↓
訪問 /apply 填寫申請
    ↓
Super Admin 審核（/admin/trips）
    ↓
核准 → 生成專屬網址（/?trip=xxx）
    ↓
團主管理行程：
  - 新增成員（/people?trip=xxx）
  - 建立分組（/groups?trip=xxx）
  - 安排餐飲、交通
    ↓
分享只讀網址給參與者（/view?trip=xxx）
```

---

## 🔄 資料庫遷移指南

### 從舊版本升級

如果你的系統是舊版（無 Multi-Tenant），請依序執行：

```sql
-- Step 1: 執行 001_add_multi_tenant.sql
-- 新增 trips 表、所有表格加入 trip_id

-- Step 2: 手動建立第一個 Trip
INSERT INTO trips (slug, trip_name, owner_email, is_active)
VALUES ('default', '預設滑雪團', 'your@email.com', true);

-- Step 3: 將現有資料關聯到第一個 Trip
UPDATE people SET trip_id = 1 WHERE trip_id IS NULL;
UPDATE ski_groups SET trip_id = 1 WHERE trip_id IS NULL;
-- ... 其他表格同理

-- Step 4: 執行 002 和 003
```

---

## 📝 授權

MIT License

---

## 🙏 致謝

本專案遵循 **Linus Torvalds** 的代碼哲學開發：
- **簡單直接**，無過度抽象
- **實用主義優先**
- **好的品味**勝過聰明的技巧

> "Bad programmers worry about the code. Good programmers worry about data structures and their relationships."
> — Linus Torvalds

---

## 🌐 示範網站

**部署範例**: https://group.zeabur.app

**測試帳號**:
- 團主網址：`/?trip=你的行程代碼`
- 參與者網址：`/view?trip=你的行程代碼`
- Admin 登入：`/admin/login`（需要密碼）

---

## 📞 支援

如有問題，請：
1. 查看 [常見問題](#-常見問題) 章節
2. 查看 `claude.md` 了解開發原則
3. 查看 `DEPLOY.md` 了解部署細節
4. 在 GitHub 提 Issue

**Happy Coding! 🎿**
