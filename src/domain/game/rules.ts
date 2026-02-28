import { BOARD_SIZE, DIRECTIONS, TOTAL_CELLS } from "./constants";
import type { Board, GameState, Player, Position, Direction } from "./types";
import { getOpponent } from "./board";

/**
 * Checks if a move in a given direction is valid (stays within board bounds)
 * @param from - Starting position
 * @param direction - Direction to move
 * @returns true if the move is valid, false otherwise
 */
export function isValidMove(from: Position, direction: Direction): boolean {
  const row = Math.floor(from / BOARD_SIZE);
  const col = from % BOARD_SIZE;
  const next = from + direction;

  // Out of bounds check
  if (next < 0 || next >= TOTAL_CELLS) return false;

  const nextRow = Math.floor(next / BOARD_SIZE);
  const nextCol = next % BOARD_SIZE;

  // Horizontal boundary check for left-moving directions
  if (direction === -1 || direction === -9 || direction === 7) {
    // Moving left: next column should be less than current column
    if (nextCol > col) return false;
  }

  // Horizontal boundary check for right-moving directions
  if (direction === 1 || direction === -7 || direction === 9) {
    // Moving right: next column should be greater than current column
    if (nextCol < col) return false;
  }

  return true;
}

/**
 * Checks if pieces can be flipped in a given direction
 * @param board - The game board
 * @param start - Starting position
 * @param direction - Direction to check
 * @param player - Current player
 * @param opponent - Opponent player
 * @returns true if pieces can be flipped in this direction
 */
function canFlipInDirection(
  board: Board,
  start: Position,
  direction: Direction,
  player: Player,
  opponent: Player
): boolean {
  let pos = start + direction;
  let hasOpponent = false;

  while (isValidMove(pos - direction, direction)) {
    if (board[pos] === opponent) {
      hasOpponent = true;
      pos += direction;
    } else if (board[pos] === player && hasOpponent) {
      return true; // Successfully sandwiched opponent pieces
    } else {
      break; // Empty cell or same color without opponent in between
    }
  }

  return false;
}

/**
 * Flips pieces in a given direction (mutates the board)
 * @param board - The game board (will be mutated)
 * @param start - Starting position
 * @param direction - Direction to flip
 * @param player - Current player
 * @param opponent - Opponent player
 */
function flipInDirection(
  board: Board,
  start: Position,
  direction: Direction,
  player: Player,
  opponent: Player
): void {
  if (!canFlipInDirection(board, start, direction, player, opponent)) {
    return;
  }

  let pos = start + direction;

  while (board[pos] === opponent) {
    board[pos] = player; // Flip the piece
    pos += direction;
  }
}

/**
 * Gets all legal moves for the current player
 * @param state - Current game state
 * @returns Array of legal move positions (empty if no legal moves)
 */
export function getLegalMoves(state: GameState): Position[] {
  const { board, currentPlayer } = state;
  const legalMoves: Position[] = [];
  const opponent = getOpponent(currentPlayer);

  for (let i = 0; i < TOTAL_CELLS; i++) {
    // Only check empty cells
    if (board[i] !== null) continue;

    // Check all 8 directions
    for (const direction of DIRECTIONS) {
      if (canFlipInDirection(board, i, direction, currentPlayer, opponent)) {
        legalMoves.push(i);
        break; // If flippable in one direction, it's a legal move
      }
    }
  }

  return legalMoves;
}

/**
 * Applies a move to the game state and returns a new state
 * @param state - Current game state
 * @param index - Position to place the piece (0-63)
 * @returns New game state with the move applied (or original state if invalid)
 */
export function applyMove(state: GameState, index: Position): GameState {
  const { board, currentPlayer } = state;

  // Validate index
  if (index < 0 || index >= TOTAL_CELLS || board[index] !== null) {
    return state; // Return original state for invalid moves
  }

  const legalMoves = getLegalMoves(state);
  if (!legalMoves.includes(index)) {
    return state; // Not a legal move
  }

  const opponent = getOpponent(currentPlayer);
  const newBoard = [...board];

  // Place the piece
  newBoard[index] = currentPlayer;

  // Flip pieces in all 8 directions
  for (const direction of DIRECTIONS) {
    flipInDirection(newBoard, index, direction, currentPlayer, opponent);
  }

  // Switch turn
  let nextPlayer = opponent;

  // Check if opponent has legal moves
  const nextState = { board: newBoard, currentPlayer: nextPlayer };
  const opponentMoves = getLegalMoves(nextState);

  // If opponent has no legal moves, pass
  if (opponentMoves.length === 0) {
    const currentMoves = getLegalMoves({
      board: newBoard,
      currentPlayer: currentPlayer,
    });

    // If current player also has no moves, game is over (keep opponent as current player)
    // If current player has moves, return turn to them
    if (currentMoves.length > 0) {
      nextPlayer = currentPlayer;
    }
  }

  return {
    board: newBoard,
    currentPlayer: nextPlayer,
  };
}

/**
 * Checks if the game is over
 * @param state - Current game state
 * @returns true if game is over, false otherwise
 */
export function isGameOver(state: GameState): boolean {
  const { board, currentPlayer } = state;

  // Condition 1: Board is full
  const isFull = board.every((cell) => cell !== null);
  if (isFull) return true;

  // Condition 2: Current player has legal moves
  const currentMoves = getLegalMoves(state);
  if (currentMoves.length > 0) return false;

  // Condition 3: Opponent has legal moves
  const opponent = getOpponent(currentPlayer);
  const opponentMoves = getLegalMoves({
    ...state,
    currentPlayer: opponent,
  });

  return opponentMoves.length === 0;
}
