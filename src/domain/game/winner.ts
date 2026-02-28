import type { Board, Player, WinnerResult } from "./types";
import { getScore } from "./board";

/**
 * Determines the game result based on the board state
 * @param board - The game board
 * @param gameOver - Whether the game has ended
 * @returns The game result (playing, draw, or win with details)
 */
export function getGameResult(
  board: Board,
  gameOver: boolean
): WinnerResult {
  // Game is still in progress
  if (!gameOver) {
    return { type: "playing" };
  }

  // Calculate scores
  const score = getScore(board);

  // Draw
  if (score.black === score.white) {
    return { type: "draw" };
  }

  // Determine winner
  const winner: Player = score.black > score.white ? "black" : "white";

  // Check for perfect game (64-0)
  const perfect = score.black === 64 || score.white === 64;

  return {
    type: "win",
    winner,
    perfect,
  };
}
