/**
 * Player type - represents the two players in the game
 */
export type Player = "black" | "white";

/**
 * Cell type - represents the state of a single cell on the board
 * - "black": Black piece is placed
 * - "white": White piece is placed
 * - null: Empty cell
 */
export type Cell = Player | null;

/**
 * Board type - represents the entire game board as a 1D array of 64 cells
 * Index 0-63 represents positions on an 8x8 board
 */
export type Board = Cell[];

/**
 * Position type - represents a position on the board (index 0-63)
 */
export type Position = number;

/**
 * Direction type - represents movement direction as an offset value
 * Valid values: -9, -8, -7, -1, 1, 7, 8, 9
 */
export type Direction = number;

/**
 * GameState type - represents the minimal game state
 * Following the minimal state principle: only store what cannot be derived
 */
export type GameState = {
  board: Board;
  currentPlayer: Player;
};

/**
 * GameMode type - represents the game mode
 * - "pvp": Player vs Player (2-player local game)
 * - "pvc": Player vs CPU
 */
export type GameMode = "pvp" | "pvc";

/**
 * PlayerColor type - represents the color chosen by a player
 * Same as Player but semantically different context
 */
export type PlayerColor = "black" | "white";

/**
 * GameConfig type - represents game configuration at start
 */
export type GameConfig = {
  mode: GameMode;
  userColor: PlayerColor; // Color controlled by human in CPU mode
};

/**
 * GameStatus type - represents the current game status
 * - "playing": Game in progress
 * - "finished": Game ended
 */
export type GameStatus = "playing" | "finished";

/**
 * WinnerResult type - represents the game result using discriminated unions
 * This allows for type-safe pattern matching
 */
export type WinnerResult =
  | { type: "win"; winner: Player; perfect: boolean }
  | { type: "draw" }
  | { type: "playing" };
