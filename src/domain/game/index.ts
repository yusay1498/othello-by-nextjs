// Type exports
export type {
  Player,
  Cell,
  Board,
  Position,
  Direction,
  GameState,
  GameMode,
  PlayerColor,
  GameConfig,
  GameStatus,
  WinnerResult,
} from "./types";

// Constant exports
export { BOARD_SIZE, TOTAL_CELLS, DIRECTIONS, CORNERS, POSITION_WEIGHTS } from "./constants";

// Board function exports
export { createInitialBoard, getScore, getOpponent } from "./board";

// Rules function exports
export { getLegalMoves, applyMove, isGameOver, isValidMove } from "./rules";

// Winner function exports
export { getGameResult } from "./winner";

// AI function exports
export { getBestMove, evaluateBoard } from "./ai";
