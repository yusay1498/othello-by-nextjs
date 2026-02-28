"use client";

import { useState } from "react";
import type { GameConfig } from "@/domain/game/types";
import { useGame } from "./hooks/useGame";
import { useCpuTurn } from "./hooks/useCpuTurn";
import { ModeSelect } from "./components/ModeSelect";
import { GameInfo } from "./components/GameInfo";
import { Board } from "./components/Board";
import { PassNotification } from "./components/PassNotification";
import { GameResult } from "./components/GameResult";

/**
 * GameContainer - ゲーム全体を統合するコンテナコンポーネント
 *
 * 責務:
 * - ゲーム設定の管理
 * - useGameフックとuseCpuTurnフックの連携
 * - 各UIコンポーネントへのPropsの配布
 * - モード選択画面とゲーム画面の切り替え
 */
export function GameContainer() {
  const [config, setConfig] = useState<GameConfig | null>(null);
  const game = useGame(config);

  // CPU思考の自動実行
  useCpuTurn(
    game.state,
    game.config,
    game.isGameOver,
    game.handleMove,
    game.handlePass,
    game.setIsCpuThinking
  );

  // メニューに戻る処理
  const handleBackToMenu = () => {
    game.handleBackToMenu();
    setConfig(null);
  };

  // モード選択画面を表示
  if (!config) {
    return <ModeSelect onSelectMode={setConfig} />;
  }

  // ゲーム画面を表示
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-green-50 to-green-100 p-4">
      <GameInfo
        currentPlayer={game.state.currentPlayer}
        score={game.score}
        isCpuThinking={game.isCpuThinking}
      />

      <Board
        board={game.state.board}
        legalMoves={game.legalMoves}
        onCellClick={game.handleMove}
        disabled={game.isCpuThinking || game.isGameOver}
      />

      {game.passPlayer && <PassNotification player={game.passPlayer} />}

      {game.isGameOver && (
        <GameResult
          result={game.result}
          score={game.score}
          onRestart={game.handleRestart}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}
