// 型のエクスポート
export type {
  Player,
  Cell,
  Board,
  Position,
  GameState,
} from './types';

// 定数のエクスポート
export { BOARD_SIZE, TOTAL_CELLS } from './constants';

// ボード関数のエクスポート
export { createInitialBoard, getScore, getOpponent } from './board';

// ルール関数のエクスポート
export { getLegalMoves, applyMove, isGameOver } from './rules';
