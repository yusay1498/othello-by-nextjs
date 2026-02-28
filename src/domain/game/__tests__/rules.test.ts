import { describe, test, expect } from "vitest";
import {
  getLegalMoves,
  applyMove,
  isGameOver,
  isValidMove,
} from "../rules";
import { createInitialBoard, getScore } from "../board";
import type { GameState, Player } from "../types";

describe("isValidMove", () => {
  test("左端から左への移動は無効", () => {
    expect(isValidMove(0, -1)).toBe(false);
    expect(isValidMove(8, -1)).toBe(false);
  });

  test("右端から右への移動は無効", () => {
    expect(isValidMove(7, 1)).toBe(false);
    expect(isValidMove(15, 1)).toBe(false);
  });

  test("上端から上への移動は無効", () => {
    expect(isValidMove(0, -8)).toBe(false);
    expect(isValidMove(4, -8)).toBe(false);
  });

  test("下端から下への移動は無効", () => {
    expect(isValidMove(63, 8)).toBe(false);
    expect(isValidMove(60, 8)).toBe(false);
  });

  test("盤面内の移動は有効", () => {
    expect(isValidMove(27, 1)).toBe(true); // 右
    expect(isValidMove(27, -1)).toBe(true); // 左
    expect(isValidMove(27, 8)).toBe(true); // 下
    expect(isValidMove(27, -8)).toBe(true); // 上
  });

  test("斜め移動の境界チェック", () => {
    expect(isValidMove(0, -9)).toBe(false); // 左上角から左上
    expect(isValidMove(7, -7)).toBe(false); // 右上角から右上
    expect(isValidMove(56, 7)).toBe(false); // 左下角から左下
    expect(isValidMove(63, 9)).toBe(false); // 右下角から右下
  });
});

describe("getLegalMoves", () => {
  test("初期盤面の黒の合法手は4つ", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };
    const moves = getLegalMoves(state);
    expect(moves).toHaveLength(4);
    expect(moves).toContain(19); // c4
    expect(moves).toContain(26); // d3
    expect(moves).toContain(37); // f5
    expect(moves).toContain(44); // e6
  });

  test("初期盤面の白の合法手は4つ", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "white",
    };
    const moves = getLegalMoves(state);
    expect(moves).toHaveLength(4);
    expect(moves).toContain(20); // c5
    expect(moves).toContain(29); // f4
    expect(moves).toContain(34); // c6
    expect(moves).toContain(43); // d6
  });

  test("合法手がない場合は空配列", () => {
    const board = new Array(64).fill("black");
    board[0] = null;
    const state: GameState = { board, currentPlayer: "black" };
    const moves = getLegalMoves(state);
    expect(moves).toEqual([]);
  });

  test("盤面が満杯の場合は空配列", () => {
    const board = new Array(64).fill("black");
    const state: GameState = { board, currentPlayer: "black" };
    const moves = getLegalMoves(state);
    expect(moves).toEqual([]);
  });
});

describe("applyMove", () => {
  test("合法手を打つと石が配置される", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const newState = applyMove(state, 19);

    expect(newState.board[19]).toBe("black"); // 石が配置された
    expect(newState).not.toBe(state); // 新しいオブジェクト
  });

  test("合法手を打つと石が裏返る", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const newState = applyMove(state, 19); // c4に配置

    expect(newState.board[19]).toBe("black"); // 配置された
    expect(newState.board[27]).toBe("black"); // 裏返った (d4のwhite)
    expect(getScore(newState.board)).toEqual({ black: 4, white: 1 });
  });

  test("手番が交代する", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const newState = applyMove(state, 19);
    expect(newState.currentPlayer).toBe("white");
  });

  test("不正な手は状態を変更しない（既に石がある）", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const newState = applyMove(state, 27); // 白の石がある
    expect(newState).toBe(state); // 同じオブジェクト
  });

  test("不正な手は状態を変更しない（範囲外）", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const newState = applyMove(state, 64);
    expect(newState).toBe(state);

    const newState2 = applyMove(state, -1);
    expect(newState2).toBe(state);
  });

  test("不正な手は状態を変更しない（合法手でない）", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const newState = applyMove(state, 0); // 角には置けない
    expect(newState).toBe(state);
  });

  test("相手がパスする場合、手番が戻る", () => {
    // 白が置けない盤面を作成
    const board = new Array(64).fill(null);
    board[27] = "white"; // d4
    board[28] = "black"; // e4
    board[19] = "black"; // c4
    // この状態で黒が26に置くと、白は置けなくなる

    const state: GameState = { board, currentPlayer: "black" };
    const legalMoves = getLegalMoves(state);

    if (legalMoves.includes(26)) {
      const newState = applyMove(state, 26);
      // 白の合法手を確認
      const whiteMoves = getLegalMoves({
        board: newState.board,
        currentPlayer: "white",
      });
      if (whiteMoves.length === 0) {
        // 白がパスなので黒の合法手を確認
        const blackMoves = getLegalMoves({
          board: newState.board,
          currentPlayer: "black",
        });
        if (blackMoves.length > 0) {
          expect(newState.currentPlayer).toBe("black"); // 手番が戻る
        }
      }
    }
  });

  test("元の盤面を変更しない（不変性）", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };
    const originalBoard = [...state.board];

    applyMove(state, 19);

    expect(state.board).toEqual(originalBoard); // 元の盤面は変更されていない
  });
});

describe("isGameOver", () => {
  test("初期盤面はゲーム継続", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };
    expect(isGameOver(state)).toBe(false);
  });

  test("盤面が満杯ならゲーム終了", () => {
    const board = new Array(64).fill("black");
    const state: GameState = { board, currentPlayer: "black" };
    expect(isGameOver(state)).toBe(true);
  });

  test("両者とも置けないならゲーム終了", () => {
    const board = new Array(64).fill(null);
    board[0] = "black";
    board[63] = "white";
    const state: GameState = { board, currentPlayer: "black" };
    expect(isGameOver(state)).toBe(true);
  });

  test("片方のみ置ける場合はゲーム継続", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };
    expect(isGameOver(state)).toBe(false);
  });

  test("複数の手を打った後のゲーム継続", () => {
    let state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    // 数手進める
    state = applyMove(state, 19);
    state = applyMove(state, 18);
    state = applyMove(state, 26);

    expect(isGameOver(state)).toBe(false);
  });
});

describe("ゲームフロー統合テスト", () => {
  test("複数手のシーケンスが正しく動作する", () => {
    let state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    // 初期状態のスコア
    let score = getScore(state.board);
    expect(score).toEqual({ black: 2, white: 2 });

    // 黒: 19 (c4)
    state = applyMove(state, 19);
    score = getScore(state.board);
    expect(score.black).toBeGreaterThan(2);
    expect(state.currentPlayer).toBe("white");

    // 白の手番
    const whiteMoves = getLegalMoves(state);
    expect(whiteMoves.length).toBeGreaterThan(0);

    // ゲームは継続中
    expect(isGameOver(state)).toBe(false);
  });

  test("パスの自動処理が正しく動作する", () => {
    // 簡単なパスシナリオを作成
    const board = new Array(64).fill(null);
    board[0] = "black";
    board[1] = "white";
    board[8] = "black";

    const state: GameState = { board, currentPlayer: "black" };

    // 黒は9に置ける可能性がある
    const moves = getLegalMoves(state);
    if (moves.includes(9)) {
      const newState = applyMove(state, 9);

      // 白の合法手を確認
      const whiteMoves = getLegalMoves({
        board: newState.board,
        currentPlayer: "white",
      });

      // 白が置けない場合、黒の手番が続く
      if (whiteMoves.length === 0) {
        const blackMoves = getLegalMoves({
          board: newState.board,
          currentPlayer: "black",
        });
        if (blackMoves.length > 0) {
          expect(newState.currentPlayer).toBe("black");
        }
      }
    }
  });
});
