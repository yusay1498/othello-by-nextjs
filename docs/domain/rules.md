# ルール (rules.ts)

## 概要

オセロのゲームルールを実装する核となるモジュールです。合法手判定、石の配置と裏返し、パス判定など、ゲームロジックの中心を担います。

## 関数一覧

### getLegalMoves

```ts
function getLegalMoves(state: GameState): Position[]
```

現在のプレイヤーが置ける合法手の一覧を返します。

**引数:**
- `state`: 現在のゲーム状態

**戻り値:**
- 合法手のインデックス配列（空配列の場合はパス）

**アルゴリズム:**

1. 盤面の全64マスを走査
2. 空きマス(`null`)のみチェック
3. 各マスから8方向に探索
4. 相手の石を挟めるマスを合法手として追加

**実装例:**

```ts
export function getLegalMoves(state: GameState): Position[] {
  const { board, currentPlayer } = state;
  const legalMoves: Position[] = [];
  const opponent = getOpponent(currentPlayer);

  for (let i = 0; i < TOTAL_CELLS; i++) {
    // 空きマスのみチェック
    if (board[i] !== null) continue;

    // 8方向をチェック
    for (const direction of DIRECTIONS) {
      if (canFlipInDirection(board, i, direction, currentPlayer, opponent)) {
        legalMoves.push(i);
        break; // 1方向でも裏返せれば合法手
      }
    }
  }

  return legalMoves;
}
```

**使用例:**

```ts
const state: GameState = {
  board: createInitialBoard(),
  currentPlayer: "black",
};

const legalMoves = getLegalMoves(state);
console.log(legalMoves); // [19, 26, 37, 44]
```

**パフォーマンス最適化:**

```ts
// 早期リターンで最適化
for (let i = 0; i < TOTAL_CELLS; i++) {
  if (board[i] !== null) continue; // 空きマス以外をスキップ

  let isLegal = false;
  for (const direction of DIRECTIONS) {
    if (canFlipInDirection(...)) {
      legalMoves.push(i);
      isLegal = true;
      break; // 見つかったら次のマスへ
    }
  }
}
```

**テストケース:**

```ts
describe('getLegalMoves', () => {
  test('初期盤面の黒の合法手は4つ', () => {
    const state = {
      board: createInitialBoard(),
      currentPlayer: "black" as Player,
    };
    const moves = getLegalMoves(state);
    expect(moves).toHaveLength(4);
    expect(moves).toContain(19); // c4
    expect(moves).toContain(26); // d3
    expect(moves).toContain(37); // e6
    expect(moves).toContain(44); // f5
  });

  test('合法手がない場合は空配列', () => {
    const board = new Array(64).fill("black");
    board[0] = null;
    const state = { board, currentPlayer: "black" as Player };
    const moves = getLegalMoves(state);
    expect(moves).toEqual([]);
  });
});
```

---

### applyMove

```ts
function applyMove(state: GameState, index: Position): GameState
```

指定された位置に石を置き、石を裏返した新しいゲーム状態を返します。

**引数:**
- `state`: 現在のゲーム状態
- `index`: 石を置く位置（0-63）

**戻り値:**
- 新しい`GameState`（元の状態は変更しない）

**処理フロー:**

```
1. 不正な手 → 元のstateを返す
2. 新しいboardをコピー
3. 指定位置に石を配置
4. 8方向に石を裏返す
5. 手番を交代
6. 相手がパスか判定
   - パスなら手番を戻す
7. 新しいstateを返す
```

**実装例:**

```ts
export function applyMove(state: GameState, index: Position): GameState {
  const { board, currentPlayer } = state;

  // 不正な手をチェック
  if (!isValidIndex(index) || board[index] !== null) {
    return state; // 元の状態を返す
  }

  const legalMoves = getLegalMoves(state);
  if (!legalMoves.includes(index)) {
    return state; // 合法手でない
  }

  const opponent = getOpponent(currentPlayer);
  const newBoard = [...board];

  // 石を配置
  newBoard[index] = currentPlayer;

  // 8方向に裏返す
  for (const direction of DIRECTIONS) {
    flipInDirection(newBoard, index, direction, currentPlayer, opponent);
  }

  // 手番を交代
  let nextPlayer = opponent;

  // 相手の合法手をチェック
  const nextState = { board: newBoard, currentPlayer: nextPlayer };
  const opponentMoves = getLegalMoves(nextState);

  // 相手がパスなら手番を戻す
  if (opponentMoves.length === 0) {
    const currentMoves = getLegalMoves({
      board: newBoard,
      currentPlayer: currentPlayer,
    });

    // 自分も置けない場合はゲーム終了（手番は相手のまま）
    if (currentMoves.length > 0) {
      nextPlayer = currentPlayer;
    }
  }

  return {
    board: newBoard,
    currentPlayer: nextPlayer,
  };
}
```

**使用例:**

```ts
let state: GameState = {
  board: createInitialBoard(),
  currentPlayer: "black",
};

// 黒が19に打つ
state = applyMove(state, 19);

console.log(getScore(state.board)); // { black: 4, white: 1 }
console.log(state.currentPlayer);    // "white"
```

**不正な手の処理:**

```ts
// ケース1: 既に石がある
state = applyMove(state, 27); // white石がある
// → 元のstateを返す

// ケース2: 範囲外
state = applyMove(state, 64);
// → 元のstateを返す

// ケース3: 合法手でない
state = applyMove(state, 0); // 角には置けない
// → 元のstateを返す
```

**テストケース:**

```ts
describe('applyMove', () => {
  test('合法手を打つと石が裏返る', () => {
    const state = {
      board: createInitialBoard(),
      currentPlayer: "black" as Player,
    };

    const newState = applyMove(state, 19);

    expect(newState.board[19]).toBe("black"); // 配置された
    expect(newState.board[27]).toBe("black"); // 裏返った
    expect(getScore(newState.board)).toEqual({ black: 4, white: 1 });
  });

  test('不正な手は状態を変更しない', () => {
    const state = {
      board: createInitialBoard(),
      currentPlayer: "black" as Player,
    };

    const newState = applyMove(state, 0); // 合法手でない
    expect(newState).toBe(state); // 同じオブジェクト
  });

  test('パスの自動処理', () => {
    // 相手が置けない盤面を作成
    const board = new Array(64).fill("black");
    board[0] = null; // 黒のみ置ける

    const state = { board, currentPlayer: "black" as Player };
    const newState = applyMove(state, 0);

    expect(newState.currentPlayer).toBe("black"); // 手番が戻る
  });
});
```

---

### isGameOver

```ts
function isGameOver(state: GameState): boolean
```

ゲームが終了しているか判定します。

**引数:**
- `state`: 現在のゲーム状態

**戻り値:**
- `true`: ゲーム終了
- `false`: ゲーム継続

**終了条件:**

1. 盤面が全て埋まった
2. 両者とも合法手がない

**実装例:**

```ts
export function isGameOver(state: GameState): boolean {
  const { board, currentPlayer } = state;

  // 条件1: 盤面が満杯
  const isFull = board.every(cell => cell !== null);
  if (isFull) return true;

  // 条件2: 現在のプレイヤーの合法手
  const currentMoves = getLegalMoves(state);
  if (currentMoves.length > 0) return false;

  // 条件3: 相手の合法手
  const opponent = getOpponent(currentPlayer);
  const opponentMoves = getLegalMoves({
    ...state,
    currentPlayer: opponent,
  });

  return opponentMoves.length === 0;
}
```

**使用例:**

```ts
const state: GameState = {
  board: createInitialBoard(),
  currentPlayer: "black",
};

if (isGameOver(state)) {
  const result = getGameResult(state.board, true);
  console.log(result);
}
```

**テストケース:**

```ts
describe('isGameOver', () => {
  test('初期盤面はゲーム継続', () => {
    const state = {
      board: createInitialBoard(),
      currentPlayer: "black" as Player,
    };
    expect(isGameOver(state)).toBe(false);
  });

  test('盤面が満杯ならゲーム終了', () => {
    const board = new Array(64).fill("black");
    const state = { board, currentPlayer: "black" as Player };
    expect(isGameOver(state)).toBe(true);
  });

  test('両者とも置けないならゲーム終了', () => {
    const board = new Array(64).fill(null);
    board[0] = "black";
    board[63] = "white";
    const state = { board, currentPlayer: "black" as Player };
    expect(isGameOver(state)).toBe(true);
  });
});
```

---

### isValidMove (ヘルパー関数)

```ts
function isValidMove(from: Position, direction: Direction): boolean
```

指定方向への移動が盤面内に収まるか判定します。

**引数:**
- `from`: 開始位置
- `direction`: 移動方向

**戻り値:**
- `true`: 有効な移動
- `false`: 盤面外

**境界チェックのロジック:**

```ts
export function isValidMove(from: Position, direction: Direction): boolean {
  const row = Math.floor(from / BOARD_SIZE);
  const col = from % BOARD_SIZE;
  const next = from + direction;

  // 範囲外チェック
  if (next < 0 || next >= TOTAL_CELLS) return false;

  const nextRow = Math.floor(next / BOARD_SIZE);
  const nextCol = next % BOARD_SIZE;

  // 横方向の境界チェック
  if (direction === -1 || direction === -9 || direction === 7) {
    // 左方向：前の列より大きくなったらNG
    if (nextCol > col) return false;
  }

  if (direction === 1 || direction === -7 || direction === 9) {
    // 右方向：前の列より小さくなったらNG
    if (nextCol < col) return false;
  }

  return true;
}
```

**テストケース:**

```ts
describe('isValidMove', () => {
  test('左端から左に移動はNG', () => {
    expect(isValidMove(0, -1)).toBe(false);
  });

  test('右端から右に移動はNG', () => {
    expect(isValidMove(7, 1)).toBe(false);
  });

  test('盤面内の移動はOK', () => {
    expect(isValidMove(27, 1)).toBe(true);
  });
});
```

---

## ヘルパー関数（内部使用）

### canFlipInDirection

```ts
function canFlipInDirection(
  board: Board,
  start: Position,
  direction: Direction,
  player: Player,
  opponent: Player
): boolean
```

指定方向に石を裏返せるか判定します。

**実装例:**

```ts
function canFlipInDirection(
  board: Board,
  start: Position,
  direction: Direction,
  player: Player,
  opponent: Player
): boolean {
  let pos = start + direction;
  let hasOpponent = false;

  while (isValidMove(pos - direction, direction)) {
    if (board[pos] === opponent) {
      hasOpponent = true;
      pos += direction;
    } else if (board[pos] === player && hasOpponent) {
      return true; // 挟めた
    } else {
      break;
    }
  }

  return false;
}
```

---

### flipInDirection

```ts
function flipInDirection(
  board: Board,
  start: Position,
  direction: Direction,
  player: Player,
  opponent: Player
): void
```

指定方向の石を実際に裏返します（破壊的操作）。

**実装例:**

```ts
function flipInDirection(
  board: Board,
  start: Position,
  direction: Direction,
  player: Player,
  opponent: Player
): void {
  if (!canFlipInDirection(board, start, direction, player, opponent)) {
    return;
  }

  let pos = start + direction;

  while (board[pos] === opponent) {
    board[pos] = player; // 裏返す
    pos += direction;
  }
}
```

---

## エッジケースの処理

### パス処理

```ts
// ケース1: 相手のみパス
// → 自動で手番を戻す（applyMove内で処理）

// ケース2: 両者ともパス
// → ゲーム終了（isGameOverで判定）

// ケース3: 連続パス
// → 発生しない（両者パスならゲーム終了）
```

### 境界値の処理

| ケース | 処理 |
|--------|------|
| インデックス < 0 | 無視（元のstateを返す） |
| インデックス >= 64 | 無視（元のstateを返す） |
| 既に石がある | 無視（元のstateを返す） |
| 合法手でない | 無視（元のstateを返す） |

---

## パフォーマンス考慮事項

### 目標パフォーマンス

```
getLegalMoves():  < 1ms
applyMove():      < 1ms
isGameOver():     < 1ms
```

### 最適化のポイント

1. **早期リターン**
```ts
if (board[i] !== null) continue; // 空きマスのみチェック
```

2. **不要な計算を避ける**
```ts
// ❌ 悪い例
const moves = getLegalMoves(state);
const hasLegalMoves = moves.length > 0;

// ✅ 良い例（早期リターン版）
function hasLegalMoves(state: GameState): boolean {
  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (board[i] !== null) continue;
    for (const direction of DIRECTIONS) {
      if (canFlipInDirection(...)) return true;
    }
  }
  return false;
}
```

3. **配列コピーの最小化**
```ts
// applyMove内でのみboardをコピー
const newBoard = [...board];
```

---

## 関連ドキュメント

- [ドメイン層概要](./README.md)
- [型定義](./types.md)
- [盤面操作](./board.md)
- [勝敗判定](./winner.md)
- [エッジケース（DESIGN.md）](../../DESIGN.md#-エッジケース)
