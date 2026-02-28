# オセロ フロントアプリ ドキュメント

## 📋 目次

このドキュメント群は、オセロゲームの完全な設計と実装ガイドを提供します。

### 🎯 全体設計

- **[DESIGN.md](../DESIGN.md)** - プロジェクト全体の設計書
  - プロジェクト概要
  - 要件定義
  - 設計方針（SOLID原則、最小状態主義）
  - アーキテクチャ（DDD + Bulletproof）
  - 座標システム
  - エッジケース
  - 状態遷移
  - 非機能要件
  - 用語集
  - 決定事項まとめ

### 🧩 ドメイン層（ビジネスロジック）

- **[domain/README.md](domain/README.md)** - ドメイン層の概要
  - 設計原則（純粋関数、不変性）
  - ファイル構成
  - データフロー
  - テスト方針

- **[domain/types.md](domain/types.md)** - 型定義
  - Player, Cell, Board, Position
  - GameState（最小状態主義）
  - WinnerResult（判別可能なユニオン型）
  - 型の使用ガイドライン

- **[domain/constants.md](domain/constants.md)** - 定数定義
  - BOARD_SIZE, TOTAL_CELLS
  - DIRECTIONS（8方向ベクトル）
  - CORNERS（角のインデックス）
  - POSITION_WEIGHTS（AI評価用）

- **[domain/board.md](domain/board.md)** - 盤面操作
  - createInitialBoard() - 初期盤面生成
  - getScore() - スコア計算
  - getOpponent() - 相手プレイヤー取得

- **[domain/rules.md](domain/rules.md)** - ゲームルール
  - getLegalMoves() - 合法手判定
  - applyMove() - 石の配置と裏返し
  - isGameOver() - ゲーム終了判定
  - パス処理の自動化

- **[domain/ai.md](domain/ai.md)** - AI思考
  - getBestMove() - ミニマックス探索
  - evaluateBoard() - 盤面評価
  - 探索深さとAI強度
  - 最適化（アルファベータ枝刈り）

- **[domain/winner.md](domain/winner.md)** - 勝敗判定
  - getGameResult() - 勝敗結果の判定
  - 勝利・引き分け・パーフェクト勝利
  - 型安全なパターンマッチング

### 🎨 プレゼンテーション層

- **[components/README.md](components/README.md)** - コンポーネント設計
  - GameContainer - 全体統合
  - ModeSelect - モード選択
  - GameInfo - 情報表示
  - Board - 盤面
  - Cell - マス
  - PassNotification - パス通知
  - GameResult - 結果モーダル
  - レスポンシブ対応
  - アクセシビリティ

### 🎣 アプリケーション層

- **[hooks/README.md](hooks/README.md)** - カスタムHooks
  - useGame - ゲーム状態管理
  - useCpuTurn - CPU思考制御
  - Hooksのベストプラクティス
  - テスト方法

### 🏗 アーキテクチャ

- **[architecture/README.md](architecture/README.md)** - システムアーキテクチャ
  - レイヤー構成（Domain / Application / Presentation）
  - ディレクトリ構造
  - レイヤーごとの責務
  - データフロー
  - 依存関係のルール
  - 設計パターン
  - スケーラビリティ

### 🧪 テスト

- **[testing/README.md](testing/README.md)** - テスト戦略
  - テスト方針とツール
  - カバレッジ目標
  - ドメイン層のテスト例
  - Hooks層のテスト例
  - コンポーネント層のテスト例
  - 統合テスト
  - CI/CD統合

---

## 📚 ドキュメントの読み方

### 初めての方

1. **[DESIGN.md](../DESIGN.md)** - まずは全体像を把握
2. **[architecture/README.md](architecture/README.md)** - アーキテクチャを理解
3. **[domain/README.md](domain/README.md)** - ドメイン層の設計思想を学ぶ

### 実装者向け

1. **[domain/types.md](domain/types.md)** - 型定義を確認
2. **[domain/board.md](domain/board.md)** から順番に実装
3. **[testing/README.md](testing/README.md)** - テストを書く

### コンポーネント開発者向け

1. **[components/README.md](components/README.md)** - コンポーネント設計を確認
2. **[hooks/README.md](hooks/README.md)** - 状態管理を理解
3. **[domain/types.md](domain/types.md)** - 型定義を参照

---

## 🎯 設計の重要ポイント

### 1. 最小状態主義

GameStateに含めるのは`board`と`currentPlayer`のみ。他は導出可能。

```ts
// ✅ 正しい
type GameState = {
  board: Board;
  currentPlayer: Player;
};

// ❌ 冗長
type GameState = {
  board: Board;
  currentPlayer: Player;
  legalMoves: Position[]; // 導出可能
  score: { black: number; white: number }; // 導出可能
};
```

### 2. 純粋関数中心

ドメイン層は副作用なしの純粋関数のみ。

```ts
// ✅ 純粋関数
export function applyMove(state: GameState, index: Position): GameState {
  return { ...state, board: newBoard };
}

// ❌ 副作用あり
export function applyMove(state: GameState, index: Position) {
  state.board[index] = state.currentPlayer; // 直接変更
  console.log("Move applied"); // 副作用
}
```

### 3. UIとドメインの分離

```
UI層 → Hooks層 → Domain層
(React) (状態管理) (ビジネスロジック)
```

---

## 🔄 実装の流れ

### フェーズ1: ドメイン層

1. `types.ts` - 型定義
2. `constants.ts` - 定数
3. `board.ts` - 盤面操作
4. `rules.ts` - ルール
5. `winner.ts` - 勝敗判定
6. `ai.ts` - AI（後回し可）

**各ステップでテストを書く！**

### フェーズ2: Hooks層

1. `useGame.ts` - 状態管理
2. `useCpuTurn.ts` - CPU制御

### フェーズ3: コンポーネント層

1. `Cell.tsx` - 最小単位
2. `Board.tsx` - セルの集合
3. `GameInfo.tsx` - 情報表示
4. `ModeSelect.tsx` - モード選択
5. `GameResult.tsx` - 結果表示
6. `PassNotification.tsx` - 通知
7. `GameContainer.tsx` - 統合

### フェーズ4: 統合・テスト

1. 統合テスト
2. E2Eテスト（オプション）
3. パフォーマンステスト

---

## 📊 ドキュメント構成図

```
othello-by-nextjs/
├── DESIGN.md                      # 全体設計書
├── README.md                      # プロジェクト README
│
└── docs/
    ├── README.md                  # このファイル
    │
    ├── domain/                    # ドメイン層
    │   ├── README.md             # 概要
    │   ├── types.md              # 型定義
    │   ├── constants.md          # 定数
    │   ├── board.md              # 盤面
    │   ├── rules.md              # ルール
    │   ├── ai.md                 # AI
    │   └── winner.md             # 勝敗判定
    │
    ├── components/               # コンポーネント層
    │   └── README.md
    │
    ├── hooks/                    # Hooks層
    │   └── README.md
    │
    ├── architecture/             # アーキテクチャ
    │   └── README.md
    │
    └── testing/                  # テスト戦略
        └── README.md
```

---

## 🛠 実装時の注意点

### ドメイン層

- React非依存で実装
- すべての関数は純粋関数
- 状態の直接変更は禁止
- テストカバレッジ80%以上

### Hooks層

- useMemo/useCallbackで最適化
- useEffectのcleanupを忘れずに
- 依存配列を正確に

### コンポーネント層

- ビジネスロジックを含めない
- Propsでデータを受け取る
- イベントハンドラーを呼ぶだけ

---

## 📞 サポート

質問や提案がある場合：

1. [GitHub Issues](https://github.com/yusay1498/othello-by-nextjs/issues)
2. [Pull Request](https://github.com/yusay1498/othello-by-nextjs/pulls)

---

## 📅 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-02-28 | 初版作成 |
