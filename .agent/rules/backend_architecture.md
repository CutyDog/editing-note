---
trigger: glob
globs: backend/**/*
---

---
name: Backend Architecture
description: バックエンドの設計思想・スタック・ディレクトリ構成の定義
---

# バックエンド設計ガイドライン (Architecture)

## 1. 技術スタック
- **Language:** Ruby 3.3.10
- **Framework:** Rails 8.1.x (API mode: `config.api_only = true`)
- **Database:** PostgreSQL 16
- **Schema Management:** Ridgepole (`db/Schemafile`)
- **Serializer:** [alba](https://github.com/okuramasafumi/alba) gem
- **Deployment:** Kamal + Docker

## 2. アーキテクチャ方針
### Service クラスの回避
- 複雑になりすぎない限り `app/services` は作成しない。
- ロジックは **Controller** または **Model** に寄せる。

### POJO (Plain Old Ruby Object) の活用
- ActiveRecord に依存しない純粋なロジックは、`app/models` 配下に POJO として実装する。
- 例: `app/models/jwt_token.rb`

### Concerns の活用
- 共通の振る舞い（認証、検索、共通スコープ等）は `app/controllers/concerns` や `app/models/concerns` を積極的に活用する。

### Serializer の規約
- JSON シリアライズは **alba gem** を使用し、`as_json` の直接使用は避ける。
- シリアライザは `app/serializers/<リソース名>/` ディレクトリに配置する。
  - 例: `app/serializers/pages/base_serializer.rb` → `Pages::BaseSerializer`
- 1クラス1ファイルとし、Railsのオートロード規約（クラス名 = ファイルパス）に準拠すること。
- 用途に応じて複数のシリアライザを使い分ける:
  - `SummarySerializer`: 一覧・子要素などの軽量表現
  - `DetailSerializer`: 詳細表示（関連するリソースを含む）
  - `BaseSerializer`: 作成・更新レスポンス用
- モデルと同名モジュール名（例: `Page`）との衝突を避けるため、モジュール名は複数形（`Pages`）を使用する。