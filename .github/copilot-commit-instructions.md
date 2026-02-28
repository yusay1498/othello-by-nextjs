# Copilot Commit Message Generation Instructions

このファイルはVSCodeのGitHub Copilotがコミットメッセージを生成する際の指示を定義します。

## Format Rules

- Write in English with the first letter capitalized
- Do NOT use prefixes like feat:, fix:, docs:, etc.
- Describe the change concisely in one sentence
- Avoid periods, commas, and conjunctions
- Keep the message under 50 characters

## Message Guidelines

- Start with a capital letter
- Use imperative mood (Add, Fix, Update, Remove, etc.)
- Be specific about what changed
- One sentence only

## Examples

Good examples:
- `Add initial board layout for Othello`
- `Fix mobile layout issue`
- `Update ESLint configuration`
- `Remove unused imports`
- `Refactor flip logic for better performance`

Bad examples:
- `feat(game): Add initial board layout` ❌ (has prefix)
- `add initial board layout` ❌ (lowercase first letter)
- `Added initial board layout.` ❌ (past tense, has period)
- `Add initial board layout, update styles, and fix bugs` ❌ (too long, has commas and conjunctions)
