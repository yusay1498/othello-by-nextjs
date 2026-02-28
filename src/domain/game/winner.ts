import { TOTAL_CELLS } from './constants';
import { getScore } from './board';
import type { Board, Player, WinnerResult } from './types';

/**
 * ゲームの勝敗結果を返す
 * @param board - 判定する盤面
 * @param gameOver - ゲーム終了フラグ
 * @returns WinnerResult型のオブジェクト
 */
export function getGameResult(
  board: Board,
  gameOver: boolean
): WinnerResult {
  // ゲームが終了していない
  if (!gameOver) {
    return { type: 'playing' };
  }

  // スコアを計算
  const score = getScore(board);

  // 引き分け
  if (score.black === score.white) {
    return { type: 'draw' };
  }

  // 勝者を決定
  const winner: Player = score.black > score.white ? 'black' : 'white';

  // パーフェクト勝利の判定
  const perfect = score.black === TOTAL_CELLS || score.white === TOTAL_CELLS;

  return {
    type: 'win',
    winner,
    perfect,
  };
}
