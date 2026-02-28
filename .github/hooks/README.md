# Git Hooks

このディレクトリには、GitHub Copilotとの統合を支援するGitフックが含まれています。

This directory contains Git hooks to assist with GitHub Copilot integration.

## Available Hooks / 利用可能なフック

### prepare-commit-msg

コミットメッセージエディタが開く前に実行され、GitHub Copilotがより良い提案を行えるようコンテキストを提供します。

Runs before the commit message editor opens and provides context for GitHub Copilot to make better suggestions.

**Features / 機能:**
- Adds staged changes summary to commit message template / ステージされた変更の概要をコミットメッセージテンプレートに追加
- Includes Conventional Commits guidelines / Conventional Commitsガイドラインを含む
- Bilingual (Japanese/English) guidance / 日英バイリンガルガイダンス

## Setup / セットアップ

Run the setup script / セットアップスクリプトを実行:

```bash
./.github/scripts/setup-copilot-commits.sh
```

Or manually configure / または手動で設定:

```bash
git config core.hooksPath .github/hooks
```

## Usage / 使用方法

After setup, commit as usual / セットアップ後、通常通りコミット:

```bash
git add <files>
git commit
```

Your editor will open with context comments that GitHub Copilot can use to suggest an appropriate commit message.

エディタが開き、GitHub Copilotが適切なコミットメッセージを提案するためのコンテキストコメントが表示されます。

## Documentation / ドキュメント

For detailed usage instructions, see [COPILOT_COMMIT_GUIDE.md](../COPILOT_COMMIT_GUIDE.md)

詳細な使用方法については、[COPILOT_COMMIT_GUIDE.md](../COPILOT_COMMIT_GUIDE.md)をご覧ください。
