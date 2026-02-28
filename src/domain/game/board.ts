import { TOTAL_CELLS } from "./constants";
import type { Board, Player } from "./types";

/**
 * オセロの初期石配置の位置
 * 8x8ボードの中央（d4、e4、d5、e5）に基づく
 */
const INITIAL_WHITE_TOP_LEFT = 27; // d4
const INITIAL_BLACK_TOP_RIGHT = 28; // e4
const INITIAL_BLACK_BOTTOM_LEFT = 35; // d5
const INITIAL_WHITE_BOTTOM_RIGHT = 36; // e5

/**
 * 標準的な初期配置でオセロボードを作成する
 * @returns 中央に4つの石が配置された64マスのボード
 */
export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: TOTAL_CELLS }, () => null);

  // 中央の初期配置を設定
  board[INITIAL_WHITE_TOP_LEFT] = "white";
  board[INITIAL_BLACK_TOP_RIGHT] = "black";
  board[INITIAL_BLACK_BOTTOM_LEFT] = "black";
  board[INITIAL_WHITE_BOTTOM_RIGHT] = "white";

  return board;
}

/**
 * 各プレイヤーのスコア（石の数）を計算する
 * @param board - スコアを計算するボード
 * @returns 黒石と白石の数を含むオブジェクト
 */
export function getScore(board: Board): { black: number; white: number } {
  return board.reduce(
    (acc, cell) => {
      if (cell === "black") acc.black++;
      else if (cell === "white") acc.white++;
      return acc;
    },
    { black: 0, white: 0 }
  );
}

/**
 * 相手プレイヤーを取得する
 * @param player - 現在のプレイヤー
 * @returns 相手プレイヤー
 */
export function getOpponent(player: Player): Player {
  return player === "black" ? "white" : "black";
}
