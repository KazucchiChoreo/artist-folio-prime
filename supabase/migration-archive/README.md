# Supabase 移行アーカイブ

このフォルダは、2026-06-20 に Lovable Cloud の Supabase から、独立した
Supabase アカウント（プロジェクトID: `wkbphwpnkdibhbxnbozj`）へデータを
移行したときの記録です。**本番の自動マイグレーションではなく、手順の
再現用バックアップ**として置いています。

## ファイル

| ファイル | 内容 |
|---|---|
| `01_schema.sql` | テーブル・関数・RLSポリシー・トリガー・Storageバケット定義 |
| `02_data.sql` | 各テーブルの実データ（INSERT文） |
| `03_fix_newlines.sql` | `\n` がリテラル文字列のまま入ってしまった列を実際の改行に直す |

## 新しい Supabase プロジェクトに、同じ構成をゼロから再現する手順

1. 新しい Supabase プロジェクトを作成
2. SQL Editor で `01_schema.sql` を実行
3. SQL Editor で `02_data.sql` を実行
4. SQL Editor で `03_fix_newlines.sql` を実行
5. **ユーザー作成（`user_roles` は自動移行できないため）**
   - サイトの `/auth` ページから新規登録、または
     Supabase ダッシュボード → Authentication → Users → Add user
   - 作成したユーザーの UUID を確認
   - SQL Editor で以下を実行：
     ```sql
     INSERT INTO public.user_roles (user_id, role) VALUES ('<取得したUUID>', 'admin');
     ```
6. **画像の再アップロード**
   - `slideshow_images` と `biography.portrait_url` の画像URLは
     移行元プロジェクトの Storage を指したままなので、
     管理画面（`/admin`）から画像を選び直してアップロードし直す
7. コード側の接続先を更新
   - `.env` の `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` /
     `VITE_SUPABASE_PROJECT_ID`（および `SUPABASE_*` も同様）を新しい値に変更
   - Cloudflare Pages の Settings → Environment variables も同じ値に変更
   - コミット・プッシュして再デプロイ

## 元データでハマった点（次回の参考に）

- Lovable のSQLエクスポートには、psqlの出力メッセージ
  （`Output format is unaligned.`、`CREATE FUNCTION` 単独行など）が
  誤って混入することがあるので、実行前に目視確認するとよい
- `boolean` 型の値が `t` / `f` という省略形のまま出力され、
  そのままでは無効なSQLになる（`true` / `false` に直す）
- 改行を含むテキスト列は、実際の改行ではなく `\n`（バックスラッシュ+n）の
  2文字として出力されることがある（`03_fix_newlines.sql` で対処）
- `user_roles.user_id` は `auth.users` への外部キーであり、
  `auth.users` 自体はエクスポートできない（Supabase Authが管理する領域）
  ため、ユーザー作成は毎回手動で行う必要がある
