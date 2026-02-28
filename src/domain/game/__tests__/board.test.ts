import { describe, expect, test } from "vitest";
import { createInitialBoard, getOpponent, getScore } from "../board";
import { TOTAL_CELLS } from "../constants";
import type { Board, Player } from "../types";

describe("createInitialBoard", () => {
  test("should return an array of 64 cells", () => {
    const board = createInitialBoard();
    expect(board).toHaveLength(TOTAL_CELLS);
  });

  test("should have correct initial placement", () => {
    const board = createInitialBoard();
    expect(board[27]).toBe("white"); // d4
    expect(board[28]).toBe("black"); // e4
    expect(board[35]).toBe("black"); // d5
    expect(board[36]).toBe("white"); // e5
  });

  test("should have exactly 4 pieces placed", () => {
    const board = createInitialBoard();
    const filledCells = board.filter((cell) => cell !== null);
    expect(filledCells).toHaveLength(4);
  });

  test("should have 2 black and 2 white pieces", () => {
    const board = createInitialBoard();
    const blackCount = board.filter((cell) => cell === "black").length;
    const whiteCount = board.filter((cell) => cell === "white").length;
    expect(blackCount).toBe(2);
    expect(whiteCount).toBe(2);
  });

  test("should have all other cells as null", () => {
    const board = createInitialBoard();
    const nullCells = board.filter((cell) => cell === null);
    expect(nullCells).toHaveLength(60);
  });
});

describe("getScore", () => {
  test("should return 2-2 for initial board", () => {
    const board = createInitialBoard();
    const score = getScore(board);
    expect(score).toEqual({ black: 2, white: 2 });
  });

  test("should return 0-0 for empty board", () => {
    const board: Board = Array.from({ length: TOTAL_CELLS }, () => null);
    const score = getScore(board);
    expect(score).toEqual({ black: 0, white: 0 });
  });

  test("should count only black pieces on all-black board", () => {
    const board: Board = Array.from({ length: TOTAL_CELLS }, () => "black");
    const score = getScore(board);
    expect(score).toEqual({ black: TOTAL_CELLS, white: 0 });
  });

  test("should count only white pieces on all-white board", () => {
    const board: Board = Array.from({ length: TOTAL_CELLS }, () => "white");
    const score = getScore(board);
    expect(score).toEqual({ black: 0, white: TOTAL_CELLS });
  });

  test("should correctly count mixed board", () => {
    const board: Board = Array.from({ length: TOTAL_CELLS }, () => null);
    board[0] = "black";
    board[1] = "black";
    board[2] = "white";
    board[10] = "white";
    board[20] = "black";
    const score = getScore(board);
    expect(score).toEqual({ black: 3, white: 2 });
  });

  test("should ignore null cells in count", () => {
    const board = createInitialBoard();
    const score = getScore(board);
    expect(score.black + score.white).toBe(4);
  });
});

describe("getOpponent", () => {
  test("should return white when given black", () => {
    expect(getOpponent("black")).toBe("white");
  });

  test("should return black when given white", () => {
    expect(getOpponent("white")).toBe("black");
  });

  test("should return original player when called twice", () => {
    const player: Player = "black";
    expect(getOpponent(getOpponent(player))).toBe(player);
  });

  test("should work for white when called twice", () => {
    const player: Player = "white";
    expect(getOpponent(getOpponent(player))).toBe(player);
  });
});
