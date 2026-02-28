import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModeSelect } from "../ModeSelect";
import type { GameConfig } from "@/domain/game/types";

describe("ModeSelect", () => {
  it("初期状態では2人対戦が選択されている", () => {
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const pvpButton = screen.getByText("2人対戦");
    expect(pvpButton).toHaveAttribute("aria-pressed", "true");
  });

  it("CPU対戦ボタンをクリックするとモードが切り替わる", async () => {
    const user = userEvent.setup();
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const pvcButton = screen.getByText("CPU対戦");
    await user.click(pvcButton);

    expect(pvcButton).toHaveAttribute("aria-pressed", "true");
  });

  it("CPU対戦を選択すると色選択が表示される", async () => {
    const user = userEvent.setup();
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const pvcButton = screen.getByText("CPU対戦");
    await user.click(pvcButton);

    expect(screen.getByText("あなたの色")).toBeInTheDocument();
    expect(screen.getByText("黒（先手）")).toBeInTheDocument();
    expect(screen.getByText("白（後手）")).toBeInTheDocument();
  });

  it("2人対戦モードでゲーム開始すると正しい設定でコールバックが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const startButton = screen.getByText("ゲーム開始");
    await user.click(startButton);

    expect(onSelectMode).toHaveBeenCalledWith({
      mode: "pvp",
      userColor: "black",
    } as GameConfig);
  });

  it("CPU対戦モード（黒）でゲーム開始すると正しい設定でコールバックが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const pvcButton = screen.getByText("CPU対戦");
    await user.click(pvcButton);

    const startButton = screen.getByText("ゲーム開始");
    await user.click(startButton);

    expect(onSelectMode).toHaveBeenCalledWith({
      mode: "pvc",
      userColor: "black",
    } as GameConfig);
  });

  it("CPU対戦モード（白）でゲーム開始すると正しい設定でコールバックが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const pvcButton = screen.getByText("CPU対戦");
    await user.click(pvcButton);

    const whiteRadio = screen.getByLabelText(/白（後手）/);
    await user.click(whiteRadio);

    const startButton = screen.getByText("ゲーム開始");
    await user.click(startButton);

    expect(onSelectMode).toHaveBeenCalledWith({
      mode: "pvc",
      userColor: "white",
    } as GameConfig);
  });

  it("色選択のラジオボタンが正しく動作する", async () => {
    const user = userEvent.setup();
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const pvcButton = screen.getByText("CPU対戦");
    await user.click(pvcButton);

    const blackRadio = screen.getByLabelText(/黒（先手）/) as HTMLInputElement;
    const whiteRadio = screen.getByLabelText(/白（後手）/) as HTMLInputElement;

    // 初期状態では黒が選択されている
    expect(blackRadio.checked).toBe(true);
    expect(whiteRadio.checked).toBe(false);

    // 白を選択
    await user.click(whiteRadio);
    expect(blackRadio.checked).toBe(false);
    expect(whiteRadio.checked).toBe(true);

    // 黒を選択
    await user.click(blackRadio);
    expect(blackRadio.checked).toBe(true);
    expect(whiteRadio.checked).toBe(false);
  });

  it("CPU対戦で白を選択後に2人対戦に切り替えると色が黒にリセットされる", async () => {
    const user = userEvent.setup();
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    // CPU対戦を選択
    const pvcButton = screen.getByText("CPU対戦");
    await user.click(pvcButton);

    // 白を選択
    const whiteRadio = screen.getByLabelText(/白（後手）/);
    await user.click(whiteRadio);

    // 2人対戦に切り替え
    const pvpButton = screen.getByText("2人対戦");
    await user.click(pvpButton);

    // ゲーム開始時は黒で設定される
    const startButton = screen.getByText("ゲーム開始");
    await user.click(startButton);

    expect(onSelectMode).toHaveBeenCalledWith({
      mode: "pvp",
      userColor: "black",
    } as GameConfig);
  });
});
