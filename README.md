# 作業時間記録アプリ

スタディプラスのように、**何を・いつ・どれくらい**やったかを記録するWebアプリです。

📱 **スマホ対応**: PWA対応でホーム画面に追加できます  
🚀 **Vercelデプロイ対応**: GitHubにプッシュするだけで自動デプロイ

## 技術スタック

- **Next.js** (App Router)
- **Tailwind CSS**
- **TypeScript**
- **shadcn/ui** 風コンポーネント（Button, Input, Label, Card）

## 機能

- **記録の追加**: 科目/タスク名・開始日時・所要時間（分）・メモを入力して保存
- **今日の合計**: 当日の勉強時間の合計を表示
- **記録一覧**: 新しい順に一覧表示・削除（データはブラウザの localStorage に保存）

## 開発の始め方

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## ビルド

```bash
npm run build
npm start
```

## プロジェクト構成

- `app/` - ページとレイアウト（App Router）
- `components/` - UIコンポーネント（`ui/` は shadcn 風）
- `lib/` - ユーティリティ・ストレージ
- `types/` - TypeScript 型定義

データはクライアントの localStorage にのみ保存しているため、別デバイスや別ブラウザでは同期されません。バックエンドやDBを追加すると永続化・同期が可能になります。

## 🚀 デプロイ方法

Vercelへのデプロイ手順は [DEPLOY.md](./DEPLOY.md) を参照してください。

### クイックスタート

1. GitHubにリポジトリを作成
2. コードをプッシュ
3. [Vercel](https://vercel.com) でインポート
4. 自動デプロイ完了！

### 📚 詳細ガイド

- **Git初心者の方**: [GITHUB_SETUP.md](./GITHUB_SETUP.md) - ターミナルの使い方から詳しく説明
- **デプロイ手順**: [DEPLOY.md](./DEPLOY.md) - Vercelデプロイとスマホ設定の完全ガイド
# my-third-app
