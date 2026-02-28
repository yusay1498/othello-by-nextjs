# テスト戦略

## 概要

このプロジェクトのテスト方針と具体的なテスト手法について説明します。

## テスト方針

### 基本原則

1. **ドメイン層を優先**
   - ビジネスロジックは80%以上のカバレッジ
   - 純粋関数なので高速にテスト可能

2. **UI層は主要パスのみ**
   - コストが高いため重要な部分に絞る
   - スナップショットテストは最小限

3. **統合テストも実施**
   - ドメイン層とHooks層の連携
   - E2Eは必要に応じて

## テストツール

| ツール | 用途 |
|--------|------|
| Vitest | ドメイン層の単体テスト |
| React Testing Library | Hooks・コンポーネントのテスト |
| Playwright（将来） | E2Eテスト |

## カバレッジ目標

| レイヤー | 目標 | 理由 |
|---------|------|------|
| ドメイン層 | > 80% | 最重要。ビジネスロジック |
| Hooks層 | > 60% | 状態管理の検証 |
| コンポーネント層 | 主要パス | コストと効果のバランス |

---

## ドメイン層のテスト

### board.ts のテスト

```ts
import { describe, test, expect } from 'vitest';
import { createInitialBoard, getScore, getOpponent } from './board';

describe('board', () => {
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
  });

  describe('getOpponent', () => {
    test('blackの相手はwhite', () => {
      expect(getOpponent("black")).toBe("white");
    });

    test('whiteの相手はblack', () => {
      expect(getOpponent("white")).toBe("black");
    });
  });
});
```

### rules.ts のテスト

```ts
import { describe, test, expect } from 'vitest';
import { getLegalMoves, applyMove, isGameOver } from './rules';

describe('rules', () => {
  describe('getLegalMoves', () => {
    test('初期盤面の黒の合法手は4つ', () => {
      const state = {
        board: createInitialBoard(),
        currentPlayer: "black" as Player,
      };
      const moves = getLegalMoves(state);
      expect(moves).toHaveLength(4);
      expect(moves).toContain(19);
      expect(moves).toContain(26);
      expect(moves).toContain(37);
      expect(moves).toContain(44);
    });

    test('合法手がない場合は空配列', () => {
      const board = new Array(64).fill("black");
      board[0] = null;
      const state = { board, currentPlayer: "black" as Player };
      const moves = getLegalMoves(state);
      expect(moves).toEqual([]);
    });
  });

  describe('applyMove', () => {
    test('合法手を打つと石が裏返る', () => {
      const state = {
        board: createInitialBoard(),
        currentPlayer: "black" as Player,
      };

      const newState = applyMove(state, 19);

      expect(newState.board[19]).toBe("black");
      expect(newState.board[27]).toBe("black");
      expect(getScore(newState.board)).toEqual({ black: 4, white: 1 });
    });

    test('不正な手は状態を変更しない', () => {
      const state = {
        board: createInitialBoard(),
        currentPlayer: "black" as Player,
      };

      const newState = applyMove(state, 0);
      expect(newState).toBe(state);
    });
  });

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
  });
});
```

### ai.ts のテスト

```ts
import { describe, test, expect } from 'vitest';
import { getBestMove, evaluateBoard } from './ai';

describe('ai', () => {
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
  });

  describe('evaluateBoard', () => {
    test('初期盤面は互角', () => {
      const board = createInitialBoard();
      const score = evaluateBoard(board, "black");
      expect(Math.abs(score)).toBeLessThan(10);
    });

    test('角を取ると高評価', () => {
      const board = createInitialBoard();
      board[0] = "black";

      const score = evaluateBoard(board, "black");
      expect(score).toBeGreaterThan(100);
    });
  });
});
```

---

## Hooks層のテスト

### useGame のテスト

```ts
import { renderHook, act } from '@testing-library/react';
import { useGame } from './useGame';

describe('useGame', () => {
  test('初期状態が正しい', () => {
    const { result } = renderHook(() => useGame({
      mode: "pvp",
      userColor: "black",
    }));

    expect(result.current.state.currentPlayer).toBe("black");
    expect(result.current.legalMoves).toHaveLength(4);
    expect(result.current.isGameOver).toBe(false);
  });

  test('手を打つと状態が更新される', () => {
    const { result } = renderHook(() => useGame({
      mode: "pvp",
      userColor: "black",
    }));

    act(() => {
      result.current.handleMove(19);
    });

    expect(result.current.state.currentPlayer).toBe("white");
    expect(result.current.score.black).toBe(4);
  });

  test('不正な手は無視される', () => {
    const { result } = renderHook(() => useGame({
      mode: "pvp",
      userColor: "black",
    }));

    const prevPlayer = result.current.state.currentPlayer;

    act(() => {
      result.current.handleMove(0); // 不正な手
    });

    expect(result.current.state.currentPlayer).toBe(prevPlayer);
  });

  test('リスタートで初期状態に戻る', () => {
    const { result } = renderHook(() => useGame({
      mode: "pvp",
      userColor: "black",
    }));

    // 手を打つ
    act(() => {
      result.current.handleMove(19);
    });

    // リスタート
    act(() => {
      result.current.handleRestart();
    });

    expect(result.current.state.currentPlayer).toBe("black");
    expect(result.current.score).toEqual({ black: 2, white: 2 });
  });
});
```

---

## コンポーネント層のテスト

### Cell のテスト

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Cell } from './Cell';

describe('Cell', () => {
  test('空のマスを描画', () => {
    render(
      <Cell
        value={null}
        isLegal={false}
        onClick={() => {}}
        disabled={false}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toBeInTheDocument();
  });

  test('黒石を描画', () => {
    render(
      <Cell
        value="black"
        isLegal={false}
        onClick={() => {}}
        disabled={false}
      />
    );

    const piece = screen.getByRole('button').querySelector('.piece.black');
    expect(piece).toBeInTheDocument();
  });

  test('合法手マーカーを表示', () => {
    render(
      <Cell
        value={null}
        isLegal={true}
        onClick={() => {}}
        disabled={false}
      />
    );

    const indicator = screen.getByRole('button').querySelector('.legal-indicator');
    expect(indicator).toBeInTheDocument();
  });

  test('クリックでonClickが呼ばれる', () => {
    const onClick = jest.fn();

    render(
      <Cell
        value={null}
        isLegal={true}
        onClick={onClick}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('disabled時はクリックできない', () => {
    const onClick = jest.fn();

    render(
      <Cell
        value={null}
        isLegal={false}
        onClick={onClick}
        disabled={true}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
```

### Board のテスト

```tsx
import { render, screen } from '@testing-library/react';
import { Board } from './Board';
import { createInitialBoard } from '@/domain/game/board';

describe('Board', () => {
  test('64個のセルを描画', () => {
    render(
      <Board
        board={createInitialBoard()}
        legalMoves={[]}
        onCellClick={() => {}}
        disabled={false}
      />
    );

    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(64);
  });

  test('合法手のマーカーを表示', () => {
    const board = createInitialBoard();
    const legalMoves = [19, 26, 37, 44];

    const { container } = render(
      <Board
        board={board}
        legalMoves={legalMoves}
        onCellClick={() => {}}
        disabled={false}
      />
    );

    const legalCells = container.querySelectorAll('.cell.legal');
    expect(legalCells).toHaveLength(4);
  });
});
```

---

## 統合テスト

### ゲームフロー全体のテスト

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { GameContainer } from './GameContainer';

describe('GameContainer Integration', () => {
  test('完全なゲームフロー', async () => {
    render(<GameContainer />);

    // モード選択
    fireEvent.click(screen.getByText('2人対戦'));
    fireEvent.click(screen.getByText('ゲーム開始'));

    // 初期状態
    expect(screen.getByText(/黒の番/)).toBeInTheDocument();

    // 手を打つ
    const cells = screen.getAllByRole('button');
    const legalCell = cells.find(cell =>
      cell.classList.contains('legal')
    );

    if (legalCell) {
      fireEvent.click(legalCell);
    }

    // 手番が変わる
    expect(screen.getByText(/白の番/)).toBeInTheDocument();
  });
});
```

---

## テストのベストプラクティス

### 1. AAA パターン

```ts
test('説明', () => {
  // Arrange: 準備
  const state = createInitialState();

  // Act: 実行
  const result = applyMove(state, 19);

  // Assert: 検証
  expect(result.board[19]).toBe("black");
});
```

### 2. 1テスト1アサーション（原則）

```ts
// ✅ 良い例
test('黒石が配置される', () => {
  const result = applyMove(state, 19);
  expect(result.board[19]).toBe("black");
});

test('白石が裏返る', () => {
  const result = applyMove(state, 19);
  expect(result.board[27]).toBe("black");
});

// ❌ 悪い例（複数の検証）
test('applyMoveの動作', () => {
  const result = applyMove(state, 19);
  expect(result.board[19]).toBe("black");
  expect(result.board[27]).toBe("black");
  expect(result.currentPlayer).toBe("white");
  // 何をテストしているか不明確
});
```

### 3. テストの独立性

```ts
// ✅ 良い例：各テストで初期化
describe('rules', () => {
  test('テスト1', () => {
    const state = createInitialState(); // 独立
    // ...
  });

  test('テスト2', () => {
    const state = createInitialState(); // 独立
    // ...
  });
});

// ❌ 悪い例：状態を共有
describe('rules', () => {
  let state = createInitialState(); // 共有

  test('テスト1', () => {
    state = applyMove(state, 19); // 変更
  });

  test('テスト2', () => {
    // state は前のテストの影響を受ける
  });
});
```

---

## CI/CD統合

### GitHub Actions 設定例

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Check coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## パフォーマンステスト

### ベンチマーク

```ts
import { describe, test, expect } from 'vitest';
import { performance } from 'perf_hooks';

describe('Performance', () => {
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

---

## 関連ドキュメント

- [ドメイン層](../domain/README.md)
- [Hooks設計](../hooks/README.md)
- [コンポーネント設計](../components/README.md)
- [テスト戦略（DESIGN.md）](../../DESIGN.md#-テスト戦略)
