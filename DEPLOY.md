# Vercelデプロイガイド

このガイドでは、作業時間記録アプリをVercelにデプロイして、スマホから使えるようにする手順を説明します。

## 📋 目次

1. [Vercelデプロイの準備](#1-vercelデプロイの準備)
2. [GitHubへのアップロード手順](#2-githubへのアップロード手順)
3. [Vercelでのデプロイ](#3-vercelでのデプロイ)
4. [スマホのホーム画面に追加](#4-スマホのホーム画面に追加)

---

## 1. Vercelデプロイの準備

### 必要なもの
- ✅ GitHubアカウント（無料）
- ✅ Vercelアカウント（無料、GitHubでサインイン可能）
- ✅ このプロジェクトがローカルに保存されていること

### 確認事項
- [x] `.gitignore` ファイルが存在する（`node_modules`などが除外されている）
- [x] `package.json` に `build` スクリプトがある
- [x] `npm run build` が成功する

### 📱 PWAアイコンの準備（オプション）

スマホのホーム画面に追加する際、より良いアイコンを表示したい場合は、PNGアイコンを作成してください：

1. **オンラインツールを使用**:
   - [RealFaviconGenerator](https://realfavicongenerator.net/) にアクセス
   - `/public/icon.svg` をアップロード
   - 「Generate」をクリック
   - 生成された `icon-192.png` と `icon-512.png` を `/public/` フォルダに保存

2. **または手動で作成**:
   - `/public/icon.svg` を画像編集ソフトで開く
   - 192x192px と 512x512px のPNGとしてエクスポート
   - `/public/icon-192.png` と `/public/icon-512.png` として保存

**注意**: PNGアイコンがなくてもアプリは動作しますが、iOSではSVGが使えない場合があるため、PNGを用意することを推奨します。

---

## 2. GitHubへのアップロード手順

> 💡 **初心者の方へ**: より詳しい手順は [GITHUB_SETUP.md](./GITHUB_SETUP.md) を参照してください。

### ステップ1: GitHubアカウントの準備

1. [GitHub.com](https://github.com) にアクセス
2. 右上の「Sign up」からアカウントを作成（既にある場合は「Sign in」）

### ステップ2: 新しいリポジトリを作成

1. GitHubにログイン後、右上の「+」→「New repository」をクリック
2. リポジトリ名を入力（例: `study-time-app`）
3. 「Public」または「Private」を選択（Privateは無料でも利用可能）
4. **「Initialize this repository with a README」のチェックは外す**（既にファイルがあるため）
5. 「Create repository」をクリック

### ステップ3: Gitの初期化（初回のみ）

ターミナル（Mac）またはコマンドプロンプト（Windows）を開いて、プロジェクトフォルダに移動します：

```bash
cd "/Users/tatsuki/Desktop/my third app"
```

**注意**: フォルダ名にスペースがある場合は、引用符で囲んでください。

### ステップ4: Gitリポジトリを初期化

```bash
# Gitを初期化
git init

# すべてのファイルをステージング（追加）
git add .

# 最初のコミット（変更を記録）
git commit -m "Initial commit: 作業時間記録アプリ"
```

### ステップ5: GitHubリポジトリと接続

GitHubで作成したリポジトリのページに表示されている「Quick setup」セクションから、**HTTPS**のURLをコピーします（例: `https://github.com/あなたのユーザー名/study-time-app.git`）

```bash
# GitHubリポジトリを追加（URLはあなたのものに置き換えてください）
git remote add origin https://github.com/あなたのユーザー名/study-time-app.git

# メインブランチを設定
git branch -M main

# GitHubにプッシュ（アップロード）
git push -u origin main
```

**初回のプッシュ時**、GitHubのユーザー名とパスワード（またはPersonal Access Token）を求められる場合があります。

#### Personal Access Tokenが必要な場合

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」→「Generate new token (classic)」
3. Note: `Vercel Deploy` など適当な名前
4. Expiration: 適切な期間を選択
5. Scopes: `repo` にチェック
6. 「Generate token」をクリック
7. 表示されたトークンをコピー（再表示されないので注意）
8. パスワードの代わりにこのトークンを入力

### ステップ6: アップロード完了の確認

GitHubのリポジトリページをリロードして、ファイルが表示されていれば成功です！

---

## 3. Vercelでのデプロイ

### ステップ1: Vercelアカウントを作成

1. [vercel.com](https://vercel.com) にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択してGitHubアカウントでログイン

### ステップ2: プロジェクトをインポート

1. Vercelのダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」でGitHubリポジトリを選択
3. 「Import」をクリック

### ステップ3: プロジェクト設定

Vercelが自動的にNext.jsを検出します。以下の設定を確認：

- **Framework Preset**: Next.js（自動検出）
- **Root Directory**: `./`（そのまま）
- **Build Command**: `npm run build`（自動設定）
- **Output Directory**: `.next`（自動設定）
- **Install Command**: `npm install`（自動設定）

**変更は不要**です。そのまま「Deploy」をクリック！

### ステップ4: デプロイ完了

1. デプロイが完了するまで1〜2分待ちます
2. 「Congratulations!」画面が表示されたら成功
3. 「Visit」ボタンをクリックして、公開されたURLを確認

**例**: `https://study-time-app-xxxxx.vercel.app`

このURLがあなたのアプリの公開アドレスです！

---

## 4. スマホのホーム画面に追加

### iPhone（Safari）

1. SafariでアプリのURLを開く
2. 画面下部の「共有」ボタン（□↑）をタップ
3. スクロールして「ホーム画面に追加」をタップ
4. 名前を確認（「学習記録」など）して「追加」をタップ
5. ホーム画面にアイコンが追加されます！

### Android（Chrome）

1. ChromeでアプリのURLを開く
2. 右上の「⋮」（メニュー）をタップ
3. 「ホーム画面に追加」または「アプリをインストール」をタップ
4. 名前を確認して「追加」をタップ
5. ホーム画面にアイコンが追加されます！

### 動作確認

- アイコンをタップすると、ブラウザなしでアプリが開きます
- フルスクリーンで表示され、ネイティブアプリのように使えます

---

## 🔄 更新方法

コードを変更したら、以下の手順で再デプロイできます：

```bash
# 変更をコミット
git add .
git commit -m "変更内容の説明"

# GitHubにプッシュ
git push

# Vercelが自動的に再デプロイします（数分で完了）
```

VercelはGitHubへのプッシュを検知して自動的に再デプロイします！

---

## ❓ よくある質問

### Q: デプロイに失敗した
- `npm run build` がローカルで成功するか確認してください
- Vercelのデプロイログでエラー内容を確認できます

### Q: スマホでアイコンが表示されない
- `manifest.json` とアイコンファイルが正しく配置されているか確認
- HTTPSでアクセスしているか確認（Vercelは自動的にHTTPS）

### Q: データが消える
- 現在のアプリは `localStorage` を使用しているため、ブラウザごとにデータが保存されます
- 別デバイスで同期したい場合は、バックエンド（Firebase、Supabaseなど）の追加が必要です

---

## 🎉 完了！

これで、スマホからいつでもアクセスできる学習記録アプリの完成です！
