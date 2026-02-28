import { useState, useMemo, useCallback } from "react";
import type {
  GameConfig,
  GameState,
  Player,
  Position,
  WinnerResult,
} from "@/domain/game/types";
import { createInitialBoard, getScore, getOpponent } from "@/domain/game/board";
import { getLegalMoves, applyMove, isGameOver } from "@/domain/game/rules";
import { getGameResult } from "@/domain/game/winner";

/**
 * useGame - ゲーム全体の状態管理を行うカスタムフック
 *
 * @param config - ゲーム設定（null の場合はモード選択画面を表示）
 * @returns ゲーム状態と操作関数
 */
export function useGame(config: GameConfig | null) {
  // 初期状態
  const [state, setState] = useState<GameState>(() => ({
    board: createInitialBoard(),
    currentPlayer: "black",
  }));

  const [isCpuThinking, setIsCpuThinking] = useState(false);
  const [passPlayer, setPassPlayer] = useState<Player | null>(null);

  // 導出値 - useMemoで最適化
  const legalMoves = useMemo(() => getLegalMoves(state), [state]);
  const score = useMemo(() => getScore(state.board), [state.board]);
  const gameOver = useMemo(() => isGameOver(state), [state]);
  const result = useMemo(
    () => getGameResult(state.board, gameOver),
    [state.board, gameOver]
  );

  // 手を打つ
  const handleMove = useCallback(
    (index: Position) => {
      // ゲーム終了またはCPU思考中は操作不可
      if (gameOver || isCpuThinking) return;

      const prevState = state;
      const newState = applyMove(state, index);

      // 状態が変わらない＝不正な手
      if (prevState === newState) return;

      setState(newState);

      // パス判定: 手番が変わらなかった場合は相手がパス
      if (newState.currentPlayer === prevState.currentPlayer) {
        const opponent = getOpponent(prevState.currentPlayer);
        setPassPlayer(opponent);
        setTimeout(() => setPassPlayer(null), 1000);
      }
    },
    [state, gameOver, isCpuThinking]
  );

  // リスタート
  const handleRestart = useCallback(() => {
    setState({
      board: createInitialBoard(),
      currentPlayer: "black",
    });
    setPassPlayer(null);
    setIsCpuThinking(false);
  }, []);

  // メニューに戻る - 親コンポーネントでconfigをnullにする必要がある
  const handleBackToMenu = useCallback(() => {
    // この関数は親コンポーネントでconfigをnullに設定するために使用される
    handleRestart();
  }, [handleRestart]);

  return {
    state,
    config,
    legalMoves,
    score,
    result,
    isGameOver: gameOver,
    isCpuThinking,
    setIsCpuThinking,
    passPlayer,
    handleMove,
    handleRestart,
    handleBackToMenu,
  };
}
