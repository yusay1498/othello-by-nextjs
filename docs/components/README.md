# コンポーネント設計

## 概要

UIコンポーネントの設計と実装ガイドです。Reactの関数コンポーネントとTypeScriptを使用し、プレゼンテーション層を構築します。

## 設計原則

### 1. UIとドメインの分離

- コンポーネントはドメインロジックを持たない
- ビジネスロジックはhooksまたはdomain層に委譲
- Propsで必要なデータを受け取る

### 2. 単一責任の原則

- 各コンポーネントは1つの役割のみ
- 複雑なコンポーネントは小さく分割

### 3. 再利用性

- 汎用的なコンポーネントは共通化
- Propsで振る舞いをカスタマイズ可能に

## コンポーネント階層

```
GameContainer (Container Component)
├── ModeSelect (モード選択)
├── GameInfo (情報表示)
├── Board (盤面)
│   └── Cell × 64 (各マス)
├── PassNotification (パス通知)
└── GameResult (結果モーダル)
```

---

## 各コンポーネント詳細

### GameContainer

**役割:** ゲーム全体の状態管理とコンポーネントの統合

**責務:**
- ゲーム状態の管理（useGame hook使用）
- CPU思考の制御（useCpuTurn hook使用）
- 子コンポーネントへのProps配布

**実装例:**

```tsx
export function GameContainer() {
  const [config, setConfig] = useState<GameConfig | null>(null);
  const game = useGame(config);
  useCpuTurn(game.state, game.config, game.handleMove);

  if (!config) {
    return <ModeSelect onSelectMode={setConfig} />;
  }

  return (
    <div className="game-container">
      <GameInfo
        currentPlayer={game.state.currentPlayer}
        score={game.score}
        isCpuThinking={game.isCpuThinking}
      />

      <Board
        board={game.state.board}
        legalMoves={game.legalMoves}
        onCellClick={game.handleMove}
        disabled={game.isCpuThinking || game.isGameOver}
      />

      {game.passPlayer && (
        <PassNotification
          player={game.passPlayer}
          duration={1000}
        />
      )}

      {game.isGameOver && (
        <GameResult
          result={game.result}
          score={game.score}
          onRestart={game.handleRestart}
          onBackToMenu={game.handleBackToMenu}
        />
      )}
    </div>
  );
}
```

---

### ModeSelect

**役割:** ゲーム開始時のモード選択画面

**Props:**

```ts
interface ModeSelectProps {
  onSelectMode: (config: GameConfig) => void;
}
```

**実装例:**

```tsx
export function ModeSelect({ onSelectMode }: ModeSelectProps) {
  const [mode, setMode] = useState<GameMode>("pvp");
  const [userColor, setUserColor] = useState<PlayerColor>("black");

  const handleStart = () => {
    onSelectMode({ mode, userColor });
  };

  return (
    <div className="mode-select">
      <h2>ゲームモード選択</h2>

      <div className="mode-options">
        <button
          onClick={() => setMode("pvp")}
          className={mode === "pvp" ? "active" : ""}
        >
          2人対戦
        </button>
        <button
          onClick={() => setMode("pvc")}
          className={mode === "pvc" ? "active" : ""}
        >
          CPU対戦
        </button>
      </div>

      {mode === "pvc" && (
        <div className="color-select">
          <label>
            <input
              type="radio"
              checked={userColor === "black"}
              onChange={() => setUserColor("black")}
            />
            黒（先手）
          </label>
          <label>
            <input
              type="radio"
              checked={userColor === "white"}
              onChange={() => setUserColor("white")}
            />
            白（後手）
          </label>
        </div>
      )}

      <button onClick={handleStart} className="start-button">
        ゲーム開始
      </button>
    </div>
  );
}
```

---

### GameInfo

**役割:** 現在の手番とスコアを表示

**Props:**

```ts
interface GameInfoProps {
  currentPlayer: Player;
  score: { black: number; white: number };
  isCpuThinking: boolean;
}
```

**実装例:**

```tsx
export function GameInfo({ currentPlayer, score, isCpuThinking }: GameInfoProps) {
  return (
    <div className="game-info">
      <div className="current-turn">
        <span className={`player ${currentPlayer}`}>
          {currentPlayer === "black" ? "⚫ 黒" : "⚪ 白"}
        </span>
        の番
        {isCpuThinking && <span className="thinking">（思考中...）</span>}
      </div>

      <div className="score">
        <div className="score-item">
          <span className="player black">⚫ 黒</span>
          <span className="count">{score.black}</span>
        </div>
        <div className="score-item">
          <span className="player white">⚪ 白</span>
          <span className="count">{score.white}</span>
        </div>
      </div>
    </div>
  );
}
```

---

### Board

**役割:** 8x8の盤面を表示

**Props:**

```ts
interface BoardProps {
  board: Board;
  legalMoves: Position[];
  onCellClick: (index: Position) => void;
  disabled: boolean;
}
```

**実装例:**

```tsx
export function Board({ board, legalMoves, onCellClick, disabled }: BoardProps) {
  return (
    <div className="board">
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          isLegal={legalMoves.includes(index)}
          onClick={() => onCellClick(index)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
```

**スタイリング例:**

```css
.board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 2px;
  background-color: #0a8a3d;
  padding: 8px;
  border-radius: 8px;
  aspect-ratio: 1;
  max-width: 600px;
}
```

---

### Cell

**役割:** 盤面の1マスを表示

**Props:**

```ts
interface CellProps {
  value: Cell;
  isLegal: boolean;
  onClick: () => void;
  disabled: boolean;
}
```

**実装例:**

```tsx
export function Cell({ value, isLegal, onClick, disabled }: CellProps) {
  const handleClick = () => {
    if (!disabled && isLegal) {
      onClick();
    }
  };

  return (
    <button
      className={`cell ${value || ""} ${isLegal ? "legal" : ""}`}
      onClick={handleClick}
      disabled={disabled && !isLegal}
    >
      {value && (
        <div className={`piece ${value}`} />
      )}
      {isLegal && !value && (
        <div className="legal-indicator" />
      )}
    </button>
  );
}
```

**スタイリング例:**

```css
.cell {
  aspect-ratio: 1;
  background-color: #0a8a3d;
  border: 1px solid #0a6a2d;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell.legal {
  cursor: pointer;
}

.cell.legal .legal-indicator {
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
}

.piece {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  transition: transform 0.3s;
}

.piece.black {
  background-color: #000;
}

.piece.white {
  background-color: #fff;
}
```

---

### PassNotification

**役割:** パス発生時のトースト通知

**Props:**

```ts
interface PassNotificationProps {
  player: Player | null;
  duration: number;
}
```

**実装例:**

```tsx
export function PassNotification({ player, duration }: PassNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (player) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [player, duration]);

  if (!visible || !player) return null;

  const playerText = player === "black" ? "黒" : "白";

  return (
    <div className="pass-notification">
      <p>{playerText}はパスです</p>
    </div>
  );
}
```

**スタイリング例:**

```css
.pass-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  animation: fadeIn 0.3s;
  z-index: 1000;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
```

---

### GameResult

**役割:** ゲーム終了時の結果モーダル

**Props:**

```ts
interface GameResultProps {
  result: WinnerResult;
  score: { black: number; white: number };
  onRestart: () => void;
  onBackToMenu: () => void;
}
```

**実装例:**

```tsx
export function GameResult({ result, score, onRestart, onBackToMenu }: GameResultProps) {
  if (result.type === "playing") return null;

  const getMessage = () => {
    switch (result.type) {
      case "draw":
        return `引き分け (${score.black}-${score.white})`;
      case "win":
        const winnerText = result.winner === "black" ? "黒" : "白";
        if (result.perfect) {
          return `${winnerText}のパーフェクト勝利！`;
        }
        return `${winnerText}の勝ち！`;
    }
  };

  return (
    <div className="game-result-modal">
      <div className="modal-content">
        <h2>{getMessage()}</h2>
        <div className="final-score">
          <div>⚫ 黒: {score.black}</div>
          <div>⚪ 白: {score.white}</div>
        </div>
        <div className="actions">
          <button onClick={onRestart}>もう一度</button>
          <button onClick={onBackToMenu}>メニューに戻る</button>
        </div>
      </div>
    </div>
  );
}
```

---

## アクセシビリティ

### キーボード操作（v1では未実装）

将来的な拡張案：

```tsx
// キーボードでセルを選択
<Cell
  tabIndex={0}
  onKeyPress={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick();
    }
  }}
/>
```

### ARIA属性

```tsx
<button
  className="cell"
  aria-label={`マス ${index}${isLegal ? "（置けます）" : ""}`}
  aria-disabled={disabled}
>
```

---

## レスポンシブ対応

```css
/* スマートフォン */
@media (max-width: 640px) {
  .board {
    max-width: 100%;
    width: calc(100vw - 32px);
  }
}

/* タブレット */
@media (min-width: 641px) and (max-width: 1024px) {
  .board {
    max-width: 500px;
  }
}

/* PC */
@media (min-width: 1025px) {
  .board {
    max-width: 600px;
  }
}
```

---

## パフォーマンス最適化

### React.memoの使用

```tsx
export const Cell = React.memo(function Cell({ value, isLegal, onClick, disabled }: CellProps) {
  // ...
});
```

### useCallbackの使用

```tsx
const handleCellClick = useCallback((index: Position) => {
  if (!disabled) {
    onCellClick(index);
  }
}, [disabled, onCellClick]);
```

---

## 関連ドキュメント

- [Hooks設計](../hooks/README.md)
- [データフロー（DESIGN.md）](../../DESIGN.md#-データフロー)
- [コンポーネント設計（DESIGN.md）](../../DESIGN.md#-コンポーネント設計)
