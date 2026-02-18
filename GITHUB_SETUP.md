# GitHubアップロード クイックスタート

このファイルは、Git初心者向けの詳細ガイドです。ターミナル（コマンドライン）の使い方から説明します。

## 📝 前提条件

- MacまたはWindows PC
- インターネット接続
- GitHubアカウント（[github.com](https://github.com) で無料作成可能）

---

## 🖥️ ターミナルの開き方

### Mac
1. 「Spotlight検索」（⌘ + スペース）を開く
2. 「ターミナル」と入力してEnter
3. または、アプリケーション → ユーティリティ → ターミナル

### Windows
1. 「Windowsキー + R」を押す
2. `cmd` と入力してEnter
3. または、スタートメニューから「コマンドプロンプト」を検索

---

## 📂 ステップ1: プロジェクトフォルダに移動

ターミナルが開いたら、以下のコマンドを入力してEnterを押します：

### Mac
```bash
cd "/Users/tatsuki/Desktop/my third app"
```

### Windows
```bash
cd "C:\Users\あなたのユーザー名\Desktop\my third app"
```

**注意**: 
- フォルダ名にスペースがある場合は、引用符（`"`）で囲みます
- Windowsの場合は、実際のパスに置き換えてください

**確認方法**: 以下のコマンドで現在のフォルダを確認できます
```bash
pwd    # Mac
cd     # Windows（現在のパスが表示される）
```

---

## 🔧 ステップ2: Gitがインストールされているか確認

```bash
git --version
```

**結果が表示されればOK**（例: `git version 2.39.0`）

**エラーが出る場合**:
- Mac: Xcode Command Line Toolsをインストール（`xcode-select --install`）
- Windows: [Git for Windows](https://git-scm.com/download/win) をダウンロードしてインストール

---

## 📦 ステップ3: Gitリポジトリを初期化

```bash
git init
```

**出力**: `Initialized empty Git repository in ...` と表示されれば成功

---

## 📋 ステップ4: ファイルを追加

```bash
git add .
```

このコマンドで、フォルダ内のすべてのファイルがGitの管理対象になります。

**確認**: 何も表示されなくても正常です

---

## 💾 ステップ5: 最初のコミット（変更を記録）

```bash
git commit -m "Initial commit: 作業時間記録アプリ"
```

**出力**: `[main (root-commit) xxxxx] Initial commit...` と表示されれば成功

**エラーが出る場合**（初回のみ）:
```bash
# ユーザー名とメールアドレスを設定（GitHubのものに置き換えてください）
git config --global user.name "あなたのGitHubユーザー名"
git config --global user.email "あなたのメールアドレス"

# もう一度コミット
git commit -m "Initial commit: 作業時間記録アプリ"
```

---

## 🌐 ステップ6: GitHubでリポジトリを作成

1. [GitHub.com](https://github.com) にログイン
2. 右上の「+」→「New repository」をクリック
3. **Repository name**: `study-time-app`（好きな名前でOK）
4. **Description**: 「作業時間記録アプリ」（任意）
5. **Public** または **Private** を選択
6. ⚠️ **「Initialize this repository with a README」のチェックは外す**
7. 「Create repository」をクリック

---

## 🔗 ステップ7: GitHubリポジトリと接続

GitHubで作成したリポジトリのページに移動すると、以下のような画面が表示されます：

```
Quick setup — if you've done this kind of thing before
https://github.com/あなたのユーザー名/study-time-app.git
```

**HTTPS**のURLをコピーします。

次に、ターミナルで以下を実行（URLはあなたのものに置き換えてください）：

```bash
git remote add origin https://github.com/あなたのユーザー名/study-time-app.git
```

**確認**: エラーが出なければ成功です

---

## 📤 ステップ8: GitHubにアップロード

```bash
git branch -M main
git push -u origin main
```

**初回のプッシュ時**、認証情報を求められます：

### 方法1: GitHub CLIを使用（推奨）
```bash
# GitHub CLIがインストールされている場合
gh auth login
```

### 方法2: Personal Access Tokenを使用

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」→「Generate new token (classic)」
3. Note: `Vercel Deploy` など適当な名前
4. Expiration: 90 days など適切な期間
5. Scopes: `repo` にチェック
6. 「Generate token」をクリック
7. **トークンをコピー**（再表示されないので注意！）
8. ターミナルで求められたら：
   - Username: あなたのGitHubユーザー名
   - Password: **トークンを貼り付け**（パスワードではない）

**成功メッセージ**:
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
...
To https://github.com/...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## ✅ 完了確認

GitHubのリポジトリページをリロードして、ファイル一覧が表示されていれば成功です！

---

## 🔄 今後の更新方法

コードを変更したら、以下の3つのコマンドで更新できます：

```bash
# 1. 変更をステージング
git add .

# 2. コミット（変更を記録）
git commit -m "変更内容の説明"

# 3. GitHubにプッシュ（アップロード）
git push
```

---

## ❓ トラブルシューティング

### Q: `git: command not found`
→ Gitがインストールされていません。上記の「ステップ2」を参照してください。

### Q: `fatal: not a git repository`
→ プロジェクトフォルダに移動していません。「ステップ1」を確認してください。

### Q: `error: failed to push`
→ 認証情報が間違っているか、リポジトリURLが間違っています。Personal Access Tokenを使用してください。

### Q: `Permission denied`
→ Personal Access Tokenの権限（`repo`）が正しく設定されているか確認してください。

---

## 📚 参考リンク

- [Git公式ドキュメント](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com/ja)
- [Personal Access Token作成ガイド](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
