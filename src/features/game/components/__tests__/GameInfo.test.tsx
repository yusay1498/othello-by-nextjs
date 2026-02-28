import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameInfo } from "../GameInfo";

describe("GameInfo", () => {
  it("黒の手番を表示する", () => {
    render(
      <GameInfo
        currentPlayer="black"
        score={{ black: 2, white: 2 }}
        isCpuThinking={false}
      />
    );

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === "⚫ 黒の番" || false;
      })
    ).toBeInTheDocument();
  });

  it("白の手番を表示する", () => {
    render(
      <GameInfo
        currentPlayer="white"
        score={{ black: 2, white: 2 }}
        isCpuThinking={false}
      />
    );

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === "⚪ 白の番" || false;
      })
    ).toBeInTheDocument();
  });

  it("スコアを正しく表示する", () => {
    render(
      <GameInfo
        currentPlayer="black"
        score={{ black: 15, white: 10 }}
        isCpuThinking={false}
      />
    );

    expect(screen.getByLabelText("黒のスコア: 15")).toHaveTextContent("15");
    expect(screen.getByLabelText("白のスコア: 10")).toHaveTextContent("10");
  });

  it("CPU思考中の表示をする", () => {
    render(
      <GameInfo
        currentPlayer="black"
        score={{ black: 2, white: 2 }}
        isCpuThinking={true}
      />
    );

    expect(screen.getByText(/思考中/)).toBeInTheDocument();
  });

  it("CPU思考中でない場合は思考中の表示をしない", () => {
    render(
      <GameInfo
        currentPlayer="black"
        score={{ black: 2, white: 2 }}
        isCpuThinking={false}
      />
    );

    expect(screen.queryByText(/思考中/)).not.toBeInTheDocument();
  });

  it("ゲーム情報のラベルが設定されている", () => {
    render(
      <GameInfo
        currentPlayer="black"
        score={{ black: 2, white: 2 }}
        isCpuThinking={false}
      />
    );

    expect(screen.getByLabelText("ゲーム情報")).toBeInTheDocument();
  });

  it("手番情報がライブリージョンとして設定されている", () => {
    const { container } = render(
      <GameInfo
        currentPlayer="black"
        score={{ black: 2, white: 2 }}
        isCpuThinking={false}
      />
    );

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });
});
