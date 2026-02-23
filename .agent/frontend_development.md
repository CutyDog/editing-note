---
name: Frontend Development
description: フロントエンド開発時の技術スタック・デザインシステム・コーディング規約
---

# フロントエンド開発ガイドライン

このプロジェクトにおけるフロントエンドの技術スタック、デザイン方針、および規約をまとめます。

## 1. 技術スタック

| カテゴリ | 技術 | 詳細 |
|---|---|---|
| フレームワーク | React | Vite + TypeScript |
| スタイリング | Vanilla CSS | CSS変数によるデザインシステム |
| アイコン | Lucide React | - |
| API通信 | Axios | `src/lib/axios.ts` を使用 |
| パッケージ管理 | npm | - |

## 2. デザインシステム Policy

### プレミアム・ダークテーマ
- 基本色: `#0d1117` (Background), `#58a6ff` (Accent Primary)
- **Glassmorphism**: `backdrop-filter: blur(12px)` と透過境界線を活用し、奥行きのあるUIを構築。
- **グラデーション**: タイトルやアクセントボタンには線形グラデーションを使用し、プレミアム感を演出。

### コンポーネント設計
- `src/index.css` に定義されたグローバル変数（`--bg-main`, `--accent-primary` 等）を優先的に使用する。
- 独自の CSS クラス（`.card` 等）を活用し、一貫性を保つ。

## 3. API通信と認証

### Axios クライアント (`src/lib/axios.ts`)
- 全てのリクエストに `localStorage` の `access_token` を自動付与する。
- **401エラー（期限切れ）**発生時、自動的に `refresh_token` を用いて再発行を試み、成功した場合はリクエストを透過的にリトライする。

## 4. コーディング規約

- **TypeScript**: 厳格な型定義を推奨。
- **ディレクトリ構成**: 
  - `src/components`: 再利用可能なパーツ
  - `src/lib`: Axios 等の基盤設定
- **コミット**: ユーザーの明示的な許可があるまで `git commit` を実行しないこと。
