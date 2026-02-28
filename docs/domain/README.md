# ドメイン層設計

## 概要

ドメイン層はオセロゲームの核となるビジネスロジックを実装する層です。React非依存の純粋関数で構成され、UIとは完全に分離されています。

## 設計原則

### 1. 純粋関数主義

- すべての関数は副作用を持たない
- 同じ入力に対して常に同じ出力を返す
- 状態を直接変更せず、新しい状態を生成して返す

### 2. 不変性の徹底

```ts
// ✅ 良い例：新しい配列を返す
function applyMove(state: GameState, index: Position): GameState {
  return {
    ...state,
    board: [...state.board],
  };
}

// ❌ 悪い例：元の配列を変更
function applyMove(state: GameState, index: Position): GameState {
  state.board[index] = state.currentPlayer;
  return state;
}
```

### 3. 単一責任の原則（SRP）

各モジュールは1つの責務のみを持ちます：

- **board.ts**: 盤面の初期化とスコア計算
- **rules.ts**: ゲームルールと合法手判定
- **winner.ts**: 勝敗判定
- **ai.ts**: CPU思考ロジック

## ファイル構成

```
domain/game/
├── types.ts        # 型定義
├── constants.ts    # 定数定義
├── board.ts        # 盤面操作
├── rules.ts        # ルール・合法手
├── ai.ts           # CPU思考
└── winner.ts       # 勝敗判定
```

## モジュール詳細

### [types.ts](./types.md)

ドメイン層で使用する全ての型定義を含みます。

主な型：
- `Player`: プレイヤーを表す型
- `Cell`: 盤面の1マスの状態
- `Board`: 盤面全体
- `GameState`: ゲームの最小状態
- `WinnerResult`: 勝敗結果

### [constants.ts](./constants.md)

ゲーム全体で使用する定数を定義します。

主な定数：
- `BOARD_SIZE`: 盤面のサイズ（8x8）
- `DIRECTIONS`: 8方向の移動ベクトル
- `POSITION_WEIGHTS`: AI評価関数用の位置重み

### [board.ts](./board.md)

盤面の初期化とスコア計算を担当します。

主な関数：
- `createInitialBoard()`: 初期盤面を生成
- `getScore(board)`: 黒白のスコアを計算
- `getOpponent(player)`: 相手プレイヤーを取得

### [rules.ts](./rules.md)

オセロのゲームルールを実装します。

主な関数：
- `getLegalMoves(state)`: 合法手一覧を取得
- `applyMove(state, index)`: 手を打って新しい状態を返す
- `isGameOver(state)`: ゲーム終了判定
- `isValidMove(from, direction)`: 移動の有効性チェック

### [winner.ts](./winner.md)

勝敗判定を担当します。

主な関数：
- `getGameResult(board, gameOver)`: 勝敗結果を返す

### [ai.ts](./ai.md)

CPU対戦時の思考ロジックを実装します。

主な関数：
- `getBestMove(state, depth)`: 最善手を探索
- `evaluateBoard(board, player)`: 盤面を評価

## データフロー

```
UI層
  ↓ (イベント)
hooks層
  ↓ (GameState)
domain層（純粋関数）
  ↓ (新しいGameState)
hooks層
  ↓ (状態更新)
UI層（再レンダリング）
```

## テスト方針

ドメイン層はReact非依存のため、Vitestを使用して純粋関数としてテストします。

### テスト観点

1. **正常系**
   - 初期盤面の正しい生成
   - 合法手の正確な判定
   - 石の正しい裏返し

2. **異常系**
   - 不正な位置への着手
   - 範囲外のインデックス
   - null/undefinedの処理

3. **境界値**
   - 盤面の角（0, 7, 56, 63）
   - 盤面の端
   - 満杯の盤面

4. **エッジケース**
   - 合法手なし（パス）
   - 両者パス（ゲーム終了）
   - パーフェクト勝利

### カバレッジ目標

- ステートメントカバレッジ: > 80%
- ブランチカバレッジ: > 75%
- 関数カバレッジ: 100%

## 使用例

```ts
import { createInitialBoard, getScore } from '@/domain/game/board';
import { getLegalMoves, applyMove, isGameOver } from '@/domain/game/rules';
import { getGameResult } from '@/domain/game/winner';

// ゲーム開始
const initialState: GameState = {
  board: createInitialBoard(),
  currentPlayer: 'black',
};

// 合法手を取得
const legalMoves = getLegalMoves(initialState);
console.log('合法手:', legalMoves); // [19, 26, 37, 44]

// 手を打つ
const newState = applyMove(initialState, 19);

// スコアを取得
const score = getScore(newState.board);
console.log('スコア:', score); // { black: 4, white: 1 }

// ゲーム終了判定
const gameOver = isGameOver(newState);

// 勝敗判定
const result = getGameResult(newState.board, gameOver);
console.log('結果:', result); // { type: 'playing' }
```

## 拡張性の考慮

### 評価関数の差し替え

AI層は内部で評価関数を切り替え可能な設計になっています。
公開APIとしては、`state` と探索深さ `depth` を渡すだけで最善手を取得できます：

```ts
// 評価関数は AI モジュール内部で使用される
const bestMove = getBestMove(state, 2);
```

将来的に評価関数をカスタマイズする場合は、AI モジュール内で評価関数を切り替えるか、オプショナルな第3引数として評価関数を受け取るように拡張できます。

### 新しいゲームモードの追加

インターフェースを変更せずに新しいモードを追加できます：

```ts
export type GameMode = "pvp" | "pvc" | "cvc"; // CPU vs CPU追加
```

## パフォーマンス考慮事項

### 最適化のポイント

1. **合法手判定の効率化**
   - 早期リターンを活用
   - 不要な計算をスキップ

2. **配列コピーの最小化**
   - 必要な場合のみコピー
   - スプレッド演算子の適切な使用

3. **ミニマックス探索の最適化**
   - アルファベータ枝刈り（将来の拡張）
   - 探索深さの制限

### ベンチマーク目標

- `getLegalMoves()`: < 1ms
- `applyMove()`: < 1ms
- `getBestMove(depth=2)`: < 2000ms

## 関連ドキュメント

- [型定義詳細](./types.md)
- [定数定義詳細](./constants.md)
- [盤面操作詳細](./board.md)
- [ルール詳細](./rules.md)
- [AI詳細](./ai.md)
- [勝敗判定詳細](./winner.md)
