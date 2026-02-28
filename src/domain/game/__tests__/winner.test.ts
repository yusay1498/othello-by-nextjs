import { describe, test, expect } from "vitest";
import { getGameResult } from "../winner";
import { createInitialBoard } from "../board";
import type { Board } from "../types";

describe("getGameResult", () => {
  describe("ゲーム進行中", () => {
    test("gameOver=falseの場合はplaying", () => {
      const board = createInitialBoard();
      const result = getGameResult(board, false);

      expect(result).toEqual({ type: "playing" });
    });

    test("満杯でもgameOver=falseならplaying", () => {
      const board = new Array(64).fill("black");
      const result = getGameResult(board, false);

      expect(result).toEqual({ type: "playing" });
    });
  });

  describe("引き分け", () => {
    test("同点の場合はdraw", () => {
      const board: Board = new Array(64).fill(null);
      for (let i = 0; i < 32; i++) {
        board[i] = "black";
        board[i + 32] = "white";
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({ type: "draw" });
    });

    test("スコア32-32の引き分け", () => {
      const board: Board = [];
      for (let i = 0; i < 32; i++) {
        board.push("black");
      }
      for (let i = 0; i < 32; i++) {
        board.push("white");
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({ type: "draw" });
    });

    test("スコア1-1の引き分け", () => {
      const board: Board = new Array(64).fill(null);
      board[0] = "black";
      board[63] = "white";

      const result = getGameResult(board, true);

      expect(result).toEqual({ type: "draw" });
    });
  });

  describe("通常の勝利", () => {
    test("黒の勝ち（40-24）", () => {
      const board: Board = new Array(64).fill(null);
      for (let i = 0; i < 40; i++) {
        board[i] = "black";
      }
      for (let i = 40; i < 64; i++) {
        board[i] = "white";
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "black",
        perfect: false,
      });
    });

    test("白の勝ち（34-30）", () => {
      const board: Board = new Array(64).fill(null);
      for (let i = 0; i < 30; i++) {
        board[i] = "black";
      }
      for (let i = 30; i < 64; i++) {
        board[i] = "white";
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "white",
        perfect: false,
      });
    });

    test("黒の僅差勝利（33-31）", () => {
      const board: Board = new Array(64).fill(null);
      for (let i = 0; i < 33; i++) {
        board[i] = "black";
      }
      for (let i = 33; i < 64; i++) {
        board[i] = "white";
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "black",
        perfect: false,
      });
    });

    test("白の僅差勝利（31-33）", () => {
      const board: Board = new Array(64).fill(null);
      for (let i = 0; i < 31; i++) {
        board[i] = "black";
      }
      for (let i = 31; i < 64; i++) {
        board[i] = "white";
      }

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "white",
        perfect: false,
      });
    });
  });

  describe("パーフェクト勝利", () => {
    test("黒のパーフェクト（64-0）", () => {
      const board: Board = new Array(64).fill("black");

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "black",
        perfect: true,
      });
    });

    test("白のパーフェクト（64-0）", () => {
      const board: Board = new Array(64).fill("white");

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "white",
        perfect: true,
      });
    });

    test("黒のパーフェクト（全ての石が黒）", () => {
      const board: Board = [];
      for (let i = 0; i < 64; i++) {
        board.push("black");
      }

      const result = getGameResult(board, true);

      expect(result.type).toBe("win");
      if (result.type === "win") {
        expect(result.winner).toBe("black");
        expect(result.perfect).toBe(true);
      }
    });
  });

  describe("エッジケース", () => {
    test("盤面が満杯でない終了（1-1）", () => {
      const board: Board = new Array(64).fill(null);
      board[0] = "black";
      board[63] = "white";

      const result = getGameResult(board, true);

      expect(result).toEqual({ type: "draw" });
    });

    test("片方の石が極端に少ない（63-1）", () => {
      const board: Board = new Array(64).fill("black");
      board[63] = "white";

      const result = getGameResult(board, true);

      expect(result).toEqual({
        type: "win",
        winner: "black",
        perfect: false,
      });
    });

    test("初期盤面でゲーム終了とした場合", () => {
      const board = createInitialBoard();
      const result = getGameResult(board, true);

      // 2-2なので引き分け
      expect(result).toEqual({ type: "draw" });
    });
  });

  describe("型安全性の確認", () => {
    test("playing結果にはwinnerプロパティが存在しない", () => {
      const board = createInitialBoard();
      const result = getGameResult(board, false);

      expect(result.type).toBe("playing");
      // TypeScriptのコンパイル時チェックで保証される
      if (result.type === "playing") {
        // @ts-expect-error - winner should not exist on playing result
        expect(result.winner).toBeUndefined();
      }
    });

    test("draw結果にはwinnerプロパティが存在しない", () => {
      const board: Board = new Array(64).fill(null);
      for (let i = 0; i < 32; i++) {
        board[i] = "black";
        board[i + 32] = "white";
      }

      const result = getGameResult(board, true);

      expect(result.type).toBe("draw");
      if (result.type === "draw") {
        // @ts-expect-error - winner should not exist on draw result
        expect(result.winner).toBeUndefined();
      }
    });

    test("win結果にはwinnerとperfectプロパティが存在する", () => {
      const board: Board = new Array(64).fill("black");

      const result = getGameResult(board, true);

      expect(result.type).toBe("win");
      if (result.type === "win") {
        expect(result.winner).toBeDefined();
        expect(result.perfect).toBeDefined();
        expect(typeof result.perfect).toBe("boolean");
      }
    });
  });
});
