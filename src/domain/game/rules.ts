import { BOARD_SIZE, DIRECTIONS, TOTAL_CELLS } from './constants';
import { getOpponent } from './board';
import type { Board, Direction, GameState, Player, Position } from './types';

/**
 * 指定方向への移動が盤面内に収まるか判定する
 * @param from - 開始位置
 * @param direction - 移動方向
 * @returns 有効な移動の場合true
 */
function isValidMove(from: Position, direction: Direction): boolean {
  const col = from % BOARD_SIZE;
  const next = from + direction;

  // 範囲外チェック
  if (next < 0 || next >= TOTAL_CELLS) return false;

  const nextCol = next % BOARD_SIZE;

  // 横方向の境界チェック
  if (direction === -1 || direction === -9 || direction === 7) {
    // 左方向：前の列より大きくなったらNG
    if (nextCol > col) return false;
  }

  if (direction === 1 || direction === -7 || direction === 9) {
    // 右方向：前の列より小さくなったらNG
    if (nextCol < col) return false;
  }

  return true;
}

/**
 * 指定方向に石を裏返せるか判定する
 * @param board - ゲームボード
 * @param start - 開始位置
 * @param direction - 移動方向
 * @param player - 現在のプレイヤー
 * @param opponent - 相手プレイヤー
 * @returns 裏返せる場合true
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
      return true; // 挟めた
    } else {
      break;
    }
  }

  return false;
}

/**
 * 指定方向の石を実際に裏返す（破壊的操作）
 * @param board - ゲームボード
 * @param start - 開始位置
 * @param direction - 移動方向
 * @param player - 現在のプレイヤー
 * @param opponent - 相手プレイヤー
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
    board[pos] = player; // 裏返す
    pos += direction;
  }
}

/**
 * 現在のプレイヤーが置ける合法手の一覧を返す
 * @param state - 現在のゲーム状態
 * @returns 合法手のインデックス配列（空配列の場合はパス）
 */
export function getLegalMoves(state: GameState): Position[] {
  const { board, currentPlayer } = state;
  const legalMoves: Position[] = [];
  const opponent = getOpponent(currentPlayer);

  for (let i = 0; i < TOTAL_CELLS; i++) {
    // 空きマスのみチェック
    if (board[i] !== null) continue;

    // 8方向をチェック
    for (const direction of DIRECTIONS) {
      if (canFlipInDirection(board, i, direction, currentPlayer, opponent)) {
        legalMoves.push(i);
        break; // 1方向でも裏返せれば合法手
      }
    }
  }

  return legalMoves;
}

/**
 * 指定された位置に石を置き、石を裏返した新しいゲーム状態を返す
 * @param state - 現在のゲーム状態
 * @param index - 石を置く位置（0-63）
 * @returns 新しいGameState（元の状態は変更しない）
 */
export function applyMove(state: GameState, index: Position): GameState {
  const { board, currentPlayer } = state;

  // 不正な手をチェック
  if (index < 0 || index >= TOTAL_CELLS || board[index] !== null) {
    return state; // 元の状態を返す
  }

  const legalMoves = getLegalMoves(state);
  if (!legalMoves.includes(index)) {
    return state; // 合法手でない
  }

  const opponent = getOpponent(currentPlayer);
  const newBoard = [...board];

  // 石を配置
  newBoard[index] = currentPlayer;

  // 8方向に裏返す
  for (const direction of DIRECTIONS) {
    flipInDirection(newBoard, index, direction, currentPlayer, opponent);
  }

  // 手番を交代
  let nextPlayer = opponent;

  // 相手の合法手をチェック
  const nextState = { board: newBoard, currentPlayer: nextPlayer };
  const opponentMoves = getLegalMoves(nextState);

  // 相手がパスなら手番を戻す
  if (opponentMoves.length === 0) {
    const currentMoves = getLegalMoves({
      board: newBoard,
      currentPlayer: currentPlayer,
    });

    // 自分も置けない場合はゲーム終了（手番は相手のまま）
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
 * ゲームが終了しているか判定する
 * @param state - 現在のゲーム状態
 * @returns ゲーム終了の場合true
 */
export function isGameOver(state: GameState): boolean {
  const { board, currentPlayer } = state;

  // 条件1: 盤面が満杯
  const isFull = board.every((cell) => cell !== null);
  if (isFull) return true;

  // 条件2: 現在のプレイヤーの合法手
  const currentMoves = getLegalMoves(state);
  if (currentMoves.length > 0) return false;

  // 条件3: 相手の合法手
  const opponent = getOpponent(currentPlayer);
  const opponentMoves = getLegalMoves({
    ...state,
    currentPlayer: opponent,
  });

  return opponentMoves.length === 0;
}
