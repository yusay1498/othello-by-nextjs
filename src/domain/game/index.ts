// 型のエクスポート
export type {
  Player,
  Cell,
  Board,
  Position,
} from './types';

// 定数のエクスポート
export { BOARD_SIZE, TOTAL_CELLS } from './constants';

// ボード関数のエクスポート
export { createInitialBoard, getScore, getOpponent } from './board';
