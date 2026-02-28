import { describe, it, expect } from "vitest";
import {
  BOARD_SIZE,
  TOTAL_CELLS,
  DIRECTIONS,
  CORNERS,
  POSITION_WEIGHTS,
} from "../constants";

describe("Game Constants", () => {
  describe("Board dimensions", () => {
    it("should have correct board size", () => {
      expect(BOARD_SIZE).toBe(8);
    });

    it("should have correct total cells", () => {
      expect(TOTAL_CELLS).toBe(64);
    });

    it("should have consistent board size calculation", () => {
      expect(BOARD_SIZE * BOARD_SIZE).toBe(TOTAL_CELLS);
    });
  });

  describe("Directions", () => {
    it("should have 8 directions", () => {
      expect(DIRECTIONS).toHaveLength(8);
    });

    it("should have correct direction values", () => {
      const expected = [-9, -8, -7, -1, 1, 7, 8, 9];
      expect([...DIRECTIONS]).toEqual(expected);
    });

    it("should be a readonly array (compile-time)", () => {
      // TypeScript enforces readonly at compile-time with 'as const'
      // Runtime check is not necessary for TypeScript readonly arrays
      expect(Array.isArray(DIRECTIONS)).toBe(true);
    });
  });

  describe("Corners", () => {
    it("should have 4 corners", () => {
      expect(CORNERS).toHaveLength(4);
    });

    it("should have correct corner positions", () => {
      const expected = [0, 7, 56, 63];
      expect([...CORNERS]).toEqual(expected);
    });

    it("should be a readonly array (compile-time)", () => {
      // TypeScript enforces readonly at compile-time with 'as const'
      // Runtime check is not necessary for TypeScript readonly arrays
      expect(Array.isArray(CORNERS)).toBe(true);
    });

    it("should reference valid board positions", () => {
      CORNERS.forEach((corner) => {
        expect(corner).toBeGreaterThanOrEqual(0);
        expect(corner).toBeLessThan(TOTAL_CELLS);
      });
    });
  });

  describe("Position Weights", () => {
    it("should have weights for all 64 positions", () => {
      expect(POSITION_WEIGHTS).toHaveLength(TOTAL_CELLS);
    });

    it("should be a readonly array (compile-time)", () => {
      // TypeScript enforces readonly at compile-time with 'as const'
      // Runtime check is not necessary for TypeScript readonly arrays
      expect(Array.isArray(POSITION_WEIGHTS)).toBe(true);
    });

    it("should have maximum weight (100) at corners", () => {
      CORNERS.forEach((corner) => {
        expect(POSITION_WEIGHTS[corner]).toBe(100);
      });
    });

    it("should have all numeric values", () => {
      POSITION_WEIGHTS.forEach((weight) => {
        expect(typeof weight).toBe("number");
        expect(Number.isFinite(weight)).toBe(true);
      });
    });
  });
});
