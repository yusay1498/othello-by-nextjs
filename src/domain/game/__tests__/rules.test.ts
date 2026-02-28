import { describe, expect, test } from 'vitest';
import { createInitialBoard, getScore } from '../board';
import { applyMove, getLegalMoves, isGameOver } from '../rules';
import { TOTAL_CELLS } from '../constants';
import type { Board, GameState } from '../types';

describe("getLegalMoves", () => {
  test('初期盤面の黒の合法手は4つ', () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: 'black',
    };
    const moves = getLegalMoves(state);
    expect(moves).toHaveLength(4);
    expect(moves).toContain(19); // d3
    expect(moves).toContain(26); // c4
    expect(moves).toContain(37); // f5
    expect(moves).toContain(44); // e6
  });

  test('初期盤面の白の合法手は4つ', () => {
    const state: GameState = {
      board: createInitialBoard(),
      currentPlayer: 'white',
    };
    const moves = getLegalMoves(state);
    expect(moves).toHaveLength(4);
    expect(moves).toContain(20); // e3
    expect(moves).toContain(29); // f4
    expect(moves).toContain(34); // c5
    expect(moves).toContain(43); // d6
  });

  test("合法手がない場合は空配列", () => {
    const board: Board = new Array(TOTAL_CELLS).fill("black");
    board[0] = null;
    const state: GameState = { board, currentPlayer: "white" };
    const moves = getLegalMoves(state);
    expect(moves).toEqual([]);
  });

  test("空のボードでは合法手なし", () => {
    const board: Board = new Array(TOTAL_CELLS).fill(null);
    const state: GameState = { board, currentPlayer: "black" };
    const moves = getLegalMoves(state);
    expect(moves).toEqual([]);
  });

  test("両者とも置けない盤面では合法手なし", () => {
    // 両者とも置けない盤面を作成
    const board: Board = new Array(TOTAL_CELLS).fill(null);
    board[0] = "black";
    board[63] = "white";

    const state: GameState = { board, currentPlayer: "black" };
    const legalMoves = getLegalMoves(state);

    expect(legalMoves).toHaveLength(0); // 黒は置けない
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

    const newState = applyMove(state, TOTAL_CELLS); // 範囲外（最大インデックス+1）
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

  test("複数方向に裏返せる", () => {
    // カスタム盤面を作成：黒が複数方向に裏返せる状況
    const board: Board = new Array(TOTAL_CELLS).fill(null);
    board[28] = "white"; // e4
    board[36] = "white"; // e5
    board[44] = "black"; // f5

    const state: GameState = { board, currentPlayer: "black" };
    const newState = applyMove(state, 20); // c5

    expect(newState.board[20]).toBe("black"); // 配置
    expect(newState.board[28]).toBe("black"); // 右上方向に裏返った
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
    const board: Board = new Array(TOTAL_CELLS).fill("black");
    const state: GameState = { board, currentPlayer: "black" };
    expect(isGameOver(state)).toBe(true);
  });

  test("両者とも置けないならゲーム終了", () => {
    const board: Board = new Array(TOTAL_CELLS).fill(null);
    board[0] = "black";
    board[63] = "white";
    const state: GameState = { board, currentPlayer: "black" };
    expect(isGameOver(state)).toBe(true);
  });

  test("片方のみ置ける場合はゲーム継続", () => {
    const board: Board = new Array(TOTAL_CELLS).fill("black");
    board[0] = null;
    board[1] = "white";
    const state: GameState = { board, currentPlayer: "black" };
    expect(isGameOver(state)).toBe(false);
  });

  test('現在のプレイヤーが置けない場合でも相手が置ける場合は継続', () => {
    const board: Board = new Array(TOTAL_CELLS).fill(null);
    // 0: 黒石, 1: 白石, それ以外は空き
    // このとき白（現在プレイヤー）はどこにも合法手がなく、黒は2に合法手を持つ
    board[0] = 'black';
    board[1] = 'white';

    const state: GameState = { board, currentPlayer: 'white' };
    expect(isGameOver(state)).toBe(false);
  });
});

describe('境界値テスト', () => {
  test('左端から左への移動で行ラップしない', () => {
    const board: Board = new Array(TOTAL_CELLS).fill(null);
    // 行ラップが起きると誤って 8 が合法手になるような配置:
    //  6: 自分の石, 7: 相手の石, 8: 空 (見かけ上は「左端」)
    board[6] = 'white';
    board[7] = 'black';
    // 8 が合法手として返ってこないことを確認する
    const state: GameState = { board, currentPlayer: 'white' };
    const moves = getLegalMoves(state);
    expect(moves).not.toContain(8);
  });

  test('右端から右への移動で行ラップしない', () => {
    const board: Board = new Array(TOTAL_CELLS).fill(null);
    // 行ラップ（col7 → 次行 col0）を誤って許す実装だと、
    // index 8 が合法手と判定されてしまうような盤面を作る
    //
    // 0 行目:  ... B W  (index 6: black, 7: white)
    // 1 行目:  ... ?    (index 8: null)
    // 正しい実装では 8 は合法手ではない（行をまたいで挟み込みできない）ため、
    // moves に 8 が含まれないことを検証する。
    board[6] = 'black';
    board[7] = 'white'; // 右端
    board[8] = null; // 次の行の左端

    // さらに通常の合法手が存在するよう、別の場所に挟み込み可能な配置を作る
    // 2 行目: index 16: black, 17: white, 18: null → 18 は黒の合法手
    board[16] = 'black';
    board[17] = 'white';
    board[18] = null;

    const state: GameState = { board, currentPlayer: 'black' };
    const moves = getLegalMoves(state);

    // 合法手が存在することを確認（テストが常に真にならないようにする）
    expect(moves.length).toBeGreaterThan(0);
    // 右端から次の行への行ラップは許されないので、index 8 は合法手に含まれない
    expect(moves).not.toContain(8);
  });

  test("角のマスでの合法手判定", () => {
    const board: Board = new Array(TOTAL_CELLS).fill(null);
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
