import type { CellState, Ship, GameState, ShipLayout } from "../types";
import { BOARD_SIZE } from "../types";

export const createEmptyBoard = (): CellState[][] => {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() =>
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => ({
          isAttacked: false,
          isHit: false,
          shipName: undefined,
        }))
    );
};

export const validateShipLayout = (
  layout: ShipLayout[]
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!Array.isArray(layout)) {
    errors.push("Ship layout must be an array");
    return { isValid: false, errors };
  }

  if (layout.length === 0) {
    errors.push("Ship layout cannot be empty");
    return { isValid: false, errors };
  }

  layout.forEach((shipData, index) => {
    if (!shipData || typeof shipData !== "object") {
      errors.push(`Ship at index ${index} is not a valid object`);
      return;
    }

    if (!shipData.ship || typeof shipData.ship !== "string") {
      errors.push(`Ship at index ${index} has invalid or missing name`);
    }

    if (!Array.isArray(shipData.positions)) {
      errors.push(`Ship "${shipData.ship}" has invalid positions array`);
      return;
    }

    if (shipData.positions.length === 0) {
      errors.push(`Ship "${shipData.ship}" has no positions`);
      return;
    }

    shipData.positions.forEach((position, posIndex) => {
      if (!Array.isArray(position) || position.length !== 2) {
        errors.push(
          `Ship "${shipData.ship}" position ${posIndex} is not a valid [row, col] array`
        );
        return;
      }

      const [row, col] = position;
      if (
        typeof row !== "number" ||
        typeof col !== "number" ||
        !Number.isInteger(row) ||
        !Number.isInteger(col)
      ) {
        errors.push(
          `Ship "${shipData.ship}" position ${posIndex} contains non-integer coordinates`
        );
      }

      if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
        errors.push(
          `Ship "${shipData.ship}" position ${posIndex} [${row}, ${col}] is out of bounds`
        );
      }
    });
  });

  const allPositions = new Set<string>();
  layout.forEach((shipData) => {
    if (
      shipData &&
      typeof shipData === "object" &&
      Array.isArray(shipData.positions)
    ) {
      shipData.positions.forEach((position) => {
        if (Array.isArray(position) && position.length === 2) {
          const posKey = `${position[0]},${position[1]}`;
          if (allPositions.has(posKey)) {
            errors.push(
              `Overlapping ship positions found at [${position[0]}, ${position[1]}]`
            );
          }
          allPositions.add(posKey);
        }
      });
    }
  });

  return { isValid: errors.length === 0, errors };
};

export const initializeShips = (layout: ShipLayout[]): Ship[] => {
  const validation = validateShipLayout(layout);

  if (!validation.isValid) {
    console.error("Ship layout validation failed:", validation.errors);
    return [];
  }

  return layout.map((shipData) => ({
    name: shipData.ship,
    positions: shipData.positions.map(([row, col]) => ({ row, col })),
    hits: new Array(shipData.positions.length).fill(false),
    isSunk: false,
  }));
};

export type AttackResult = {
  gameState: GameState;
  result: "hit" | "miss" | "duplicate" | "out_of_bounds" | "game_over";
  message: string;
};

export const attackCell = (
  row: number,
  col: number,
  gameState: GameState
): AttackResult => {
  if (!gameState || typeof gameState !== "object") {
    return {
      gameState: gameState || ({} as GameState),
      result: "out_of_bounds",
      message: "Invalid game state provided.",
    };
  }

  const numRow = Math.floor(Number(row));
  const numCol = Math.floor(Number(col));

  if (!Number.isFinite(numRow) || !Number.isFinite(numCol)) {
    return {
      gameState,
      result: "out_of_bounds",
      message: `Invalid coordinates [${row}, ${col}]. Please provide valid numbers.`,
    };
  }

  if (gameState.gameStatus === "won") {
    return {
      gameState,
      result: "game_over",
      message: "Game is already complete! All ships have been destroyed.",
    };
  }

  if (
    numRow < 0 ||
    numRow >= BOARD_SIZE ||
    numCol < 0 ||
    numCol >= BOARD_SIZE
  ) {
    return {
      gameState,
      result: "out_of_bounds",
      message: `Invalid coordinates [${numRow}, ${numCol}]. Please click within the game board.`,
    };
  }

  if (
    !gameState.board ||
    !gameState.board[numRow] ||
    !gameState.board[numRow][numCol]
  ) {
    return {
      gameState,
      result: "out_of_bounds",
      message: "Invalid board state or coordinates.",
    };
  }

  if (gameState.board[numRow][numCol].isAttacked) {
    return {
      gameState,
      result: "duplicate",
      message: "You've already fired at this position! Try a different cell.",
    };
  }

  const newBoard = gameState.board.map((boardRow, rowIndex) =>
    boardRow.map((cell, colIndex) => {
      if (rowIndex === numRow && colIndex === numCol) {
        return { ...cell, isAttacked: true };
      }
      return cell;
    })
  );

  let hitShip: Ship | null = null;
  let hitPositionIndex = -1;

  for (const ship of gameState.ships) {
    const positionIndex = ship.positions.findIndex(
      (pos) => pos.row === numRow && pos.col === numCol
    );
    if (positionIndex !== -1) {
      hitShip = ship;
      hitPositionIndex = positionIndex;
      break;
    }
  }

  let newShips = gameState.ships;
  let newHits = gameState.hits;
  let resultMessage = "";
  let resultType: "hit" | "miss" = "miss";

  if (hitShip) {
    newShips = gameState.ships.map((ship) => {
      if (ship.name === hitShip!.name) {
        const newHitsArray = [...ship.hits];
        newHitsArray[hitPositionIndex] = true;
        const isSunk = newHitsArray.every((hit) => hit);
        return {
          ...ship,
          hits: newHitsArray,
          isSunk,
        };
      }
      return ship;
    });

    newBoard[numRow][numCol] = {
      ...newBoard[numRow][numCol],
      isHit: true,
      shipName: hitShip.name,
    };

    newHits = gameState.hits + 1;
    resultType = "hit";

    const updatedShip = newShips.find((ship) => ship.name === hitShip!.name);
    if (updatedShip?.isSunk) {
      const shipDisplayName =
        hitShip.name.charAt(0).toUpperCase() + hitShip.name.slice(1);
      resultMessage = `Hit! ${shipDisplayName} Sunk!`;
    } else {
      resultMessage = "Hit! You struck a ship!";
    }
  } else {
    resultMessage = "Miss! No ship at this location.";
  }

  const gameWon = checkGameWon(newShips);
  if (gameWon) {
    resultMessage = "🎉 Victory! All ships destroyed! 🎉";
  }

  const newGameState: GameState = {
    ...gameState,
    board: newBoard,
    ships: newShips,
    totalShots: gameState.totalShots + 1,
    hits: newHits,
    gameStatus: gameWon ? "won" : "playing",
  };

  return {
    gameState: newGameState,
    result: resultType,
    message: resultMessage,
  };
};

export const attackCellLegacy = (
  row: number,
  col: number,
  gameState: GameState
): GameState => {
  const result = attackCell(row, col, gameState);
  return result.gameState;
};

export const checkShipSunk = (ship: Ship): boolean => {
  return ship.hits.every((hit) => hit);
};

export const checkGameWon = (ships: Ship[]): boolean => {
  return ships.every((ship) => checkShipSunk(ship));
};
