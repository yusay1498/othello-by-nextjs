# Contributing to Othello by Next.js

Thank you for your interest in contributing to this project! This document provides guidelines for contributing.

## Getting Started

### Prerequisites
- Node.js (v20 or later)
- npm or yarn package manager
- Git

### Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/othello-by-nextjs.git
   cd othello-by-nextjs
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Workflow

### Creating a Branch
Create a branch for your feature or fix:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

### Making Changes
1. Make your changes in your feature branch
2. Follow the code style guidelines (see below)
3. Write or update tests if applicable
4. Run linting:
   ```bash
   npm run lint
   ```
5. Build the project to ensure no errors:
   ```bash
   npm run build
   ```

### Code Style Guidelines
- Use TypeScript for all new code
- Follow existing code patterns in the project
- Use Tailwind CSS for styling
- Keep components small and focused
- Add comments for complex logic
- Use meaningful variable and function names

### AI Coding Assistant Constraints
This project includes custom instructions for AI coding assistants (like Claude Code and GitHub Copilot) to ensure consistency:

- **Location:** `.github/copilot-instructions.md`
- **Purpose:** Defines project-specific coding standards, commit message formats, and PR guidelines
- **Key Constraints:**
  - PR titles must be in English
  - PR descriptions and code comments must be in Japanese (日本語)
  - One feature per PR
  - Commit messages follow the format described below

These constraints are automatically loaded by AI coding assistants that support custom instructions. When contributing, please ensure your changes align with these guidelines.

### Commit Messages
Follow this commit message format:

**Format:**
- Write in Japanese (日本語)
- Use conventional commit format: `type(scope): メッセージ`
- Types: feat（機能追加）, fix（バグ修正）, docs（ドキュメント）, style（スタイル）, refactor（リファクタリング）, test（テスト）, chore（雑務）
- Keep messages clear and concise

Examples:
```
feat(game): オセロボードの初期配置を実装
fix(ui): モバイル表示時のレイアウト崩れを修正
refactor(logic): 駒の裏返し処理を最適化
```

#### Using GitHub Copilot for Commit Messages
You can use GitHub Copilot to help generate commit messages. See [.github/COPILOT_COMMIT_GUIDE.md](.github/COPILOT_COMMIT_GUIDE.md) for detailed instructions.

Quick setup:
```bash
# Enable git hooks that work with Copilot
git config core.hooksPath .github/hooks
```

Then when you commit, Copilot will help suggest appropriate commit messages based on your staged changes.

### Submitting a Pull Request
1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a pull request from your fork to the main repository
3. Fill out the pull request template
4. Wait for review and address any feedback

## Code Review Process
- All submissions require review before merging
- Reviewers may request changes or improvements
- Once approved, a maintainer will merge your PR

## Testing
- Write tests for new features
- Ensure existing tests pass
- Test game logic thoroughly
- Consider edge cases

## Reporting Bugs
Use the bug report template when creating an issue. Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)

## Feature Requests
Use the feature request template when proposing new features. Include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach

## Questions?
Feel free to open an issue for questions or discussions.

## License
By contributing, you agree that your contributions will be licensed under the same license as the project.
