import type { Player } from "@/domain/game/types";

interface GameInfoProps {
  currentPlayer: Player;
  score: { black: number; white: number };
  isCpuThinking: boolean;
}

/**
 * ゲーム情報を表示するコンポーネント
 * 現在の手番、スコア、CPU思考状態を表示する
 */
export function GameInfo({
  currentPlayer,
  score,
  isCpuThinking,
}: GameInfoProps) {
  return (
    <div
      className="flex flex-col gap-4 w-full max-w-xl p-4 bg-white rounded-lg shadow-md"
      aria-label="ゲーム情報"
    >
      {/* 手番表示 */}
      <div className="text-center text-xl font-bold" aria-live="polite">
        <span
          className={`${
            currentPlayer === "black" ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {currentPlayer === "black" ? "⚫ 黒" : "⚪ 白"}
        </span>
        の番
        {isCpuThinking && (
          <span className="ml-2 text-sm text-blue-600 font-normal animate-pulse">
            （思考中...）
          </span>
        )}
      </div>

      {/* スコア表示 */}
      <div className="flex justify-around gap-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-gray-900 font-semibold">⚫ 黒</span>
          <span
            className="text-3xl font-bold text-gray-900"
            aria-label={`黒のスコア: ${score.black}`}
          >
            {score.black}
          </span>
        </div>
        <div className="flex items-center text-2xl text-gray-400">-</div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-gray-500 font-semibold">⚪ 白</span>
          <span
            className="text-3xl font-bold text-gray-500"
            aria-label={`白のスコア: ${score.white}`}
          >
            {score.white}
          </span>
        </div>
      </div>
    </div>
  );
}
