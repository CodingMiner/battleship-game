import { describe, it, expect, beforeEach } from "vitest";
import {
  createEmptyBoard,
  validateShipLayout,
  initializeShips,
  attackCell,
  checkShipSunk,
  checkGameWon,
} from "./gameLogic";
import type { GameState, ShipLayout } from "../types";
import { BOARD_SIZE } from "../types";

describe("gameLogic", () => {
  describe("createEmptyBoard", () => {
    it("should create a 10x10 board with empty cells", () => {
      const board = createEmptyBoard();

      expect(board).toHaveLength(BOARD_SIZE);
      expect(board[0]).toHaveLength(BOARD_SIZE);

      // Check all cells are initialized correctly
      board.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toEqual({
            isAttacked: false,
            isHit: false,
            shipName: undefined,
          });
        });
      });
    });
  });

  describe("validateShipLayout", () => {
    it("should validate correct ship layout", () => {
      const validLayout: ShipLayout[] = [
        {
          ship: "destroyer",
          positions: [
            [0, 0],
            [1, 0],
          ],
        },
        {
          ship: "submarine",
          positions: [
            [3, 0],
            [3, 1],
            [3, 2],
          ],
        },
      ];

      const result = validateShipLayout(validLayout);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject empty layout", () => {
      const result = validateShipLayout([]);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Ship layout cannot be empty");
    });

    it("should reject overlapping ships", () => {
      const overlappingLayout: ShipLayout[] = [
        {
          ship: "destroyer",
          positions: [
            [0, 0],
            [1, 0],
          ],
        },
        {
          ship: "submarine",
          positions: [
            [0, 0],
            [0, 1],
            [0, 2],
          ],
        },
      ];

      const result = validateShipLayout(overlappingLayout);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((error) => error.includes("Overlapping"))).toBe(
        true
      );
    });

    it("should reject out of bounds positions", () => {
      const outOfBoundsLayout: ShipLayout[] = [
        {
          ship: "destroyer",
          positions: [
            [10, 10],
            [11, 10],
          ],
        },
      ];

      const result = validateShipLayout(outOfBoundsLayout);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) => error.includes("out of bounds"))
      ).toBe(true);
    });

    it("should reject invalid position format", () => {
      const invalidLayout: ShipLayout[] = [
        {
          ship: "destroyer",
          positions: [
            [0, 0],
            [1] as unknown as [number, number], // Invalid position - missing col
          ],
        },
      ];

      const result = validateShipLayout(invalidLayout);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) =>
          error.includes("not a valid [row, col] array")
        )
      ).toBe(true);
    });
  });

  describe("initializeShips", () => {
    it("should initialize ships from valid layout", () => {
      const layout: ShipLayout[] = [
        {
          ship: "destroyer",
          positions: [
            [0, 0],
            [1, 0],
          ],
        },
      ];

      const ships = initializeShips(layout);

      expect(ships).toHaveLength(1);
      expect(ships[0]).toEqual({
        name: "destroyer",
        positions: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
        ],
        hits: [false, false],
        isSunk: false,
      });
    });

    it("should return empty array for invalid layout", () => {
      const invalidLayout: ShipLayout[] = [
        {
          ship: "destroyer",
          positions: [
            [10, 10],
            [11, 10],
          ],
        },
      ];

      const ships = initializeShips(invalidLayout);

      expect(ships).toHaveLength(0);
    });
  });

  describe("attackCell", () => {
    let gameState: GameState;

    beforeEach(() => {
      const board = createEmptyBoard();
      const ships = initializeShips([
        {
          ship: "destroyer",
          positions: [
            [0, 0],
            [1, 0],
          ],
        },
      ]);

      gameState = {
        board,
        ships,
        gameStatus: "playing",
        totalShots: 0,
        hits: 0,
      };
    });

    it("should handle hit on ship", () => {
      const result = attackCell(0, 0, gameState);

      expect(result.result).toBe("hit");
      expect(result.message).toContain("Hit!");
      expect(result.gameState.board[0][0].isAttacked).toBe(true);
      expect(result.gameState.board[0][0].isHit).toBe(true);
      expect(result.gameState.board[0][0].shipName).toBe("destroyer");
      expect(result.gameState.totalShots).toBe(1);
      expect(result.gameState.hits).toBe(1);
      expect(result.gameState.ships[0].hits[0]).toBe(true);
    });

    it("should handle miss", () => {
      const result = attackCell(5, 5, gameState);

      expect(result.result).toBe("miss");
      expect(result.message).toContain("Miss!");
      expect(result.gameState.board[5][5].isAttacked).toBe(true);
      expect(result.gameState.board[5][5].isHit).toBe(false);
      expect(result.gameState.totalShots).toBe(1);
      expect(result.gameState.hits).toBe(0);
    });

    it("should handle duplicate attack", () => {
      // First attack
      const firstResult = attackCell(0, 0, gameState);

      // Second attack on same position
      const secondResult = attackCell(0, 0, firstResult.gameState);

      expect(secondResult.result).toBe("duplicate");
      expect(secondResult.message).toContain("already fired");
      expect(secondResult.gameState.totalShots).toBe(1); // Should not increment
    });

    it("should handle out of bounds attack", () => {
      const result = attackCell(-1, 0, gameState);

      expect(result.result).toBe("out_of_bounds");
      expect(result.message).toContain("Invalid coordinates");
    });

    it("should sink ship when all positions hit", () => {
      // Hit first position
      const firstHit = attackCell(0, 0, gameState);
      expect(firstHit.gameState.ships[0].isSunk).toBe(false);

      // Hit second position (should sink ship and win game since it's the only ship)
      const secondHit = attackCell(1, 0, firstHit.gameState);

      expect(secondHit.result).toBe("hit");
      expect(secondHit.gameState.ships[0].isSunk).toBe(true);
      // When it's the last ship, victory message takes precedence
      expect(secondHit.message).toContain("Victory!");
    });

    it("should show ship sunk message with multiple ships", () => {
      // Create game state with two ships
      const multiShipGameState: GameState = {
        ...gameState,
        ships: initializeShips([
          {
            ship: "destroyer",
            positions: [
              [0, 0],
              [1, 0],
            ],
          },
          {
            ship: "submarine",
            positions: [
              [3, 3],
              [4, 3],
              [5, 3],
            ],
          },
        ]),
      };

      // Hit first position of destroyer
      const firstHit = attackCell(0, 0, multiShipGameState);

      // Hit second position (should sink destroyer but not win game)
      const secondHit = attackCell(1, 0, firstHit.gameState);

      expect(secondHit.result).toBe("hit");
      expect(secondHit.message).toContain("Destroyer Sunk!");
      expect(secondHit.gameState.ships[0].isSunk).toBe(true);
      expect(secondHit.gameState.gameStatus).toBe("playing"); // Game not over yet
    });

    it("should win game when all ships sunk", () => {
      // Hit both positions of the destroyer
      const firstHit = attackCell(0, 0, gameState);
      const secondHit = attackCell(1, 0, firstHit.gameState);

      expect(secondHit.gameState.gameStatus).toBe("won");
      expect(secondHit.message).toContain("Victory!");
    });

    it("should reject attacks on completed game", () => {
      // Complete the game first
      const firstHit = attackCell(0, 0, gameState);
      const gameWon = attackCell(1, 0, firstHit.gameState);

      // Try to attack after game is won
      const afterWin = attackCell(2, 2, gameWon.gameState);

      expect(afterWin.result).toBe("game_over");
      expect(afterWin.message).toContain("already complete");
    });

    it("should handle invalid coordinates", () => {
      const result = attackCell(NaN, 0, gameState);

      expect(result.result).toBe("out_of_bounds");
      expect(result.message).toContain("Invalid coordinates");
    });
  });

  describe("checkShipSunk", () => {
    it("should return true when all positions hit", () => {
      const ship = {
        name: "destroyer",
        positions: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
        ],
        hits: [true, true],
        isSunk: false,
      };

      expect(checkShipSunk(ship)).toBe(true);
    });

    it("should return false when not all positions hit", () => {
      const ship = {
        name: "destroyer",
        positions: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
        ],
        hits: [true, false],
        isSunk: false,
      };

      expect(checkShipSunk(ship)).toBe(false);
    });
  });

  describe("checkGameWon", () => {
    it("should return true when all ships sunk", () => {
      const ships = [
        {
          name: "destroyer",
          positions: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
          ],
          hits: [true, true],
          isSunk: true,
        },
        {
          name: "submarine",
          positions: [
            { row: 3, col: 0 },
            { row: 3, col: 1 },
          ],
          hits: [true, true],
          isSunk: true,
        },
      ];

      expect(checkGameWon(ships)).toBe(true);
    });

    it("should return false when not all ships sunk", () => {
      const ships = [
        {
          name: "destroyer",
          positions: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
          ],
          hits: [true, true],
          isSunk: true,
        },
        {
          name: "submarine",
          positions: [
            { row: 3, col: 0 },
            { row: 3, col: 1 },
          ],
          hits: [false, false],
          isSunk: false,
        },
      ];

      expect(checkGameWon(ships)).toBe(false);
    });

    it("should return true for empty ships array", () => {
      expect(checkGameWon([])).toBe(true);
    });
  });
});
