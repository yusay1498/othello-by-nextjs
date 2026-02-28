"use client";

import { useState } from "react";
import type { GameConfig, GameMode, PlayerColor } from "@/domain/game/types";

interface ModeSelectProps {
  onSelectMode: (config: GameConfig) => void;
}

/**
 * ModeSelect - ゲーム開始時のモード選択画面
 *
 * @param onSelectMode - モード選択時のコールバック関数
 */
export function ModeSelect({ onSelectMode }: ModeSelectProps) {
  const [mode, setMode] = useState<GameMode>("pvp");
  const [userColor, setUserColor] = useState<PlayerColor>("black");

  const handleStart = () => {
    onSelectMode({ mode, userColor });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
          オセロ
        </h2>

        <div className="mb-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">
            ゲームモード
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("pvp")}
              className={`rounded-lg border-2 px-6 py-4 font-semibold transition-all ${
                mode === "pvp"
                  ? "border-green-600 bg-green-600 text-white shadow-md"
                  : "border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50"
              }`}
            >
              2人対戦
            </button>
            <button
              onClick={() => setMode("pvc")}
              className={`rounded-lg border-2 px-6 py-4 font-semibold transition-all ${
                mode === "pvc"
                  ? "border-green-600 bg-green-600 text-white shadow-md"
                  : "border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50"
              }`}
            >
              CPU対戦
            </button>
          </div>
        </div>

        {mode === "pvc" && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              あなたの色
            </h3>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center rounded-lg border-2 border-gray-200 p-3 transition-colors hover:bg-white">
                <input
                  type="radio"
                  name="color"
                  checked={userColor === "black"}
                  onChange={() => setUserColor("black")}
                  className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
                />
                <span className="flex items-center text-gray-800">
                  <span className="mr-2 text-xl">⚫</span>
                  黒（先手）
                </span>
              </label>
              <label className="flex cursor-pointer items-center rounded-lg border-2 border-gray-200 p-3 transition-colors hover:bg-white">
                <input
                  type="radio"
                  name="color"
                  checked={userColor === "white"}
                  onChange={() => setUserColor("white")}
                  className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
                />
                <span className="flex items-center text-gray-800">
                  <span className="mr-2 text-xl">⚪</span>
                  白（後手）
                </span>
              </label>
            </div>
          </div>
        )}

        <button
          onClick={handleStart}
          className="w-full rounded-lg bg-green-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl active:scale-95"
        >
          ゲーム開始
        </button>
      </div>
    </div>
  );
}
