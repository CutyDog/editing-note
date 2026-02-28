---
trigger: glob
description: RSpecによるテスト作成・修正、日本語でのテスト記述ルール、テスト環境の設定が必要な場合。
globs: backend/spec/**/*
---

---
name: Backend Testing
description: RSpec によるテスト記述スタイルとルールの定義
---

# バックエンドテスト規約 (Testing)

## 1. 記述スタイル (RSpec)
- **説明文は日本語:** `it` や `context` の説明文は日本語で記述する。
- **構成:** RSpec + FactoryBot を使用する。

## 2. 共通化
- JSON パースなどの頻出処理は `spec/support/request_spec_helper.rb` にまとめ、`rails_helper.rb` で自動 include する。
- **認証ヘルパー:** request spec での認証には `auth_headers(user)` ヘルパーを使用する。
  - `let(:access_token)` や `let(:auth_headers)` を各 spec に直書きしない。

## 3. 実行環境
- `spec/rails_helper.rb` 内で `ENV['RAILS_ENV'] = 'test'` を強制し、環境差異を防ぐ。
- **テストDB の自動同期:** `rails_helper.rb` に Ridgepole の dry-run チェックを組み込んでおり、スキーマに差分がある場合のみ自動で `ridgepole:apply` を実行する。手動での `rake ridgepole:apply RAILS_ENV=test` は不要。

## 4. シリアライザのテスト
- シリアライザの単体テストは `spec/serializers/` 配下に配置する。
- `to_h` の戻り値は **文字列キー** であるため、期待値には `"key"` 形式を使用する。
  - NG: `expect(result).to include(:id)`
  - OK: `expect(result).to include("id")`

## 5. FactoryBot
- `build(:factory)` は DB保存しないため、`belongs_to` アソシエーションがある場合は `user_id` が nil になることに注意。
  - バリデーションテストでは明示的に `build(:factory, user: create(:user))` か `create(:factory)` を使う。