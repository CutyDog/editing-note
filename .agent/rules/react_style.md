---
trigger: glob
globs: frontend/**
---

# React 開発規約 & ディレクトリ構成ルール

このプロジェクトでは、拡張性とメンテナンス性を重視した **Feature-based Architecture** を採用します。

## 1. ディレクトリ構成
すべての機能は `src/features/` 配下にカプセル化してください。

- `src/features/[feature-name]/`
    - `api/`: その機能専用のAPI通信 (TanStack Query 等)
    - `components/`: その機能専用のUIコンポーネント
    - `hooks/`: その機能専用のカスタムフック
    - `types/`: その機能専用の型定義
    - `index.ts`: 外部（他のfeature）に公開する部品のみをエクスポート（Public API）

共通部品は `src/components/ui/` (shadcn/ui等) に配置してください。

## 2. インポートルール
- 他の feature の内部ファイル（例: `features/auth/components/LoginForm.tsx`）を直接インポートしてはいけません。
- 必ずその feature の `index.ts` を経由してインポートしてください。
- 循環参照を避けるため、feature 間の依存は最小限に留めてください。

## 3. コーディング規約
- **コンポーネント:** 関数コンポーネント (`export const MyComponent = ...`) を使用し、PascalCase で命名してください。
- **Hooks:** 独自のロジックは必ずカスタムフックに抽出し、`use` プレフィックスをつけて命名してください。
- **状態管理:** - サーバー状態は TanStack Query を使用してください。
    - グローバルなクライアント状態は Zustand を優先してください。
- **型定義:** 可能な限り `interface` または `type` を定義し、Any 型の使用を禁止します。