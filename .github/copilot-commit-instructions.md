# Copilot Commit Message Generation Instructions

このファイルはVSCodeのGitHub Copilotがコミットメッセージを生成する際の指示を定義します。

## Format Rules

- Use conventional commit format: `type(scope): message`
- Write the message in Japanese (日本語でメッセージを記述)
- Keep the subject line concise (50-72 characters recommended)
- Use imperative mood in the type prefix

## Commit Types

- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントの変更
- `style`: コードスタイルの変更（フォーマット、セミコロンなど）
- `refactor`: リファクタリング（機能追加やバグ修正を含まない）
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの設定変更

## Scope Guidelines

- Use the main directory or feature name as scope
- Examples: `game`, `ui`, `logic`, `board`, `rules`, `config`

## Message Guidelines

- メッセージは日本語で記述する
- 変更内容を簡潔に説明する
- 「〜を実装」「〜を修正」「〜を追加」などの表現を使用

## Examples

良い例:
- `feat(game): オセロボードの初期配置を実装`
- `fix(ui): モバイル表示時のレイアウト崩れを修正`
- `refactor(logic): 駒の裏返し処理を最適化`
- `docs(readme): インストール手順を更新`
- `test(rules): 合法手判定のテストケースを追加`
- `chore(config): ESLint設定を更新`

悪い例:
- `Add move validation logic` (英語、プレフィックスなし)
- `feat(game): Add move validation logic` (英語)
- `オセロボードの初期配置を実装` (プレフィックスなし)
