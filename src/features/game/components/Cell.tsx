import { memo } from "react";
import type { Cell as CellType, Position } from "@/domain/game/types";

interface CellProps {
  index: Position;
  value: CellType;
  isLegal: boolean;
  onCellClick: (index: Position) => void;
  disabled: boolean;
}

/**
 * オセロの1マスを表示するコンポーネント
 * パフォーマンス最適化のためReact.memoでメモ化
 */
export const Cell = memo(function Cell({ index, value, isLegal, onCellClick, disabled }: CellProps) {
  return (
    <button
      type="button"
      onClick={() => onCellClick(index)}
      disabled={disabled || !isLegal}
      className={`
        w-full aspect-square
        border border-green-700
        bg-green-600
        flex items-center justify-center
        transition-all duration-200
        ${isLegal && !disabled ? "hover:bg-green-500 cursor-pointer" : "cursor-default"}
        ${disabled ? "opacity-50" : ""}
      `}
      aria-label={
        value === "black"
          ? "黒石"
          : value === "white"
          ? "白石"
          : isLegal
          ? "合法手"
          : "空きマス"
      }
    >
      {/* 石の表示 */}
      {value && (
        <div
          className={`
            w-[85%] h-[85%] rounded-full
            ${value === "black" ? "bg-gray-900" : "bg-white"}
            shadow-md
          `}
        />
      )}

      {/* 合法手の表示 */}
      {!value && isLegal && !disabled && (
        <div className="w-3 h-3 rounded-full bg-white opacity-50" />
      )}
    </button>
  );
});
