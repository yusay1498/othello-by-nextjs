import { TOTAL_CELLS } from "./constants";
import type { Board, Player } from "./types";

/**
 * Initial piece positions for standard Othello starting position
 * Based on 8x8 board center (d4, e4, d5, e5)
 */
const INITIAL_WHITE_TOP_LEFT = 27; // d4
const INITIAL_BLACK_TOP_RIGHT = 28; // e4
const INITIAL_BLACK_BOTTOM_LEFT = 35; // d5
const INITIAL_WHITE_BOTTOM_RIGHT = 36; // e5

/**
 * Creates the initial Othello board with the standard starting position
 * @returns A 64-cell board with the initial 4 pieces placed in the center
 */
export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: TOTAL_CELLS }, () => null);

  // Set initial center pieces
  board[INITIAL_WHITE_TOP_LEFT] = "white";
  board[INITIAL_BLACK_TOP_RIGHT] = "black";
  board[INITIAL_BLACK_BOTTOM_LEFT] = "black";
  board[INITIAL_WHITE_BOTTOM_RIGHT] = "white";

  return board;
}

/**
 * Calculates the score (number of pieces) for each player
 * @param board - The board to calculate scores for
 * @returns An object containing the count of black and white pieces
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
 * Gets the opponent player
 * @param player - The current player
 * @returns The opponent player
 */
export function getOpponent(player: Player): Player {
  return player === "black" ? "white" : "black";
}
