import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cell } from "../Cell";

describe("Cell", () => {
  it("空のマスを表示する", () => {
    render(
      <Cell index={0} value={null} isLegal={false} onCellClick={vi.fn()} disabled={false} />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("黒石を表示する", () => {
    render(
      <Cell index={0} value="black" isLegal={false} onCellClick={vi.fn()} disabled={false} />
    );

    const button = screen.getByLabelText("黒石");
    expect(button).toBeInTheDocument();
  });

  it("白石を表示する", () => {
    render(
      <Cell index={0} value="white" isLegal={false} onCellClick={vi.fn()} disabled={false} />
    );

    const button = screen.getByLabelText("白石");
    expect(button).toBeInTheDocument();
  });

  it("合法手を表示する", () => {
    render(
      <Cell index={0} value={null} isLegal={true} onCellClick={vi.fn()} disabled={false} />
    );

    const button = screen.getByLabelText("合法手");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("合法手をクリックするとonCellClickが呼ばれる", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Cell index={5} value={null} isLegal={true} onCellClick={handleClick} disabled={false} />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(5);
  });

  it("無効化されたセルはクリックできない", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Cell index={0} value={null} isLegal={true} onCellClick={handleClick} disabled={true} />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("合法手でないセルはクリックできない", () => {
    const handleClick = vi.fn();

    render(
      <Cell index={0} value={null} isLegal={false} onCellClick={handleClick} disabled={false} />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
