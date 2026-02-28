import { describe, expect, test } from 'vitest';
import { createInitialBoard } from '../board';
import { getGameResult } from '../winner';
import { TOTAL_CELLS } from '../constants';
import type { Board } from '../types';

describe("getGameResult", () => {
  describe("ゲーム進行中", () => {
    test("gameOver=falseの場合はplaying", () => {
      const board = createInitialBoard();
      const result = getGameResult(board, false);

      expect(result).toEqual({ type: "playing" });
    });

    test("盤面が満杯でもgameOver=falseならplaying", () => {
      const board: Board = new Array(TOTAL_CELLS).fill("black");
      const result = getGameResult(board, false);

      expect(result).toEqual({ type: "playing" });
    });
  });

  describe("引き分け", () => {
    test("同点の場合はdraw", () => {
      const board: Board = new Array(TOTAL_CELLS).fill(null);
      for (let i = 0; i < 32; i++) {
        board[i] = "black";
        board[i + 32] = "white";
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({ type: "draw" });
    });

    test("32-32の引き分け", () => {
      const board: Board = new Array(TOTAL_CELLS).fill(null);
      // 32個ずつ配置
      for (let i = 0; i < 32; i++) {
        board[i] = "black";
      }
      for (let i = 32; i < TOTAL_CELLS; i++) {
        board[i] = "white";
      }

      const result = getGameResult(board, true);

      expect(result.type).toBe("draw");
    });
  });

  describe("通常の勝利", () => {
    test("黒の勝ち", () => {
      const board: Board = new Array(TOTAL_CELLS).fill(null);
      for (let i = 0; i < 40; i++) {
        board[i] = "black";
      }
      for (let i = 40; i < TOTAL_CELLS; i++) {
        board[i] = "white";
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "black",
        perfect: false,
      });
    });

    test("白の勝ち", () => {
      const board: Board = new Array(TOTAL_CELLS).fill(null);
      for (let i = 0; i < 30; i++) {
        board[i] = "black";
      }
      for (let i = 30; i < TOTAL_CELLS; i++) {
        board[i] = "white";
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "white",
        perfect: false,
      });
    });

    test("僅差での黒の勝ち（33-31）", () => {
      const board: Board = new Array(TOTAL_CELLS).fill(null);
      for (let i = 0; i < 33; i++) {
        board[i] = "black";
      }
      for (let i = 33; i < TOTAL_CELLS; i++) {
        board[i] = "white";
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "black",
        perfect: false,
      });
    });
  });

  describe("パーフェクト勝利", () => {
    test("黒のパーフェクト", () => {
      const board: Board = new Array(TOTAL_CELLS).fill("black");

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "black",
        perfect: true,
      });
    });

    test("白のパーフェクト", () => {
      const board: Board = new Array(TOTAL_CELLS).fill("white");

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "white",
        perfect: true,
      });
    });
  });

  describe("エッジケース", () => {
    test("盤面が満杯でない終了（両者とも置けない状態）", () => {
      const board: Board = new Array(TOTAL_CELLS).fill(null);
      board[0] = "black";
      board[63] = "white";

      const result = getGameResult(board, true);

      // どちらも1個ずつなので引き分け
      expect(result).toEqual({ type: "draw" });
    });

    test("片方の石が0個（完全制圧）", () => {
      const board: Board = new Array(TOTAL_CELLS).fill("black");

      const result = getGameResult(board, true);

      expect(result.type).toBe("win");
      expect(result).toHaveProperty("winner", "black");
      expect(result).toHaveProperty("perfect", true);
    });

    test("初期盤面でgameOver=true（仮想テスト）", () => {
      const board = createInitialBoard();
      const result = getGameResult(board, true);

      // 初期盤面は2-2なので引き分け
      expect(result).toEqual({ type: "draw" });
    });
  });
});
