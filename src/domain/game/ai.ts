import { POSITION_WEIGHTS, TOTAL_CELLS } from "./constants";
import type { Board, GameState, Player, Position } from "./types";
import { getOpponent } from "./board";
import { getLegalMoves, applyMove, isGameOver } from "./rules";

/**
 * Evaluates the board position for a given player
 * @param board - The game board to evaluate
 * @param player - The player to evaluate for
 * @returns Evaluation score (higher is better for the player)
 */
export function evaluateBoard(board: Board, player: Player): number {
  const opponent = getOpponent(player);
  let score = 0;

  // Position-based evaluation using weights
  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (board[i] === player) {
      score += POSITION_WEIGHTS[i];
    } else if (board[i] === opponent) {
      score -= POSITION_WEIGHTS[i];
    }
  }

  return score;
}

/**
 * Minimax algorithm implementation
 * @param state - Current game state
 * @param depth - Remaining search depth
 * @param isMaximizing - Whether this is a maximizing node (AI's turn)
 * @param aiPlayer - The player the AI is playing as
 * @returns Evaluation score
 */
function minimax(
  state: GameState,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  // Terminal condition: reached depth limit or game over
  if (depth === 0 || isGameOver(state)) {
    return evaluateBoard(state.board, aiPlayer);
  }

  const legalMoves = getLegalMoves(state);

  // No legal moves (pass) - switch to opponent
  if (legalMoves.length === 0) {
    const nextState = {
      ...state,
      currentPlayer: getOpponent(state.currentPlayer),
    };
    return minimax(nextState, depth - 1, !isMaximizing, aiPlayer);
  }

  if (isMaximizing) {
    // AI's turn: maximize score
    let maxScore = -Infinity;

    for (const move of legalMoves) {
      const nextState = applyMove(state, move);
      const score = minimax(nextState, depth - 1, false, aiPlayer);
      maxScore = Math.max(maxScore, score);
    }

    return maxScore;
  } else {
    // Opponent's turn: minimize score
    let minScore = Infinity;

    for (const move of legalMoves) {
      const nextState = applyMove(state, move);
      const score = minimax(nextState, depth - 1, true, aiPlayer);
      minScore = Math.min(minScore, score);
    }

    return minScore;
  }
}

/**
 * Gets the best move for the current player using minimax algorithm
 * @param state - Current game state
 * @param depth - Search depth (default: 2)
 * @returns Best move position, or null if no legal moves
 */
export function getBestMove(
  state: GameState,
  depth: number = 2
): Position | null {
  const legalMoves = getLegalMoves(state);

  // No legal moves available
  if (legalMoves.length === 0) {
    return null;
  }

  // Only one legal move
  if (legalMoves.length === 1) {
    return legalMoves[0];
  }

  let bestMove = legalMoves[0];
  let bestScore = -Infinity;

  // Evaluate each legal move
  for (const move of legalMoves) {
    const nextState = applyMove(state, move);

    // Use minimax to evaluate this move
    const score = minimax(
      nextState,
      depth - 1,
      false, // Next turn is opponent's (minimizing)
      state.currentPlayer
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
