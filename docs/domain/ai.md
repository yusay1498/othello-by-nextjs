# AI (ai.ts)

## 概要

CPU対戦時の思考ロジックを実装するモジュールです。ミニマックスアルゴリズムと評価関数を使用して最善手を探索します。

## アルゴリズム

### ミニマックス法

**基本概念:**
- 自分のターン: スコアを最大化（Max）
- 相手のターン: スコアを最小化（Min）
- 深さ優先探索で未来の局面を評価

**探索深さ:**
- デフォルト: 2手先まで
- 深さ0: 現在の盤面を評価
- 深さ1: 1手先を評価
- 深さ2: 2手先（相手の手も考慮）

## 関数一覧

### getBestMove

```ts
function getBestMove(state: GameState, depth: number): Position | null
```

最善手を探索して返します。

**引数:**
- `state`: 現在のゲーム状態
- `depth`: 探索深さ（通常は2）

**戻り値:**
- 最善手のインデックス
- 合法手がない場合は`null`

**実装例:**

```ts
export function getBestMove(
  state: GameState,
  depth: number = 2
): Position | null {
  const legalMoves = getLegalMoves(state);

  if (legalMoves.length === 0) {
    return null; // 合法手なし（パス）
  }

  if (legalMoves.length === 1) {
    return legalMoves[0]; // 1つしかない
  }

  let bestMove = legalMoves[0];
  let bestScore = -Infinity;

  for (const move of legalMoves) {
    // 手を打ってみる
    const nextState = applyMove(state, move);

    // ミニマックスで評価
    const score = minimax(
      nextState,
      depth - 1,
      false, // 相手のターン
      state.currentPlayer
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
```

**使用例:**

```ts
const state: GameState = {
  board: createInitialBoard(),
  currentPlayer: "white", // CPUが白
};

const bestMove = getBestMove(state, 2);
if (bestMove !== null) {
  const newState = applyMove(state, bestMove);
  console.log(`CPUは${bestMove}に打ちました`);
}
```

**パフォーマンス:**
- 深さ2: 約1000-2000ms
- 深さ3: 約10000ms以上（非推奨）
- 深さ1: 約100ms（弱いAI）

**テストケース:**

```ts
describe('getBestMove', () => {
  test('合法手がある場合は有効な手を返す', () => {
    const state = {
      board: createInitialBoard(),
      currentPlayer: "black" as Player,
    };

    const move = getBestMove(state, 2);
    expect(move).not.toBeNull();

    const legalMoves = getLegalMoves(state);
    expect(legalMoves).toContain(move);
  });

  test('合法手がない場合はnullを返す', () => {
    const board = new Array(64).fill("black");
    const state = { board, currentPlayer: "white" as Player };

    const move = getBestMove(state, 2);
    expect(move).toBeNull();
  });

  test('角を優先する', () => {
    // 角が取れる盤面を作成
    const board = createInitialBoard();
    // ... 角が取れる状態にする
    const state = { board, currentPlayer: "black" as Player };

    const move = getBestMove(state, 2);
    expect(CORNERS).toContain(move); // 角を選択
  });
});
```

---

### minimax (ヘルパー関数)

```ts
function minimax(
  state: GameState,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number
```

ミニマックスアルゴリズムで局面を評価します。

**引数:**
- `state`: 評価する局面
- `depth`: 残り探索深さ
- `isMaximizing`: 最大化ノードか（true = AI, false = 相手）
- `aiPlayer`: AIが担当するプレイヤー

**戻り値:**
- 評価スコア（-∞ 〜 +∞）

**実装例:**

```ts
function minimax(
  state: GameState,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  // 終端条件
  if (depth === 0 || isGameOver(state)) {
    return evaluateBoard(state.board, aiPlayer);
  }

  const legalMoves = getLegalMoves(state);

  // 合法手がない（パス）
  if (legalMoves.length === 0) {
    const nextState = {
      ...state,
      currentPlayer: getOpponent(state.currentPlayer),
    };
    return minimax(nextState, depth - 1, !isMaximizing, aiPlayer);
  }

  if (isMaximizing) {
    // AIのターン：スコアを最大化
    let maxScore = -Infinity;

    for (const move of legalMoves) {
      const nextState = applyMove(state, move);
      const score = minimax(nextState, depth - 1, false, aiPlayer);
      maxScore = Math.max(maxScore, score);
    }

    return maxScore;
  } else {
    // 相手のターン：スコアを最小化
    let minScore = Infinity;

    for (const move of legalMoves) {
      const nextState = applyMove(state, move);
      const score = minimax(nextState, depth - 1, true, aiPlayer);
      minScore = Math.min(minScore, score);
    }

    return minScore;
  }
}
```

**アルゴリズムの流れ:**

```
depth=2, AI=Max
    │
    ├─ 手1 → depth=1, 相手=Min
    │     ├─ 手1-1 → depth=0 → 評価: 50
    │     ├─ 手1-2 → depth=0 → 評価: 30
    │     └─ 手1-3 → depth=0 → 評価: 40
    │     → Min選択: 30
    │
    ├─ 手2 → depth=1, 相手=Min
    │     ├─ 手2-1 → depth=0 → 評価: 60
    │     ├─ 手2-2 → depth=0 → 評価: 45
    │     └─ 手2-3 → depth=0 → 評価: 55
    │     → Min選択: 45
    │
    └─ 手3 → depth=1, 相手=Min
          ├─ 手3-1 → depth=0 → 評価: 35
          ├─ 手3-2 → depth=0 → 評価: 25
          └─ 手3-3 → depth=0 → 評価: 30
          → Min選択: 25

→ Max選択: 手2（スコア45）
```

---

### evaluateBoard

```ts
function evaluateBoard(board: Board, player: Player): number
```

盤面を評価してスコアを返します。

**引数:**
- `board`: 評価する盤面
- `player`: 評価対象のプレイヤー

**戻り値:**
- 評価スコア（高いほど有利）

**評価関数の要素:**

1. **位置の重み** (POSITION_WEIGHTS)
2. **石の数** (オプション)
3. **確定石** (オプション)
4. **機動力** (オプション)

**基本実装:**

```ts
export function evaluateBoard(board: Board, player: Player): number {
  const opponent = getOpponent(player);
  let score = 0;

  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (board[i] === player) {
      score += POSITION_WEIGHTS[i];
    } else if (board[i] === opponent) {
      score -= POSITION_WEIGHTS[i];
    }
  }

  return score;
}
```

**拡張実装（複合評価）:**

```ts
export function evaluateBoard(board: Board, player: Player): number {
  const opponent = getOpponent(player);

  // 1. 位置評価
  let positionScore = 0;
  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (board[i] === player) {
      positionScore += POSITION_WEIGHTS[i];
    } else if (board[i] === opponent) {
      positionScore -= POSITION_WEIGHTS[i];
    }
  }

  // 2. 石数評価（序盤は不利、終盤は有利）
  const pieceCount = getScore(board);
  const totalPieces = pieceCount.black + pieceCount.white;
  const pieceScore = totalPieces > 40
    ? (pieceCount[player] - pieceCount[opponent]) * 2
    : 0;

  // 3. 機動力評価（合法手の数）
  const playerMoves = getLegalMoves({ board, currentPlayer: player }).length;
  const opponentMoves = getLegalMoves({ board, currentPlayer: opponent }).length;
  const mobilityScore = (playerMoves - opponentMoves) * 5;

  return positionScore + pieceScore + mobilityScore;
}
```

**評価要素の重み付け:**

| 要素 | 重み | 適用時期 |
|------|------|----------|
| 位置評価 | 1.0 | 常時 |
| 石数評価 | 2.0 | 終盤（40石以上） |
| 機動力評価 | 5.0 | 常時 |
| 確定石評価 | 10.0 | 中盤以降 |

**使用例:**

```ts
const board = createInitialBoard();
const score = evaluateBoard(board, "black");
console.log(score); // 0（初期盤面は互角）
```

**テストケース:**

```ts
describe('evaluateBoard', () => {
  test('初期盤面は互角（0付近）', () => {
    const board = createInitialBoard();
    const score = evaluateBoard(board, "black");
    expect(Math.abs(score)).toBeLessThan(10);
  });

  test('角を取ると高評価', () => {
    const board = createInitialBoard();
    board[0] = "black"; // 角を取得

    const score = evaluateBoard(board, "black");
    expect(score).toBeGreaterThan(100);
  });

  test('相手が有利な盤面は負のスコア', () => {
    const board = new Array(64).fill("white");
    board[0] = "black";

    const score = evaluateBoard(board, "black");
    expect(score).toBeLessThan(0);
  });
});
```

---

## 最適化

### アルファベータ枝刈り（将来の拡張）

探索効率を大幅に向上させる手法：

```ts
function alphabeta(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  // 終端条件
  if (depth === 0 || isGameOver(state)) {
    return evaluateBoard(state.board, aiPlayer);
  }

  const legalMoves = getLegalMoves(state);

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of legalMoves) {
      const nextState = applyMove(state, move);
      const score = alphabeta(nextState, depth - 1, alpha, beta, false, aiPlayer);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // ベータカット
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of legalMoves) {
      const nextState = applyMove(state, move);
      const score = alphabeta(nextState, depth - 1, alpha, beta, true, aiPlayer);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // アルファカット
    }
    return minScore;
  }
}
```

### 手の順序付け

有望な手から探索することで枝刈り効率を向上：

```ts
function sortMoves(state: GameState, moves: Position[]): Position[] {
  return moves.sort((a, b) => {
    // 角を優先
    const aIsCorner = CORNERS.includes(a);
    const bIsCorner = CORNERS.includes(b);
    if (aIsCorner && !bIsCorner) return -1;
    if (!aIsCorner && bIsCorner) return 1;

    // 位置の重みで比較
    return POSITION_WEIGHTS[b] - POSITION_WEIGHTS[a];
  });
}
```

---

## AI強度の調整

### 探索深さによる強度変更

```ts
const AI_LEVELS = {
  EASY: 1,    // 1手先のみ
  MEDIUM: 2,  // 2手先（デフォルト）
  HARD: 3,    // 3手先（遅い）
} as const;

// 使用例
const move = getBestMove(state, AI_LEVELS.MEDIUM);
```

### ランダム性の追加

```ts
export function getBestMoveWithRandomness(
  state: GameState,
  depth: number,
  randomness: number = 0.1
): Position | null {
  const legalMoves = getLegalMoves(state);
  if (legalMoves.length === 0) return null;

  // ランダムに手を選ぶ確率
  if (Math.random() < randomness) {
    const randomIndex = Math.floor(Math.random() * legalMoves.length);
    return legalMoves[randomIndex];
  }

  return getBestMove(state, depth);
}
```

---

## パフォーマンス計測

### ベンチマーク

```ts
describe('AI Performance', () => {
  test('getBestMove (depth=2) は2秒以内', () => {
    const state = {
      board: createInitialBoard(),
      currentPlayer: "black" as Player,
    };

    const start = performance.now();
    getBestMove(state, 2);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(2000);
  });
});
```

### 探索ノード数のカウント

```ts
let nodeCount = 0;

function minimax(...args) {
  nodeCount++;
  // ... 実装
}

console.log(`探索ノード数: ${nodeCount}`);
```

---

## 使用例：フルゲームループ

```ts
// CPU対戦のゲームループ
let state: GameState = {
  board: createInitialBoard(),
  currentPlayer: "black",
};

const config: GameConfig = {
  mode: "pvc",
  userColor: "black", // 人間が黒
};

while (!isGameOver(state)) {
  if (state.currentPlayer === config.userColor) {
    // 人間のターン
    const userMove = await getUserInput();
    state = applyMove(state, userMove);
  } else {
    // CPUのターン
    const cpuMove = getBestMove(state, 2);
    if (cpuMove !== null) {
      state = applyMove(state, cpuMove);
    }
  }
}

// 結果表示
const result = getGameResult(state.board, true);
console.log(result);
```

---

## 関連ドキュメント

- [ドメイン層概要](./README.md)
- [型定義](./types.md)
- [定数定義](./constants.md)
- [ルール](./rules.md)
- [要件定義（DESIGN.md）](../../DESIGN.md#-要件定義)
