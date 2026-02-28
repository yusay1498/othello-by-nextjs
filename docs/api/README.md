# API リファレンス

## 概要

このドキュメントでは、プロジェクト内で使用する全ての関数・型・定数のリファレンスを提供します。

---

## domain/game/types.ts

### 型定義

#### Player
```ts
type Player = "black" | "white";
```
プレイヤーを表す型。

---

#### Cell
```ts
type Cell = Player | null;
```
盤面の1マスの状態。

---

#### Board
```ts
type Board = Cell[];
```
盤面全体（64要素の配列）。

---

#### Position
```ts
type Position = number;
```
盤面上の位置（0-63）。

---

#### Direction
```ts
type Direction = number;
```
8方向の移動量。

---

#### GameState
```ts
type GameState = {
  board: Board;
  currentPlayer: Player;
};
```
ゲームの最小状態。

---

#### GameMode
```ts
type GameMode = "pvp" | "pvc";
```
ゲームモード。

---

#### PlayerColor
```ts
type PlayerColor = "black" | "white";
```
プレイヤーの色。

---

#### GameConfig
```ts
type GameConfig = {
  mode: GameMode;
  userColor: PlayerColor;
};
```
ゲーム開始時の設定。

---

#### GameStatus
```ts
type GameStatus = "playing" | "finished";
```
ゲームの進行状態。

---

#### WinnerResult
```ts
type WinnerResult =
  | { type: "win"; winner: Player; perfect: boolean }
  | { type: "draw" }
  | { type: "playing" };
```
勝敗結果。

---

## domain/game/constants.ts

### 定数

#### BOARD_SIZE
```ts
const BOARD_SIZE: 8;
```
盤面の一辺のサイズ。

---

#### TOTAL_CELLS
```ts
const TOTAL_CELLS: 64;
```
盤面の総マス数。

---

#### DIRECTIONS
```ts
const DIRECTIONS: readonly number[];
// [-9, -8, -7, -1, 1, 7, 8, 9]
```
8方向の移動量。

---

#### CORNERS
```ts
const CORNERS: readonly number[];
// [0, 7, 56, 63]
```
盤面の4つの角。

---

#### POSITION_WEIGHTS
```ts
const POSITION_WEIGHTS: readonly number[];
// [100, -20, 10, ..., 100]
```
AI評価関数用の位置重み（64要素）。

---

## domain/game/board.ts

### 関数

#### createInitialBoard
```ts
function createInitialBoard(): Board
```
初期盤面を生成します。

**戻り値:**
- `Board`: 初期配置の盤面

**例:**
```ts
const board = createInitialBoard();
// board[27] === "white"
// board[28] === "black"
```

---

#### getScore
```ts
function getScore(board: Board): { black: number; white: number }
```
盤面上の黒石と白石の数を数えます。

**引数:**
- `board`: スコアを計算する盤面

**戻り値:**
- オブジェクト形式で黒と白のスコア

**例:**
```ts
const score = getScore(board);
console.log(score); // { black: 2, white: 2 }
```

---

#### getOpponent
```ts
function getOpponent(player: Player): Player
```
相手プレイヤーを返します。

**引数:**
- `player`: 現在のプレイヤー

**戻り値:**
- 相手プレイヤー

**例:**
```ts
const opponent = getOpponent("black"); // "white"
```

---

## domain/game/rules.ts

### 関数

#### getLegalMoves
```ts
function getLegalMoves(state: GameState): Position[]
```
現在のプレイヤーが置ける合法手の一覧を返します。

**引数:**
- `state`: 現在のゲーム状態

**戻り値:**
- 合法手のインデックス配列

**例:**
```ts
const moves = getLegalMoves(state);
console.log(moves); // [19, 26, 37, 44]
```

---

#### applyMove
```ts
function applyMove(state: GameState, index: Position): GameState
```
指定された位置に石を置き、新しいゲーム状態を返します。

**引数:**
- `state`: 現在のゲーム状態
- `index`: 石を置く位置

**戻り値:**
- 新しい`GameState`

**例:**
```ts
const newState = applyMove(state, 19);
```

---

#### isGameOver
```ts
function isGameOver(state: GameState): boolean
```
ゲームが終了しているか判定します。

**引数:**
- `state`: 現在のゲーム状態

**戻り値:**
- `true`: ゲーム終了 / `false`: ゲーム継続

**例:**
```ts
if (isGameOver(state)) {
  console.log("ゲーム終了");
}
```

---

#### isValidMove
```ts
function isValidMove(from: Position, direction: Direction): boolean
```
指定方向への移動が盤面内に収まるか判定します。

**引数:**
- `from`: 開始位置
- `direction`: 移動方向

**戻り値:**
- `true`: 有効 / `false`: 無効

---

## domain/game/winner.ts

### 関数

#### getGameResult
```ts
function getGameResult(board: Board, gameOver: boolean): WinnerResult
```
ゲームの勝敗結果を返します。

**引数:**
- `board`: 判定する盤面
- `gameOver`: ゲーム終了フラグ

**戻り値:**
- `WinnerResult`型のオブジェクト

**例:**
```ts
const result = getGameResult(board, true);
if (result.type === "win") {
  console.log(`${result.winner}の勝ち！`);
}
```

---

## domain/game/ai.ts

### 関数

#### getBestMove
```ts
function getBestMove(state: GameState, depth: number): Position | null
```
最善手を探索して返します。

**引数:**
- `state`: 現在のゲーム状態
- `depth`: 探索深さ（通常は2）

**戻り値:**
- 最善手のインデックス / 合法手がない場合は`null`

**例:**
```ts
const bestMove = getBestMove(state, 2);
if (bestMove !== null) {
  const newState = applyMove(state, bestMove);
}
```

---

#### evaluateBoard
```ts
function evaluateBoard(board: Board, player: Player): number
```
盤面を評価してスコアを返します。

**引数:**
- `board`: 評価する盤面
- `player`: 評価対象のプレイヤー

**戻り値:**
- 評価スコア（高いほど有利）

**例:**
```ts
const score = evaluateBoard(board, "black");
console.log(score); // 50
```

---

## features/game/hooks/useGame.ts

### カスタムHook

#### useGame
```ts
function useGame(config: GameConfig | null): {
  state: GameState;
  config: GameConfig | null;
  legalMoves: Position[];
  score: { black: number; white: number };
  result: WinnerResult;
  isGameOver: boolean;
  isCpuThinking: boolean;
  passPlayer: Player | null;
  handleMove: (index: Position) => void;
  handleRestart: () => void;
  handleBackToMenu: () => void;
}
```
ゲーム全体の状態を管理します。

**引数:**
- `config`: ゲーム設定

**戻り値:**
- ゲーム状態と操作関数

**例:**
```ts
const game = useGame({ mode: "pvp", userColor: "black" });

// 手を打つ
game.handleMove(19);

// リスタート
game.handleRestart();
```

---

## features/game/hooks/useCpuTurn.ts

### カスタムHook

#### useCpuTurn
```ts
function useCpuTurn(
  state: GameState,
  config: GameConfig | null,
  onMove: (index: Position) => void
): void
```
CPU対戦時の自動思考を制御します。

**引数:**
- `state`: 現在のゲーム状態
- `config`: ゲーム設定
- `onMove`: 手を打つコールバック

**例:**
```ts
useCpuTurn(game.state, game.config, game.handleMove);
```

---

## features/game/components/*

### コンポーネント

#### GameContainer
```tsx
function GameContainer(): JSX.Element
```
ゲーム全体のコンテナ。

---

#### ModeSelect
```tsx
interface ModeSelectProps {
  onSelectMode: (config: GameConfig) => void;
}

function ModeSelect(props: ModeSelectProps): JSX.Element
```
ゲームモード選択画面。

---

#### GameInfo
```tsx
interface GameInfoProps {
  currentPlayer: Player;
  score: { black: number; white: number };
  isCpuThinking: boolean;
}

function GameInfo(props: GameInfoProps): JSX.Element
```
手番とスコア表示。

---

#### Board
```tsx
interface BoardProps {
  board: Board;
  legalMoves: Position[];
  onCellClick: (index: Position) => void;
  disabled: boolean;
}

function Board(props: BoardProps): JSX.Element
```
盤面コンポーネント。

---

#### Cell
```tsx
interface CellProps {
  value: Cell;
  isLegal: boolean;
  onClick: () => void;
  disabled: boolean;
}

function Cell(props: CellProps): JSX.Element
```
盤面の1マス。

---

#### PassNotification
```tsx
interface PassNotificationProps {
  player: Player | null;
  duration: number;
}

function PassNotification(props: PassNotificationProps): JSX.Element
```
パス通知トースト。

---

#### GameResult
```tsx
interface GameResultProps {
  result: WinnerResult;
  score: { black: number; white: number };
  onRestart: () => void;
  onBackToMenu: () => void;
}

function GameResult(props: GameResultProps): JSX.Element
```
結果モーダル。

---

## 使用例

### 基本的なゲームフロー

```ts
import { createInitialBoard, getScore, getOpponent } from '@/domain/game/board';
import { getLegalMoves, applyMove, isGameOver } from '@/domain/game/rules';
import { getGameResult } from '@/domain/game/winner';
import { getBestMove } from '@/domain/game/ai';

// 初期化
let state: GameState = {
  board: createInitialBoard(),
  currentPlayer: "black",
};

// ゲームループ
while (!isGameOver(state)) {
  // 合法手を取得
  const legalMoves = getLegalMoves(state);

  if (legalMoves.length === 0) {
    // パス
    state = {
      ...state,
      currentPlayer: getOpponent(state.currentPlayer),
    };
    continue;
  }

  // 手を打つ（人間またはCPU）
  const move = state.currentPlayer === "black"
    ? legalMoves[0] // 人間の手
    : getBestMove(state, 2); // CPUの手

  if (move !== null) {
    state = applyMove(state, move);
  }
}

// 結果表示
const result = getGameResult(state.board, true);
const score = getScore(state.board);
console.log(result, score);
```

---

## 関連ドキュメント

- [型定義詳細](../domain/types.md)
- [ドメイン層](../domain/README.md)
- [Hooks設計](../hooks/README.md)
- [コンポーネント設計](../components/README.md)
