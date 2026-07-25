# KazucchiChoreo — artist-folio-prime

KAZUTCHI（コレオグラファー）のポートフォリオサイト。

## 公開URL

| 環境 | URL |
|---|---|
| 本番サイト | https://artist-folio-prime.pages.dev/ |
| 管理画面 | https://artist-folio-prime.pages.dev/admin |
| ログイン | https://artist-folio-prime.pages.dev/auth |

## リポジトリ

https://github.com/KazucchiChoreo/artist-folio-prime

---

## ソリューション構成

### ホスティング
**Cloudflare Pages**（無料プラン）

- `main` ブランチへのpushで自動デプロイ
- Build command: `bun run build`
- Build output directory: `dist`
- 環境変数（Cloudflareダッシュボードで管理）:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

### フロントエンド
| 技術 | 用途 |
|---|---|
| React 19 | UIフレームワーク |
| TanStack Router | SPAルーティング |
| TanStack Query | データフェッチ・キャッシュ |
| Tailwind CSS v4 | スタイリング |
| shadcn/ui | UIコンポーネント |
| Vite 7 | ビルドツール |
| TypeScript | 型安全 |

### バックエンド
**Supabase**（独自アカウント・無料プラン）

| 項目 | 値 |
|---|---|
| Project ID | `wkbphwpnkdibhbxnbozj` |
| Project URL | https://wkbphwpnkdibhbxnbozj.supabase.co |
| ダッシュボード | https://supabase.com/dashboard/project/wkbphwpnkdibhbxnbozj |
| Storageバケット | `artist-media` |

### パッケージマネージャー
- ローカル開発: `bun`
- Cloudflareビルド環境: `npm install`（Cloudflare側が自動選択）

---

## データベース構成

| テーブル | 用途 |
|---|---|
| `biography` | プロフィール（名前・本文・写真URL）|
| `choreography` | 活動実績一覧 |
| `news` | ニュース一覧 |
| `contact_info` | お問い合わせ先情報（SNSリンク等）|
| `contact_submissions` | フォームからの送信データ |
| `slideshow_images` | トップページのスライドショー画像 |
| `site_settings` | サイト全体の公開/非公開設定 |
| `site_text` | 管理画面から編集可能なテキスト（`home.role` 等）|
| `user_roles` | 管理者権限管理（`admin` / `user`）|
| `appearances` | 出演情報（現在は非表示）|
| `records` | リリース情報（現在は非表示）|

### 認証・権限
- Supabase Auth でメール/パスワード認証
- `user_roles` テーブルで `admin` ロールを判定
- `has_role()` 関数（SECURITY DEFINER）で RLS の無限再帰を回避

---

## ページ構成

| ページ | パス | 説明 |
|---|---|---|
| トップ | `/` | スライドショー・ヒーロー・INDEX・最新ニュース |
| ニュース | `/news` | ニュース一覧 |
| 活動実績 | `/choreography` | 振付・活動実績一覧 |
| プロフィール | `/biography` | プロフィール・写真 |
| お問い合わせ | `/contact` | フォーム送信 |
| ログイン | `/auth` | 管理者ログイン |
| 管理画面 | `/admin` | コンテンツ管理（要admin権限）|

---

## 管理画面タブ

| タブ | 編集内容 |
|---|---|
| Slideshow | トップページのスライド画像（複数一括アップロード可）|
| Home Text | ヒーローテキスト・役職名（`site_text` テーブル経由）|
| News | ニュース記事（追加・編集・削除）|
| Record | 活動実績（追加・編集・削除）|
| Biography | プロフィール文・写真 |
| Contact | SNSリンク・マネジメント連絡先 |
| Settings | サイト全体の公開/非公開切り替え |

---

## 多言語対応

日本語（JA）・英語（EN）・中国語（ZH）の3言語対応。
言語設定は `localStorage` に保存される。

- 静的テキスト: `src/lib/i18n.tsx` の `STRINGS` オブジェクト
- DBコンテンツ: 各テーブルに `_ja` / `_en` / `_zh` カラム
- 管理画面から編集可能なテキスト: `site_text` テーブル

---

## 環境変数

`.env`（`.env` はコミットから外す。`.env.example` のみ管理）

```
VITE_SUPABASE_URL=https://wkbphwpnkdibhbxnbozj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SUPABASE_PROJECT_ID=wkbphwpnkdibhbxnbozj
```

Cloudflare Pages の環境変数にも同じ値を設定すること。

---

## ローカル開発

```bash
git clone https://github.com/KazucchiChoreo/artist-folio-prime
cd artist-folio-prime
bun install   # または npm install
cp .env.example .env  # .envを編集してSupabaseの値を入力
bun dev
```

---

## デプロイ

`main` ブランチへのpushで Cloudflare Pages が自動ビルド・デプロイする。
手動でトリガーしたい場合は Cloudflare ダッシュボード → Deployments → Retry deployment。

---

## Supabaseバックアップ・移行手順

`supabase/migrations-archive/` フォルダを参照。
新しい Supabase プロジェクトへの移行手順・ハマりポイントを記録してある。

---

## 今後の拡張メモ

- **決済システム**: Supabase Edge Functions を使えば現在の構成のまま拡張可能。Stripe と連携する場合、Edge Functions で決済セッション作成・Webhook受信を担当させる。Edge Functionsは無料プランで月50万回まで無料。
- **お問い合わせフォームの文言**: 現在コード（`contact.tsx`）にハードコード。`site_text` テーブルの仕組みに乗せれば管理画面から編集可能になる。
- **INDEXグリッドのレイアウト**: 4項目で余白ができる問題あり（要対応）。
