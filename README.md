# 🏂 滑雪團行程管理系統

多日滑雪團隊協調管理工具，支援人員管理、滑雪分組、交通餐飲安排等完整功能。

## ✨ 核心功能

- ⛷️ **行程設定** - 自訂行程名稱、地點、日期
- 👥 **人員管理** - 支援親子關係、滑雪程度、裝備等詳細資料
- 🏂 **滑雪分組** - 按日期/時段（上午/下午/晚上）分組，支援複製和成員管理
- 📢 **公告系統** - 團隊公告發布
- 🍽️ **餐飲安排** - 餐廳、時間、參與人員管理
- 🚗 **交通協調** - 車輛、司機、乘客安排
- ✅ **任務清單** - 待辦事項追蹤

## 🎿 滑雪分組功能（核心特色）

### 時段管理
- 支援三個時段：上午 / 下午 / 晚上
- 每個時段獨立分組，同一人可在不同時段分配到不同組
- **智能未分組計算**：僅顯示當前時段還沒被分配的人員

### 工作流程
```
1. 選擇工作日期（例如：2025-11-17）
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

## 👥 人員資料結構

每位成員包含以下資訊：

### 基本資料
- 📝 姓名、電話

### 滑雪資訊
- 🎿 滑雪水平：初級 / 中級 / 高級
- 🏂 板型：雙板 (Ski) / 單板 (Snowboard)
- 📦 裝備：自備 / 租借

### 家庭資訊
- 👶 年齡組：大人 / 小孩
- 👨 父親（僅小孩）- 可選擇大人作為父親
- 👩 母親（僅小孩）- 可選擇大人作為母親

### 其他
- 📻 是否有無線電
- ✅ 是否確認參加
- 👑 是否為管理員

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 配置 Supabase

1. 前往 [Supabase](https://supabase.com) 創建新專案（免費方案即可）
2. 在專案設定中獲取 API 憑證：
   - `Project URL`
   - `anon/public key`
3. 複製環境變數範例檔：
   ```bash
   cp .env.example .env.local
   ```
4. 在 `.env.local` 中填入你的 Supabase 配置：
   ```
   NEXT_PUBLIC_SUPABASE_URL=你的專案URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon key
   ```

### 3. 建立資料庫表格

在 Supabase Dashboard → SQL Editor 中執行以下 SQL：

```sql
-- 完整資料庫 Schema 請參考 lib/db.sql
-- 或直接執行以下關鍵指令：

-- 1. 人員表（含父母關係）
CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  ski_level VARCHAR(20) DEFAULT 'beginner',
  board_type VARCHAR(20) DEFAULT 'ski',
  age_group VARCHAR(20) DEFAULT 'adult',
  equipment VARCHAR(20) DEFAULT 'rental',
  has_radio BOOLEAN DEFAULT false,
  father_id INT REFERENCES people(id) ON DELETE SET NULL,
  mother_id INT REFERENCES people(id) ON DELETE SET NULL,
  is_admin BOOLEAN DEFAULT false,
  is_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. 滑雪組表（支援時段）
CREATE TABLE ski_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  group_date DATE,
  session VARCHAR(20),  -- 'morning', 'afternoon', 'evening'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. 滑雪組成員表（多對多關聯）
CREATE TABLE ski_group_members (
  id SERIAL PRIMARY KEY,
  group_id INT REFERENCES ski_groups(id) ON DELETE CASCADE,
  person_id INT REFERENCES people(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, person_id)
);

-- 4. 行程設定表
CREATE TABLE trip_settings (
  id SERIAL PRIMARY KEY,
  trip_name VARCHAR(200) DEFAULT '滑雪團行程管理',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location VARCHAR(100) DEFAULT '神居滑雪場',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 完整 Schema 包含公告、餐飲、交通、任務等表格，
-- 請執行 lib/db.sql 中的完整內容
```

### 4. 啟用 Row Level Security (RLS)

```sql
-- 為所有表格啟用 RLS 並設定政策
ALTER TABLE ski_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE ski_group_members ENABLE ROW LEVEL SECURITY;

-- 允許所有操作（開發環境）
CREATE POLICY "Enable all access for ski_groups"
ON ski_groups FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for ski_group_members"
ON ski_group_members FOR ALL USING (true) WITH CHECK (true);

-- 其他表格也需要類似的政策
```

### 5. 啟動開發伺服器

```bash
npm run dev
```

訪問 http://localhost:3000

### 6. 開始使用

1. 到「行程設定」填寫行程名稱、地點、日期
2. 到「人員管理」新增參加者
3. 如有小孩，設定其父母關係
4. 到「滑雪分組」選擇日期和時段開始分組
5. 使用複製功能快速建立其他時段的分組

## 🚢 部署到 Zeabur

### 快速部署步驟：

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
   - 添加環境變數：
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - 部署完成

3. **驗證部署**
   - Zeabur 會自動分配一個網址（例如：yourapp.zeabur.app）
   - 訪問網址確認功能正常

詳細部署步驟請參考 `DEPLOY.md`。

## 📁 專案結構

```
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 首頁（顯示所有功能入口）
│   ├── trip-settings/            # 行程設定
│   ├── people/                   # 人員管理
│   ├── groups/                   # 滑雪分組（核心功能）
│   ├── announcements/            # 公告
│   ├── meals/                    # 餐飲安排
│   ├── transport/                # 交通協調
│   ├── tasks/                    # 任務清單
│   └── api/                      # API Routes
│       ├── ski-groups/           # 滑雪組 API
│       │   ├── route.ts          # GET, POST
│       │   └── [id]/route.ts     # PATCH, DELETE
│       ├── people/               # 人員 API
│       ├── trip-settings/        # 行程設定 API
│       └── ...                   # 其他 API
├── lib/
│   ├── db.sql                    # 完整資料庫 Schema
│   ├── supabase.ts               # Supabase 客戶端初始化
│   └── types.ts                  # TypeScript 型別定義
├── .env.example                  # 環境變數範例
├── claude.md                     # 開發原則與規範
├── README.md                     # 本文件
└── DEPLOY.md                     # 詳細部署指南
```

## 💻 技術棧

- **前端框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **資料庫**: Supabase (PostgreSQL)
- **部署**: Zeabur
- **開發原則**: Linus Torvalds 哲學（詳見 `claude.md`）

## 🧪 開發原則

本專案遵循 Linus Torvalds 的代碼哲學：

### KISS (Keep It Simple, Stupid)
- 直接使用 fetch API，無引入 Axios 或複雜狀態管理
- 簡單的 filter/map 邏輯，避免過度抽象

### Good Taste
- 用 `resetForm()` 自動帶入工作日期/時段，符合真實使用流程
- 未分組人員按「當前時段」計算，不是全局計算

### No Over-Engineering
- 不使用 Redux/MobX 等重量級狀態管理
- 直接用 useState + useEffect 處理所有狀態

### 資料結構優先
- 核心是 `currentSessionGroups` 的計算邏輯
- UI 只是資料的呈現

詳細開發規範請參考 `claude.md`。

## 🔄 資料庫遷移

如果從舊版本升級，執行以下 SQL：

```sql
-- 新增父母關係欄位
ALTER TABLE people ADD COLUMN IF NOT EXISTS father_id INT REFERENCES people(id) ON DELETE SET NULL;
ALTER TABLE people ADD COLUMN IF NOT EXISTS mother_id INT REFERENCES people(id) ON DELETE SET NULL;

-- 新增行程名稱欄位
ALTER TABLE trip_settings ADD COLUMN IF NOT EXISTS trip_name VARCHAR(200) DEFAULT '滑雪團行程管理';

-- 新增時段欄位
ALTER TABLE ski_groups ADD COLUMN IF NOT EXISTS session VARCHAR(20);
```

## 🐛 常見問題

### Q: 親子關係沒有顯示？
A: 確保資料庫有 `father_id` 和 `mother_id` 欄位，並在人員管理頁面設定父母關係。

### Q: 滑雪分組選人失敗？
A: 檢查 Supabase 是否已建立 `ski_groups` 和 `ski_group_members` 表格，並啟用 RLS 政策。

### Q: 未分組人員顯示不正確？
A: 確保已選擇「工作日期」和「工作時段」，系統會只顯示該時段未分配的人員。

## 📝 授權

MIT License

## 🙏 致謝

本專案遵循 Linus Torvalds 的代碼哲學開發：
- 簡單直接，無過度抽象
- 實用主義優先
- 好的品味勝過聰明的技巧

---

**部署範例**: https://group.zeabur.app
