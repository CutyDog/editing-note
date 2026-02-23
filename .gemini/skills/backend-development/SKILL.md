---
name: Backend Development
description: バックエンド開発時の技術スタック・アーキテクチャ・コーディング規約
---

# バックエンド開発ガイド

## 技術スタック

| カテゴリ | 技術 | バージョン |
|---|---|---|
| 言語 | Ruby | 3.3.10 |
| フレームワーク | Rails (API mode) | 8.1.x |
| データベース | PostgreSQL | 16 |
| Web サーバー | Puma | >= 5.0 |
| テスト | RSpec + FactoryBot | - |
| リンター | RuboCop (rails-omakase) | - |
| セキュリティ | Brakeman, bundler-audit | - |
| デプロイ | Kamal + Docker | - |

## プロジェクト構成

```
editing-note/                 # リポジトリルート（モノレポ）
├── backend/                  # Rails API アプリケーション
│   ├── app/
│   │   ├── controllers/      # API コントローラー
│   │   ├── models/           # ActiveRecord モデル
│   │   ├── jobs/             # ActiveJob ジョブ
│   │   └── mailers/         # メーラー
│   ├── config/
│   │   ├── database.yml      # DB 接続設定
│   │   ├── routes.rb         # ルーティング
│   │   └── environments/     # 環境別設定
│   ├── db/
│   │   └── seeds.rb
│   ├── spec/                 # RSpec テスト
│   │   ├── rails_helper.rb
│   │   └── spec_helper.rb
│   ├── Gemfile
│   └── Dockerfile            # Rails が生成した Dockerfile (参考用)
├── docker/
│   └── backend/
│       ├── Dockerfile        # 開発用 Dockerfile（こちらを使用）
│       └── entrypoint.sh
├── frontend/                 # フロントエンドアプリケーション（未構築）
├── docker-compose.yml        # 開発環境の Docker Compose
└── .github/
    ├── workflows/ci.yml      # CI (セキュリティスキャン + リント)
    └── dependabot.yml
```

## 開発環境

### Docker Compose で起動

```bash
# ビルド
docker compose build

# 起動
docker compose up

# Rails コマンド実行
docker compose run --rm backend rails <command>

# RSpec 実行
docker compose run --rm backend bundle exec rspec
```

### ポート

| サービス | ポート |
|---|---|
| Rails API | 3000 |
| PostgreSQL | 5432 |

### 環境変数

- `DATABASE_URL`: PostgreSQL 接続 URL（docker-compose.yml で設定済み）
- `RAILS_ENV`: 実行環境（development / test / production）

## コーディング規約

### API 設計

- Rails API モード（`config.api_only = true`）で動作
- レスポンスは JSON 形式
- ヘルスチェック: `GET /up` で 200 を返す

### コントローラー

```ruby
# app/controllers/api/v1/example_controller.rb
module Api
  module V1
    class ExampleController < ApplicationController
      def index
        resources = Resource.all
        render json: resources
      end
    end
  end
end
```

- API バージョニングは `Api::V1` の名前空間で管理
- ルーティングは `namespace :api { namespace :v1 { ... } }` を使用

### モデル

```ruby
# app/models/example.rb
class Example < ApplicationRecord
  # バリデーション
  validates :name, presence: true

  # スコープ
  scope :active, -> { where(active: true) }

  # アソシエーション
  belongs_to :user
end
```

### テスト

- テストフレームワーク: **RSpec**（Minitest は使わない）
- テストデータ: **FactoryBot** を使用
- `spec/` ディレクトリに配置

```ruby
# spec/models/example_spec.rb
RSpec.describe Example, type: :model do
  describe "validations" do
    it { is_expected.to validate_presence_of(:name) }
  end
end
```

```ruby
# spec/factories/examples.rb
FactoryBot.define do
  factory :example do
    name { "テスト" }
  end
end
```

### マイグレーション

```bash
# マイグレーション生成
docker compose run --rm backend rails generate migration AddFieldToTable field:type

# マイグレーション実行
docker compose run --rm backend rails db:migrate

# ロールバック
docker compose run --rm backend rails db:rollback
```

## セキュリティ

### コミットしてはいけないファイル

以下のファイルは `.gitignore` で除外済み：

- `config/master.key` — Rails credentials の復号キー
- `config/credentials/*.key` — 環境別 credentials キー
- `.kamal/secrets` — Kamal デプロイ用シークレット
- `.env*` — 環境変数ファイル

### CI で自動チェック

- **Brakeman**: Rails のセキュリティ脆弱性を静的解析
- **bundler-audit**: Gem の既知の脆弱性をスキャン
- **RuboCop**: コードスタイルのリント
