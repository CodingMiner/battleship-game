export interface Position {
  row: number;
  col: number;
}

export interface Ship {
  name: string;
  positions: Position[];
  hits: boolean[];
  isSunk: boolean;
}

export interface CellState {
  isAttacked: boolean;
  isHit: boolean;
  shipName?: string;
}

export interface GameState {
  board: CellState[][];
  ships: Ship[];
  gameStatus: "playing" | "won";
  totalShots: number;
  hits: number;
}

export interface ShipTypeConfig {
  size: number;
  count: number;
}

export interface ShipLayout {
  ship: string;
  positions: [number, number][];
}

export interface GameData {
  shipTypes: Record<string, ShipTypeConfig>;
  layout: ShipLayout[];
}

export const BOARD_SIZE = 10;

export const SHIP_TYPES = {
  carrier: { size: 5, count: 1 },
  battleship: { size: 4, count: 1 },
  cruiser: { size: 3, count: 1 },
  submarine: { size: 3, count: 1 },
  destroyer: { size: 2, count: 1 },
} as const;

export type ShipType = keyof typeof SHIP_TYPES;
