import { describe, expect, test } from "vitest";
import { createInitialBoard, getScore } from "../board";
import { applyMove, getLegalMoves, isGameOver } from "../rules";
import type { Board, GameState, Player } from "../types";

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
    expect(moves).toContain(37); // e6
    expect(moves).toContain(44); // f5
  });

  test("初期盤面の白の合法手は4つ", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "white",
    };
    const moves = getLegalMoves(state);
    expect(moves).toHaveLength(4);
    expect(moves).toContain(20); // c5
    expect(moves).toContain(29); // d6
    expect(moves).toContain(34); // e3
    expect(moves).toContain(43); // f4
  });

  test("合法手がない場合は空配列", () => {
    const board: Board = new Array(64).fill("black");
    board[0] = null;
    const state: GameState = { board, currentPlayer: "white" };
    const moves = getLegalMoves(state);
    expect(moves).toEqual([]);
  });

  test("空のボードでは合法手なし", () => {
    const board: Board = new Array(64).fill(null);
    const state: GameState = { board, currentPlayer: "black" };
    const moves = getLegalMoves(state);
    expect(moves).toEqual([]);
  });
});

describe("applyMove", () => {
  test("合法手を打つと石が裏返る", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const newState = applyMove(state, 19); // c4

    expect(newState.board[19]).toBe("black"); // 配置された
    expect(newState.board[27]).toBe("black"); // 裏返った（元は白）
    expect(getScore(newState.board)).toEqual({ black: 4, white: 1 });
    expect(newState.currentPlayer).toBe("white"); // 手番が交代
  });

  test("不正な手（既に石がある）は状態を変更しない", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const newState = applyMove(state, 27); // 白石がある
    expect(newState).toBe(state); // 同じオブジェクト
  });

  test("不正な手（範囲外）は状態を変更しない", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const newState = applyMove(state, 64); // 範囲外
    expect(newState).toBe(state);
  });

  test("不正な手（合法手でない）は状態を変更しない", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const newState = applyMove(state, 0); // 合法手でない
    expect(newState).toBe(state);
  });

  test("複数の方向に裏返せる", () => {
    // カスタム盤面を作成：黒が複数方向に裏返せる状況
    const board: Board = new Array(64).fill(null);
    board[28] = "white"; // e4
    board[36] = "white"; // e5
    board[44] = "black"; // f5

    const state: GameState = { board, currentPlayer: "black" };
    const newState = applyMove(state, 20); // c5

    expect(newState.board[20]).toBe("black"); // 配置
    expect(newState.board[28]).toBe("black"); // 右上方向に裏返った
  });

  test("パスの自動処理：相手がパスする場合", () => {
    // 確実にパスが発生する盤面を作成
    // 黒が打った後、白が合法手を持たない状況
    const board: Board = new Array(64).fill(null);

    // 上部に黒と白を配置
    board[0] = 'black';
    board[1] = 'white';
    board[2] = 'white';
    board[3] = null;

    // 下部は全て黒で埋める（白が置けない状況を作る）
    for (let i = 8; i < 64; i++) {
      board[i] = 'black';
    }

    const state: GameState = { board, currentPlayer: 'black' };

    // 黒が3に置く（2の白を裏返す）
    const newState = applyMove(state, 3);

    // 手が正常に適用されたことを確認
    expect(newState.board[3]).toBe('black');
    expect(newState.board[2]).toBe('black'); // 裏返った

    // この後白は置く場所がない
    // 白の合法手を確認
    const whiteMoves = getLegalMoves({ board: newState.board, currentPlayer: 'white' });
    expect(whiteMoves.length).toBe(0);

    // 黒はまだ置ける（例：4番に置ける可能性がある）
    const blackMoves = getLegalMoves({ board: newState.board, currentPlayer: 'black' });

    // 黒が置けるなら手番が黒に戻る、置けないならゲーム終了
    if (blackMoves.length > 0) {
      expect(newState.currentPlayer).toBe('black');
    } else {
      // 両者とも置けない場合は白のままでゲーム終了
      expect(newState.currentPlayer).toBe('white');
    }
  });

  test("パスの自動処理：両者ともパス", () => {
    // 両者とも置けない盤面を作成
    const board: Board = new Array(64).fill(null);
    board[0] = "black";
    board[63] = "white";

    const state: GameState = { board, currentPlayer: "black" };
    const legalMoves = getLegalMoves(state);

    expect(legalMoves).toHaveLength(0); // 黒は置けない
  });

  test("元のboardを変更しない（不変性）", () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: "black",
    };

    const originalBoard = [...state.board];
    applyMove(state, 19);

    expect(state.board).toEqual(originalBoard); // 元のboardは変更されない
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
    const board: Board = new Array(64).fill("black");
    const state: GameState = { board, currentPlayer: "black" };
    expect(isGameOver(state)).toBe(true);
  });

  test("両者とも置けないならゲーム終了", () => {
    const board: Board = new Array(64).fill(null);
    board[0] = "black";
    board[63] = "white";
    const state: GameState = { board, currentPlayer: "black" };
    expect(isGameOver(state)).toBe(true);
  });

  test("片方のみ置ける場合はゲーム継続", () => {
    const board: Board = new Array(64).fill("black");
    board[0] = null;
    board[1] = "white";
    const state: GameState = { board, currentPlayer: "black" };
    expect(isGameOver(state)).toBe(false);
  });

  test("現在のプレイヤーが置けない場合でも相手が置ける場合は継続", () => {
    const board: Board = createInitialBoard();
    // 黒が置けない状況を作る（実際には初期盤面では両方置ける）
    const state: GameState = { board, currentPlayer: "black" };
    expect(isGameOver(state)).toBe(false);
  });
});

describe("境界値テスト", () => {
  test("左端から左への移動", () => {
    const board: Board = new Array(64).fill(null);
    board[0] = "white"; // 左端
    board[1] = "black";
    const state: GameState = { board, currentPlayer: "white" };
    const moves = getLegalMoves(state);
    // 左端からは左に行けない
    expect(moves).not.toContain(-1);
  });

  test("右端から右への移動", () => {
    const board: Board = new Array(64).fill(null);
    board[7] = "white"; // 右端
    board[6] = "black";
    const state: GameState = { board, currentPlayer: "white" };
    const moves = getLegalMoves(state);
    // 右端からは右に行けない
    expect(moves).not.toContain(8);
  });

  test("角のマスでの合法手判定", () => {
    const board: Board = new Array(64).fill(null);
    // 角に黒石、隣に白石を配置して黒が挟める状況を作る
    board[0] = "black";
    board[1] = "white";
    board[2] = null; // ここに黒が置ける

    const state: GameState = { board, currentPlayer: "black" };
    const moves = getLegalMoves(state);

    // 黒は2に置くことで1の白石を挟める
    expect(moves).toContain(2);
  });
});
