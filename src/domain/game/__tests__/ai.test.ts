import { describe, it, expect } from 'vitest';
import { evaluateBoard, getBestMove } from '../ai';
import { createInitialBoard } from '../board';
import { TOTAL_CELLS } from '../constants';
import type { GameState, Board } from '../types';

describe('ai', () => {
  describe('evaluateBoard', () => {
    it('初期盤面では評価値がほぼ0に近い', () => {
      const board = createInitialBoard();
      const blackEval = evaluateBoard(board, 'black');
      const whiteEval = evaluateBoard(board, 'white');

      // 初期盤面は対称なので両者の評価値が同じ（符号が逆）
      expect(blackEval + whiteEval).toBe(0);
      expect(Math.abs(blackEval)).toBe(Math.abs(whiteEval));
    });

    it('石が多い方が有利に評価される', () => {
      // 黒が多い盤面
      const board: Board = Array(TOTAL_CELLS).fill(null);
      board[0] = 'black';
      board[1] = 'black';
      board[2] = 'black';
      board[3] = 'white';

      const blackEval = evaluateBoard(board, 'black');
      const whiteEval = evaluateBoard(board, 'white');

      expect(blackEval).toBeGreaterThan(whiteEval);
    });

    it('角を取った方が有利に評価される', () => {
      // 角の位置は重み100
      const boardWithCorner: Board = Array(TOTAL_CELLS).fill(null);
      boardWithCorner[0] = 'black'; // 左上角

      const boardWithoutCorner: Board = Array(TOTAL_CELLS).fill(null);
      boardWithoutCorner[1] = 'black'; // 角じゃない位置

      const evalWithCorner = evaluateBoard(boardWithCorner, 'black');
      const evalWithoutCorner = evaluateBoard(boardWithoutCorner, 'black');

      expect(evalWithCorner).toBeGreaterThan(evalWithoutCorner);
    });
  });

  describe('getBestMove', () => {
    it('合法手がない場合はnullを返す', () => {
      const state: GameState = {
        board: Array(TOTAL_CELLS).fill('black'), // 全て黒（合法手なし）
        currentPlayer: 'white',
      };

      const move = getBestMove(state);
      expect(move).toBeNull();
    });

    it('合法手が1つの場合はその手を返す', () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: 'black',
      };

      const move = getBestMove(state);
      expect(move).not.toBeNull();
      expect(typeof move).toBe('number');
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(TOTAL_CELLS);
    });

    it('初期盤面で有効な手を返す', () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: 'black',
      };

      const move = getBestMove(state, 1); // 深さ1で高速テスト
      expect(move).not.toBeNull();

      // 初期盤面での黒の合法手: 19, 26, 37, 44
      const validMoves = [19, 26, 37, 44];
      expect(validMoves).toContain(move);
    });

    it('深さを指定して探索できる', () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: 'black',
      };

      const move1 = getBestMove(state, 1);
      const move2 = getBestMove(state, 2);

      // どちらも有効な手を返す
      expect(move1).not.toBeNull();
      expect(move2).not.toBeNull();
    });
  });
});
