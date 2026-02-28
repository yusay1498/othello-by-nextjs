// 型のエクスポート
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
} from './types';

// 定数のエクスポート
export {
  BOARD_SIZE,
  TOTAL_CELLS,
  DIRECTIONS,
  CORNERS,
  POSITION_WEIGHTS,
} from './constants';

// ボード関数のエクスポート
export { createInitialBoard, getScore, getOpponent } from './board';

// ルール関数のエクスポート
export { getLegalMoves, applyMove, isGameOver } from './rules';

// 勝敗判定関数のエクスポート
export { getGameResult } from './winner';

// AI関数のエクスポート
export { evaluateBoard, getBestMove } from './ai';
