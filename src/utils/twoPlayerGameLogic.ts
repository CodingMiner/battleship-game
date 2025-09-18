import type { 
  TwoPlayerGameState, 
  TwoPlayerShip, 
  ShipOrientation,
  PlacementValidation,
  PlayerBoard,
  AIState
} from '../types/twoPlayerGame';
import type { Position, CellState } from '../types';
import { BOARD_SIZE } from '../types';
import { createEmptyBoard } from './gameLogic';

export const createEmptyPlayerBoard = (): PlayerBoard => ({
  ships: [],
  attacks: createEmptyBoard()
});

export const initializeTwoPlayerGame = (): TwoPlayerGameState => ({
  phase: "placement",
  currentTurn: "player",
  playerBoard: createEmptyPlayerBoard(),
  computerBoard: createEmptyPlayerBoard(),
  playerAttacks: createEmptyBoard(),
  computerAttacks: createEmptyBoard(),
  totalShots: { player: 0, computer: 0 },
  hits: { player: 0, computer: 0 }
});

export const createShipTemplate = (
  name: string, 
  size: number, 
  orientation: ShipOrientation = "horizontal"
): TwoPlayerShip => ({
  name,
  positions: [],
  hits: new Array(size).fill(false),
  isSunk: false,
  orientation,
  isPlaced: false,
  size
});

export const canPlaceShip = (
  _board: CellState[][],
  ships: TwoPlayerShip[],
  startPos: Position,
  shipSize: number,
  orientation: ShipOrientation
): PlacementValidation => {
  const { row, col } = startPos;
  const positions: Position[] = [];

  // Generate positions based on orientation
  for (let i = 0; i < shipSize; i++) {
    const newPos: Position = orientation === "horizontal" 
      ? { row, col: col + i }
      : { row: row + i, col };
    positions.push(newPos);
  }

  // Check bounds
  for (const pos of positions) {
    if (pos.row < 0 || pos.row >= BOARD_SIZE || pos.col < 0 || pos.col >= BOARD_SIZE) {
      return {
        isValid: false,
        canPlace: false,
        errorMessage: "Ship extends outside the board"
      };
    }
  }

  // Check for overlapping ships
  const conflictingPositions: Position[] = [];
  for (const pos of positions) {
    // Check if any existing ship occupies this position
    const hasShip = ships.some(ship => 
      ship.isPlaced && ship.positions.some(shipPos => 
        shipPos.row === pos.row && shipPos.col === pos.col
      )
    );
    
    if (hasShip) {
      conflictingPositions.push(pos);
    }
  }

  if (conflictingPositions.length > 0) {
    return {
      isValid: false,
      canPlace: false,
      errorMessage: "Ship overlaps with existing ship",
      conflictingPositions
    };
  }

  return {
    isValid: true,
    canPlace: true
  };
};

export const placeShip = (
  ships: TwoPlayerShip[],
  shipName: string,
  startPos: Position,
  orientation: ShipOrientation
): TwoPlayerShip[] => {
  return ships.map(ship => {
    if (ship.name === shipName) {
      const positions: Position[] = [];
      const { row, col } = startPos;
      
      for (let i = 0; i < ship.size; i++) {
        const newPos: Position = orientation === "horizontal"
          ? { row, col: col + i }
          : { row: row + i, col };
        positions.push(newPos);
      }

      return {
        ...ship,
        positions,
        orientation,
        isPlaced: true,
        hits: new Array(ship.size).fill(false)
      };
    }
    return ship;
  });
};

export const removeShipFromBoard = (
  ships: TwoPlayerShip[],
  shipName: string
): TwoPlayerShip[] => {
  return ships.map(ship => {
    if (ship.name === shipName) {
      return {
        ...ship,
        positions: [],
        isPlaced: false,
        hits: new Array(ship.size).fill(false)
      };
    }
    return ship;
  });
};

export const allShipsPlaced = (ships: TwoPlayerShip[]): boolean => {
  return ships.every(ship => ship.isPlaced);
};

export const getRandomPosition = (): Position => ({
  row: Math.floor(Math.random() * BOARD_SIZE),
  col: Math.floor(Math.random() * BOARD_SIZE)
});

export const getRandomOrientation = (): ShipOrientation => 
  Math.random() < 0.5 ? "horizontal" : "vertical";

export const placeComputerShips = (ships: TwoPlayerShip[]): TwoPlayerShip[] => {
  return autoPlaceShips(ships);
};

export const autoPlaceShips = (ships: TwoPlayerShip[]): TwoPlayerShip[] => {
  const placedShips = [...ships];
  
  for (let i = 0; i < placedShips.length; i++) {
    const ship = placedShips[i];
    
    // Skip if already placed
    if (ship.isPlaced) continue;
    
    let placed = false;
    let attempts = 0;
    const maxAttempts = 1000; // Increased attempts for better placement success

    while (!placed && attempts < maxAttempts) {
      const startPos = getRandomPosition();
      const orientation = getRandomOrientation();
      
      const validation = canPlaceShip(
        createEmptyBoard(), // We don't need the board for collision detection with ships
        placedShips, // Check against all ships (including already placed ones)
        startPos,
        ship.size,
        orientation
      );

      if (validation.canPlace) {
        placedShips[i] = {
          ...ship,
          positions: generateShipPositions(startPos, ship.size, orientation),
          orientation,
          isPlaced: true,
          hits: new Array(ship.size).fill(false)
        };
        placed = true;
      }
      attempts++;
    }

    if (!placed) {
      console.warn(`Failed to auto-place ship: ${ship.name} after ${maxAttempts} attempts`);
      // Try a more systematic approach
      placed = systematicPlaceShip(placedShips, i);
    }
  }

  return placedShips;
};

const systematicPlaceShip = (ships: TwoPlayerShip[], shipIndex: number): boolean => {
  const ship = ships[shipIndex];
  
  // Try every position and orientation systematically
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (const orientation of ['horizontal', 'vertical'] as ShipOrientation[]) {
        const validation = canPlaceShip(
          createEmptyBoard(),
          ships,
          { row, col },
          ship.size,
          orientation
        );

        if (validation.canPlace) {
          ships[shipIndex] = {
            ...ship,
            positions: generateShipPositions({ row, col }, ship.size, orientation),
            orientation,
            isPlaced: true,
            hits: new Array(ship.size).fill(false)
          };
          return true;
        }
      }
    }
  }
  
  return false;
};

export const autoPlaceRemainingShips = (ships: TwoPlayerShip[]): TwoPlayerShip[] => {
  const unplacedShips = ships.filter(ship => !ship.isPlaced);
  if (unplacedShips.length === 0) return ships;
  
  return autoPlaceShips(ships);
};

export const generateShipPositions = (
  startPos: Position,
  size: number,
  orientation: ShipOrientation
): Position[] => {
  const positions: Position[] = [];
  const { row, col } = startPos;
  
  for (let i = 0; i < size; i++) {
    const newPos: Position = orientation === "horizontal"
      ? { row, col: col + i }
      : { row: row + i, col };
    positions.push(newPos);
  }
  
  return positions;
};

export const rotateShip = (
  ships: TwoPlayerShip[],
  shipName: string
): TwoPlayerShip[] => {
  return ships.map(ship => {
    if (ship.name === shipName && ship.isPlaced) {
      const newOrientation: ShipOrientation = 
        ship.orientation === "horizontal" ? "vertical" : "horizontal";
      
      // Get the first position (anchor point)
      const anchorPos = ship.positions[0];
      
      // Check if rotation is valid
      const validation = canPlaceShip(
        createEmptyBoard(),
        ships.filter(s => s.name !== shipName), // Exclude current ship from collision check
        anchorPos,
        ship.size,
        newOrientation
      );

      if (validation.canPlace) {
        return {
          ...ship,
          orientation: newOrientation,
          positions: generateShipPositions(anchorPos, ship.size, newOrientation)
        };
      }
    }
    return ship;
  });
};

export const initializeAI = (difficulty: import('../types/twoPlayerGame').AIDifficulty = "medium"): AIState => {
  const difficultySettings = {
    easy: {
      hitProbability: 0.3,
      smartTargeting: false,
      delayBetweenMoves: 2000,
      strategy: "random" as const
    },
    medium: {
      hitProbability: 0.7,
      smartTargeting: true,
      delayBetweenMoves: 1500,
      strategy: "smart" as const
    },
    hard: {
      hitProbability: 0.9,
      smartTargeting: true,
      delayBetweenMoves: 1000,
      strategy: "smart" as const
    }
  };

  const settings = difficultySettings[difficulty];

  return {
    targetQueue: [],
    huntMode: false,
    shipSizes: [5, 4, 3, 3, 2], // Ship sizes to track
    strategy: settings.strategy,
    difficulty,
    hitProbability: settings.hitProbability,
    smartTargeting: settings.smartTargeting,
    delayBetweenMoves: settings.delayBetweenMoves
  };
};

export const getCellKey = (row: number, col: number): string => `${row}-${col}`;

export const parsePosition = (key: string): Position => {
  const [row, col] = key.split('-').map(Number);
  return { row, col };
};

// Attack mechanics
export interface AttackResult {
  hit: boolean;
  shipSunk?: TwoPlayerShip;
  gameWon: boolean;
  message: string;
}

export const attackPosition = (
  position: Position,
  targetBoard: PlayerBoard,
  attackBoard: CellState[][]
): AttackResult => {
  const { row, col } = position;
  
  // Check if already attacked
  if (attackBoard[row][col].isAttacked) {
    return {
      hit: false,
      gameWon: false,
      message: "Already attacked this position!"
    };
  }

  // Mark as attacked
  attackBoard[row][col] = { ...attackBoard[row][col], isAttacked: true };

  // Check if hit
  let hitShip: TwoPlayerShip | undefined;
  let hitPositionIndex = -1;

  for (const ship of targetBoard.ships) {
    const posIndex = ship.positions.findIndex(
      pos => pos.row === row && pos.col === col
    );
    if (posIndex !== -1) {
      hitShip = ship;
      hitPositionIndex = posIndex;
      break;
    }
  }

  if (hitShip) {
    // Hit! Mark the hit on the ship and attack board
    hitShip.hits[hitPositionIndex] = true;
    attackBoard[row][col] = {
      ...attackBoard[row][col],
      isHit: true,
      shipName: hitShip.name
    };

    // Check if ship is sunk
    const isSunk = hitShip.hits.every(hit => hit);
    if (isSunk) {
      hitShip.isSunk = true;
    }

    // Check if game is won
    const gameWon = targetBoard.ships.every(ship => ship.isSunk);
    
    return {
      hit: true,
      shipSunk: isSunk ? hitShip : undefined,
      gameWon,
      message: isSunk 
        ? `${hitShip.name.charAt(0).toUpperCase() + hitShip.name.slice(1)} Sunk!`
        : "Hit!"
    };
  } else {
    // Miss
    attackBoard[row][col] = { ...attackBoard[row][col], isHit: false };
    return {
      hit: false,
      gameWon: false,
      message: "Miss!"
    };
  }
};

// Computer AI
export const makeComputerAttack = (
  playerBoard: PlayerBoard,
  computerAttacks: CellState[][],
  aiState: AIState
): { position: Position; result: AttackResult; newAIState: AIState } => {
  let targetPosition: Position;
  
  // Difficulty-based decision making
  const shouldMakeOptimalMove = Math.random() < aiState.hitProbability;
  
  if (shouldMakeOptimalMove && aiState.smartTargeting && aiState.targetQueue.length > 0) {
    // Smart targeting - continue attacking around hits
    targetPosition = aiState.targetQueue.shift()!;
  } else if (shouldMakeOptimalMove && aiState.strategy === "smart") {
    // Try to make a strategic move (like checkerboard pattern for hard mode)
    targetPosition = getStrategicTarget(computerAttacks, aiState) || findRandomValidTarget(computerAttacks);
  } else {
    // Random attack (more common on easier difficulties)
    targetPosition = findRandomValidTarget(computerAttacks);
  }

  const result = attackPosition(targetPosition, playerBoard, computerAttacks);
  
  // Update AI state based on result
  const newAIState = updateAIState(aiState, targetPosition, result);
  
  return {
    position: targetPosition,
    result,
    newAIState
  };
};

const getStrategicTarget = (attackBoard: CellState[][], aiState: AIState): Position | null => {
  if (aiState.difficulty !== "hard") return null;
  
  // Hard mode: Use checkerboard pattern for efficiency
  const validTargets: Position[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!attackBoard[row][col].isAttacked) {
        // Checkerboard pattern: only target cells where row + col is even
        if ((row + col) % 2 === 0) {
          validTargets.push({ row, col });
        }
      }
    }
  }
  
  // If no checkerboard targets available, fall back to any valid target
  if (validTargets.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * validTargets.length);
  return validTargets[randomIndex];
};

const findRandomValidTarget = (attackBoard: CellState[][]): Position => {
  const validTargets: Position[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!attackBoard[row][col].isAttacked) {
        validTargets.push({ row, col });
      }
    }
  }
  
  const randomIndex = Math.floor(Math.random() * validTargets.length);
  return validTargets[randomIndex];
};

const updateAIState = (
  aiState: AIState,
  position: Position,
  result: AttackResult
): AIState => {
  const newState = { ...aiState };
  
  if (result.hit && !result.shipSunk) {
    // Hit but not sunk - add adjacent positions to target queue
    newState.huntMode = true;
    newState.lastHit = position;
    
    const adjacentPositions = getAdjacentPositions(position);
    adjacentPositions.forEach(pos => {
      if (!newState.targetQueue.some(target => 
        target.row === pos.row && target.col === pos.col
      )) {
        newState.targetQueue.push(pos);
      }
    });
  } else if (result.shipSunk) {
    // Ship sunk - clear target queue and exit hunt mode
    newState.huntMode = false;
    newState.targetQueue = [];
    newState.lastHit = undefined;
    
    // Remove the sunk ship size from tracking
    if (result.shipSunk) {
      const shipSize = result.shipSunk.size;
      const sizeIndex = newState.shipSizes.indexOf(shipSize);
      if (sizeIndex > -1) {
        newState.shipSizes.splice(sizeIndex, 1);
      }
    }
  }
  
  return newState;
};

const getAdjacentPositions = (position: Position): Position[] => {
  const { row, col } = position;
  const adjacent: Position[] = [];
  
  // Check all 4 directions
  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 },  // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }   // Right
  ];
  
  directions.forEach(dir => {
    const newRow = row + dir.row;
    const newCol = col + dir.col;
    
    if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
      adjacent.push({ row: newRow, col: newCol });
    }
  });
  
  return adjacent;
};

export const checkGameOver = (playerBoard: PlayerBoard, computerBoard: PlayerBoard): {
  isGameOver: boolean;
  winner?: 'player' | 'computer';
} => {
  const playerDefeated = playerBoard.ships.every(ship => ship.isSunk);
  const computerDefeated = computerBoard.ships.every(ship => ship.isSunk);
  
  if (playerDefeated) {
    return { isGameOver: true, winner: 'computer' };
  } else if (computerDefeated) {
    return { isGameOver: true, winner: 'player' };
  } else {
    return { isGameOver: false };
  }
};