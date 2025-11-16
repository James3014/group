# Zeabur 部署指南

## 前置準備

### 1. 設定 Supabase（免費）

1. 前往 https://supabase.com 註冊並登入
2. 點擊「New Project」創建新專案
3. 等待專案初始化完成（約 2 分鐘）
4. 在左側選單點擊「SQL Editor」
5. 複製 `lib/db.sql` 的內容，貼上並執行
6. 在「Project Settings」→「API」找到：
   - `Project URL`（NEXT_PUBLIC_SUPABASE_URL）
   - `anon public`（NEXT_PUBLIC_SUPABASE_ANON_KEY）

### 2. 推送代碼到 GitHub

```bash
# 如果還沒推送，執行：
git add .
git commit -m "Initial commit: ski trip planner"
git push -u origin claude/trip-planning-tool-012pgCyTuGKbGBxLQABPmw7p
```

## Zeabur 部署步驟

### 1. 註冊 Zeabur

1. 前往 https://zeabur.com
2. 使用 GitHub 帳號登入
3. 授權 Zeabur 存取你的 GitHub

### 2. 創建專案

1. 點擊「Create Project」
2. 選擇你的 GitHub repository（`group`）
3. 選擇分支：`claude/trip-planning-tool-012pgCyTuGKbGBxLQABPmw7p`
4. Zeabur 會自動檢測到 Next.js 專案

### 3. 設定環境變數

在 Zeabur 專案設定中添加以下環境變數：

```
NEXT_PUBLIC_SUPABASE_URL=你的_Supabase_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_Supabase_anon_key
```

### 4. 部署

1. 點擊「Deploy」
2. 等待建置完成（約 2-3 分鐘）
3. Zeabur 會提供一個網址，例如：`https://your-project.zeabur.app`

## 使用自訂網域（可選）

1. 在 Zeabur 專案設定中點擊「Domains」
2. 點擊「Add Domain」
3. 輸入你的網域名稱
4. 依照指示設定 DNS 記錄

## 成本說明

**完全免費方案：**
- Zeabur：每月 $5 美金免費額度（30人使用足夠）
- Supabase：500MB 資料庫 + 50GB 流量（完全足夠）

**總成本：$0/月**

## 初始化資料

部署完成後，你可以：

1. 前往網站的「人員管理」頁面
2. 添加第一批成員
3. 在 Supabase Dashboard 手動將某些人設為管理員：
   ```sql
   UPDATE people SET is_admin = true WHERE name IN ('管理員1', '管理員2');
   ```

## 更新應用

每次推送代碼到 GitHub，Zeabur 會自動重新部署：

```bash
git add .
git commit -m "更新功能"
git push
```

## 故障排除

### 建置失敗
- 檢查環境變數是否正確設定
- 查看 Zeabur 建置日誌

### 連不上資料庫
- 確認 Supabase URL 和 Key 正確
- 檢查 Supabase 專案是否正常運行

### 頁面顯示錯誤
- 確認資料庫表格已經創建（執行 `lib/db.sql`）
- 檢查瀏覽器控制台的錯誤訊息

## 支援

遇到問題可以：
1. 查看 Zeabur 文檔：https://docs.zeabur.com
2. 查看 Supabase 文檔：https://supabase.com/docs
3. 檢查專案的 GitHub Issues
