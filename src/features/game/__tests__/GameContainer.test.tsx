import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameContainer } from "../GameContainer";

// useGameとuseCpuTurnフックをモック化
vi.mock("../hooks/useGame");
vi.mock("../hooks/useCpuTurn");

import { useGame } from "../hooks/useGame";
import { useCpuTurn } from "../hooks/useCpuTurn";
import { createInitialBoard } from "@/domain/game/board";

describe("GameContainer", () => {
  const mockUseGame = vi.mocked(useGame);
  const mockUseCpuTurn = vi.mocked(useCpuTurn);

  beforeEach(() => {
    vi.clearAllMocks();

    // デフォルトのuseGame戻り値
    mockUseGame.mockReturnValue({
      state: {
        board: createInitialBoard(),
        currentPlayer: "black",
      },
      config: null,
      legalMoves: [],
      score: { black: 2, white: 2 },
      result: { type: "playing" },
      isGameOver: false,
      isCpuThinking: false,
      setIsCpuThinking: vi.fn(),
      passPlayer: null,
      handleMove: vi.fn(),
      handleRestart: vi.fn(),
      handleBackToMenu: vi.fn(),
    });

    // デフォルトのuseCpuTurn（何もしない）
    mockUseCpuTurn.mockReturnValue(undefined);
  });

  describe("初期表示", () => {
    it("初期状態ではModeSelectコンポーネントが表示される", () => {
      render(<GameContainer />);

      // ModeSelectの特徴的な要素が表示されているか確認
      expect(screen.getByText("オセロ")).toBeInTheDocument();
      expect(screen.getByText("2人対戦")).toBeInTheDocument();
      expect(screen.getByText("CPU対戦")).toBeInTheDocument();
      expect(screen.getByText("ゲーム開始")).toBeInTheDocument();
    });

    it("configがnullの場合はゲーム画面が表示されない", () => {
      render(<GameContainer />);

      // ゲーム画面の要素が表示されていないことを確認
      expect(screen.queryByLabelText("オセロボード")).not.toBeInTheDocument();
    });
  });

  describe("モード選択からゲーム画面への遷移", () => {
    it("モード選択でゲーム開始をクリックするとゲーム画面に遷移する", async () => {
      const user = userEvent.setup();

      // configが設定された後のuseGame戻り値を準備
      mockUseGame.mockReturnValueOnce({
        state: {
          board: createInitialBoard(),
          currentPlayer: "black",
        },
        config: null,
        legalMoves: [],
        score: { black: 2, white: 2 },
        result: { type: "playing" },
        isGameOver: false,
        isCpuThinking: false,
        setIsCpuThinking: vi.fn(),
        passPlayer: null,
        handleMove: vi.fn(),
        handleRestart: vi.fn(),
        handleBackToMenu: vi.fn(),
      });

      const { rerender } = render(<GameContainer />);

      // ゲーム開始ボタンをクリック
      const startButton = screen.getByText("ゲーム開始");
      await user.click(startButton);

      // configが設定された後の状態をモック
      mockUseGame.mockReturnValue({
        state: {
          board: createInitialBoard(),
          currentPlayer: "black",
        },
        config: { mode: "pvp", userColor: "black" },
        legalMoves: [19, 26, 37, 44],
        score: { black: 2, white: 2 },
        result: { type: "playing" },
        isGameOver: false,
        isCpuThinking: false,
        setIsCpuThinking: vi.fn(),
        passPlayer: null,
        handleMove: vi.fn(),
        handleRestart: vi.fn(),
        handleBackToMenu: vi.fn(),
      });

      rerender(<GameContainer />);

      // ゲーム画面の要素が表示されることを確認
      await waitFor(() => {
        expect(screen.getByLabelText("オセロボード")).toBeInTheDocument();
      });
    });

    it("PvPモードを選択してゲームを開始できる", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<GameContainer />);

      // 2人対戦ボタンは初期選択されている
      const startButton = screen.getByText("ゲーム開始");
      await user.click(startButton);

      // configが設定された状態に更新
      mockUseGame.mockReturnValue({
        state: {
          board: createInitialBoard(),
          currentPlayer: "black",
        },
        config: { mode: "pvp", userColor: "black" },
        legalMoves: [19, 26, 37, 44],
        score: { black: 2, white: 2 },
        result: { type: "playing" },
        isGameOver: false,
        isCpuThinking: false,
        setIsCpuThinking: vi.fn(),
        passPlayer: null,
        handleMove: vi.fn(),
        handleRestart: vi.fn(),
        handleBackToMenu: vi.fn(),
      });

      rerender(<GameContainer />);

      // ゲーム情報が表示される
      await waitFor(() => {
        expect(screen.getByText(/の番/)).toBeInTheDocument();
      });
    });

    it("CPU対戦モードを選択してゲームを開始できる", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<GameContainer />);

      // CPU対戦を選択
      const pvcButton = screen.getByText("CPU対戦");
      await user.click(pvcButton);

      // ゲーム開始
      const startButton = screen.getByText("ゲーム開始");
      await user.click(startButton);

      // configが設定された状態に更新
      mockUseGame.mockReturnValue({
        state: {
          board: createInitialBoard(),
          currentPlayer: "black",
        },
        config: { mode: "pvc", userColor: "black" },
        legalMoves: [19, 26, 37, 44],
        score: { black: 2, white: 2 },
        result: { type: "playing" },
        isGameOver: false,
        isCpuThinking: false,
        setIsCpuThinking: vi.fn(),
        passPlayer: null,
        handleMove: vi.fn(),
        handleRestart: vi.fn(),
        handleBackToMenu: vi.fn(),
      });

      rerender(<GameContainer />);

      await waitFor(() => {
        expect(screen.getByLabelText("オセロボード")).toBeInTheDocument();
      });
    });
  });

  describe("メニューに戻る処理", () => {
    it("ゲーム終了後にメニューに戻るとModeSelectが表示される", async () => {
      const user = userEvent.setup();
      const handleBackToMenu = vi.fn();
      const { rerender } = render(<GameContainer />);

      // ゲーム開始
      const startButton = screen.getByText("ゲーム開始");
      await user.click(startButton);

      // ゲーム終了状態のモック
      mockUseGame.mockReturnValue({
        state: {
          board: createInitialBoard(),
          currentPlayer: "black",
        },
        config: { mode: "pvp", userColor: "black" },
        legalMoves: [],
        score: { black: 32, white: 32 },
        result: { type: "draw" },
        isGameOver: true,
        isCpuThinking: false,
        setIsCpuThinking: vi.fn(),
        passPlayer: null,
        handleMove: vi.fn(),
        handleRestart: vi.fn(),
        handleBackToMenu,
      });

      rerender(<GameContainer />);

      // 結果モーダルが表示される
      await waitFor(() => {
        expect(screen.getByText(/引き分け/)).toBeInTheDocument();
      });

      // メニューに戻るボタンをクリック
      const backButton = screen.getByText("メニューに戻る");
      await user.click(backButton);

      // handleBackToMenuが呼ばれることを確認
      expect(handleBackToMenu).toHaveBeenCalledTimes(1);

      // configがnullの状態に戻す
      mockUseGame.mockReturnValue({
        state: {
          board: createInitialBoard(),
          currentPlayer: "black",
        },
        config: null,
        legalMoves: [],
        score: { black: 2, white: 2 },
        result: { type: "playing" },
        isGameOver: false,
        isCpuThinking: false,
        setIsCpuThinking: vi.fn(),
        passPlayer: null,
        handleMove: vi.fn(),
        handleRestart: vi.fn(),
        handleBackToMenu: vi.fn(),
      });

      rerender(<GameContainer />);

      // ModeSelectに戻ることを確認
      await waitFor(() => {
        expect(screen.getByText("オセロ")).toBeInTheDocument();
        expect(screen.getByText("2人対戦")).toBeInTheDocument();
      });
    });

    it("メニューに戻る処理でゲーム状態がリセットされる", async () => {
      const user = userEvent.setup();
      const handleBackToMenu = vi.fn();
      const { rerender } = render(<GameContainer />);

      // ゲーム開始
      const startButton = screen.getByText("ゲーム開始");
      await user.click(startButton);

      // ゲーム進行中の状態
      mockUseGame.mockReturnValue({
        state: {
          board: createInitialBoard(),
          currentPlayer: "white",
        },
        config: { mode: "pvp", userColor: "black" },
        legalMoves: [10, 20],
        score: { black: 5, white: 10 },
        result: { type: "win", winner: "white", perfect: false },
        isGameOver: true,
        isCpuThinking: false,
        setIsCpuThinking: vi.fn(),
        passPlayer: null,
        handleMove: vi.fn(),
        handleRestart: vi.fn(),
        handleBackToMenu,
      });

      rerender(<GameContainer />);

      // メニューに戻るボタンをクリック
      const backButton = await screen.findByText("メニューに戻る");
      await user.click(backButton);

      expect(handleBackToMenu).toHaveBeenCalled();

      // configがリセットされた状態
      mockUseGame.mockReturnValue({
        state: {
          board: createInitialBoard(),
          currentPlayer: "black",
        },
        config: null,
        legalMoves: [],
        score: { black: 2, white: 2 },
        result: { type: "playing" },
        isGameOver: false,
        isCpuThinking: false,
        setIsCpuThinking: vi.fn(),
        passPlayer: null,
        handleMove: vi.fn(),
        handleRestart: vi.fn(),
        handleBackToMenu: vi.fn(),
      });

      rerender(<GameContainer />);

      // 初期状態に戻っていることを確認
      await waitFor(() => {
        expect(screen.getByText("ゲーム開始")).toBeInTheDocument();
      });
    });
  });

  describe("フックの統合", () => {
    it("useGameフックが正しく呼ばれる", () => {
      render(<GameContainer />);

      expect(mockUseGame).toHaveBeenCalledWith(null);
    });

    it("useCpuTurnフックが正しいパラメータで呼ばれる", () => {
      const mockSetIsCpuThinking = vi.fn();
      const mockHandleMove = vi.fn();

      mockUseGame.mockReturnValue({
        state: {
          board: createInitialBoard(),
          currentPlayer: "black",
        },
        config: { mode: "pvc", userColor: "black" },
        legalMoves: [19, 26, 37, 44],
        score: { black: 2, white: 2 },
        result: { type: "playing" },
        isGameOver: false,
        isCpuThinking: false,
        setIsCpuThinking: mockSetIsCpuThinking,
        passPlayer: null,
        handleMove: mockHandleMove,
        handleRestart: vi.fn(),
        handleBackToMenu: vi.fn(),
      });

      render(<GameContainer />);

      expect(mockUseCpuTurn).toHaveBeenCalledWith(
        { board: expect.any(Array), currentPlayer: "black" },
        { mode: "pvc", userColor: "black" },
        false,
        mockHandleMove,
        mockSetIsCpuThinking
      );
    });
  });

  describe("コンポーネントの表示", () => {
    it("ゲーム中はGameInfo、Board、が表示される", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<GameContainer />);

      // ゲーム開始してconfig設定
      const startButton = screen.getByText("ゲーム開始");
      await user.click(startButton);

      mockUseGame.mockReturnValue({
        state: {
          board: createInitialBoard(),
          currentPlayer: "black",
        },
        config: { mode: "pvp", userColor: "black" },
        legalMoves: [19, 26, 37, 44],
        score: { black: 2, white: 2 },
        result: { type: "playing" },
        isGameOver: false,
        isCpuThinking: false,
        setIsCpuThinking: vi.fn(),
        passPlayer: null,
        handleMove: vi.fn(),
        handleRestart: vi.fn(),
        handleBackToMenu: vi.fn(),
      });

      rerender(<GameContainer />);

      // GameInfo
      await waitFor(() => {
        expect(screen.getByText(/の番/)).toBeInTheDocument();
      });
      // Board
      expect(screen.getByLabelText("オセロボード")).toBeInTheDocument();
    });

    it("パスが発生するとPassNotificationが表示される", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<GameContainer />);

      // ゲーム開始してconfig設定
      const startButton = screen.getByText("ゲーム開始");
      await user.click(startButton);

      mockUseGame.mockReturnValue({
        state: {
          board: createInitialBoard(),
          currentPlayer: "black",
        },
        config: { mode: "pvp", userColor: "black" },
        legalMoves: [19, 26, 37, 44],
        score: { black: 2, white: 2 },
        result: { type: "playing" },
        isGameOver: false,
        isCpuThinking: false,
        setIsCpuThinking: vi.fn(),
        passPlayer: "white",
        handleMove: vi.fn(),
        handleRestart: vi.fn(),
        handleBackToMenu: vi.fn(),
      });

      rerender(<GameContainer />);

      await waitFor(() => {
        expect(screen.getByText("白はパスです")).toBeInTheDocument();
      });
    });

    it("ゲーム終了時はGameResultが表示される", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<GameContainer />);

      // ゲーム開始してconfig設定
      const startButton = screen.getByText("ゲーム開始");
      await user.click(startButton);

      mockUseGame.mockReturnValue({
        state: {
          board: createInitialBoard(),
          currentPlayer: "black",
        },
        config: { mode: "pvp", userColor: "black" },
        legalMoves: [],
        score: { black: 35, white: 29 },
        result: { type: "win", winner: "black", perfect: false },
        isGameOver: true,
        isCpuThinking: false,
        setIsCpuThinking: vi.fn(),
        passPlayer: null,
        handleMove: vi.fn(),
        handleRestart: vi.fn(),
        handleBackToMenu: vi.fn(),
      });

      rerender(<GameContainer />);

      await waitFor(() => {
        expect(screen.getByText("黒の勝ち！")).toBeInTheDocument();
      });
      expect(screen.getByText("もう一度")).toBeInTheDocument();
      expect(screen.getByText("メニューに戻る")).toBeInTheDocument();
    });
  });
});
