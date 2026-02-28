# 盤面操作 (board.ts)

## 概要

盤面の初期化とスコア計算を担当する純粋関数群です。ゲームルールとは独立した、盤面データの基本的な操作を提供します。

## 関数一覧

### createInitialBoard

```ts
function createInitialBoard(): Board
```

オセロの初期盤面を生成します。

**戻り値:**
- 長さ64の`Board`配列
- 中央4マスに初期配置、それ以外は`null`

**初期配置:**

```
     0   1   2   3   4   5   6   7
   ┌───┬───┬───┬───┬───┬───┬───┬───┐
 0 │   │   │   │   │   │   │   │   │
 1 │   │   │   │   │   │   │   │   │
 2 │   │   │   │   │   │   │   │   │
 3 │   │   │   │ ⚪ │ ⚫ │   │   │
 4 │   │   │   │ ⚫ │ ⚪ │   │   │
 5 │   │   │   │   │   │   │   │   │
 6 │   │   │   │   │   │   │   │   │
 7 │   │   │   │   │   │   │   │   │
   └───┴───┴───┴───┴───┴───┴───┴───┘
```

| インデックス | 座標 | 石 |
|-------------|------|-----|
| 27 | (3, 3) | ⚪ white |
| 28 | (3, 4) | ⚫ black |
| 35 | (4, 3) | ⚫ black |
| 36 | (4, 4) | ⚪ white |

**実装例:**

```ts
export function createInitialBoard(): Board {
  const board: Board = new Array(TOTAL_CELLS).fill(null);

  // 中央4マスに初期配置
  board[27] = "white";  // d4
  board[28] = "black";  // e4
  board[35] = "black";  // d5
  board[36] = "white";  // e5

  return board;
}
```

**使用例:**

```ts
const initialBoard = createInitialBoard();
console.log(initialBoard.length); // 64

// 黒石の数を確認
const blackCount = initialBoard.filter(cell => cell === "black").length;
console.log(blackCount); // 2
```

**テストケース:**

```ts
describe('createInitialBoard', () => {
  test('64マスの配列を返す', () => {
    const board = createInitialBoard();
    expect(board).toHaveLength(64);
  });

  test('初期配置が正しい', () => {
    const board = createInitialBoard();
    expect(board[27]).toBe("white");
    expect(board[28]).toBe("black");
    expect(board[35]).toBe("black");
    expect(board[36]).toBe("white");
  });

  test('それ以外のマスはnull', () => {
    const board = createInitialBoard();
    const filledCells = board.filter(cell => cell !== null);
    expect(filledCells).toHaveLength(4);
  });
});
```

---

### getScore

```ts
function getScore(board: Board): { black: number; white: number }
```

盤面上の黒石と白石の数を数えます。

**引数:**
- `board`: スコアを計算する盤面

**戻り値:**
- オブジェクト形式で黒と白のスコア

**実装例:**

```ts
export function getScore(board: Board): { black: number; white: number } {
  let black = 0;
  let white = 0;

  for (const cell of board) {
    if (cell === "black") {
      black++;
    } else if (cell === "white") {
      white++;
    }
  }

  return { black, white };
}
```

**使用例:**

```ts
const board = createInitialBoard();
const score = getScore(board);
console.log(score); // { black: 2, white: 2 }

// スコア差を計算
const diff = score.black - score.white;
console.log(diff); // 0（引き分け状態）
```

**パフォーマンス考慮:**

```ts
// 最適化版（reduce使用）
export function getScore(board: Board): { black: number; white: number } {
  return board.reduce(
    (acc, cell) => {
      if (cell === "black") acc.black++;
      else if (cell === "white") acc.white++;
      return acc;
    },
    { black: 0, white: 0 }
  );
}
```

**テストケース:**

```ts
describe('getScore', () => {
  test('初期盤面のスコアは2-2', () => {
    const board = createInitialBoard();
    const score = getScore(board);
    expect(score).toEqual({ black: 2, white: 2 });
  });

  test('空の盤面は0-0', () => {
    const board = new Array(64).fill(null);
    const score = getScore(board);
    expect(score).toEqual({ black: 0, white: 0 });
  });

  test('黒だけの盤面', () => {
    const board = new Array(64).fill("black");
    const score = getScore(board);
    expect(score).toEqual({ black: 64, white: 0 });
  });

  test('混在した盤面', () => {
    const board = new Array(64).fill(null);
    board[0] = "black";
    board[1] = "black";
    board[2] = "white";
    const score = getScore(board);
    expect(score).toEqual({ black: 2, white: 1 });
  });
});
```

---

### getOpponent

```ts
function getOpponent(player: Player): Player
```

相手プレイヤーを返します。

**引数:**
- `player`: 現在のプレイヤー（`"black"` または `"white"`）

**戻り値:**
- 相手プレイヤー

**実装例:**

```ts
export function getOpponent(player: Player): Player {
  return player === "black" ? "white" : "black";
}
```

**使用例:**

```ts
const current: Player = "black";
const opponent = getOpponent(current);
console.log(opponent); // "white"

// 手番交代
const nextPlayer = getOpponent(currentPlayer);
```

**テストケース:**

```ts
describe('getOpponent', () => {
  test('blackの相手はwhite', () => {
    expect(getOpponent("black")).toBe("white");
  });

  test('whiteの相手はblack', () => {
    expect(getOpponent("white")).toBe("black");
  });

  test('2回呼ぶと元に戻る', () => {
    const player: Player = "black";
    expect(getOpponent(getOpponent(player))).toBe(player);
  });
});
```

---

## ヘルパー関数（オプション）

### isValidIndex

```ts
function isValidIndex(index: number): boolean
```

インデックスが有効範囲（0-63）内かチェックします。

**実装例:**

```ts
export function isValidIndex(index: number): boolean {
  return index >= 0 && index < TOTAL_CELLS;
}
```

**使用例:**

```ts
if (isValidIndex(position)) {
  const cell = board[position];
}
```

---

### toCoordinates

```ts
function toCoordinates(index: Position): { row: number; col: number }
```

インデックスを(row, col)座標に変換します。

**実装例:**

```ts
export function toCoordinates(index: Position): { row: number; col: number } {
  return {
    row: Math.floor(index / BOARD_SIZE),
    col: index % BOARD_SIZE,
  };
}
```

**使用例:**

```ts
const coord = toCoordinates(19);
console.log(coord); // { row: 2, col: 3 }
```

---

### toIndex

```ts
function toIndex(row: number, col: number): Position
```

(row, col)座標をインデックスに変換します。

**実装例:**

```ts
export function toIndex(row: number, col: number): Position {
  return row * BOARD_SIZE + col;
}
```

**使用例:**

```ts
const index = toIndex(2, 3);
console.log(index); // 19
```

---

## 使用例：フルゲームフロー

```ts
import { createInitialBoard, getScore, getOpponent } from '@/domain/game/board';
import { applyMove } from '@/domain/game/rules';

// ゲーム開始
let state: GameState = {
  board: createInitialBoard(),
  currentPlayer: "black",
};

console.log(getScore(state.board)); // { black: 2, white: 2 }

// 黒が19に打つ
state = applyMove(state, 19);
console.log(getScore(state.board)); // { black: 4, white: 1 }

// applyMoveが手番交代も行う
console.log(state.currentPlayer); // "white"
```

---

## エラーハンドリング

### 防御的プログラミング

```ts
export function getScore(board: Board): { black: number; white: number } {
  // 引数チェック
  if (!board || board.length !== TOTAL_CELLS) {
    throw new Error(`Invalid board: expected ${TOTAL_CELLS} cells`);
  }

  let black = 0;
  let white = 0;

  for (const cell of board) {
    if (cell === "black") {
      black++;
    } else if (cell === "white") {
      white++;
    }
  }

  return { black, white };
}
```

### エラーケース

| エラー | 原因 | 対処 |
|-------|------|------|
| `board.length !== 64` | 不正な盤面 | エラーをスロー |
| `null` / `undefined` board | 未初期化 | エラーをスロー |
| 不正な`Player`値 | 型の誤用 | TypeScriptで防止 |

---

## パフォーマンス最適化

### ベンチマーク

```ts
// 目標パフォーマンス
createInitialBoard():  < 0.1ms
getScore():            < 0.5ms
getOpponent():         < 0.001ms
```

### 最適化のポイント

1. **配列のプリアロケーション**
```ts
// ✅ 良い例
const board = new Array(TOTAL_CELLS);

// ❌ 悪い例
const board = [];
for (let i = 0; i < TOTAL_CELLS; i++) {
  board.push(null);
}
```

2. **不要なコピーを避ける**
```ts
// ✅ 良い例（読み取り専用）
export function getScore(board: Board) {
  // 配列をコピーしない
}

// ❌ 悪い例
export function getScore(board: Board) {
  const copy = [...board]; // 不要なコピー
}
```

---

## 型安全性

### 戻り値の型

```ts
// ✅ 良い例：明示的な型
export function getScore(board: Board): { black: number; white: number } {
  // ...
}

// ❌ 悪い例：型推論に依存
export function getScore(board: Board) {
  // ...
}
```

### 引数の型

```ts
// ✅ 良い例：厳密な型
export function getOpponent(player: Player): Player {
  // ...
}

// ❌ 悪い例：緩い型
export function getOpponent(player: string): string {
  // ...
}
```

---

## 関連ドキュメント

- [ドメイン層概要](./README.md)
- [型定義](./types.md)
- [定数定義](./constants.md)
- [ルール](./rules.md)
- [座標システム（DESIGN.md）](../../DESIGN.md#-座標システム)
