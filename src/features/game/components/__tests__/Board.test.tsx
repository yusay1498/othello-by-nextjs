import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Board } from "../Board";
import { createInitialBoard } from "@/domain/game/board";

describe("Board", () => {
  it("64個のセルを表示する", () => {
    const board = createInitialBoard();
    const handleCellClick = vi.fn();

    render(
      <Board
        board={board}
        legalMoves={[]}
        onCellClick={handleCellClick}
        disabled={false}
      />
    );

    const cells = screen.getAllByRole("button");
    expect(cells).toHaveLength(64);
  });

  it("初期配置の石を正しく表示する", () => {
    const board = createInitialBoard();
    const handleCellClick = vi.fn();

    render(
      <Board
        board={board}
        legalMoves={[]}
        onCellClick={handleCellClick}
        disabled={false}
      />
    );

    // 初期配置: 27=白, 28=黒, 35=黒, 36=白
    const blackStones = screen.getAllByLabelText("黒猫");
    const whiteStones = screen.getAllByLabelText("白猫");

    expect(blackStones).toHaveLength(2);
    expect(whiteStones).toHaveLength(2);
  });

  it("合法手を表示する", () => {
    const board = createInitialBoard();
    const legalMoves = [19, 26, 37, 44]; // 例: 初期状態の黒の合法手
    const handleCellClick = vi.fn();

    render(
      <Board
        board={board}
        legalMoves={legalMoves}
        onCellClick={handleCellClick}
        disabled={false}
      />
    );

    const legalCells = screen.getAllByLabelText("合法手");
    expect(legalCells).toHaveLength(4);
  });

  it("セルクリック時にonCellClickが正しいインデックスで呼ばれる", async () => {
    const user = userEvent.setup();
    const board = createInitialBoard();
    const legalMoves = [19];
    const handleCellClick = vi.fn();

    render(
      <Board
        board={board}
        legalMoves={legalMoves}
        onCellClick={handleCellClick}
        disabled={false}
      />
    );

    const legalCell = screen.getByLabelText("合法手");
    await user.click(legalCell);

    expect(handleCellClick).toHaveBeenCalledWith(19);
  });

  it("無効化されている場合はクリックできない", () => {
    const board = createInitialBoard();
    const legalMoves = [19];
    const handleCellClick = vi.fn();

    render(
      <Board
        board={board}
        legalMoves={legalMoves}
        onCellClick={handleCellClick}
        disabled={true}
      />
    );

    const cells = screen.getAllByRole("button");
    cells.forEach((cell) => {
      expect(cell).toBeDisabled();
    });
  });
});
