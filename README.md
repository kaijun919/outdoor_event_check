# からあげ！ごっち チェックリスト 🔥

イベント出店用荷物チェックアプリ（PWA対応）

---

## 📁 ファイル構成

```
gotchi-pwa/
├── src/
│   ├── App.jsx        ← メインアプリ
│   └── main.jsx       ← エントリーポイント
├── public/
│   ├── manifest.json  ← PWA設定
│   ├── sw.js          ← Service Worker（オフライン対応）
│   ├── icon-192.png   ← アイコン（自分で用意）
│   └── icon-512.png   ← アイコン（自分で用意）
├── .github/
│   └── workflows/
│       └── deploy.yml ← GitHub Actions自動デプロイ
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 GitHub Pages に公開する手順

### 1. GitHubでリポジトリを作成
- GitHub.com にログイン
- 「New repository」→ 名前は `gotchi-checklist` など
- Publicにする（GitHub Pages無料利用のため）

### 2. vite.config.js のリポジトリ名を修正
```js
const REPO_NAME = "/gotchi-checklist/"; // ← 作ったリポジトリ名に合わせる
```

### 3. ファイルをアップロード
```bash
git init
git add .
git commit -m "初回コミット"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/gotchi-checklist.git
git push -u origin main
```

### 4. GitHub Pages を有効化
- リポジトリの「Settings」→「Pages」
- Source: **GitHub Actions** を選択
- pushするたびに自動でビルド＆デプロイされます！

### 5. アクセスURL
```
https://あなたのユーザー名.github.io/gotchi-checklist/
```

---

## 📱 ホーム画面に追加する方法

### iPhone（Safari）
1. Safariでアプリのページを開く
2. 下の共有ボタン（□↑）をタップ
3. 「ホーム画面に追加」をタップ
4. 「追加」をタップ

### Android（Chrome）
1. Chromeでアプリのページを開く
2. 右上の「⋮」→「ホーム画面に追加」
3. または自動でバナーが出るのでタップ

---

## 🖼️ アイコンについて

`public/` フォルダに以下のPNGファイルを用意してください：
- `icon-192.png`（192×192px）
- `icon-512.png`（512×512px）

からあげのロゴ画像などを使うとGoodです🍗

---

## ✅ オフライン動作について

一度ページを読み込むと Service Worker がキャッシュし、
次回からはWi-Fiなしでも使えます。
データは端末のlocalStorageに保存されます。
