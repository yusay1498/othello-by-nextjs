import type { Board as BoardType, Position } from "@/domain/game/types";
import { Cell } from "./Cell";

interface BoardProps {
  board: BoardType;
  legalMoves: Position[];
  onCellClick: (index: Position) => void;
  disabled: boolean;
}

/**
 * オセロボード全体を表示するコンポーネント
 * 8x8のグリッドでCellコンポーネントを配置する
 */
export function Board({ board, legalMoves, onCellClick, disabled }: BoardProps) {
  return (
    <div
      className="grid grid-cols-8 gap-0 w-full max-w-xl aspect-square bg-green-800 border-4 border-green-900 rounded-lg overflow-hidden shadow-xl"
      role="grid"
      aria-label="オセロボード"
    >
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          isLegal={legalMoves.includes(index)}
          onClick={() => onCellClick(index)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
