import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModeSelect } from "../ModeSelect";
import type { GameConfig } from "@/domain/game/types";

describe("ModeSelect", () => {
  it("初期状態では2人対戦が選択されている", () => {
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const pvpButton = screen.getByText("2人対戦");
    expect(pvpButton).toHaveClass("bg-green-600");
  });

  it("CPU対戦ボタンをクリックするとモードが切り替わる", () => {
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const pvcButton = screen.getByText("CPU対戦");
    fireEvent.click(pvcButton);

    expect(pvcButton).toHaveClass("bg-green-600");
  });

  it("CPU対戦を選択すると色選択が表示される", () => {
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const pvcButton = screen.getByText("CPU対戦");
    fireEvent.click(pvcButton);

    expect(screen.getByText("あなたの色")).toBeInTheDocument();
    expect(screen.getByText("黒（先手）")).toBeInTheDocument();
    expect(screen.getByText("白（後手）")).toBeInTheDocument();
  });

  it("2人対戦モードでゲーム開始すると正しい設定でコールバックが呼ばれる", () => {
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const startButton = screen.getByText("ゲーム開始");
    fireEvent.click(startButton);

    expect(onSelectMode).toHaveBeenCalledWith({
      mode: "pvp",
      userColor: "black",
    } as GameConfig);
  });

  it("CPU対戦モード（黒）でゲーム開始すると正しい設定でコールバックが呼ばれる", () => {
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const pvcButton = screen.getByText("CPU対戦");
    fireEvent.click(pvcButton);

    const startButton = screen.getByText("ゲーム開始");
    fireEvent.click(startButton);

    expect(onSelectMode).toHaveBeenCalledWith({
      mode: "pvc",
      userColor: "black",
    } as GameConfig);
  });

  it("CPU対戦モード（白）でゲーム開始すると正しい設定でコールバックが呼ばれる", () => {
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const pvcButton = screen.getByText("CPU対戦");
    fireEvent.click(pvcButton);

    const whiteRadio = screen.getByLabelText(/白（後手）/);
    fireEvent.click(whiteRadio);

    const startButton = screen.getByText("ゲーム開始");
    fireEvent.click(startButton);

    expect(onSelectMode).toHaveBeenCalledWith({
      mode: "pvc",
      userColor: "white",
    } as GameConfig);
  });

  it("色選択のラジオボタンが正しく動作する", () => {
    const onSelectMode = vi.fn();
    render(<ModeSelect onSelectMode={onSelectMode} />);

    const pvcButton = screen.getByText("CPU対戦");
    fireEvent.click(pvcButton);

    const blackRadio = screen.getByLabelText(/黒（先手）/) as HTMLInputElement;
    const whiteRadio = screen.getByLabelText(/白（後手）/) as HTMLInputElement;

    // 初期状態では黒が選択されている
    expect(blackRadio.checked).toBe(true);
    expect(whiteRadio.checked).toBe(false);

    // 白を選択
    fireEvent.click(whiteRadio);
    expect(blackRadio.checked).toBe(false);
    expect(whiteRadio.checked).toBe(true);

    // 黒を選択
    fireEvent.click(blackRadio);
    expect(blackRadio.checked).toBe(true);
    expect(whiteRadio.checked).toBe(false);
  });
});
