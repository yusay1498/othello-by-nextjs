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
 * @param onPass - パスする際のコールバック関数
 * @param setIsCpuThinking - CPU思考中フラグの更新関数
 */
export function useCpuTurn(
  state: GameState,
  config: GameConfig | null,
  isGameOver: boolean,
  onMove: (index: Position) => void,
  onPass: () => void,
  setIsCpuThinking: (thinking: boolean) => void
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // onMove、onPass、setIsCpuThinkingの最新値をrefで保持（effectの再実行を防ぐ）
  const onMoveRef = useRef(onMove);
  const onPassRef = useRef(onPass);
  const setIsCpuThinkingRef = useRef(setIsCpuThinking);

  // 常に最新の値でrefを更新
  useEffect(() => {
    onMoveRef.current = onMove;
    onPassRef.current = onPass;
    setIsCpuThinkingRef.current = setIsCpuThinking;
  });

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
    setIsCpuThinkingRef.current(true);

    // 500ms後にCPUの手を実行
    timerRef.current = setTimeout(() => {
      const bestMove = getBestMove(state);

      // CPU思考中フラグを下ろす（手を打つ前に下ろす）
      setIsCpuThinkingRef.current(false);

      // 合法手がある場合は手を打つ、ない場合はパス
      if (bestMove !== null) {
        onMoveRef.current(bestMove);
      } else {
        onPassRef.current();
      }

      timerRef.current = null;
    }, 500);

    // クリーンアップ: タイマーをクリア
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsCpuThinkingRef.current(false);
    };
  }, [state, config, isGameOver]);
}
