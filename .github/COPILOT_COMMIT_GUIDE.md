# GitHub Copilotでコミットメッセージを生成する方法

このガイドでは、GitHub Copilotを使用してローカルコミットのメッセージを生成する方法を説明します。

## クイックスタート / Quick Start

### 推奨方法: VSCode ✨ボタンを使用

1. VSCodeでSource Controlパネルを開く（`Ctrl/Cmd + Shift + G`）
2. ファイルをステージングする
3. コミットメッセージ入力欄の横にある **✨（Sparkle）ボタン** をクリック
4. Copilotが自動的にコミットメッセージを生成します

> **Note**: このプロジェクトでは `.vscode/settings.json` に `github.copilot.chat.commitMessageGeneration.instructions` を設定しているため、Copilotはプロジェクトのコミット規約（`type(scope): 日本語メッセージ`）に従ったメッセージを生成します。

### 代替方法: Git Hookを使用

```bash
# セットアップスクリプトを実行 / Run the setup script
./.github/scripts/setup-copilot-commits.sh

# 変更をステージング / Stage your changes
git add <files>

# コミット（エディタが開きます）/ Commit (editor will open)
git commit
```

## 前提条件

- GitHub Copilot がインストールされていること
- GitHub Copilot Chat がインストールされていること（✨ボタン機能に必要）
- Visual Studio Code を使用していること
- Git が設定されていること

## 方法 1: VSCode ✨ボタンを使用する（推奨）

この方法が最も簡単で効果的です。

### セットアップ

このプロジェクトでは既にVSCodeの設定が完了しています。`.vscode/settings.json` に以下の設定が含まれています：

```json
{
  "github.copilot.chat.commitMessageGeneration.instructions": [
    {
      "file": ".github/copilot-commit-instructions.md"
    }
  ]
}
```

この設定により、Copilotは `.github/copilot-commit-instructions.md` の指示に従ってコミットメッセージを生成します。

### 使用方法

1. 変更を加えてファイルをステージング（Source Controlパネル or `git add`）
2. Source Controlパネルでコミットメッセージ入力欄の横の **✨ボタン** をクリック
3. Copilotがステージされた変更を分析し、規約に従ったコミットメッセージを生成
4. 生成されたメッセージを確認・必要に応じて編集
5. コミットを実行

### カスタマイズ

コミットメッセージの生成ルールを変更したい場合は、`.github/copilot-commit-instructions.md` を編集してください。

## 方法 2: Git Hookを使用する

Git Hookを使用すると、コミット時にエディタが自動的に開き、変更の概要がコメントとして表示されます。

### セットアップ

```bash
# セットアップスクリプトを実行
./.github/scripts/setup-copilot-commits.sh
```

または手動で設定:
```bash
git config core.hooksPath .github/hooks
```

### 使用方法

1. 通常通りファイルを変更してステージング:
```bash
git add <files>
```

2. コミットコマンドを実行（メッセージなし）:
```bash
git commit
```

3. エディタが開き、変更の概要がコメントとして表示されます
4. Copilotの補完機能を使ってメッセージを入力、または手動で記述

## 方法 3: Copilot Chatを使用

1. Copilot Chatを開く（`Ctrl/Cmd + Shift + I`）

2. 以下のようなプロンプトを入力:
```
現在のステージされた変更に対して、日本語でtype(scope): メッセージの形式でコミットメッセージを生成してください。
```

3. 生成されたメッセージをコピーして使用

## コミットメッセージのベストプラクティス

このプロジェクトでは、以下の形式を使用します:

### 形式

**日本語での従来のコミット形式:**
- 日本語で記述してください
- `type(scope): メッセージ` の形式を使用
- タイプ: feat（機能追加）, fix（バグ修正）, docs（ドキュメント）, style（スタイル）, refactor（リファクタリング）, test（テスト）, chore（雑務）
- メッセージは明確で簡潔に保ってください

### 例

```
feat(game): オセロボードの初期配置を実装
fix(ui): モバイル表示時のレイアウト崩れを修正
refactor(logic): 駒の裏返し処理を最適化
docs(readme): インストール手順を更新
test(rules): 合法手判定のテストケースを追加
```

**悪い例 / Bad examples:**
```
Add move validation logic  ❌ (英語で記述されている・プレフィックスがない)
feat(game): Add move validation logic  ❌ (英語で記述されている)
オセロボードの初期配置を実装  ❌ (type(scope)プレフィックスがない)
```

## トラブルシューティング

### Copilotが提案を表示しない

1. Copilotが有効になっているか確認
2. エディタを再起動
3. ステージされた変更があるか確認（`git status`）
4. Copilotのサブスクリプションが有効か確認

### フックが動作しない

1. フックに実行権限があるか確認:
```bash
ls -l .git/hooks/prepare-commit-msg
```

2. 必要に応じて実行権限を付与:
```bash
chmod +x .git/hooks/prepare-commit-msg
```

3. フックパスの設定を確認:
```bash
git config core.hooksPath
```

## 参考リンク

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)

---

# How to Generate Commit Messages with GitHub Copilot

This guide explains how to use GitHub Copilot to generate commit messages for local commits.

## Prerequisites

- GitHub Copilot installed
- Using Visual Studio Code
- Git configured

## Method 1: VSCode ✨ Button (Recommended)

This is the easiest and most effective method.

### Setup

This project already has VSCode settings configured. The `.vscode/settings.json` includes:

```json
{
  "github.copilot.chat.commitMessageGeneration.instructions": [
    {
      "file": ".github/copilot-commit-instructions.md"
    }
  ]
}
```

This setting tells Copilot to follow the instructions in `.github/copilot-commit-instructions.md` when generating commit messages.

### Usage

1. Stage your changes (Source Control panel or `git add`)
2. Click the **✨ button** next to the commit message input in Source Control panel
3. Copilot analyzes staged changes and generates a commit message following the project conventions
4. Review and edit the generated message if needed
5. Commit

### Customization

To change the commit message generation rules, edit `.github/copilot-commit-instructions.md`.

## Method 2: Using Git Hook

Git Hook opens your editor automatically when committing, showing a summary of changes as comments.

### Setup

```bash
# Run the setup script
./.github/scripts/setup-copilot-commits.sh
```

Or manually:
```bash
git config core.hooksPath .github/hooks
```

### Usage

1. Make changes and stage files:
```bash
git add <files>
```

2. Run commit without a message:
```bash
git commit
```

3. Your editor opens with a summary of changes as comments
4. Use Copilot's completion feature to write the message, or write manually

## Method 3: Using Copilot Chat

1. Open Copilot Chat (`Ctrl/Cmd + Shift + I`)

2. Enter a prompt like:
```
Generate a commit message for the currently staged changes in Japanese using the format: type(scope): メッセージ.
```

3. Copy and use the generated message

## Commit Message Best Practices

This project uses the following format:

### Format

**Japanese Conventional Commit Format:**
- Write in Japanese (日本語)
- Use format: `type(scope): メッセージ`
- Types: feat（機能追加）, fix（バグ修正）, docs（ドキュメント）, style（スタイル）, refactor（リファクタリング）, test（テスト）, chore（雑務）
- Keep messages clear and concise

### Examples

```
feat(game): オセロボードの初期配置を実装
fix(ui): モバイル表示時のレイアウト崩れを修正
refactor(logic): 駒の裏返し処理を最適化
docs(readme): インストール手順を更新
test(rules): 合法手判定のテストケースを追加
```

**Bad examples:**
```
Add move validation logic  ❌ (written in English, no prefix)
feat(game): Add move validation logic  ❌ (written in English)
オセロボードの初期配置を実装  ❌ (no type(scope) prefix)
```

## Troubleshooting

### Copilot not showing suggestions

1. Verify Copilot is enabled
2. Restart your editor
3. Check that you have staged changes (`git status`)
4. Verify your Copilot subscription is active

### Hook not working

1. Check hook has execute permission:
```bash
ls -l .git/hooks/prepare-commit-msg
```

2. Add execute permission if needed:
```bash
chmod +x .git/hooks/prepare-commit-msg
```

3. Verify hooks path configuration:
```bash
git config core.hooksPath
```

## References

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
