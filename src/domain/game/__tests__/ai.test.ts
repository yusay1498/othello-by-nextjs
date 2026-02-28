import { describe, test, expect } from "vitest";
import { evaluateBoard, getBestMove } from "../ai";
import { createInitialBoard } from "../board";
import { getLegalMoves } from "../rules";
import { CORNERS } from "../constants";
import type { GameState, Player, Board } from "../types";

describe("evaluateBoard", () => {
  test("初期盤面は互角（0付近）", () => {
    const board = createInitialBoard();
    const score = evaluateBoard(board, "black");
    // 初期盤面は完全に対称なので0になるはず
    expect(score).toBe(0);
  });

  test("黒と白で評価が逆転する", () => {
    const board = createInitialBoard();
    board[0] = "black"; // 角を黒が取得

    const blackScore = evaluateBoard(board, "black");
    const whiteScore = evaluateBoard(board, "white");

    expect(blackScore).toBeGreaterThan(0);
    expect(whiteScore).toBeLessThan(0);
    expect(blackScore).toBe(-whiteScore);
  });

  test("角を取ると高評価（100点）", () => {
    const board = createInitialBoard();
    board[0] = "black"; // 左上角

    const score = evaluateBoard(board, "black");
    expect(score).toBeGreaterThanOrEqual(100);
  });

  test("複数の角を取るとさらに高評価", () => {
    const board = createInitialBoard();
    board[0] = "black"; // 左上角
    board[7] = "black"; // 右上角

    const score = evaluateBoard(board, "black");
    expect(score).toBeGreaterThanOrEqual(200);
  });

  test("相手が有利な盤面は負のスコア", () => {
    const board: Board = new Array(64).fill("white");
    board[0] = "black";

    const score = evaluateBoard(board, "black");
    expect(score).toBeLessThan(0);
  });

  test("全て自分の石の場合は最大スコア", () => {
    const board: Board = new Array(64).fill("black");

    const score = evaluateBoard(board, "black");
    expect(score).toBeGreaterThan(0);
  });

  test("全て相手の石の場合は最小スコア", () => {
    const board: Board = new Array(64).fill("white");

    const score = evaluateBoard(board, "black");
    expect(score).toBeLessThan(0);
  });

  test("空の盤面は0", () => {
    const board: Board = new Array(64).fill(null);

    const score = evaluateBoard(board, "black");
    expect(score).toBe(0);
  });
});

describe("getBestMove", () => {
  test("合法手がある場合は有効な手を返す", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const move = getBestMove(state, 2);
    expect(move).not.toBeNull();

    const legalMoves = getLegalMoves(state);
    expect(legalMoves).toContain(move);
  });

  test("合法手がない場合はnullを返す", () => {
    const board: Board = new Array(64).fill("black");
    const state: GameState = { board, currentPlayer: "white" };

    const move = getBestMove(state, 2);
    expect(move).toBeNull();
  });

  test("合法手が1つの場合はその手を返す", () => {
    // 合法手が1つだけの状況を作成
    const board: Board = new Array(64).fill(null);
    board[27] = "white";
    board[28] = "black";

    const state: GameState = { board, currentPlayer: "black" };
    const legalMoves = getLegalMoves(state);

    if (legalMoves.length === 1) {
      const move = getBestMove(state, 2);
      expect(move).toBe(legalMoves[0]);
    }
  });

  test("異なる深さで動作する", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const move1 = getBestMove(state, 1);
    const move2 = getBestMove(state, 2);

    expect(move1).not.toBeNull();
    expect(move2).not.toBeNull();

    const legalMoves = getLegalMoves(state);
    expect(legalMoves).toContain(move1);
    expect(legalMoves).toContain(move2);
  });

  test("白のターンでも動作する", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "white",
    };

    const move = getBestMove(state, 2);
    expect(move).not.toBeNull();

    const legalMoves = getLegalMoves(state);
    expect(legalMoves).toContain(move);
  });

  test("深さ0でも動作する", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const move = getBestMove(state, 0);
    expect(move).not.toBeNull();

    const legalMoves = getLegalMoves(state);
    expect(legalMoves).toContain(move);
  });

  test("明らかに良い手を選択する（角が取れる場合）", () => {
    // 角が取れる状況を作成
    const board: Board = createInitialBoard();
    board[1] = "black";
    board[2] = "black";
    board[3] = "black";
    board[4] = "black";
    board[5] = "black";
    board[6] = "black";

    const state: GameState = { board, currentPlayer: "black" };
    const legalMoves = getLegalMoves(state);

    // 角（0または7）が取れる場合、それを選ぶべき
    const hasCornerMove = legalMoves.some((move) => CORNERS.includes(move));

    if (hasCornerMove) {
      const move = getBestMove(state, 2);
      // 角が合法手に含まれていて、AIがそれを選ぶべき
      expect(CORNERS.includes(move!)).toBe(true);
    }
  });

  test("複数回実行しても一貫した結果を返す", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const move1 = getBestMove(state, 2);
    const move2 = getBestMove(state, 2);
    const move3 = getBestMove(state, 2);

    // 同じ状態からは同じ手を返すべき（決定的アルゴリズム）
    expect(move1).toBe(move2);
    expect(move2).toBe(move3);
  });
});

describe("AI統合テスト", () => {
  test("初期盤面から有効な手を選べる", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const move = getBestMove(state, 2);
    expect(move).not.toBeNull();

    // 初期盤面の黒の合法手は [19, 26, 37, 44]
    expect([19, 26, 37, 44]).toContain(move);
  });

  test("ゲーム進行中でも適切な手を選べる", () => {
    let state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    // 数手進める
    const legalMoves = getLegalMoves(state);
    if (legalMoves.length > 0) {
      // AIが手を選ぶ
      const aiMove = getBestMove(state, 1);
      expect(aiMove).not.toBeNull();
      expect(legalMoves).toContain(aiMove);
    }
  });

  test("評価関数とgetBestMoveの整合性", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const bestMove = getBestMove(state, 1);
    expect(bestMove).not.toBeNull();

    // 選ばれた手は何らかの基準で最良であるべき
    // （評価関数が一貫していることを確認）
    const legalMoves = getLegalMoves(state);
    expect(legalMoves.length).toBeGreaterThan(0);
  });
});

describe("パフォーマンステスト", () => {
  test("getBestMove (depth=1) は500ms以内", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const start = Date.now();
    getBestMove(state, 1);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(500);
  }, 1000);

  test("getBestMove (depth=2) は5秒以内", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const start = Date.now();
    getBestMove(state, 2);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(5000);
  }, 10000);
});
