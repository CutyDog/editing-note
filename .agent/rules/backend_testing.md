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

## 3. 実行環境
- `spec/rails_helper.rb` 内で `ENV['RAILS_ENV'] = 'test'` を強制し、環境差異を防ぐ。