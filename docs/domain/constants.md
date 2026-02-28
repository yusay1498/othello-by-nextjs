# 定数定義 (constants.ts)

## 概要

ゲーム全体で使用する定数を一元管理するファイルです。マジックナンバーを避け、保守性と可読性を向上させます。

## 盤面関連定数

### BOARD_SIZE

```ts
export const BOARD_SIZE = 8;
```

盤面の一辺のサイズです。

**値:** `8`（8x8の盤面）

**使用例:**
```ts
const row = Math.floor(index / BOARD_SIZE);
const col = index % BOARD_SIZE;
```

---

### TOTAL_CELLS

```ts
export const TOTAL_CELLS = 64;
```

盤面の総マス数です。

**値:** `64`（8 × 8）

**使用例:**
```ts
export function createInitialBoard(): Board {
  const board = new Array(TOTAL_CELLS).fill(null);
  // ...
}
```

---

## 方向ベクトル

### DIRECTIONS

```ts
export const DIRECTIONS: readonly number[] = [
  -9, -8, -7, -1, 1, 7, 8, 9
] as const;
```

8方向の移動量を定義する配列です。

**方向マッピング:**

```
┌─────┬─────┬─────┐
│ -9  │ -8  │ -7  │  左上  上  右上
├─────┼─────┼─────┤
│ -1  │  0  │ +1  │  左   中心  右
├─────┼─────┼─────┤
│ +7  │ +8  │ +9  │  左下  下  右下
└─────┴─────┴─────┘
```

**計算根拠:**

| 方向 | 計算式 | 値 | 説明 |
|------|--------|-----|------|
| 左上 | -8 - 1 | -9 | 1行上＋1列左 |
| 上 | -8 | -8 | 1行上 |
| 右上 | -8 + 1 | -7 | 1行上＋1列右 |
| 左 | -1 | -1 | 1列左 |
| 右 | +1 | +1 | 1列右 |
| 左下 | +8 - 1 | +7 | 1行下＋1列左 |
| 下 | +8 | +8 | 1行下 |
| 右下 | +8 + 1 | +9 | 1行下＋1列右 |

**使用例:**
```ts
function checkDirection(board: Board, start: Position, direction: Direction): boolean {
  let pos = start + direction;

  while (isValidPosition(pos)) {
    const cell = board[pos];
    // ...
    pos += direction;
  }
}

// 8方向すべてをチェック
for (const direction of DIRECTIONS) {
  checkDirection(board, position, direction);
}
```

**readonly指定の理由:**
- 配列の要素が変更されないことを保証
- 意図しない変更を防ぐ
- パフォーマンス最適化のヒント

---

## 特殊位置定数

### CORNERS

```ts
export const CORNERS: readonly number[] = [0, 7, 56, 63] as const;
```

盤面の4つの角のインデックスです。

**座標マッピング:**

```
  0   1   2   3   4   5   6   7
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ 0 │   │   │   │   │   │   │ 7 │  0
├───┼───┼───┼───┼───┼───┼───┼───┤
│   │   │   │   │   │   │   │   │  1
├───┼───┼───┼───┼───┼───┼───┼───┤
│   │   │   │   │   │   │   │   │  2
├───┼───┼───┼───┼───┼───┼───┼───┤
│   │   │   │   │   │   │   │   │  3
├───┼───┼───┼───┼───┼───┼───┼───┤
│   │   │   │   │   │   │   │   │  4
├───┼───┼───┼───┼───┼───┼───┼───┤
│   │   │   │   │   │   │   │   │  5
├───┼───┼───┼───┼───┼───┼───┼───┤
│   │   │   │   │   │   │   │   │  6
├───┼───┼───┼───┼───┼───┼───┼───┤
│56 │   │   │   │   │   │   │63 │  7
└───┴───┴───┴───┴───┴───┴───┴───┘
```

**使用例:**
```ts
function isCorner(position: Position): boolean {
  return CORNERS.includes(position);
}

// AI評価で角を重視
if (isCorner(position)) {
  score += 100;
}
```

**角が重要な理由:**
- 一度取られたら取り返されない
- ゲーム終盤まで保持できる
- 戦略上最も価値が高い位置

---

## AI評価用定数

### POSITION_WEIGHTS

```ts
export const POSITION_WEIGHTS: readonly number[] = [
  100, -20,  10,   5,   5,  10, -20, 100,
  -20, -50,  -2,  -2,  -2,  -2, -50, -20,
   10,  -2,   1,   1,   1,   1,  -2,  10,
    5,  -2,   1,   0,   0,   1,  -2,   5,
    5,  -2,   1,   0,   0,   1,  -2,   5,
   10,  -2,   1,   1,   1,   1,  -2,  10,
  -20, -50,  -2,  -2,  -2,  -2, -50, -20,
  100, -20,  10,   5,   5,  10, -20, 100,
] as const;
```

盤面の各位置に対する評価値の重み付けです。

**ビジュアル表現:**

```
     0    1    2    3    4    5    6    7
   ┌────┬────┬────┬────┬────┬────┬────┬────┐
 0 │100 │-20 │ 10 │  5 │  5 │ 10 │-20 │100 │
   ├────┼────┼────┼────┼────┼────┼────┼────┤
 1 │-20 │-50 │ -2 │ -2 │ -2 │ -2 │-50 │-20 │
   ├────┼────┼────┼────┼────┼────┼────┼────┤
 2 │ 10 │ -2 │  1 │  1 │  1 │  1 │ -2 │ 10 │
   ├────┼────┼────┼────┼────┼────┼────┼────┤
 3 │  5 │ -2 │  1 │  0 │  0 │  1 │ -2 │  5 │
   ├────┼────┼────┼────┼────┼────┼────┼────┤
 4 │  5 │ -2 │  1 │  0 │  0 │  1 │ -2 │  5 │
   ├────┼────┼────┼────┼────┼────┼────┼────┤
 5 │ 10 │ -2 │  1 │  1 │  1 │  1 │ -2 │ 10 │
   ├────┼────┼────┼────┼────┼────┼────┼────┤
 6 │-20 │-50 │ -2 │ -2 │ -2 │ -2 │-50 │-20 │
   ├────┼────┼────┼────┼────┼────┼────┼────┤
 7 │100 │-20 │ 10 │  5 │  5 │ 10 │-20 │100 │
   └────┴────┴────┴────┴────┴────┴────┴────┘
```

**重み付けの戦略:**

| 位置タイプ | 重み | 理由 |
|-----------|------|------|
| 角 (0,7,56,63) | +100 | 最も価値が高い。取り返されない |
| 角の隣 (1,8,6,15,48,55,57,62) | -20〜-50 | 危険。相手に角を取られる原因になる |
| 辺の中央寄り (2-5,16,23...) | +5〜+10 | やや有利。比較的安定 |
| 中央 (27,28,35,36) | 0 | 中立。序盤は重要だが終盤は普通 |
| その他内側 | +1 | 標準的な価値 |
| 角の斜め隣 (9,14,49,54) | -50 | 最も危険。絶対に避けるべき |

**使用例:**
```ts
export function evaluateBoard(board: Board, player: Player): number {
  let score = 0;

  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (board[i] === player) {
      score += POSITION_WEIGHTS[i];
    } else if (board[i] !== null) {
      score -= POSITION_WEIGHTS[i];
    }
  }

  return score;
}
```

**カスタマイズ例:**

より攻撃的なAI用の重み：
```ts
const AGGRESSIVE_WEIGHTS = [
  120, -30,  15,  10,  10,  15, -30, 120,
  -30, -60,  -5,  -5,  -5,  -5, -60, -30,
   15,  -5,   5,   5,   5,   5,  -5,  15,
   10,  -5,   5,   2,   2,   5,  -5,  10,
   10,  -5,   5,   2,   2,   5,  -5,  10,
   15,  -5,   5,   5,   5,   5,  -5,  15,
  -30, -60,  -5,  -5,  -5,  -5, -60, -30,
  120, -30,  15,  10,  10,  15, -30, 120,
];
```

---

## その他の定数候補

将来的に追加する可能性のある定数：

### ゲームフロー関連

```ts
// CPU思考の遅延時間（ms）
export const CPU_THINKING_DELAY = 500;

// パス通知の表示時間（ms）
export const PASS_NOTIFICATION_DURATION = 1000;

// アニメーション時間（ms）
export const FLIP_ANIMATION_DURATION = 300;
```

### AI関連

```ts
// ミニマックスの探索深さ
export const AI_SEARCH_DEPTH = 2;

// タイムアウト時間（ms）
export const AI_TIMEOUT = 2000;
```

### 初期配置

```ts
// 初期配置の位置
export const INITIAL_POSITIONS = {
  BLACK: [28, 35],
  WHITE: [27, 36],
} as const;
```

---

## 使用ガイドライン

### 1. マジックナンバーの禁止

```ts
// ❌ 悪い例
if (board.length === 64) { }

// ✅ 良い例
if (board.length === TOTAL_CELLS) { }
```

### 2. 定数の集約

```ts
// ❌ 悪い例（各ファイルで定義）
const BOARD_SIZE = 8; // board.tsで定義
const BOARD_SIZE = 8; // rules.tsで定義

// ✅ 良い例（constants.tsで一元管理）
import { BOARD_SIZE } from './constants';
```

### 3. 型安全性の確保

```ts
// readonly配列を使用
export const DIRECTIONS: readonly number[] = [...] as const;

// 変更不可
DIRECTIONS[0] = 10; // ❌ エラー
```

---

## 定数の変更時の影響範囲

### BOARD_SIZE変更時

影響を受けるファイル：
- `board.ts`: 初期化ロジック
- `rules.ts`: 境界チェック
- `ai.ts`: 評価関数
- コンポーネント: グリッドレイアウト

### DIRECTIONS変更時

影響を受けるファイル：
- `rules.ts`: 合法手判定
- `ai.ts`: 盤面評価

### POSITION_WEIGHTS変更時

影響を受けるファイル：
- `ai.ts`: 評価関数のみ

---

## パフォーマンス考慮事項

### 定数の最適化

```ts
// ✅ 良い例：as constで最適化
export const DIRECTIONS = [-9, -8, -7, -1, 1, 7, 8, 9] as const;

// ❌ 悪い例：毎回新しい配列を生成
export const getDirections = () => [-9, -8, -7, -1, 1, 7, 8, 9];
```

### メモリ効率

- `readonly`配列は変更不可のため、V8エンジンが最適化可能
- `as const`により、TypeScriptコンパイラがより厳密な型推論を実行

---

## テスト

定数のテスト例：

```ts
import { BOARD_SIZE, TOTAL_CELLS, DIRECTIONS, CORNERS } from './constants';

describe('constants', () => {
  test('BOARD_SIZE * BOARD_SIZE = TOTAL_CELLS', () => {
    expect(BOARD_SIZE * BOARD_SIZE).toBe(TOTAL_CELLS);
  });

  test('DIRECTIONSは8方向', () => {
    expect(DIRECTIONS).toHaveLength(8);
  });

  test('CORNERSは4つ', () => {
    expect(CORNERS).toHaveLength(4);
  });

  test('POSITION_WEIGHTSは64要素', () => {
    expect(POSITION_WEIGHTS).toHaveLength(TOTAL_CELLS);
  });
});
```

---

## 関連ドキュメント

- [ドメイン層概要](./README.md)
- [型定義](./types.md)
- [AI詳細](./ai.md)
- [座標システム（DESIGN.md）](../../DESIGN.md#-座標システム)
