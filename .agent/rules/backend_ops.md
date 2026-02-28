---
trigger: model_decision
description: Ridgepoleによるスキーマ更新、Docker操作、CI/CDの設定
---

---
name: Backend Operations
description: データベース管理、CI/CD、コマンド操作のルール
---

# バックエンド運用規約 (Ops)

## 1. データベース管理 (Ridgepole)
- スキーマ管理の正本は `db/Schemafile` とする。
- 変更適用時は必ず以下のコマンドを提案・実行すること：
  ```bash
  docker compose exec backend bundle exec rake ridgepole:apply