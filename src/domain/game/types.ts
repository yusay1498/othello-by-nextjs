/**
 * Player型 - ゲームの2人のプレイヤーを表す
 */
export type Player = "black" | "white";

/**
 * Cell型 - ボード上の1マスの状態を表す
 * - "black": 黒石が配置されている
 * - "white": 白石が配置されている
 * - null: 空のマス
 */
export type Cell = Player | null;

/**
 * Board型 - ゲームボード全体を64マスの1次元配列で表す
 * インデックス0-63は8x8ボード上の位置を表す
 */
export type Board = Cell[];

/**
 * Position型 - ボード上の位置を表す（インデックス0-63）
 */
export type Position = number;

/**
 * Direction型 - 移動方向をオフセット値で表す
 * 有効な値: -9, -8, -7, -1, 1, 7, 8, 9
 */
export type Direction = number;

/**
 * GameState型 - 最小限のゲーム状態を表す
 * 最小状態主義に従い、導出できないものだけを保持する
 */
export type GameState = {
  board: Board;
  currentPlayer: Player;
};

/**
 * GameMode型 - ゲームモードを表す
 * - "pvp": プレイヤー対プレイヤー（2人対戦）
 * - "pvc": プレイヤー対CPU
 */
export type GameMode = "pvp" | "pvc";

/**
 * PlayerColor型 - プレイヤーが選択した色を表す
 * Playerと同じだが、意味的に異なる文脈で使用
 */
export type PlayerColor = "black" | "white";

/**
 * GameConfig型 - ゲーム開始時の設定を表す
 */
export type GameConfig = {
  mode: GameMode;
  userColor: PlayerColor; // CPU戦で人間が操作する色
};

/**
 * GameStatus型 - 現在のゲーム状態を表す
 * - "playing": ゲーム進行中
 * - "finished": ゲーム終了
 */
export type GameStatus = "playing" | "finished";

/**
 * WinnerResult型 - 判別可能なユニオン型を使用してゲーム結果を表す
 * 型安全なパターンマッチングが可能
 */
export type WinnerResult =
  | { type: "win"; winner: Player; perfect: boolean }
  | { type: "draw" }
  | { type: "playing" };
