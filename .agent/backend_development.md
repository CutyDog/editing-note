---
name: Backend Development
description: バックエンド開発時の技術スタック・アーキテクチャ・コーディング規約
---

# バックエンド開発ガイドライン

このプロジェクトにおける技術スタック、アーキテクチャ、およびコーディング規約をまとめます。

## 1. 技術スタック

| カテゴリ | 技術 | 詳細 |
|---|---|---|
| 言語 | Ruby | 3.3.10 |
| フレームワーク | Rails (API mode) | 8.1.x |
| データベース | PostgreSQL | 16 |
| スキーマ管理 | Ridgepole | `db/Schemafile` |
| テスト | RSpec + FactoryBot | 日本語記述を推奨 |
| リンター | RuboCop | rails-omakase |
| デプロイ | Kamal + Docker | - |

## 2. アーキテクチャ方針

### Service クラスの回避
- 複雑になりすぎない限り、`app/services` は作成しない。
- 基本的にロジックは Controller または Model に寄せる。
- ActiveRecord に依存しない純粋なロジックは、`app/models` 配下に **Plain Ruby Object (POJO)** として実装する（例: `JwtToken`）。

### Concerns の活用
- 共通の振る舞い（認証、検索フィルター、共通スコープ等）は `app/controllers/concerns` や `app/models/concerns` を活用して共通化する。

## 3. コーディング規約

### API 設計
- Rails API モード（`config.api_only = true`）で動作。
- レスポンスは JSON 形式。
- ヘルスチェック: `GET /up` で 200 を返す。

### コントローラー
- 認証が必要なアクションは `before_action :authenticate_user!` で保護する。
- 認証をスキップする場合は `skip_before_action :authenticate_user!, only: [...]` を明示する。

### モデル
- バリデーション、アソシエーション、スコープを適切に定義する。

## 4. テスト (RSpec) ルール

### 記述スタイル
- **説明文は日本語**: `it` や `context` の説明文は日本語で記述する。
- **共通ヘルパー**: `json` パースなどの頻出処理は `spec/support/request_spec_helper.rb` にまとめ、`rails_helper.rb` で自動 include する。

### 環境の強制
- テスト実行時の環境差異を防ぐため、`spec/rails_helper.rb` 内で `ENV['RAILS_ENV'] = 'test'` を強制する。

## 5. データベース管理 (Ridgepole)

- スキーマ管理は `db/Schemafile` を正とする。
- 変更適用時は以下のコマンドを使用する：
  ```bash
  docker compose exec backend bundle exec rake ridgepole:apply
  ```

## 6. CI (GitHub Actions)

- **セキュリティ / リント**: Brakeman, bundler-audit, RuboCop による自動チェックを行う。
- **テスト実行**: PostgreSQL サービスコンテナを併用した RSpec テストを実行する。
- **環境変数設定**: CI 上で credentials (master.key) を必要とする処理がある場合は、ワークフロー内で `SECRET_KEY_BASE` などのダミー値を環境変数として注入し、テストを継続可能にする。
