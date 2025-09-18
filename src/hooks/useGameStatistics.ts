import { useMemo } from 'react';
import type { GameState, Ship } from '../types';

export interface GameStatistics {
  totalShots: number;
  hits: number;
  misses: number;
  accuracy: number;
  shipsRemaining: number;
  shipsSunk: number;
  shipsTotal: number;
  gameProgress: number; // Percentage of game completion
}

export const useGameStatistics = (gameState: GameState): GameStatistics => {
  return useMemo(() => {
    const { totalShots, hits, ships } = gameState;
    const misses = totalShots - hits;
    const accuracy = totalShots > 0 ? Math.round((hits / totalShots) * 100) : 0;
    
    const shipsSunk = ships.filter(ship => ship.isSunk).length;
    const shipsRemaining = ships.length - shipsSunk;
    const shipsTotal = ships.length;
    
    // Calculate game progress based on total ship positions hit
    const totalShipPositions = ships.reduce((total, ship) => total + ship.positions.length, 0);
    const hitPositions = ships.reduce((total, ship) => {
      return total + ship.hits.filter(hit => hit).length;
    }, 0);
    const gameProgress = totalShipPositions > 0 ? Math.round((hitPositions / totalShipPositions) * 100) : 0;

    return {
      totalShots,
      hits,
      misses,
      accuracy,
      shipsRemaining,
      shipsSunk,
      shipsTotal,
      gameProgress,
    };
  }, [gameState.totalShots, gameState.hits, gameState.ships]);
};

export interface ShipStatus {
  name: string;
  isSunk: boolean;
  size: number;
  hitCount: number;
  displayName: string;
}

export const useShipStatuses = (ships: Ship[]): ShipStatus[] => {
  return useMemo(() => {
    return ships.map(ship => ({
      name: ship.name,
      isSunk: ship.isSunk,
      size: ship.positions.length,
      hitCount: ship.hits.filter(hit => hit).length,
      displayName: ship.name.charAt(0).toUpperCase() + ship.name.slice(1),
    }));
  }, [ships]);
};