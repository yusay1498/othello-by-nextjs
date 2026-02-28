import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGame } from "../useGame";
import type { GameConfig } from "@/domain/game/types";

describe("useGame", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("初期状態", () => {
    test("PvPモードの初期状態が正しい", () => {
      const config: GameConfig = {
        mode: "pvp",
        userColor: "black",
      };

      const { result } = renderHook(() => useGame(config));

      expect(result.current.state.currentPlayer).toBe("black");
      expect(result.current.legalMoves).toHaveLength(4);
      expect(result.current.isGameOver).toBe(false);
      expect(result.current.score).toEqual({ black: 2, white: 2 });
      expect(result.current.result.type).toBe("playing");
      expect(result.current.isCpuThinking).toBe(false);
      expect(result.current.passPlayer).toBeNull();
    });

    test("PvCモードの初期状態が正しい", () => {
      const config: GameConfig = {
        mode: "pvc",
        userColor: "black",
      };

      const { result } = renderHook(() => useGame(config));

      expect(result.current.state.currentPlayer).toBe("black");
      expect(result.current.config).toEqual(config);
    });

    test("configがnullの場合も正しく動作する", () => {
      const { result } = renderHook(() => useGame(null));

      expect(result.current.config).toBeNull();
      expect(result.current.state.currentPlayer).toBe("black");
    });
  });

  describe("handleMove", () => {
    test("合法手を打つと状態が更新される", () => {
      const config: GameConfig = {
        mode: "pvp",
        userColor: "black",
      };

      const { result } = renderHook(() => useGame(config));

      // 黒の初期合法手は [19, 26, 37, 44]
      act(() => {
        result.current.handleMove(19);
      });

      // 手番が白に変わる
      expect(result.current.state.currentPlayer).toBe("white");
      // スコアが更新される
      expect(result.current.score.black).toBe(4);
      expect(result.current.score.white).toBe(1);
    });

    test("不正な手は無視される", () => {
      const config: GameConfig = {
        mode: "pvp",
        userColor: "black",
      };

      const { result } = renderHook(() => useGame(config));

      const prevState = result.current.state;

      // 不正な位置に手を打つ
      act(() => {
        result.current.handleMove(0);
      });

      // 状態が変わらない
      expect(result.current.state).toBe(prevState);
    });

    test("操作がブロックされている場合は手を打てない", () => {
      const config: GameConfig = {
        mode: "pvp",
        userColor: "black",
      };

      const { result } = renderHook(() => useGame(config));

      // CPU思考中フラグを使って操作をブロックする
      act(() => {
        result.current.setIsCpuThinking(true);
      });

      const prevState = result.current.state;

      // 手を打とうとする
      act(() => {
        result.current.handleMove(19);
      });

      // ブロックされているので状態が変わらない
      expect(result.current.state).toBe(prevState);
      expect(result.current.isCpuThinking).toBe(true);
    });

    test("通常の手ではパスは発生しない", () => {
      const config: GameConfig = {
        mode: "pvp",
        userColor: "black",
      };

      const { result } = renderHook(() => useGame(config));

      // 通常の手を打つ（パスは発生しない）
      act(() => {
        result.current.handleMove(19);
      });

      // 通常の手ではパスは発生しない
      expect(result.current.passPlayer).toBeNull();
      // 手番は正常に交代する
      expect(result.current.state.currentPlayer).toBe("white");
    });
  });

  describe("handleRestart", () => {
    test("リスタートすると初期状態に戻る", () => {
      const config: GameConfig = {
        mode: "pvp",
        userColor: "black",
      };

      const { result } = renderHook(() => useGame(config));

      // 手を打つ
      act(() => {
        result.current.handleMove(19);
      });

      expect(result.current.state.currentPlayer).toBe("white");

      // リスタート
      act(() => {
        result.current.handleRestart();
      });

      // 初期状態に戻る
      expect(result.current.state.currentPlayer).toBe("black");
      expect(result.current.score).toEqual({ black: 2, white: 2 });
      expect(result.current.passPlayer).toBeNull();
      expect(result.current.isCpuThinking).toBe(false);
    });
  });

  describe("handleBackToMenu", () => {
    test("メニューに戻ると状態がリセットされる", () => {
      const config: GameConfig = {
        mode: "pvp",
        userColor: "black",
      };

      const { result } = renderHook(() => useGame(config));

      // 手を打つ
      act(() => {
        result.current.handleMove(19);
      });

      // メニューに戻る
      act(() => {
        result.current.handleBackToMenu();
      });

      // 初期状態に戻る
      expect(result.current.state.currentPlayer).toBe("black");
      expect(result.current.score).toEqual({ black: 2, white: 2 });
    });
  });

  describe("導出値の計算", () => {
    test("legalMovesが正しく導出される", () => {
      const config: GameConfig = {
        mode: "pvp",
        userColor: "black",
      };

      const { result } = renderHook(() => useGame(config));

      // 初期状態での黒の合法手は4つ
      expect(result.current.legalMoves).toHaveLength(4);
      expect(result.current.legalMoves).toContain(19);
      expect(result.current.legalMoves).toContain(26);
      expect(result.current.legalMoves).toContain(37);
      expect(result.current.legalMoves).toContain(44);
    });

    test("scoreが正しく導出される", () => {
      const config: GameConfig = {
        mode: "pvp",
        userColor: "black",
      };

      const { result } = renderHook(() => useGame(config));

      // 初期状態
      expect(result.current.score).toEqual({ black: 2, white: 2 });

      // 手を打つ
      act(() => {
        result.current.handleMove(19);
      });

      // スコアが更新される
      expect(result.current.score.black).toBe(4);
      expect(result.current.score.white).toBe(1);
    });

    test("resultが正しく導出される", () => {
      const config: GameConfig = {
        mode: "pvp",
        userColor: "black",
      };

      const { result } = renderHook(() => useGame(config));

      // ゲーム進行中
      expect(result.current.result.type).toBe("playing");
      expect(result.current.isGameOver).toBe(false);
    });
  });
});
