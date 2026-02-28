# アーキテクチャ

## 概要

このプロジェクトはフロント向けDDDとBulletproof寄りの構成を採用しています。

## レイヤー構成

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (app/, features/*/components)    │
│  - React Components                 │
│  - UI/UX                            │
└──────────────┬──────────────────────┘
               │ Props/Events
┌──────────────▼──────────────────────┐
│         Application Layer           │
│      (features/*/hooks)             │
│  - Custom Hooks                     │
│  - State Management                 │
└──────────────┬──────────────────────┘
               │ Function Calls
┌──────────────▼──────────────────────┐
│          Domain Layer               │
│         (domain/game)               │
│  - Business Logic                   │
│  - Pure Functions                   │
│  - No React Dependency              │
└─────────────────────────────────────┘
```

## ディレクトリ構造

**注意:** 以下は実装完了時の想定構造です。現状のリポジトリは Next.js のテンプレート状態（`app/` のみ）であり、`src/`、`domain/`、`features/` ディレクトリはまだ存在しません。

```
src/
├── domain/                    # ドメイン層
│   └── game/
│       ├── types.ts          # 型定義
│       ├── constants.ts      # 定数
│       ├── board.ts          # 盤面操作
│       ├── rules.ts          # ルール
│       ├── ai.ts             # AI
│       └── winner.ts         # 勝敗判定
│
├── features/                 # 機能単位
│   └── game/
│       ├── components/       # UIコンポーネント
│       │   ├── Board.tsx
│       │   ├── Cell.tsx
│       │   ├── GameInfo.tsx
│       │   ├── GameResult.tsx
│       │   ├── ModeSelect.tsx
│       │   └── PassNotification.tsx
│       ├── hooks/            # カスタムHooks
│       │   ├── useGame.ts
│       │   └── useCpuTurn.ts
│       └── GameContainer.tsx # Container Component
│
└── app/                      # Next.js App Router
    ├── page.tsx              # トップページ
    ├── layout.tsx            # レイアウト
    └── globals.css           # グローバルスタイル
```

## レイヤーごとの責務

### Domain Layer（ドメイン層）

**責務:**
- ゲームのビジネスロジック
- 純粋関数の実装
- React非依存

**原則:**
- 副作用を持たない
- 同じ入力に対して同じ出力
- UIから完全に分離

**例:**
```ts
// ✅ 純粋関数
export function applyMove(state: GameState, index: Position): GameState {
  // ...
}

// ❌ 副作用（NG）
export function applyMoveWithLogging(state: GameState, index: Position) {
  console.log("Moving to", index); // 副作用
  // ...
}
```

---

### Application Layer（アプリケーション層）

**責務:**
- ドメイン層とUI層の橋渡し
- 状態管理
- ユースケースの実装

**原則:**
- Hooksでロジックをカプセル化
- ドメイン関数を呼び出す
- UI詳細は知らない

**例:**
```ts
export function useGame(config: GameConfig | null) {
  const [state, setState] = useState<GameState>(initialState);

  const handleMove = useCallback((index: Position) => {
    setState(prev => applyMove(prev, index)); // ドメイン関数を呼ぶ
  }, []);

  return { state, handleMove };
}
```

---

### Presentation Layer（プレゼンテーション層）

**責務:**
- UIの描画
- ユーザー操作の受付
- 視覚的なフィードバック

**原則:**
- ビジネスロジックを持たない
- Propsで受け取ったデータを表示
- イベントハンドラーを呼ぶだけ

**例:**
```tsx
export function Cell({ value, isLegal, onClick }: CellProps) {
  return (
    <button onClick={onClick}>
      {value && <div className={`piece ${value}`} />}
    </button>
  );
}
```

---

## データフロー

### 下向きの流れ（Props）

```
GameContainer (state, handlers)
    ↓ Props
Board (board, legalMoves, onCellClick)
    ↓ Props
Cell (value, isLegal, onClick)
```

### 上向きの流れ（Events）

```
Cell (onClick)
    ↑ Event
Board (onCellClick)
    ↑ Event
GameContainer (handleMove → applyMove)
```

### 完全なフロー

```
1. User clicks Cell
2. Cell calls onClick
3. Board calls onCellClick(index)
4. GameContainer calls handleMove(index)
5. handleMove calls applyMove(state, index) ← Domain
6. Domain returns new state
7. setState updates state
8. React re-renders
9. New state flows down as Props
```

---

## 依存関係のルール

### 許可される依存

```
Presentation → Application → Domain ✅
```

### 禁止される依存

```
Domain → Application ❌
Domain → Presentation ❌
Application → Presentation ❌
```

**依存関係図:**

```
┌───────────────┐
│ Presentation  │
└───────┬───────┘
        │ depends on
        ▼
┌───────────────┐
│  Application  │
└───────┬───────┘
        │ depends on
        ▼
┌───────────────┐
│    Domain     │
└───────────────┘
```

---

## 設計パターン

### 1. Repository Pattern（将来の拡張）

ローカルストレージやAPIとの通信を抽象化：

```ts
interface GameRepository {
  save(state: GameState): Promise<void>;
  load(): Promise<GameState | null>;
}

class LocalStorageGameRepository implements GameRepository {
  async save(state: GameState): Promise<void> {
    localStorage.setItem('game', JSON.stringify(state));
  }

  async load(): Promise<GameState | null> {
    const data = localStorage.getItem('game');
    return data ? JSON.parse(data) : null;
  }
}
```

### 2. Factory Pattern

複雑なオブジェクト生成を隠蔽：

```ts
export function createGame(config: GameConfig): GameState {
  return {
    board: createInitialBoard(),
    currentPlayer: config.mode === "pvc" && config.userColor === "white"
      ? "black" // CPUが先手
      : "black",
  };
}
```

### 3. Strategy Pattern

評価関数の差し替え：

```ts
type EvaluationStrategy = (board: Board, player: Player) => number;

const positionStrategy: EvaluationStrategy = (board, player) => {
  // POSITION_WEIGHTS ベース
};

const mobilityStrategy: EvaluationStrategy = (board, player) => {
  // 機動力ベース
};

export function getBestMove(
  state: GameState,
  depth: number,
  strategy: EvaluationStrategy = positionStrategy
): Position | null {
  // ...
}
```

---

## スケーラビリティ

### 機能追加時の拡張方法

#### 1. オンライン対戦の追加

```
src/
├── domain/
│   ├── game/          # 既存
│   └── online/        # 新規
│       ├── types.ts
│       └── sync.ts
│
├── features/
│   ├── game/          # 既存
│   └── online/        # 新規
│       ├── components/
│       ├── hooks/
│       └── OnlineContainer.tsx
```

#### 2. リプレイ機能の追加

```ts
// domain層に追加
export type GameHistory = {
  moves: Position[];
  states: GameState[];
};

// hooks層に追加
function useReplay(history: GameHistory) {
  // リプレイ制御
}
```

---

## テスタビリティ

### レイヤーごとのテスト戦略

| レイヤー | テストツール | テスト内容 |
|---------|------------|-----------|
| Domain | Vitest | 純粋関数の単体テスト |
| Application | React Testing Library | Hooksの動作テスト |
| Presentation | React Testing Library | コンポーネントの描画テスト |

### ドメイン層のテスト

```ts
// 依存なしでテスト可能
describe('applyMove', () => {
  test('合法手を打つと石が裏返る', () => {
    const state = { board: createInitialBoard(), currentPlayer: "black" };
    const newState = applyMove(state, 19);
    expect(getScore(newState.board)).toEqual({ black: 4, white: 1 });
  });
});
```

---

## パフォーマンス

### レイヤーごとの最適化

**Domain層:**
- 純粋関数 → メモ化可能
- 不変データ → 変更検知が高速

**Application層:**
- useMemo/useCallback → 再計算を最小化
- 依存配列の最適化

**Presentation層:**
- React.memo → 不要な再レンダリング防止
- 仮想化（将来）

---

## 関連ドキュメント

- [ドメイン層](../domain/README.md)
- [Hooks設計](../hooks/README.md)
- [コンポーネント設計](../components/README.md)
- [設計方針（DESIGN.md）](../../DESIGN.md#-設計方針)
