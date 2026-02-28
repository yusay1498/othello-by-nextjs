import { TOTAL_CELLS } from "./constants";
import type { Board, Player } from "./types";

/**
 * Creates the initial Othello board with the standard starting position
 * @returns A 64-cell board with the initial 4 pieces placed in the center
 */
export function createInitialBoard(): Board {
  const board: Board = new Array(TOTAL_CELLS).fill(null);

  // Set initial center pieces
  board[27] = "white"; // d4
  board[28] = "black"; // e4
  board[35] = "black"; // d5
  board[36] = "white"; // e5

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
