# 神居雪场滑雪团 - 行程管理工具

30人圣诞节滑雪团队协调系统。

## 功能

- 👥 人员管理
- 📢 公告系统
- 🏂 滑雪分组
- 🍽️ 餐饮安排
- 🚗 交通协调
- ✅ 任务清单

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

1. 前往 [Supabase](https://supabase.com) 创建新项目（免费）
2. 在项目设置中获取 `URL` 和 `anon key`
3. 复制 `.env.example` 到 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```
4. 填入你的 Supabase 配置

### 3. 创建数据库表

在 Supabase SQL Editor 中执行 `lib/db.sql` 文件内容。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Zeabur

1. 推送代码到 GitHub
2. 在 [Zeabur](https://zeabur.com) 导入项目
3. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 部署完成

## 技术栈

- Next.js 14 + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- 部署：Zeabur

## 开发原则

遵循 Linus Torvalds 的代码哲学：
- 简单直接，无过度抽象
- 数据结构优先于代码
- 消除特殊情况
- 实用主义

详见 `claude.md`
