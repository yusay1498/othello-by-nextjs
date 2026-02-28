import { useEffect, useRef } from "react";
import type { GameState, GameConfig, Position } from "@/domain/game/types";
import { getBestMove } from "@/domain/game/ai";

/**
 * useCpuTurn - CPU手番の自動実行を管理するカスタムフック
 *
 * @param state - 現在のゲーム状態
 * @param config - ゲーム設定（null の場合は何もしない）
 * @param isGameOver - ゲーム終了フラグ
 * @param onMove - 手を打つ際のコールバック関数
 * @param setIsCpuThinking - CPU思考中フラグの更新関数
 */
export function useCpuTurn(
  state: GameState,
  config: GameConfig | null,
  isGameOver: boolean,
  onMove: (index: Position) => void,
  setIsCpuThinking: (thinking: boolean) => void
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // クリーンアップ関数
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // CPU対戦モードでない場合は何もしない
    if (!config || config.mode !== "pvc") {
      return;
    }

    // ゲーム終了している場合は何もしない
    if (isGameOver) {
      return;
    }

    // 現在の手番がCPUでない場合は何もしない（ユーザーの手番）
    if (state.currentPlayer === config.userColor) {
      return;
    }

    // CPU思考中フラグを立てる
    setIsCpuThinking(true);

    // 500ms後にCPUの手を実行
    timerRef.current = setTimeout(() => {
      const bestMove = getBestMove(state);

      // 合法手がある場合のみ手を打つ
      if (bestMove !== null) {
        onMove(bestMove);
      }

      // CPU思考中フラグを下ろす
      setIsCpuThinking(false);
      timerRef.current = null;
    }, 500);

    // クリーンアップ: タイマーをクリア
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsCpuThinking(false);
    };
  }, [state, config, isGameOver, onMove, setIsCpuThinking]);
}
