#!/bin/bash

# Setup script for GitHub Copilot commit message integration
# このスクリプトは、GitHub Copilotを使用したコミットメッセージ生成を設定します

echo "GitHub Copilot コミットメッセージ統合のセットアップ"
echo "Setting up GitHub Copilot commit message integration"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ エラー: Gitリポジトリではありません"
    echo "❌ Error: Not a git repository"
    exit 1
fi

# Configure git to use the custom hooks directory
echo "📝 Gitフックパスを設定中..."
echo "📝 Configuring git hooks path..."

git config core.hooksPath .github/hooks

if [ $? -eq 0 ]; then
    echo "✅ Gitフックパスが正常に設定されました"
    echo "✅ Git hooks path configured successfully"
    echo ""
    echo "設定されたパス / Configured path: .github/hooks"
    echo ""
    echo "これで、コミット時にGitHub Copilotがコミットメッセージの提案を行います"
    echo "Now GitHub Copilot will suggest commit messages when you commit"
    echo ""
    echo "使用方法 / Usage:"
    echo "  1. git add <files>      # ファイルをステージング / Stage your files"
    echo "  2. git commit           # コミットを実行 / Run commit"
    echo "  3. Copilotの提案を確認 / Review Copilot's suggestions"
    echo ""
    echo "詳細なガイドについては .github/COPILOT_COMMIT_GUIDE.md をご覧ください"
    echo "For detailed guide, see .github/COPILOT_COMMIT_GUIDE.md"
else
    echo "❌ エラー: Gitフックパスの設定に失敗しました"
    echo "❌ Error: Failed to configure git hooks path"
    exit 1
fi
