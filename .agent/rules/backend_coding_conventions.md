---
trigger: glob
globs: backend/app/**/*, backend/lib/**/*
---

---
name: Backend Coding Conventions
description: 具体的なコーディング規約とAPI設計ルール
---

# バックエンド実装規約 (Conventions)

## 1. API 設計
- レスポンスはすべて **JSON 形式** とする。
- **ヘルスチェック:** `GET /up` で 200 を返す実装を維持する。

## 2. コントローラー
- 認証が必要なアクションは `before_action :authenticate_user!` で保護する。
- 認証をスキップする場合は `skip_before_action :authenticate_user!, only: [...]` を明示する。
- **シリアライザ:** レスポンスの JSON 生成は `as_json` を使わず、必ず `Pages::XxxSerializer.new(record).to_h` 形式を使用する。
- **認可スコープ:** `current_user.リソース名.find(id)` 形式で必ずログインユーザーのリソースに限定し、他ユーザーのリソースには 404 を返す。

## 3. モデル
- バリデーション、アソシエーション、スコープを適切に定義する。
- スキーマ変更は直接行わず、必ず Ridgepole を通じて行う。

## 4. リンター
- **RuboCop:** `rails-omakase` のルールに従う。