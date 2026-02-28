# GitHub Copilotでコミットメッセージを生成する方法

このガイドでは、GitHub Copilotを使用してローカルコミットのメッセージを生成する方法を説明します。

## クイックスタート / Quick Start

最速でセットアップするには、以下のコマンドを実行してください：

```bash
# セットアップスクリプトを実行 / Run the setup script
./.github/scripts/setup-copilot-commits.sh

# 変更をステージング / Stage your changes
git add <files>

# コミット（Copilotが提案を行います）/ Commit (Copilot will suggest messages)
git commit
```

## 前提条件

- GitHub Copilot がインストールされていること
- Visual Studio Code、IntelliJ IDEA、または他のCopilot対応エディタを使用していること
- Git が設定されていること

## 方法 1: Git Hookを使用する（推奨）

### セットアップ

1. フックディレクトリを設定:
```bash
git config core.hooksPath .github/hooks
```

または、手動でフックをコピー:
```bash
cp .github/hooks/prepare-commit-msg .git/hooks/prepare-commit-msg
chmod +x .git/hooks/prepare-commit-msg
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

3. エディタが開き、Copilotが変更内容に基づいてコミットメッセージを提案します

4. Copilotの提案を確認し、必要に応じて編集してから保存

## 方法 2: エディタでCopilotを直接使用

### Visual Studio Codeの場合

1. Source Control パネルを開く（Ctrl/Cmd + Shift + G）

2. コミットメッセージ入力欄で、以下のいずれかを入力:
   - `#` を入力してCopilotに提案を依頼
   - `/commit` を入力（Copilot Chatが有効な場合）
   - 変更内容を示す単語を先頭大文字で入力（例: `Add`, `Fix`, `Update`）

3. Copilotが提案を表示するので、Tab キーで受け入れる

### Copilot Chatを使用

1. Copilot Chatを開く（Ctrl/Cmd + Shift + I）

2. 以下のようなプロンプトを入力:
```
現在のステージされた変更に対して、先頭大文字の英語で簡潔なコミットメッセージを生成してください。プレフィックスは不要で、50文字以内、ピリオドやカンマは避けてください。
```

または英語で:
```
Generate a concise commit message for the currently staged changes starting with a capital letter in English, no prefix needed, under 50 characters, avoiding periods and commas
```

3. 生成されたメッセージをコピーして使用

## 方法 3: コマンドラインでCopilotを使用

GitHub CLI (`gh`) がインストールされている場合:

```bash
# 変更の差分を取得してCopilotに送信
git diff --cached | gh copilot suggest "Generate a concise commit message starting with capital letter, no prefix, under 50 characters"
```

## コミットメッセージのベストプラクティス

このプロジェクトでは、以下の形式を使用します:

### 形式

**1行目:**
- 必ず先頭大文字の英語で記述
- プレフィックス（feat:, fix: など）は不要
- 変更内容を簡潔に記述
- ピリオド、カンマ、接続詞はできるだけ避ける
- 1文でかつ50文字以内に収める

### 例

```
Add move validation logic
Correct piece flip calculation
Update installation instructions
Implement board state management
Fix visual feedback on piece placement
```

**悪い例 / Bad examples:**
```
feat(game): Add move validation logic.  ❌ (プレフィックスとピリオドがある)
add move validation logic  ❌ (先頭が小文字)
Add move validation logic, and update tests  ❌ (カンマと接続詞がある)
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
- Using Visual Studio Code, IntelliJ IDEA, or another Copilot-enabled editor
- Git configured

## Method 1: Using Git Hook (Recommended)

### Setup

1. Configure the hooks directory:
```bash
git config core.hooksPath .github/hooks
```

Or manually copy the hook:
```bash
cp .github/hooks/prepare-commit-msg .git/hooks/prepare-commit-msg
chmod +x .git/hooks/prepare-commit-msg
```

### Usage

1. Make changes and stage files as usual:
```bash
git add <files>
```

2. Run commit command without a message:
```bash
git commit
```

3. Your editor will open, and Copilot will suggest a commit message based on the changes

4. Review Copilot's suggestion, edit if needed, and save

## Method 2: Using Copilot Directly in Your Editor

### For Visual Studio Code

1. Open the Source Control panel (Ctrl/Cmd + Shift + G)

2. In the commit message input, do one of the following:
   - Type `#` to request Copilot suggestions
   - Type `/commit` (if Copilot Chat is enabled)
   - Start typing with a capital letter describing the change (e.g., `Add`, `Fix`, `Update`)

3. Copilot will show suggestions - press Tab to accept

### Using Copilot Chat

1. Open Copilot Chat (Ctrl/Cmd + Shift + I)

2. Enter a prompt like:
```
Generate a concise commit message for the currently staged changes starting with a capital letter in English, no prefix needed, under 50 characters, avoiding periods and commas
```

3. Copy the generated message and use it

## Method 3: Using Copilot from Command Line

If you have GitHub CLI (`gh`) installed:

```bash
# Get the diff and send it to Copilot
git diff --cached | gh copilot suggest "Generate a concise commit message starting with capital letter, no prefix, under 50 characters"
```

## Commit Message Best Practices

This project uses the following format:

### Format

**First line:**
- Must start with a capital letter in English
- No prefix (feat:, fix:, etc.) needed
- Describe changes concisely
- Avoid periods, commas, and conjunctions
- Keep it to one sentence under 50 characters

### Examples

```
Add move validation logic
Correct piece flip calculation
Update installation instructions
Implement board state management
Fix visual feedback on piece placement
```

**Bad examples:**
```
feat(game): Add move validation logic.  ❌ (has prefix and period)
add move validation logic  ❌ (starts with lowercase)
Add move validation logic, and update tests  ❌ (has comma and conjunction)
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
