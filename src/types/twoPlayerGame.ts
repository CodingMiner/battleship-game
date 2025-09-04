import type { Position, CellState } from '../types';

export type GamePhase = "placement" | "battle" | "gameOver";
export type Player = "player" | "computer";
export type ShipOrientation = "horizontal" | "vertical";

export interface TwoPlayerShip {
  name: string;
  positions: Position[];
  hits: boolean[];
  isSunk: boolean;
  orientation: ShipOrientation;
  isPlaced: boolean;
  size: number;
}

export interface PlayerBoard {
  ships: TwoPlayerShip[];
  attacks: CellState[][]; // Attacks received on this board
}

export interface TwoPlayerGameState {
  phase: GamePhase;
  currentTurn: Player;
  playerBoard: PlayerBoard;
  computerBoard: PlayerBoard;
  playerAttacks: CellState[][]; // Player's attacks on computer board
  computerAttacks: CellState[][]; // Computer's attacks on player board
  winner?: Player;
  totalShots: { player: number; computer: number };
  hits: { player: number; computer: number };
}

export type AIDifficulty = "easy" | "medium" | "hard";

export interface AIState {
  targetQueue: Position[]; // Positions to attack after a hit
  lastHit?: Position;
  huntMode: boolean; // Systematic search vs random
  shipSizes: number[]; // Remaining ship sizes to find
  strategy: "random" | "smart";
  difficulty: AIDifficulty;
  
  // Difficulty-based settings
  hitProbability: number; // Chance of making optimal moves
  smartTargeting: boolean; // Whether to use adjacent cell targeting
  delayBetweenMoves: number; // Milliseconds delay for realism
}

// Ship placement data
export interface ShipPlacementData {
  name: string;
  size: number;
  assetPath: string;
}

// Import assets properly
import CarrierShape from '../assets/Carrier Shape.png';
import BattleshipShape from '../assets/Battleship Shape.png';
import CruiserShape from '../assets/Cruiser Shape.png';
import SubmarineShape from '../assets/Submarine Shape.png';
import AircraftShape from '../assets/Aircraft Shape.png';
import Hit from '../assets/Hit.png';
import HitSmall from '../assets/Hit small.png';
import Miss from '../assets/Miss.png';
import MissSmall from '../assets/Miss small.png';

export const SHIP_PLACEMENT_DATA: ShipPlacementData[] = [
  {
    name: "carrier",
    size: 5,
    assetPath: CarrierShape
  },
  {
    name: "battleship", 
    size: 4,
    assetPath: BattleshipShape
  },
  {
    name: "cruiser",
    size: 3,
    assetPath: CruiserShape
  },
  {
    name: "submarine",
    size: 3,
    assetPath: SubmarineShape
  },
  {
    name: "destroyer",
    size: 2,
    assetPath: AircraftShape
  }
];

// Attack result assets
export const ATTACK_ASSETS = {
  hit: Hit,
  hitSmall: HitSmall, 
  miss: Miss,
  missSmall: MissSmall
};

export interface PlacementDragData {
  shipName: string;
  shipSize: number;
  orientation: ShipOrientation;
  dragOffset: { x: number; y: number };
}

export interface PlacementValidation {
  isValid: boolean;
  canPlace: boolean;
  errorMessage?: string;
  conflictingPositions?: Position[];
}