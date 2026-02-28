import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { PassNotification } from "../PassNotification";

describe("PassNotification", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("playerがnullの場合は何も表示しない", () => {
    const { container } = render(
      <PassNotification player={null} duration={1000} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("黒のパス通知を表示する", () => {
    render(<PassNotification player="black" duration={1000} />);

    expect(screen.getByText("黒はパスです")).toBeInTheDocument();
  });

  it("白のパス通知を表示する", () => {
    render(<PassNotification player="white" duration={1000} />);

    expect(screen.getByText("白はパスです")).toBeInTheDocument();
  });

  it("指定された時間後にonCompleteを呼ぶ", async () => {
    const onComplete = vi.fn();
    render(
      <PassNotification player="black" duration={1000} onComplete={onComplete} />
    );

    expect(screen.getByText("黒はパスです")).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    // 1000ms経過
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("playerが変更された場合、新しいプレイヤーのパス通知を表示する", () => {
    const { rerender } = render(
      <PassNotification player="black" duration={1000} />
    );

    expect(screen.getByText("黒はパスです")).toBeInTheDocument();

    rerender(<PassNotification player="white" duration={1000} />);

    expect(screen.getByText("白はパスです")).toBeInTheDocument();
    expect(screen.queryByText("黒はパスです")).not.toBeInTheDocument();
  });

  it("playerがnullに変更された場合は非表示になる", () => {
    const { rerender } = render(
      <PassNotification player="black" duration={1000} />
    );

    expect(screen.getByText("黒はパスです")).toBeInTheDocument();

    rerender(<PassNotification player={null} duration={1000} />);

    expect(screen.queryByText("黒はパスです")).not.toBeInTheDocument();
  });

  it("ARIA属性が正しく設定されている", () => {
    render(<PassNotification player="black" duration={1000} />);

    const notification = screen.getByRole("alert");
    expect(notification).toHaveAttribute("aria-live", "assertive");
    expect(notification).toHaveAttribute("aria-atomic", "true");
  });

  it("duration時間が異なる場合でも正しく動作する", async () => {
    const onComplete = vi.fn();
    render(
      <PassNotification
        player="black"
        duration={2000}
        onComplete={onComplete}
      />
    );

    expect(screen.getByText("黒はパスです")).toBeInTheDocument();

    // 1000ms経過（まだonCompleteは呼ばれない）
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(onComplete).not.toHaveBeenCalled();

    // さらに1000ms経過（合計2000ms、onCompleteが呼ばれる）
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("onCompleteが未指定の場合でもエラーが発生しない", async () => {
    render(<PassNotification player="black" duration={1000} />);

    expect(screen.getByText("黒はパスです")).toBeInTheDocument();

    // タイマー経過してもエラーが発生しないことを確認
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText("黒はパスです")).toBeInTheDocument();
  });
});
