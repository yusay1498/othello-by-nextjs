# Hooks設計

## 概要

カスタムフックの設計と実装ガイドです。ゲーム状態管理とCPU思考制御を担当します。

## Hooks一覧

### useGame

**役割:** ゲーム全体の状態管理

**シグネチャ:**

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

**実装例:**

```ts
export function useGame(config: GameConfig | null) {
  // 初期状態
  const [state, setState] = useState<GameState>(() => ({
    board: createInitialBoard(),
    currentPlayer: "black",
  }));

  const [isCpuThinking, setIsCpuThinking] = useState(false);
  const [passPlayer, setPassPlayer] = useState<Player | null>(null);

  // 導出値
  const legalMoves = useMemo(() => getLegalMoves(state), [state]);
  const score = useMemo(() => getScore(state.board), [state.board]);
  const gameOver = useMemo(() => isGameOver(state), [state]);
  const result = useMemo(
    () => getGameResult(state.board, gameOver),
    [state.board, gameOver]
  );

  // 手を打つ
  const handleMove = useCallback((index: Position) => {
    if (gameOver || isCpuThinking) return;

    const prevState = state;
    const newState = applyMove(state, index);

    // 状態が変わらない＝不正な手
    if (prevState === newState) return;

    setState(newState);

    // パス判定
    if (newState.currentPlayer === prevState.currentPlayer) {
      const opponent = getOpponent(prevState.currentPlayer);
      setPassPlayer(opponent);
      const timer = setTimeout(() => setPassPlayer(null), 1000);
      // cleanup不要（setPassPlayerはアンマウント後も安全）
    }
  }, [state, gameOver, isCpuThinking]);

  // リスタート
  const handleRestart = useCallback(() => {
    setState({
      board: createInitialBoard(),
      currentPlayer: "black",
    });
    setPassPlayer(null);
  }, []);

  // メニューに戻る
  const handleBackToMenu = useCallback(() => {
    // 親コンポーネントでconfigをnullにする
  }, []);

  return {
    state,
    config,
    legalMoves,
    score,
    result,
    isGameOver: gameOver,
    isCpuThinking,
    passPlayer,
    handleMove,
    handleRestart,
    handleBackToMenu,
  };
}
```

---

### useCpuTurn

**役割:** CPU対戦時の自動思考制御

**シグネチャ:**

```ts
function useCpuTurn(
  state: GameState,
  config: GameConfig | null,
  onMove: (index: Position) => void
): void
```

**実装例:**

```ts
export function useCpuTurn(
  state: GameState,
  config: GameConfig | null,
  onMove: (index: Position) => void
) {
  useEffect(() => {
    // CPU対戦でないまたは人間のターン
    if (config?.mode !== "pvc") return;
    if (state.currentPlayer === config.userColor) return;

    // ゲーム終了
    if (isGameOver(state)) return;

    // CPU思考
    const timer = setTimeout(() => {
      const bestMove = getBestMove(state, 2);
      if (bestMove !== null) {
        onMove(bestMove);
      }
    }, 500); // 0.5秒待機（自然な動きのため）

    return () => clearTimeout(timer);
  }, [state, config, onMove]);
}
```

**cleanup処理:**

```ts
// コンポーネントのアンマウント時にタイマーをクリア
useEffect(() => {
  const timer = setTimeout(() => {
    // CPU思考
  }, 500);

  return () => clearTimeout(timer); // cleanup
}, [state]);
```

---

## Hooks設計のベストプラクティス

### 1. 単一責任の原則

```ts
// ✅ 良い例：役割が明確
function useGame() { /* ゲーム状態管理 */ }
function useCpuTurn() { /* CPU思考制御 */ }

// ❌ 悪い例：責務が混在
function useGameWithCpu() { /* すべて */ }
```

### 2. useMemoで導出値を最適化

```ts
// ✅ 良い例：必要な時だけ再計算
const legalMoves = useMemo(() => getLegalMoves(state), [state]);

// ❌ 悪い例：毎回計算
const legalMoves = getLegalMoves(state);
```

### 3. useCallbackでハンドラーを安定化

```ts
// ✅ 良い例
const handleMove = useCallback((index: Position) => {
  // ...
}, [state, isGameOver]);

// ❌ 悪い例：毎回新しい関数が生成される
const handleMove = (index: Position) => {
  // ...
};
```

### 4. useEffectのcleanup

```ts
useEffect(() => {
  const timer = setTimeout(() => {
    // 処理
  }, 500);

  // cleanup関数を必ず返す
  return () => clearTimeout(timer);
}, [dependencies]);
```

---

## テスト

### useGameのテスト

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
});
```

### useCpuTurnのテスト

```ts
import { vi } from 'vitest';

describe('useCpuTurn', () => {
  vi.useFakeTimers();

  test('CPUのターンで自動的に手を打つ', () => {
    const onMove = vi.fn();
    const state = {
      board: createInitialBoard(),
      currentPlayer: "white" as Player,
    };
    const config = {
      mode: "pvc" as GameMode,
      userColor: "black" as PlayerColor,
    };

    renderHook(() => useCpuTurn(state, config, onMove));

    // 500ms後にonMoveが呼ばれる
    vi.advanceTimersByTime(500);

    expect(onMove).toHaveBeenCalledTimes(1);
  });
});
```

---

## パフォーマンス考慮事項

### 1. 不要な再計算を避ける

```ts
// useMemoで最適化
const legalMoves = useMemo(() => getLegalMoves(state), [state]);
const score = useMemo(() => getScore(state.board), [state.board]);
```

### 2. 依存配列を正確に

```ts
// ✅ 正確な依存配列
useEffect(() => {
  // state を使用
}, [state]);

// ❌ 依存配列の漏れ
useEffect(() => {
  // state を使用
}, []); // Warning: Missing dependency
```

### 3. イベントハンドラーの安定化

```ts
// useCallbackで安定化
const handleMove = useCallback((index: Position) => {
  setState(prev => applyMove(prev, index));
}, []); // 依存なし（setStateの関数形式を使用）
```

---

## カスタムHooksの拡張

### useGameHistory（履歴機能）

```ts
function useGameHistory(state: GameState) {
  const [history, setHistory] = useState<GameState[]>([state]);

  const addHistory = useCallback((newState: GameState) => {
    setHistory(prev => [...prev, newState]);
  }, []);

  const undo = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      return newHistory[newHistory.length - 1];
    }
  }, [history]);

  return { history, addHistory, undo };
}
```

### useTimer（制限時間機能）

```ts
function useTimer(initialTime: number) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  return { timeLeft, isRunning, setIsRunning };
}
```

---

## 関連ドキュメント

- [コンポーネント設計](../components/README.md)
- [ドメイン層](../domain/README.md)
- [データフロー（DESIGN.md）](../../DESIGN.md#-データフロー)
