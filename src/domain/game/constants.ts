/**
 * Constants for the Othello game domain
 */

/**
 * Board size (8x8)
 */
export const BOARD_SIZE = 8;

/**
 * Total number of cells on the board
 */
export const TOTAL_CELLS = 64;

/**
 * Direction vectors for the 8 directions
 * - -9: Top-left diagonal
 * - -8: Up
 * - -7: Top-right diagonal
 * - -1: Left
 * -  1: Right
 * -  7: Bottom-left diagonal
 * -  8: Down
 * -  9: Bottom-right diagonal
 */
export const DIRECTIONS: readonly number[] = [
  -9, -8, -7, -1, 1, 7, 8, 9,
] as const;

/**
 * Corner positions on the board
 * Corners are strategically important in Othello
 */
export const CORNERS: readonly number[] = [0, 7, 56, 63] as const;

/**
 * Position weights for AI evaluation
 * Higher values indicate more desirable positions
 * - Corners (100): Most valuable
 * - Adjacent to corners (-20 to -50): Dangerous (opponent can capture corner)
 * - Edges (10): Moderately valuable
 * - Center (0-1): Neutral to slightly valuable
 */
export const POSITION_WEIGHTS: readonly number[] = [
  100, -20, 10, 5, 5, 10, -20, 100, -20, -50, -2, -2, -2, -2, -50, -20, 10, -2,
  1, 1, 1, 1, -2, 10, 5, -2, 1, 0, 0, 1, -2, 5, 5, -2, 1, 0, 0, 1, -2, 5, 10,
  -2, 1, 1, 1, 1, -2, 10, -20, -50, -2, -2, -2, -2, -50, -20, 100, -20, 10, 5,
  5, 10, -20, 100,
] as const;
