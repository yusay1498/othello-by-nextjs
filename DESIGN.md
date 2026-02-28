# 🎯 オセロ フロントアプリ 設計書

> 🧠 人間にもAIにも読みやすい
> 🧩 責務が明確
> 🛠 実装がブレない

---

## 📋 目次

1. [プロジェクト概要](#-プロジェクト概要)
2. [要件定義](#-要件定義)
3. [設計方針](#-設計方針)
4. [アーキテクチャ](#-アーキテクチャ)
5. [ドメイン設計](#-ドメイン設計)
6. [状態設計](#-状態設計)
7. [座標システム](#-座標システム)
8. [関数シグネチャ](#-関数シグネチャ)
9. [エッジケース](#-エッジケース)
10. [コンポーネント設計](#-コンポーネント設計)
11. [データフロー](#-データフロー)
12. [状態遷移](#-状態遷移)
13. [テスト戦略](#-テスト戦略)
14. [非機能要件](#️-非機能要件)
15. [用語集](#-用語集)
16. [決定事項まとめ](#-決定事項まとめ)

---

## 🎯 プロジェクト概要

| 項目 | 内容 |
|------|------|
| プロジェクト名 | オセロ（ローカル対戦） |
| 目的 | ポートフォリオ用途 |
| 技術スタック | React + Next.js + TypeScript |
| スタイリング | Tailwind CSS |

---

## 🎮 要件定義

### プレイ仕様

| 項目 | 仕様 |
|------|------|
| 対戦モード | ローカル2人対戦 / CPU対戦 |
| CPU強さ | ミニマックス（深さ2、固定評価関数） |
| 先手後手 | 選択可能 |
| パス | 自動処理 |
| 合法手表示 | 半透明で表示 |
| 勝敗判定 | あり |
| レスポンシブ | スマホ / PC対応 |

---

## 🧠 設計方針

### 最重要原則

| 原則 | 説明 |
|------|------|
| 不変状態 | stateを直接変更しない |
| 純粋関数中心 | 副作用を最小化 |
| UIとドメインの分離 | ロジックはdomain層に集約 |
| 最小状態主義 | 導出可能な値は状態に持たない |
| 保守性優先 | 拡張より明確さを重視 |

### SOLID適用ポイント

| 原則 | 適用 |
|------|------|
| S (単一責任) | board / rules / ai / winner 分離 |
| O (開放閉鎖) | 評価関数差し替え可能 |
| L (リスコフ) | Player型で保証 |
| I (インターフェース分離) | UIはドメイン詳細を知らない |
| D (依存逆転) | UIはドメイン関数に依存 |

---

## 🏗 アーキテクチャ

### 方針

フロント向けDDD + Bulletproof寄り構成

### ディレクトリ構成

```
src/
├── domain/
│   └── game/
│       ├── types.ts        # 型定義
│       ├── constants.ts    # 定数
│       ├── board.ts        # 盤面操作
│       ├── rules.ts        # ルール・合法手
│       ├── ai.ts           # CPU思考
│       └── winner.ts       # 勝敗判定
├── features/
│   └── game/
│       ├── components/
│       │   ├── Board.tsx
│       │   ├── Cell.tsx
│       │   ├── GameInfo.tsx
│       │   ├── GameResult.tsx
│       │   ├── ModeSelect.tsx
│       │   └── PassNotification.tsx
│       ├── hooks/
│       │   ├── useGame.ts
│       │   └── useCpuTurn.ts
│       └── GameContainer.tsx
└── app/
    └── page.tsx
```

---

## 🧩 ドメイン設計

### 型定義（domain/game/types.ts）

```ts
export type Player = "black" | "white";

export type Cell = Player | null;

export type Board = Cell[]; // 1次元64マス

export type Position = number; // 0-63のインデックス

export type Direction = number; // 方向ベクトル

export type GameState = {
  board: Board;
  currentPlayer: Player;
};

export type GameMode = "pvp" | "pvc";

export type PlayerColor = "black" | "white";

export type GameConfig = {
  mode: GameMode;
  userColor: PlayerColor; // CPU戦で人間が担当する色
};

export type GameStatus = "playing" | "finished";

export type WinnerResult =
  | { type: "win"; winner: Player; perfect: boolean }
  | { type: "draw" }
  | { type: "playing" };
```

### 定数（domain/game/constants.ts）

```ts
export const BOARD_SIZE = 8;
export const TOTAL_CELLS = 64;

// 8方向の移動量
export const DIRECTIONS: readonly number[] = [
  -9, -8, -7, -1, 1, 7, 8, 9
] as const;

// 角のインデックス
export const CORNERS: readonly number[] = [0, 7, 56, 63] as const;

// 評価関数用の重み付けマップ
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

### 責務分離

| ファイル | 責務 |
|----------|------|
| board.ts | 盤面の初期化・スコア計算 |
| rules.ts | 合法手判定・石を置く・パス判定 |
| winner.ts | 勝敗判定 |
| ai.ts | 盤面評価・最善手探索 |

---

## 🎲 状態設計

### 最小状態主義

**GameStateに含めるもの：**

- ✅ board
- ✅ currentPlayer

**含めないもの（導出可能）：**

- ❌ winner → `getGameResult(board, gameOver)` で導出
- ❌ legalMoves → `getLegalMoves(state)` で導出
- ❌ score → `getScore(board)` で導出

### 状態管理方法

```ts
const [state, setState] = useState<GameState>(initialState);

// 更新はドメイン関数経由
setState(prev => applyMove(prev, index));
```

---

## 📐 座標システム

### 盤面インデックス

```
     0   1   2   3   4   5   6   7
   +---+---+---+---+---+---+---+---+
 0 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
   +---+---+---+---+---+---+---+---+
 1 | 8 | 9 |10 |11 |12 |13 |14 |15 |
   +---+---+---+---+---+---+---+---+
 2 |16 |17 |18 |19 |20 |21 |22 |23 |
   +---+---+---+---+---+---+---+---+
 3 |24 |25 |26 |27 |28 |29 |30 |31 |
   +---+---+---+---+---+---+---+---+
 4 |32 |33 |34 |35 |36 |37 |38 |39 |
   +---+---+---+---+---+---+---+---+
 5 |40 |41 |42 |43 |44 |45 |46 |47 |
   +---+---+---+---+---+---+---+---+
 6 |48 |49 |50 |51 |52 |53 |54 |55 |
   +---+---+---+---+---+---+---+---+
 7 |56 |57 |58 |59 |60 |61 |62 |63 |
   +---+---+---+---+---+---+---+---+
```

### 変換関数

| 変換 | 計算式 |
|------|--------|
| index → row | `Math.floor(index / 8)` |
| index → col | `index % 8` |
| (row, col) → index | `row * 8 + col` |

### 初期配置

| インデックス | 座標 | 石 |
|--------------|------|-----|
| 27 | d4 | ⚪ white |
| 28 | e4 | ⚫ black |
| 35 | d5 | ⚫ black |
| 36 | e5 | ⚪ white |

### 8方向ベクトル

| 方向 | 値 | 計算 |
|------|-----|------|
| 左上 | -9 | -8-1 |
| 上 | -8 | -8 |
| 右上 | -7 | -8+1 |
| 左 | -1 | -1 |
| 右 | +1 | +1 |
| 左下 | +7 | +8-1 |
| 下 | +8 | +8 |
| 右下 | +9 | +8+1 |

---

## 📝 関数シグネチャ

### board.ts

| 関数 | シグネチャ | 説明 |
|------|-----------|------|
| createInitialBoard | `() => Board` | 初期盤面を生成 |
| getScore | `(board: Board) => { black: number; white: number }` | スコア計算 |
| getOpponent | `(player: Player) => Player` | 相手プレイヤーを返す |

### rules.ts

| 関数 | シグネチャ | 説明 |
|------|-----------|------|
| getLegalMoves | `(state: GameState) => Position[]` | 合法手一覧を返す |
| applyMove | `(state: GameState, index: Position) => GameState` | 手を打って新しい状態を返す |
| isGameOver | `(state: GameState) => boolean` | ゲーム終了判定 |
| isValidMove | `(from: Position, direction: Direction) => boolean` | 移動が有効か判定 |

### winner.ts

| 関数 | シグネチャ | 説明 |
|------|-----------|------|
| getGameResult | `(board: Board, gameOver: boolean) => WinnerResult` | 勝敗結果を返す |

### ai.ts

| 関数 | シグネチャ | 説明 |
|------|-----------|------|
| getBestMove | `(state: GameState, depth: number) => Position \| null` | 最善手を返す（なければnull） |
| evaluateBoard | `(board: Board, player: Player) => number` | 盤面を評価してスコアを返す |

---

## 🚨 エッジケース

### ゲーム終了条件

| 条件 | 判定タイミング | 結果 |
|------|----------------|------|
| 盤面が全て埋まった | applyMove後 | 即終了 → 勝敗判定 |
| 両者とも合法手なし | applyMove後 | 即終了 → 勝敗判定 |
| 片方のみ合法手なし | applyMove後 | 自動パス → ゲーム継続 |

### 勝敗パターン

| スコア | 結果 | 表示例 |
|--------|------|--------|
| 黒 > 白 | 黒の勝ち | "黒の勝ち！ (40-24)" |
| 白 > 黒 | 白の勝ち | "白の勝ち！ (35-29)" |
| 黒 = 白 | 引き分け | "引き分け (32-32)" |
| 64-0 | パーフェクト | "黒のパーフェクト勝利！" |

### パス処理

| 状況 | 挙動 | UI表示 |
|------|------|--------|
| 相手のみ合法手なし | 手番を自分に戻す | "白はパスです" (1秒表示) |
| 自分のみ合法手なし | 自動で相手に移る | "黒はパスです" |
| 連続パス | 発生しない（両者なしならゲーム終了） | - |

### 不正操作

| 操作 | 挙動 | 理由 |
|------|------|------|
| 合法手以外をクリック | 無視 | UIでフィルタ済み |
| ゲーム終了後にクリック | 無視 | status !== "playing" |
| CPU手番中にクリック | 無視 | 手番チェック |
| 範囲外インデックス | 無視 | 防御的実装 |

### 境界値

| ケース | 値 | 挙動 |
|--------|-----|------|
| 最小インデックス | 0 (左上角) | 正常処理 |
| 最大インデックス | 63 (右下角) | 正常処理 |
| 負のインデックス | -1 | 無視 |
| 範囲外インデックス | 64以上 | 無視 |

### CPU対戦固有

| ケース | 挙動 |
|--------|------|
| CPUがパスの場合 | 自動スキップ（UI表示あり） |
| CPUの思考中にリセット | 思考キャンセル（cleanup） |
| CPUの合法手が1つ | 即座にその手を打つ（遅延あり） |

---

## 🧩 コンポーネント設計

### コンポーネントツリー

```
GameContainer
├── ModeSelect           # モード選択（初期表示）
├── GameInfo             # 手番・スコア表示
├── Board                # 盤面
│   └── Cell × 64        # 各マス
├── PassNotification     # パス通知（トースト）
└── GameResult           # 結果モーダル
```

### Props定義

#### Board

| Prop | 型 | 説明 |
|------|-----|------|
| board | `Board` | 盤面状態 |
| legalMoves | `Position[]` | 合法手一覧 |
| onCellClick | `(index: Position) => void` | クリックハンドラ |
| disabled | `boolean` | 操作不可フラグ |

#### Cell

| Prop | 型 | 説明 |
|------|-----|------|
| value | `Cell` | "black" \| "white" \| null |
| isLegal | `boolean` | 合法手か |
| onClick | `() => void` | クリックハンドラ |
| disabled | `boolean` | 操作不可 |

#### GameInfo

| Prop | 型 | 説明 |
|------|-----|------|
| currentPlayer | `Player` | 現在の手番 |
| score | `{ black: number; white: number }` | スコア |
| isCpuThinking | `boolean` | CPU思考中フラグ |

#### GameResult

| Prop | 型 | 説明 |
|------|-----|------|
| result | `WinnerResult` | 勝敗結果 |
| score | `{ black: number; white: number }` | 最終スコア |
| onRestart | `() => void` | リスタートハンドラ |
| onBackToMenu | `() => void` | メニューに戻る |

#### ModeSelect

| Prop | 型 | 説明 |
|------|-----|------|
| onSelectMode | `(config: GameConfig) => void` | モード選択ハンドラ |

#### PassNotification

| Prop | 型 | 説明 |
|------|-----|------|
| player | `Player \| null` | パスしたプレイヤー |
| duration | `number` | 表示時間（ms） |

---

## 🔄 データフロー

### ユーザー操作時

```
┌─────────┐    click(index)    ┌──────────┐
│  Cell   │ ─────────────────► │ useGame  │
└─────────┘                    └────┬─────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
             ┌────────────┐ ┌────────────┐ ┌────────────┐
             │getLegalMoves│ │ applyMove  │ │isGameOver  │
             └────────────┘ └────────────┘ └────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                            ┌─────────────┐
                            │  setState   │
                            └─────────────┘
                                    │
                                    ▼
                            ┌─────────────┐
                            │ 再レンダリング │
                            └─────────────┘
```

### CPU手番時

```
┌──────────┐   state変更検知   ┌─────────────┐
│ useGame  │ ───────────────► │ useCpuTurn  │
└──────────┘                  └──────┬──────┘
                                     │
                                     ▼
                              ┌────────────┐
                              │ getBestMove │
                              └──────┬─────┘
                                     │
                                     ▼
                              ┌────────────┐
                              │  onMove()  │
                              └────────────┘
```

---

## 🔀 状態遷移

### 画面状態

```
┌────────────┐
│ ModeSelect │◄─────────────────────────┐
└─────┬──────┘                          │
      │ モード選択                       │
      ▼                                 │
┌────────────┐                          │
│  Playing   │                          │
└─────┬──────┘                          │
      │ ゲーム終了                       │
      ▼                                 │
┌────────────┐    メニューに戻る         │
│   Result   │──────────────────────────┘
└─────┬──────┘
      │ リスタート
      ▼
┌────────────┐
│  Playing   │
└────────────┘
```

### ゲーム状態（Playing中）

```
┌──────────────┐
│ PlayerTurn   │◄──────────┐
│ (黒 or 白)   │           │
└──────┬───────┘           │
       │ 手を打つ           │
       ▼                   │
┌──────────────┐           │
│ CheckPass    │           │
└──────┬───────┘           │
       │                   │
   ┌───┴───┐               │
   ▼       ▼               │
相手が   相手が             │
置ける   置けない           │
   │       │               │
   ▼       ▼               │
手番交代  パス表示 ─────────┘
   │       │
   │       ▼
   │    自分が置ける？
   │    ├─ Yes → 手番維持
   │    └─ No → ゲーム終了
   │
   └──────────────────────►次のターンへ
```

---

## 🧪 テスト戦略

### 方針

- ドメイン層はReact非依存 → Vitestで純粋関数テスト
- UI層は必要に応じてReact Testing Library

### テスト対象

| レイヤー | テスト内容 | ツール |
|----------|-----------|--------|
| domain/board | 初期化・スコア計算 | Vitest |
| domain/rules | 合法手判定・applyMove | Vitest |
| domain/winner | 勝敗判定 | Vitest |
| domain/ai | 評価関数・探索 | Vitest |
| hooks | 状態管理フロー | React Testing Library |
| components | 表示・操作 | React Testing Library |

### カバレッジ目標

| 対象 | 目標 |
|------|------|
| ドメイン層 | > 80% |
| hooks | > 60% |
| components | 主要パス |

---

## ⚙️ 非機能要件

### パフォーマンス

| 項目 | 目標値 |
|------|--------|
| 初期表示 | < 1秒 |
| 手を打った時の応答 | < 100ms |
| CPU思考時間 | < 2秒 |

### 対応環境

| 項目 | 対応範囲 |
|------|----------|
| ブラウザ | Chrome, Safari, Firefox (最新2バージョン) |
| デバイス | PC, タブレット, スマートフォン |
| 画面幅 | 320px以上 |

### アクセシビリティ

| 項目 | 対応 |
|------|------|
| キーボード操作 | v1では未対応 |
| スクリーンリーダー | v1では未対応 |
| カラーコントラスト | WCAG AA準拠 |

### 保守性

| 項目 | 基準 |
|------|------|
| テストカバレッジ | ドメイン層 > 80% |
| 型カバレッジ | 100% (any禁止) |

---

## 📖 用語集

| 用語 | 定義 |
|------|------|
| Player | `"black" \| "white"` の手番を示す型 |
| Cell | 盤面の1マスの状態（`Player \| null`） |
| Board | 64マスの配列（`Cell[]`） |
| Position | 0-63のインデックス |
| Direction | 8方向の移動量（-9,-8,-7,-1,1,7,8,9） |
| LegalMove | 現在の手番で石を置ける位置 |
| Pass | 合法手がなく手番をスキップすること |
| Flip | 相手の石を裏返すこと |
| GameState | board + currentPlayer の最小状態 |
| PvP | Player vs Player（2人対戦） |
| PvC | Player vs CPU（CPU対戦） |

---

## 🎯 決定事項まとめ

| 項目 | 決定 |
|------|------|
| Board構造 | 1次元配列（64要素） |
| 状態管理 | useState + 純粋関数 |
| 勝敗 | 導出（stateに持たない） |
| パス | 自動処理（applyMove内） |
| AI | ミニマックス 深さ2固定 |
| アーキテクチャ | フロントDDD + Bulletproof |
| 型レベル64固定 | やらない |
| エラー処理 | 不正な手は無視（元のstate返却） |
| CPU思考遅延 | 500ms |

---

## 📅 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-02-28 | 初版作成 |
