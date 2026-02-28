# Othello by Next.js

Next.js、React、TypeScriptで構築された、モダンなオセロ（リバーシ）ボードゲームの実装です。

## 🎮 オセロについて

オセロは2人用の戦略ボードゲームで、8×8のボードで行われます。プレイヤーは交互に自分の色の駒を置いていきます。新しい駒と既存の駒の間に挟まれた相手の駒は、すべて自分の色に裏返されます。

## ✨ 機能

- モダンなWebベースのオセロゲーム
- Next.js 16とReact 19で構築
- TypeScriptによる型安全性
- Tailwind CSSによるレスポンシブデザイン
- 高速で最適化されたパフォーマンス

## 🚀 はじめ方

### 前提条件

- Node.js 24.x以降
- npm、yarn、またはpnpm

### インストール

1. リポジトリをクローン:
```bash
git clone https://github.com/yusay1498/othello-by-nextjs.git
cd othello-by-nextjs
```

2. 依存関係をインストール:
```bash
npm install
# または
yarn install
# または
pnpm install
```

3. 開発サーバーを起動:
```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

4. ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認します。

## 🛠️ 技術スタック

- **フレームワーク:** [Next.js 16](https://nextjs.org/)
- **UIライブラリ:** [React 19](https://react.dev/)
- **言語:** [TypeScript](https://www.typescriptlang.org/)
- **スタイリング:** [Tailwind CSS](https://tailwindcss.com/)
- **リンティング:** [ESLint](https://eslint.org/)

## 📝 利用可能なスクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - 本番用にアプリケーションをビルド
- `npm run start` - 本番サーバーを起動
- `npm run lint` - ESLintでコード品質をチェック

## 📚 ドキュメント

包括的なドキュメントが日本語で提供されています：

- **[設計書](DESIGN.md)** - 完全な仕様と設計決定
- **[ドキュメント索引](docs/README.md)** - ドキュメント全体のナビゲーションガイド
- **[ドメイン層](docs/domain/README.md)** - ビジネスロジックとゲームルール
  - [型定義](docs/domain/types.md)
  - [定数](docs/domain/constants.md)
  - [盤面操作](docs/domain/board.md)
  - [ルール](docs/domain/rules.md)
  - [AI](docs/domain/ai.md)
  - [勝敗判定](docs/domain/winner.md)
- **[コンポーネント](docs/components/README.md)** - UIコンポーネント設計
- **[Hooks](docs/hooks/README.md)** - 状態管理用カスタムフック
- **[アーキテクチャ](docs/architecture/README.md)** - システムアーキテクチャ
- **[テスト戦略](docs/testing/README.md)** - テスト戦略と例
- **[APIリファレンス](docs/api/README.md)** - 完全なAPIドキュメント

## 🤝 コントリビューション

コントリビューションを歓迎します！詳細については[CONTRIBUTING.md](CONTRIBUTING.md)をお読みください。

### GitHub Copilotでコミットメッセージを生成

GitHub Copilotを使用してコミットメッセージを自動生成できます。詳しくは[Copilotコミットガイド](.github/COPILOT_COMMIT_GUIDE.md)をご覧ください。

## 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

- クラシックなオセロ/リバーシボードゲームにインスパイアされています
- モダンなWeb技術で構築されています

## 📧 連絡先

プロジェクトリンク: [https://github.com/yusay1498/othello-by-nextjs](https://github.com/yusay1498/othello-by-nextjs)
