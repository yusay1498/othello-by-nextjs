"use client";

import { useEffect } from "react";
import type { Player } from "@/domain/game/types";

interface PassNotificationProps {
  player: Player | null;
  duration: number;
  onComplete?: () => void;
}

/**
 * パス発生時のトースト通知コンポーネント
 * 指定されたプレイヤーがパスしたことを一定時間表示する
 */
export function PassNotification({
  player,
  duration,
  onComplete,
}: PassNotificationProps) {
  useEffect(() => {
    if (player && onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [player, duration, onComplete]);

  if (!player) {
    return null;
  }

  const playerText = player === "black" ? "黒" : "白";

  return (
    <div
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50
                 bg-gray-900 bg-opacity-90 text-white
                 px-6 py-3 rounded-lg shadow-lg
                 animate-fade-in"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <p className="text-base font-semibold">{playerText}はパスです</p>
    </div>
  );
}
