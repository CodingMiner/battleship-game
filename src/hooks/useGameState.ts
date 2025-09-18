import { useState, useCallback, useMemo } from 'react';
import type { GameState, Ship } from '../types';
import { gameData } from '../data/shipLayout';
import {
  createEmptyBoard,
  initializeShips,
  attackCell,
  validateShipLayout,
} from '../utils/gameLogic';

export const useGameState = () => {
  // Initialize the game state
  const initialGameState = useMemo((): GameState => {
    const board = createEmptyBoard();
    let ships: Ship[] = [];

    try {
      const shipValidation = validateShipLayout(gameData.layout);

      if (!shipValidation || !shipValidation.isValid) {
        console.error(
          "Ship layout validation failed:",
          shipValidation?.errors || ["Unknown validation error"]
        );
        ships = [];
      } else {
        ships = initializeShips(gameData.layout);
      }
    } catch (error) {
      console.error("Error during ship initialization:", error);
      ships = [];
    }

    return {
      board,
      ships,
      gameStatus: "playing",
      totalShots: 0,
      hits: 0,
    };
  }, []);

  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [lastAction, setLastAction] = useState<string>("");

  // Handle cell attacks
  const handleAttack = useCallback((row: number, col: number) => {
    const attackResult = attackCell(row, col, gameState);

    switch (attackResult.result) {
      case "game_over":
      case "duplicate":
      case "out_of_bounds":
        setLastAction(attackResult.message);
        return;

      case "hit":
      case "miss":
        setGameState(attackResult.gameState);
        setLastAction(attackResult.message);
        break;

      default:
        setLastAction("An unexpected error occurred. Please try again.");
        return;
    }
  }, [gameState]);

  // Restart the game
  const handleRestart = useCallback(() => {
    setGameState(initialGameState);
    setLastAction("");
  }, [initialGameState]);

  // Computed values
  const isGameWon = useMemo(() => gameState.gameStatus === "won", [gameState.gameStatus]);
  
  const gameStats = useMemo(() => ({
    totalShots: gameState.totalShots,
    hits: gameState.hits,
    misses: gameState.totalShots - gameState.hits,
    accuracy: gameState.totalShots > 0 ? Math.round((gameState.hits / gameState.totalShots) * 100) : 0,
    shipsRemaining: gameState.ships.filter(ship => !ship.isSunk).length,
    shipsSunk: gameState.ships.filter(ship => ship.isSunk).length,
  }), [gameState.totalShots, gameState.hits, gameState.ships]);

  return {
    gameState,
    lastAction,
    isGameWon,
    gameStats,
    handleAttack,
    handleRestart,
  };
};