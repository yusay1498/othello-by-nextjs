import { memo } from "react";
import Image from "next/image";
import type { Cell as CellType, Position } from "@/domain/game/types";
import blackCatImage from "@/assets/images/black-cat.png";
import whiteCatImage from "@/assets/images/white-cat.png";

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
          ? "黒猫"
          : value === "white"
          ? "白猫"
          : isLegal
          ? "合法手"
          : "空きマス"
      }
    >
      {/* 石の表示（猫の画像） */}
      {value && (
        <div className="relative w-[80%] h-[80%]">
          <Image
            src={value === "black" ? blackCatImage : whiteCatImage}
            alt=""
            fill
            sizes="100%"
            className="object-contain"
            aria-hidden
          />
        </div>
      )}

      {/* 合法手の表示 */}
      {!value && isLegal && !disabled && (
        <div className="w-3 h-3 rounded-full bg-white opacity-50" />
      )}
    </button>
  );
});
