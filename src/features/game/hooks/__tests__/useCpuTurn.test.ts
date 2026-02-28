import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCpuTurn } from "../useCpuTurn";
import type { GameState, GameConfig } from "@/domain/game/types";
import { createInitialBoard } from "@/domain/game/board";
import * as ai from "@/domain/game/ai";

describe("useCpuTurn", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("基本動作", () => {
    test("CPU対戦モードでない場合は何もしない", () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: "black",
      };
      const config: GameConfig = {
        mode: "pvp",
        userColor: "black",
      };
      const onMove = vi.fn();
      const onPass = vi.fn();
      const setIsCpuThinking = vi.fn();

      renderHook(() =>
        useCpuTurn(state, config, false, onMove, onPass, setIsCpuThinking)
      );

      // PvPモードなのでCPU思考は発動しない
      expect(setIsCpuThinking).not.toHaveBeenCalled();
      expect(onMove).not.toHaveBeenCalled();
    });

    test("configがnullの場合は何もしない", () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: "black",
      };
      const onMove = vi.fn();
      const onPass = vi.fn();
      const setIsCpuThinking = vi.fn();

      renderHook(() => useCpuTurn(state, null, false, onMove, onPass, setIsCpuThinking));

      // configがnullなので何もしない
      expect(setIsCpuThinking).not.toHaveBeenCalled();
      expect(onMove).not.toHaveBeenCalled();
    });

    test("ゲーム終了時は何もしない", () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: "white",
      };
      const config: GameConfig = {
        mode: "pvc",
        userColor: "black",
      };
      const onMove = vi.fn();
      const onPass = vi.fn();
      const setIsCpuThinking = vi.fn();

      renderHook(() => useCpuTurn(state, config, true, onMove, onPass, setIsCpuThinking));

      // ゲーム終了しているので何もしない
      expect(setIsCpuThinking).not.toHaveBeenCalled();
      expect(onMove).not.toHaveBeenCalled();
    });

    test("ユーザーの手番では何もしない", () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: "black",
      };
      const config: GameConfig = {
        mode: "pvc",
        userColor: "black",
      };
      const onMove = vi.fn();
      const onPass = vi.fn();
      const setIsCpuThinking = vi.fn();

      renderHook(() =>
        useCpuTurn(state, config, false, onMove, onPass, setIsCpuThinking)
      );

      // ユーザーの手番なので何もしない
      expect(setIsCpuThinking).not.toHaveBeenCalled();
      expect(onMove).not.toHaveBeenCalled();
    });
  });

  describe("CPU手番の処理", () => {
    test("CPUの手番で500ms後に手を打つ", () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: "white",
      };
      const config: GameConfig = {
        mode: "pvc",
        userColor: "black",
      };
      const onMove = vi.fn();
      const onPass = vi.fn();
      const setIsCpuThinking = vi.fn();

      // getBestMoveをモック
      const getBestMoveSpy = vi.spyOn(ai, "getBestMove");
      getBestMoveSpy.mockReturnValue(19);

      renderHook(() =>
        useCpuTurn(state, config, false, onMove, onPass, setIsCpuThinking)
      );

      // 即座にCPU思考中フラグが立つ
      expect(setIsCpuThinking).toHaveBeenCalledWith(true);

      // 500ms経過前はまだ手を打たない
      vi.advanceTimersByTime(400);
      expect(onMove).not.toHaveBeenCalled();

      // 500ms経過後に手を打つ
      vi.advanceTimersByTime(100);
      expect(getBestMoveSpy).toHaveBeenCalledWith(state);
      expect(onMove).toHaveBeenCalledWith(19);
      expect(setIsCpuThinking).toHaveBeenCalledWith(false);
    });

    test("手を打った後にCPU思考中フラグが下ろされる", () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: "white",
      };
      const config: GameConfig = {
        mode: "pvc",
        userColor: "black",
      };
      const callOrder: string[] = [];
      const onMove = vi.fn(() => {
        callOrder.push("onMove");
      });
      const onPass = vi.fn(() => {
        callOrder.push("onPass");
      });
      const setIsCpuThinking = vi.fn((value: boolean) => {
        callOrder.push(`setIsCpuThinking(${value})`);
      });

      const getBestMoveSpy = vi.spyOn(ai, "getBestMove");
      getBestMoveSpy.mockReturnValue(19);

      renderHook(() =>
        useCpuTurn(state, config, false, onMove, onPass, setIsCpuThinking)
      );

      // 500ms経過
      vi.advanceTimersByTime(500);

      // onMoveの後にsetIsCpuThinking(false)が呼ばれることを確認
      expect(callOrder).toEqual([
        "setIsCpuThinking(true)",
        "onMove",
        "setIsCpuThinking(false)",
      ]);
    });

    test("合法手がない場合はパスする", () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: "white",
      };
      const config: GameConfig = {
        mode: "pvc",
        userColor: "black",
      };
      const onMove = vi.fn();
      const onPass = vi.fn();
      const setIsCpuThinking = vi.fn();

      // getBestMoveがnullを返す（合法手なし）
      const getBestMoveSpy = vi.spyOn(ai, "getBestMove");
      getBestMoveSpy.mockReturnValue(null);

      renderHook(() =>
        useCpuTurn(state, config, false, onMove, onPass, setIsCpuThinking)
      );

      // CPU思考中フラグは立つ
      expect(setIsCpuThinking).toHaveBeenCalledWith(true);

      // 500ms経過
      vi.advanceTimersByTime(500);

      // 合法手がないのでonMoveは呼ばれず、onPassが呼ばれる
      expect(onMove).not.toHaveBeenCalled();
      expect(onPass).toHaveBeenCalled();
      // フラグは下ろされる
      expect(setIsCpuThinking).toHaveBeenCalledWith(false);
    });
  });

  describe("クリーンアップ", () => {
    test("アンマウント時にタイマーがクリアされる", () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: "white",
      };
      const config: GameConfig = {
        mode: "pvc",
        userColor: "black",
      };
      const onMove = vi.fn();
      const onPass = vi.fn();
      const setIsCpuThinking = vi.fn();

      const getBestMoveSpy = vi.spyOn(ai, "getBestMove");
      getBestMoveSpy.mockReturnValue(19);

      const { unmount } = renderHook(() =>
        useCpuTurn(state, config, false, onMove, onPass, setIsCpuThinking)
      );

      // CPU思考中フラグが立つ
      expect(setIsCpuThinking).toHaveBeenCalledWith(true);

      // アンマウント
      unmount();

      // クリーンアップでCPU思考中フラグが下ろされる
      expect(setIsCpuThinking).toHaveBeenCalledWith(false);

      // タイマー経過後も手を打たない（クリーンアップされている）
      vi.advanceTimersByTime(500);
      expect(onMove).not.toHaveBeenCalled();
    });

    test("状態変更時に前のタイマーがクリアされる", () => {
      const initialState: GameState = {
        board: createInitialBoard(),
        currentPlayer: "white",
      };
      const config: GameConfig = {
        mode: "pvc",
        userColor: "black",
      };
      const onMove = vi.fn();
      const onPass = vi.fn();
      const setIsCpuThinking = vi.fn();

      const getBestMoveSpy = vi.spyOn(ai, "getBestMove");
      getBestMoveSpy.mockReturnValue(19);

      const { rerender } = renderHook(
        ({ state }) => useCpuTurn(state, config, false, onMove, onPass, setIsCpuThinking),
        {
          initialProps: { state: initialState },
        }
      );

      // 最初のタイマーがセットされる
      expect(setIsCpuThinking).toHaveBeenCalledWith(true);

      // 300ms経過
      vi.advanceTimersByTime(300);

      // 状態が変わる
      const newState: GameState = {
        board: createInitialBoard(),
        currentPlayer: "black",
      };
      rerender({ state: newState });

      // 前のタイマーがクリアされ、新しい状態では何もしない（ユーザー手番）
      vi.advanceTimersByTime(200);
      // 合計500msだが、状態変更でクリアされたので呼ばれない
      expect(onMove).not.toHaveBeenCalled();
    });
  });

  describe("ユーザー色による判定", () => {
    test("ユーザーが黒でCPUが白の場合、白手番で実行される", () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: "white",
      };
      const config: GameConfig = {
        mode: "pvc",
        userColor: "black",
      };
      const onMove = vi.fn();
      const onPass = vi.fn();
      const setIsCpuThinking = vi.fn();

      const getBestMoveSpy = vi.spyOn(ai, "getBestMove");
      getBestMoveSpy.mockReturnValue(19);

      renderHook(() =>
        useCpuTurn(state, config, false, onMove, onPass, setIsCpuThinking)
      );

      // CPUの手番なので実行される
      expect(setIsCpuThinking).toHaveBeenCalledWith(true);

      vi.advanceTimersByTime(500);
      expect(onMove).toHaveBeenCalledWith(19);
    });

    test("ユーザーが白でCPUが黒の場合、黒手番で実行される", () => {
      const state: GameState = {
        board: createInitialBoard(),
        currentPlayer: "black",
      };
      const config: GameConfig = {
        mode: "pvc",
        userColor: "white",
      };
      const onMove = vi.fn();
      const onPass = vi.fn();
      const setIsCpuThinking = vi.fn();

      const getBestMoveSpy = vi.spyOn(ai, "getBestMove");
      getBestMoveSpy.mockReturnValue(26);

      renderHook(() =>
        useCpuTurn(state, config, false, onMove, onPass, setIsCpuThinking)
      );

      // CPUの手番なので実行される
      expect(setIsCpuThinking).toHaveBeenCalledWith(true);

      vi.advanceTimersByTime(500);
      expect(onMove).toHaveBeenCalledWith(26);
    });
  });
});
