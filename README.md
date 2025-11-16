# 神居雪場滑雪團 - 行程管理工具

30人聖誕節滑雪團隊協調系統。

## 功能

- 👥 人員管理
- 📢 公告系統
- 🏂 滑雪分組
- 🍽️ 餐飲安排
- 🚗 交通協調
- ✅ 任務清單

## 人員資料欄位

每位成員包含以下資訊：
- 📝 基本資料：姓名、電話
- 🎿 滑雪水平：初級、中級、高級
- 🏂 板型：雙板 (Ski) / 單板 (Snowboard)
- 👶 年齡：大人 / 小孩
- 📦 裝備：自備 / 租借
- 📻 無線電：有 / 無

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 配置 Supabase

1. 前往 [Supabase](https://supabase.com) 創建新專案（免費）
2. 在專案設定中獲取 `URL` 和 `anon key`
3. 複製 `.env.example` 到 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```
4. 填入你的 Supabase 配置

### 3. 創建資料庫表

在 Supabase SQL Editor 中執行 `lib/db.sql` 文件內容。

### 4. 啟動開發伺服器

```bash
npm run dev
```

訪問 http://localhost:3000

## 部署到 Zeabur

詳細部署步驟請參考 `DEPLOY.md`。

快速步驟：
1. 推送代碼到 GitHub
2. 在 [Zeabur](https://zeabur.com) 導入專案
3. 添加環境變數：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 部署完成

## 技術棧

- Next.js 14 + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- 部署：Zeabur

## 開發原則

遵循 Linus Torvalds 的代碼哲學：
- 簡單直接，無過度抽象
- 資料結構優先於代碼
- 消除特殊情況
- 實用主義
- 測試優先（TDD）

詳見 `claude.md`

## 專案結構

```
├── app/                    # Next.js 頁面和 API
│   ├── page.tsx           # 首頁
│   ├── people/            # 人員管理
│   ├── announcements/     # 公告
│   ├── groups/            # 滑雪分組
│   ├── meals/             # 餐飲
│   ├── transport/         # 交通
│   ├── tasks/             # 任務
│   └── api/               # API routes
├── lib/
│   ├── db.sql             # 資料庫 schema
│   ├── supabase.ts        # Supabase 客戶端
│   └── types.ts           # TypeScript 類型
├── claude.md              # 開發原則（含 TDD 規範）
├── README.md              # 專案說明
└── DEPLOY.md              # 部署指南
```

## 授權

MIT License
