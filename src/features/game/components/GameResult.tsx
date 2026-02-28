"use client";

import { useEffect, useRef } from "react";
import type { WinnerResult } from "@/domain/game/types";

interface GameResultProps {
  result: WinnerResult;
  score: { black: number; white: number };
  onRestart: () => void;
  onBackToMenu: () => void;
}

/**
 * GameResult - ゲーム終了時の結果モーダル
 *
 * ゲームが終了した際に勝敗結果とスコアを表示し、
 * 再戦またはメニューに戻るオプションを提供します。
 * アクセシビリティ: 初期フォーカス移動、ESCキー、バックドロップクリックで閉じる機能を実装
 */
export function GameResult({
  result,
  score,
  onRestart,
  onBackToMenu,
}: GameResultProps) {
  const restartButtonRef = useRef<HTMLButtonElement>(null);

  // モーダルが表示されたら最初のボタンにフォーカスを移動
  useEffect(() => {
    if (result.type !== "playing" && restartButtonRef.current) {
      restartButtonRef.current.focus();
    }
  }, [result.type]);

  // ESCキーでモーダルを閉じる（メニューに戻る）
  useEffect(() => {
    if (result.type === "playing") return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onBackToMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [result.type, onBackToMenu]);

  // ゲーム進行中の場合は何も表示しない
  if (result.type === "playing") return null;

  // 結果メッセージを生成
  const getMessage = () => {
    switch (result.type) {
      case "draw":
        return `引き分け (${score.black}-${score.white})`;
      case "win": {
        const winnerText = result.winner === "black" ? "黒" : "白";
        if (result.perfect) {
          return `${winnerText}のパーフェクト勝利！`;
        }
        return `${winnerText}の勝ち！`;
      }
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-result-title"
      onClick={onBackToMenu}
    >
      <div
        className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="game-result-title"
          className="text-2xl font-bold text-center mb-6 text-zinc-900 dark:text-zinc-50"
        >
          {getMessage()}
        </h2>

        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-lg font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
              ⚫ 黒
            </div>
            <div
              className="text-3xl font-bold text-zinc-900 dark:text-zinc-50"
              aria-label={`黒の最終スコア: ${score.black}`}
            >
              {score.black}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
              ⚪ 白
            </div>
            <div
              className="text-3xl font-bold text-zinc-900 dark:text-zinc-50"
              aria-label={`白の最終スコア: ${score.white}`}
            >
              {score.white}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            ref={restartButtonRef}
            onClick={onRestart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="もう一度プレイする"
          >
            もう一度
          </button>
          <button
            onClick={onBackToMenu}
            className="flex-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
            aria-label="メニューに戻る"
          >
            メニューに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
