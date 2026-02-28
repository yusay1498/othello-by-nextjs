import type { GameState, Player, Position, Board } from './types';
import { POSITION_WEIGHTS, TOTAL_CELLS } from './constants';
import { getOpponent, getScore } from './board';
import { getLegalMoves, applyMove } from './rules';

/**
 * ボードを評価してスコアを返す
 * 高いほど指定プレイヤーに有利
 */
export function evaluateBoard(board: Board, player: Player): number {
  const opponent = getOpponent(player);
  let score = 0;

  // 位置による重み付けスコア
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const cell = board[i];
    if (cell === player) {
      score += POSITION_WEIGHTS[i];
    } else if (cell === opponent) {
      score -= POSITION_WEIGHTS[i];
    }
  }

  // 石の数による評価
  const counts = getScore(board);
  score += (counts[player] - counts[opponent]) * 10;

  return score;
}

/**
 * ミニマックスアルゴリズムで最善手を探索
 */
function minimax(
  state: GameState,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  aiPlayer: Player
): number {
  // 深さ0または終局なら評価値を返す
  if (depth === 0) {
    return evaluateBoard(state.board, aiPlayer);
  }

  const legalMoves = getLegalMoves(state);

  // 合法手がない場合はパス
  if (legalMoves.length === 0) {
    const opponent = getOpponent(state.currentPlayer);
    const nextState = { ...state, currentPlayer: opponent };
    const opponentMoves = getLegalMoves(nextState);

    // 相手も合法手がなければ終局
    if (opponentMoves.length === 0) {
      return evaluateBoard(state.board, aiPlayer);
    }

    // パスして相手のターンに
    return minimax(nextState, depth - 1, !isMaximizing, alpha, beta, aiPlayer);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of legalMoves) {
      const nextState = applyMove(state, move);
      const evaluation = minimax(
        nextState,
        depth - 1,
        false,
        alpha,
        beta,
        aiPlayer
      );
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // βカット
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of legalMoves) {
      const nextState = applyMove(state, move);
      const evaluation = minimax(
        nextState,
        depth - 1,
        true,
        alpha,
        beta,
        aiPlayer
      );
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // αカット
    }
    return minEval;
  }
}

/**
 * AIの最善手を取得
 * @param state 現在のゲーム状態
 * @param depth 探索深さ（デフォルト2）
 * @returns 最善手のPosition、合法手がない場合はnull
 */
export function getBestMove(
  state: GameState,
  depth: number = 2
): Position | null {
  const legalMoves = getLegalMoves(state);

  if (legalMoves.length === 0) {
    return null;
  }

  // 合法手が1つしかない場合はそれを返す
  if (legalMoves.length === 1) {
    return legalMoves[0];
  }

  let bestMove: Position = legalMoves[0];
  let bestValue = -Infinity;

  for (const move of legalMoves) {
    const nextState = applyMove(state, move);
    const moveValue = minimax(
      nextState,
      depth - 1,
      false,
      -Infinity,
      Infinity,
      state.currentPlayer
    );

    if (moveValue > bestValue) {
      bestValue = moveValue;
      bestMove = move;
    }
  }

  return bestMove;
}
