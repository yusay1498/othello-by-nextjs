# 勝敗判定 (winner.ts)

## 概要

ゲームの勝敗を判定するモジュールです。スコアを比較し、勝者・引き分け・ゲーム継続を判定します。

## 関数一覧

### getGameResult

```ts
function getGameResult(board: Board, gameOver: boolean): WinnerResult
```

ゲームの勝敗結果を返します。

**引数:**
- `board`: 判定する盤面
- `gameOver`: ゲーム終了フラグ

**戻り値:**
- `WinnerResult`型のオブジェクト

**実装例:**

```ts
export function getGameResult(
  board: Board,
  gameOver: boolean
): WinnerResult {
  // ゲームが終了していない
  if (!gameOver) {
    return { type: "playing" };
  }

  // スコアを計算
  const score = getScore(board);

  // 引き分け
  if (score.black === score.white) {
    return { type: "draw" };
  }

  // 勝者を決定
  const winner: Player = score.black > score.white ? "black" : "white";

  // パーフェクト勝利の判定
  const perfect = score.black === 64 || score.white === 64;

  return {
    type: "win",
    winner,
    perfect,
  };
}
```

**使用例:**

```ts
const state: GameState = {
  board: createInitialBoard(),
  currentPlayer: "black",
};

// ゲーム終了判定
const gameOver = isGameOver(state);

// 勝敗判定
const result = getGameResult(state.board, gameOver);

switch (result.type) {
  case "playing":
    console.log("ゲーム進行中");
    break;

  case "draw":
    console.log("引き分け");
    break;

  case "win":
    if (result.perfect) {
      console.log(`${result.winner}のパーフェクト勝利！`);
    } else {
      console.log(`${result.winner}の勝ち！`);
    }
    break;
}
```

---

## 結果パターン

### 1. ゲーム進行中

```ts
{
  type: "playing"
}
```

**条件:**
- `gameOver === false`

**表示例:**
- （結果は表示しない）

---

### 2. 引き分け

```ts
{
  type: "draw"
}
```

**条件:**
- `gameOver === true`
- `score.black === score.white`

**表示例:**
```
引き分け (32-32)
```

**発生ケース:**
```ts
const board = new Array(64).fill(null);
for (let i = 0; i < 32; i++) {
  board[i] = "black";
  board[i + 32] = "white";
}

const result = getGameResult(board, true);
console.log(result); // { type: "draw" }
```

---

### 3. 通常の勝利

```ts
{
  type: "win",
  winner: "black" | "white",
  perfect: false
}
```

**条件:**
- `gameOver === true`
- `score.black !== score.white`
- 相手の石が1個以上残っている

**表示例:**
```
黒の勝ち！ (40-24)
白の勝ち！ (35-29)
```

**発生ケース:**
```ts
const board = new Array(64).fill(null);
for (let i = 0; i < 40; i++) {
  board[i] = "black";
}
for (let i = 40; i < 64; i++) {
  board[i] = "white";
}

const result = getGameResult(board, true);
console.log(result);
// {
//   type: "win",
//   winner: "black",
//   perfect: false
// }
```

---

### 4. パーフェクト勝利

```ts
{
  type: "win",
  winner: "black" | "white",
  perfect: true
}
```

**条件:**
- `gameOver === true`
- `score.black === 64` または `score.white === 64`
- 相手の石が0個

**表示例:**
```
黒のパーフェクト勝利！ (64-0)
白のパーフェクト勝利！ (64-0)
```

**発生ケース:**
```ts
const board = new Array(64).fill("black");

const result = getGameResult(board, true);
console.log(result);
// {
//   type: "win",
//   winner: "black",
//   perfect: true
// }
```

---

## テストケース

```ts
describe('getGameResult', () => {
  describe('ゲーム進行中', () => {
    test('gameOver=falseの場合はplaying', () => {
      const board = createInitialBoard();
      const result = getGameResult(board, false);

      expect(result).toEqual({ type: "playing" });
    });
  });

  describe('引き分け', () => {
    test('同点の場合はdraw', () => {
      const board = new Array(64).fill(null);
      for (let i = 0; i < 32; i++) {
        board[i] = "black";
        board[i + 32] = "white";
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({ type: "draw" });
    });
  });

  describe('通常の勝利', () => {
    test('黒の勝ち', () => {
      const board = new Array(64).fill(null);
      for (let i = 0; i < 40; i++) {
        board[i] = "black";
      }
      for (let i = 40; i < 64; i++) {
        board[i] = "white";
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "black",
        perfect: false,
      });
    });

    test('白の勝ち', () => {
      const board = new Array(64).fill(null);
      for (let i = 0; i < 30; i++) {
        board[i] = "black";
      }
      for (let i = 30; i < 64; i++) {
        board[i] = "white";
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "white",
        perfect: false,
      });
    });
  });

  describe('パーフェクト勝利', () => {
    test('黒のパーフェクト', () => {
      const board = new Array(64).fill("black");

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "black",
        perfect: true,
      });
    });

    test('白のパーフェクト', () => {
      const board = new Array(64).fill("white");

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "white",
        perfect: true,
      });
    });
  });
});
```

---

## UI表示への変換

### 結果メッセージの生成

```ts
function getResultMessage(
  result: WinnerResult,
  score: { black: number; white: number }
): string {
  switch (result.type) {
    case "playing":
      return "";

    case "draw":
      return `引き分け (${score.black}-${score.white})`;

    case "win":
      const winnerText = result.winner === "black" ? "黒" : "白";
      if (result.perfect) {
        return `${winnerText}のパーフェクト勝利！ (64-0)`;
      }
      return `${winnerText}の勝ち！ (${score.black}-${score.white})`;
  }
}
```

**使用例:**

```ts
const result = getGameResult(board, true);
const score = getScore(board);
const message = getResultMessage(result, score);

console.log(message); // "黒の勝ち！ (40-24)"
```

---

## エッジケース

### ケース1: 盤面が満杯でない終了

```ts
// 両者とも置けない状態
const board = new Array(64).fill(null);
board[0] = "black";
board[63] = "white";

const result = getGameResult(board, true);
// どちらも1個ずつなので判定可能
```

### ケース2: 片方の石が0個

```ts
// 白が全て黒に変わった
const board = new Array(64).fill("black");

const result = getGameResult(board, true);
// { type: "win", winner: "black", perfect: true }
```

### ケース3: gameOver判定の誤り

```ts
// gameOver=falseなのに満杯
const board = new Array(64).fill("black");
const result = getGameResult(board, false);

// 常に { type: "playing" } を返す（gameOverを優先）
```

---

## パフォーマンス

### 目標

```
getGameResult(): < 1ms
```

### 最適化

```ts
// スコア計算は1回のみ
export function getGameResult(
  board: Board,
  gameOver: boolean
): WinnerResult {
  if (!gameOver) {
    return { type: "playing" };
  }

  const score = getScore(board); // 1回だけ呼ぶ

  if (score.black === score.white) {
    return { type: "draw" };
  }

  const winner: Player = score.black > score.white ? "black" : "white";
  const perfect = score.black === 64 || score.white === 64;

  return { type: "win", winner, perfect };
}
```

---

## 型安全性

### パターンマッチング

TypeScriptの判別可能なユニオン型により、型安全にパターンマッチングできます：

```ts
function handleResult(result: WinnerResult): void {
  switch (result.type) {
    case "playing":
      // result.winner はアクセス不可（コンパイルエラー）
      break;

    case "draw":
      // result.winner はアクセス不可（コンパイルエラー）
      break;

    case "win":
      // result.winner, result.perfect にアクセス可能
      console.log(result.winner);
      console.log(result.perfect);
      break;

    default:
      // すべてのケースを網羅していることをチェック
      const exhaustive: never = result;
      throw new Error(`未処理のケース: ${exhaustive}`);
  }
}
```

---

## 使用例：完全なゲームフロー

```ts
import { createInitialBoard, getScore } from './board';
import { applyMove, isGameOver } from './rules';
import { getGameResult } from './winner';

// ゲーム開始
let state: GameState = {
  board: createInitialBoard(),
  currentPlayer: "black",
};

// ゲームループ
while (true) {
  // 手を打つ
  const legalMoves = getLegalMoves(state);
  if (legalMoves.length > 0) {
    state = applyMove(state, legalMoves[0]);
  }

  // 終了判定
  const gameOver = isGameOver(state);
  if (gameOver) {
    break;
  }
}

// 勝敗判定
const result = getGameResult(state.board, true);
const score = getScore(state.board);

console.log(getResultMessage(result, score));
```

---

## 関連ドキュメント

- [ドメイン層概要](./README.md)
- [型定義](./types.md)
- [盤面操作](./board.md)
- [ルール](./rules.md)
- [エッジケース（DESIGN.md）](../../DESIGN.md#-エッジケース)
