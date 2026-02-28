# Othello by Next.js

A modern implementation of the classic Othello (Reversi) board game built with Next.js, React, and TypeScript.

## 🎮 About Othello

Othello is a strategy board game for two players, played on an 8×8 board. Players take turns placing pieces with their assigned color facing up. During a play, any pieces of the opponent's color that are between the new piece and any existing pieces of the current player's color are turned over to the current player's color.

## ✨ Features

- Modern web-based Othello game
- Built with Next.js 16 and React 19
- TypeScript for type safety
- Responsive design with Tailwind CSS
- Fast and optimized performance

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yusay1498/othello-by-nextjs.git
cd othello-by-nextjs
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/)
- **UI Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Linting:** [ESLint](https://eslint.org/)

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 📚 Documentation

Comprehensive documentation is available in Japanese:

- **[設計書 (Design Document)](DESIGN.md)** - Complete specification and design decisions
- **[ドメイン層 (Domain Layer)](docs/domain/README.md)** - Business logic and game rules
  - [型定義 (Types)](docs/domain/types.md)
  - [定数 (Constants)](docs/domain/constants.md)
  - [盤面操作 (Board)](docs/domain/board.md)
  - [ルール (Rules)](docs/domain/rules.md)
  - [AI](docs/domain/ai.md)
  - [勝敗判定 (Winner)](docs/domain/winner.md)
- **[コンポーネント (Components)](docs/components/README.md)** - UI component design
- **[Hooks](docs/hooks/README.md)** - Custom hooks for state management
- **[アーキテクチャ (Architecture)](docs/architecture/README.md)** - System architecture
- **[テスト戦略 (Testing)](docs/testing/README.md)** - Testing strategy and examples
- **[API リファレンス (API Reference)](docs/api/README.md)** - Complete API documentation

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic Othello/Reversi board game
- Built with modern web technologies

## 📧 Contact

Project Link: [https://github.com/yusay1498/othello-by-nextjs](https://github.com/yusay1498/othello-by-nextjs)
