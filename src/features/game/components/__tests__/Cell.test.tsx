import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cell } from "../Cell";

describe("Cell", () => {
  it("空のマスを表示する", () => {
    render(
      <Cell value={null} isLegal={false} onClick={vi.fn()} disabled={false} />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("黒石を表示する", () => {
    render(
      <Cell value="black" isLegal={false} onClick={vi.fn()} disabled={false} />
    );

    const button = screen.getByLabelText("黒石");
    expect(button).toBeInTheDocument();
  });

  it("白石を表示する", () => {
    render(
      <Cell value="white" isLegal={false} onClick={vi.fn()} disabled={false} />
    );

    const button = screen.getByLabelText("白石");
    expect(button).toBeInTheDocument();
  });

  it("合法手を表示する", () => {
    render(
      <Cell value={null} isLegal={true} onClick={vi.fn()} disabled={false} />
    );

    const button = screen.getByLabelText("合法手");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("合法手をクリックするとonClickが呼ばれる", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Cell value={null} isLegal={true} onClick={handleClick} disabled={false} />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("無効化されたセルはクリックできない", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Cell value={null} isLegal={true} onClick={handleClick} disabled={true} />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("合法手でないセルはクリックできない", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Cell value={null} isLegal={false} onClick={handleClick} disabled={false} />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
