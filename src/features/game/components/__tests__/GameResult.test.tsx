import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameResult } from "../GameResult";
import type { WinnerResult } from "@/domain/game/types";

describe("GameResult", () => {
  describe("表示条件", () => {
    it("ゲーム進行中は何も表示しない", () => {
      const result: WinnerResult = { type: "playing" };
      const { container } = render(
        <GameResult
          result={result}
          score={{ black: 10, white: 10 }}
          onRestart={vi.fn()}
          onBackToMenu={vi.fn()}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it("ゲーム終了時はモーダルを表示する", () => {
      const result: WinnerResult = {
        type: "win",
        winner: "black",
        perfect: false,
      };
      render(
        <GameResult
          result={result}
          score={{ black: 32, white: 32 }}
          onRestart={vi.fn()}
          onBackToMenu={vi.fn()}
        />
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("勝敗メッセージ", () => {
    it("黒の勝利メッセージを表示する", () => {
      const result: WinnerResult = {
        type: "win",
        winner: "black",
        perfect: false,
      };
      render(
        <GameResult
          result={result}
          score={{ black: 35, white: 29 }}
          onRestart={vi.fn()}
          onBackToMenu={vi.fn()}
        />
      );

      expect(screen.getByText("黒の勝ち！")).toBeInTheDocument();
    });

    it("白の勝利メッセージを表示する", () => {
      const result: WinnerResult = {
        type: "win",
        winner: "white",
        perfect: false,
      };
      render(
        <GameResult
          result={result}
          score={{ black: 25, white: 39 }}
          onRestart={vi.fn()}
          onBackToMenu={vi.fn()}
        />
      );

      expect(screen.getByText("白の勝ち！")).toBeInTheDocument();
    });

    it("黒のパーフェクト勝利メッセージを表示する", () => {
      const result: WinnerResult = {
        type: "win",
        winner: "black",
        perfect: true,
      };
      render(
        <GameResult
          result={result}
          score={{ black: 64, white: 0 }}
          onRestart={vi.fn()}
          onBackToMenu={vi.fn()}
        />
      );

      expect(screen.getByText("黒のパーフェクト勝利！")).toBeInTheDocument();
    });

    it("白のパーフェクト勝利メッセージを表示する", () => {
      const result: WinnerResult = {
        type: "win",
        winner: "white",
        perfect: true,
      };
      render(
        <GameResult
          result={result}
          score={{ black: 0, white: 64 }}
          onRestart={vi.fn()}
          onBackToMenu={vi.fn()}
        />
      );

      expect(screen.getByText("白のパーフェクト勝利！")).toBeInTheDocument();
    });

    it("引き分けメッセージとスコアを表示する", () => {
      const result: WinnerResult = { type: "draw" };
      render(
        <GameResult
          result={result}
          score={{ black: 32, white: 32 }}
          onRestart={vi.fn()}
          onBackToMenu={vi.fn()}
        />
      );

      expect(screen.getByText("引き分け (32-32)")).toBeInTheDocument();
    });
  });

  describe("スコア表示", () => {
    it("黒と白の最終スコアを正しく表示する", () => {
      const result: WinnerResult = {
        type: "win",
        winner: "black",
        perfect: false,
      };
      render(
        <GameResult
          result={result}
          score={{ black: 40, white: 24 }}
          onRestart={vi.fn()}
          onBackToMenu={vi.fn()}
        />
      );

      expect(screen.getByLabelText("黒の最終スコア: 40")).toHaveTextContent(
        "40"
      );
      expect(screen.getByLabelText("白の最終スコア: 24")).toHaveTextContent(
        "24"
      );
    });
  });

  describe("ボタン操作", () => {
    it("もう一度ボタンをクリックするとonRestartが呼ばれる", async () => {
      const user = userEvent.setup();
      const onRestart = vi.fn();
      const result: WinnerResult = {
        type: "win",
        winner: "black",
        perfect: false,
      };

      render(
        <GameResult
          result={result}
          score={{ black: 35, white: 29 }}
          onRestart={onRestart}
          onBackToMenu={vi.fn()}
        />
      );

      const restartButton = screen.getByRole("button", {
        name: "もう一度プレイする",
      });
      await user.click(restartButton);

      expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it("メニューに戻るボタンをクリックするとonBackToMenuが呼ばれる", async () => {
      const user = userEvent.setup();
      const onBackToMenu = vi.fn();
      const result: WinnerResult = {
        type: "win",
        winner: "white",
        perfect: false,
      };

      render(
        <GameResult
          result={result}
          score={{ black: 28, white: 36 }}
          onRestart={vi.fn()}
          onBackToMenu={onBackToMenu}
        />
      );

      const backButton = screen.getByRole("button", {
        name: "メニューに戻る",
      });
      await user.click(backButton);

      expect(onBackToMenu).toHaveBeenCalledTimes(1);
    });
  });

  describe("アクセシビリティ", () => {
    it("モーダルとして適切な属性が設定されている", () => {
      const result: WinnerResult = {
        type: "win",
        winner: "black",
        perfect: false,
      };
      render(
        <GameResult
          result={result}
          score={{ black: 35, white: 29 }}
          onRestart={vi.fn()}
          onBackToMenu={vi.fn()}
        />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "game-result-title");
    });

    it("タイトルに適切なIDが設定されている", () => {
      const result: WinnerResult = {
        type: "win",
        winner: "black",
        perfect: false,
      };
      render(
        <GameResult
          result={result}
          score={{ black: 35, white: 29 }}
          onRestart={vi.fn()}
          onBackToMenu={vi.fn()}
        />
      );

      const title = screen.getByText("黒の勝ち！");
      expect(title).toHaveAttribute("id", "game-result-title");
    });

    it("モーダルが表示されたら「もう一度」ボタンにフォーカスが移動する", () => {
      const result: WinnerResult = {
        type: "win",
        winner: "black",
        perfect: false,
      };
      render(
        <GameResult
          result={result}
          score={{ black: 35, white: 29 }}
          onRestart={vi.fn()}
          onBackToMenu={vi.fn()}
        />
      );

      const restartButton = screen.getByRole("button", {
        name: "もう一度プレイする",
      });
      expect(restartButton).toHaveFocus();
    });

    it("ESCキーを押すとonBackToMenuが呼ばれる", async () => {
      const user = userEvent.setup();
      const onBackToMenu = vi.fn();
      const result: WinnerResult = {
        type: "win",
        winner: "black",
        perfect: false,
      };

      render(
        <GameResult
          result={result}
          score={{ black: 35, white: 29 }}
          onRestart={vi.fn()}
          onBackToMenu={onBackToMenu}
        />
      );

      await user.keyboard("{Escape}");

      expect(onBackToMenu).toHaveBeenCalledTimes(1);
    });

    it("バックドロップをクリックするとonBackToMenuが呼ばれる", async () => {
      const user = userEvent.setup();
      const onBackToMenu = vi.fn();
      const result: WinnerResult = {
        type: "win",
        winner: "black",
        perfect: false,
      };

      render(
        <GameResult
          result={result}
          score={{ black: 35, white: 29 }}
          onRestart={vi.fn()}
          onBackToMenu={onBackToMenu}
        />
      );

      const backdrop = screen.getByRole("dialog");
      await user.click(backdrop);

      expect(onBackToMenu).toHaveBeenCalledTimes(1);
    });

    it("モーダルコンテンツをクリックしてもonBackToMenuは呼ばれない", async () => {
      const user = userEvent.setup();
      const onBackToMenu = vi.fn();
      const result: WinnerResult = {
        type: "win",
        winner: "black",
        perfect: false,
      };

      render(
        <GameResult
          result={result}
          score={{ black: 35, white: 29 }}
          onRestart={vi.fn()}
          onBackToMenu={onBackToMenu}
        />
      );

      const title = screen.getByText("黒の勝ち！");
      await user.click(title);

      expect(onBackToMenu).not.toHaveBeenCalled();
    });
  });
});
