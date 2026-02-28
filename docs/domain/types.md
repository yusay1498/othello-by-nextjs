# 型定義 (types.ts)

## 概要

ドメイン層で使用する全ての型定義を一元管理するファイルです。TypeScriptの型システムを活用し、型安全性を確保します。

## 基本型

### Player

```ts
export type Player = "black" | "white";
```

プレイヤーを表すユニオン型です。

**使用例:**
```ts
const currentPlayer: Player = "black";
const opponent: Player = getOpponent(currentPlayer); // "white"
```

**設計上の決定:**
- 文字列リテラル型を使用することで、タイポを防ぎIDEの補完を有効化
- boolean（true/false）ではなく明示的な値を使用し、可読性を向上

---

### Cell

```ts
export type Cell = Player | null;
```

盤面の1マスの状態を表す型です。

**値の意味:**
- `"black"`: 黒石が置かれている
- `"white"`: 白石が置かれている
- `null`: 空のマス

**使用例:**
```ts
const cell: Cell = board[index];

if (cell === null) {
  console.log("空のマス");
} else {
  console.log(`${cell}の石`);
}
```

---

### Board

```ts
export type Board = Cell[];
```

盤面全体を表す1次元配列です。

**仕様:**
- 長さは常に64（8x8）
- インデックス0-63で各マスを表現

**座標変換:**
```ts
// (row, col) → index
const index = row * 8 + col;

// index → (row, col)
const row = Math.floor(index / 8);
const col = index % 8;
```

**使用例:**
```ts
const board: Board = createInitialBoard();
console.log(board.length); // 64

// 特定の位置の石を取得
const centerCell = board[27]; // d4の位置
```

**設計上の決定:**
- 1次元配列を採用（2次元配列ではない）
- インデックス計算がシンプル
- メモリ効率が良い
- 型レベルで長さ64を強制しない（実装の柔軟性を優先）

---

### Position

```ts
export type Position = number;
```

盤面上の位置を表すインデックス型です。

**範囲:** 0-63

**使用例:**
```ts
const position: Position = 19;
const isValid = position >= 0 && position < 64;
```

**設計上の決定:**
- `number`のエイリアスとして定義
- 意味を明確化し、コードの可読性を向上
- 型レベルで0-63を強制しない（ランタイムチェックで対応）

---

### Direction

```ts
export type Direction = number;
```

8方向の移動量を表す型です。

**有効な値:**
- `-9`: 左上
- `-8`: 上
- `-7`: 右上
- `-1`: 左
- `+1`: 右
- `+7`: 左下
- `+8`: 下
- `+9`: 右下

**使用例:**
```ts
import { DIRECTIONS } from './constants';

for (const direction of DIRECTIONS) {
  const next = current + direction;
  // 処理...
}
```

---

## ゲーム状態型

### GameState

```ts
export type GameState = {
  board: Board;
  currentPlayer: Player;
};
```

ゲームの最小状態を表す型です。

**フィールド:**
- `board`: 現在の盤面
- `currentPlayer`: 現在の手番

**使用例:**
```ts
const state: GameState = {
  board: createInitialBoard(),
  currentPlayer: "black",
};

const newState = applyMove(state, 19);
```

**設計上の決定（最小状態主義）:**

含めるもの：
- ✅ `board`: 盤面の状態
- ✅ `currentPlayer`: 現在の手番

含めないもの（導出可能）：
- ❌ `winner`: `getGameResult()`で導出
- ❌ `legalMoves`: `getLegalMoves()`で導出
- ❌ `score`: `getScore()`で導出
- ❌ `gameOver`: `isGameOver()`で導出

**メリット:**
- 状態の不整合を防ぐ
- 更新箇所が最小限
- テストが容易

---

## ゲーム設定型

### GameMode

```ts
export type GameMode = "pvp" | "pvc";
```

ゲームモードを表す型です。

**値の意味:**
- `"pvp"`: Player vs Player（2人対戦）
- `"pvc"`: Player vs CPU（CPU対戦）

**将来の拡張:**
```ts
// CPU vs CPUモードの追加例
export type GameMode = "pvp" | "pvc" | "cvc";
```

---

### PlayerColor

```ts
export type PlayerColor = "black" | "white";
```

プレイヤーが選択する色を表す型です。

**Note:** `Player`型と同じ定義ですが、意味的に区別するため別名で定義しています。

---

### GameConfig

```ts
export type GameConfig = {
  mode: GameMode;
  userColor: PlayerColor;
};
```

ゲーム開始時の設定を表す型です。

**フィールド:**
- `mode`: ゲームモード（PvP / PvC）
- `userColor`: CPU対戦時に人間が担当する色

**使用例:**
```ts
const config: GameConfig = {
  mode: "pvc",
  userColor: "black", // 人間が黒、CPUが白
};
```

---

### GameStatus

```ts
export type GameStatus = "playing" | "finished";
```

ゲームの進行状態を表す型です。

**値の意味:**
- `"playing"`: ゲーム進行中
- `"finished"`: ゲーム終了

**使用例:**
```ts
const status: GameStatus = isGameOver(state) ? "finished" : "playing";

if (status === "playing") {
  // クリック可能
}
```

---

## 結果型

### WinnerResult

```ts
export type WinnerResult =
  | { type: "win"; winner: Player; perfect: boolean }
  | { type: "draw" }
  | { type: "playing" };
```

ゲームの勝敗結果を表す判別可能なユニオン型です。

**バリアント:**

#### 1. 勝利
```ts
{
  type: "win";
  winner: Player;     // 勝者（"black" | "white"）
  perfect: boolean;   // パーフェクト勝利か（64-0）
}
```

**使用例:**
```ts
const result: WinnerResult = {
  type: "win",
  winner: "black",
  perfect: false,
};
```

#### 2. 引き分け
```ts
{
  type: "draw";
}
```

**使用例:**
```ts
const result: WinnerResult = { type: "draw" };
```

#### 3. ゲーム進行中
```ts
{
  type: "playing";
}
```

**使用例:**
```ts
const result: WinnerResult = { type: "playing" };
```

### パターンマッチング

TypeScriptの型ガードを使用して安全に処理できます：

```ts
function displayResult(result: WinnerResult): string {
  switch (result.type) {
    case "win":
      if (result.perfect) {
        return `${result.winner}のパーフェクト勝利！`;
      }
      return `${result.winner}の勝ち！`;

    case "draw":
      return "引き分け";

    case "playing":
      return "ゲーム進行中";
  }
}
```

---

## 型の使用ガイドライン

### 1. anyの禁止

```ts
// ❌ 悪い例
function doSomething(value: any) { }

// ✅ 良い例
function doSomething(value: Player) { }
```

### 2. 型アサーションの最小化

```ts
// ❌ 悪い例
const player = "black" as Player;

// ✅ 良い例
const player: Player = "black";
```

### 3. オプショナルプロパティの慎重な使用

```ts
// ❌ 悪い例
type GameState = {
  board: Board;
  currentPlayer?: Player; // undefinedになりうる
};

// ✅ 良い例
type GameState = {
  board: Board;
  currentPlayer: Player; // 常に存在
};
```

---

## 型の拡張例

### カスタムゲームモードの追加

```ts
// 既存の型を拡張
export type GameMode = "pvp" | "pvc" | "online" | "tournament";

export type OnlineConfig = GameConfig & {
  roomId: string;
  playerName: string;
};
```

### 履歴機能の追加

```ts
export type GameHistory = {
  moves: Position[];
  states: GameState[];
};

export type GameStateWithHistory = GameState & {
  history: GameHistory;
};
```

---

## 関連ドキュメント

- [ドメイン層概要](./README.md)
- [定数定義](./constants.md)
- [盤面操作](./board.md)
- [ルール](./rules.md)
