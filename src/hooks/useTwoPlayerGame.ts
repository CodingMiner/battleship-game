import { useState, useCallback, useMemo } from 'react';
import type { 
  TwoPlayerGameState, 
  ShipOrientation,
  PlacementValidation,
  AIState,
  AIDifficulty
} from '../types/twoPlayerGame';
import type { Position } from '../types';
import { SHIP_TYPES } from '../types';
import { 
  initializeTwoPlayerGame,
  createShipTemplate,
  canPlaceShip,
  placeShip,
  removeShipFromBoard,
  allShipsPlaced,
  placeComputerShips,
  autoPlaceRemainingShips,
  rotateShip,
  initializeAI,
  attackPosition,
  makeComputerAttack
} from '../utils/twoPlayerGameLogic';
import { createEmptyBoard } from '../utils/gameLogic';

export const useTwoPlayerGame = (initialDifficulty: AIDifficulty = 'medium') => {
  const [gameState, setGameState] = useState<TwoPlayerGameState>(() => {
    const initialState = initializeTwoPlayerGame();
    
    // Initialize player ships (unplaced templates)
    const playerShips = Object.entries(SHIP_TYPES).map(([name, config]) =>
      createShipTemplate(name, config.size)
    );
    
    // Initialize computer ships (will be placed automatically)
    const computerShips = Object.entries(SHIP_TYPES).map(([name, config]) =>
      createShipTemplate(name, config.size)
    );

    return {
      ...initialState,
      playerBoard: {
        ...initialState.playerBoard,
        ships: playerShips
      },
      computerBoard: {
        ...initialState.computerBoard,
        ships: placeComputerShips(computerShips)
      }
    };
  });

  const [aiState, setAiState] = useState<AIState>(initializeAI(initialDifficulty));
  const [difficulty, setDifficulty] = useState<AIDifficulty>(initialDifficulty);
  const [battleMessage, setBattleMessage] = useState<string>("");

  // Place a ship for the player
  const placePlayerShip = useCallback((
    shipName: string,
    startPos: Position,
    orientation: ShipOrientation
  ): PlacementValidation => {
    const ship = gameState.playerBoard.ships.find(s => s.name === shipName);
    if (!ship) {
      return { isValid: false, canPlace: false, errorMessage: "Ship not found" };
    }

    const validation = canPlaceShip(
      createEmptyBoard(),
      gameState.playerBoard.ships,
      startPos,
      ship.size,
      orientation
    );

    if (validation.canPlace) {
      setGameState(prev => ({
        ...prev,
        playerBoard: {
          ...prev.playerBoard,
          ships: placeShip(prev.playerBoard.ships, shipName, startPos, orientation)
        }
      }));
    }

    return validation;
  }, [gameState.playerBoard.ships]);

  // Remove a ship from the board (for repositioning)
  const removePlayerShip = useCallback((shipName: string) => {
    setGameState(prev => ({
      ...prev,
      playerBoard: {
        ...prev.playerBoard,
        ships: removeShipFromBoard(prev.playerBoard.ships, shipName)
      }
    }));
  }, []);

  // Auto-place remaining ships
  const autoPlaceShips = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      playerBoard: {
        ...prev.playerBoard,
        ships: autoPlaceRemainingShips(prev.playerBoard.ships)
      }
    }));
  }, []);

  // Update AI difficulty
  const updateDifficulty = useCallback((newDifficulty: AIDifficulty) => {
    setDifficulty(newDifficulty);
    setAiState(initializeAI(newDifficulty));
  }, []);

  // Rotate a placed ship
  const rotatePlayerShip = useCallback((shipName: string) => {
    setGameState(prev => ({
      ...prev,
      playerBoard: {
        ...prev.playerBoard,
        ships: rotateShip(prev.playerBoard.ships, shipName)
      }
    }));
  }, []);

  // Start the battle phase
  const startBattle = useCallback(() => {
    if (allShipsPlaced(gameState.playerBoard.ships)) {
      setGameState(prev => ({
        ...prev,
        phase: "battle",
        currentTurn: "player"
      }));
      setBattleMessage("Your turn! Click on the enemy grid to attack.");
    }
  }, [gameState.playerBoard.ships]);

  // Player attacks computer
  const attackComputer = useCallback((position: Position) => {
    if (gameState.phase !== "battle" || gameState.currentTurn !== "player") {
      return;
    }

    const result = attackPosition(
      position, 
      gameState.computerBoard, 
      gameState.playerAttacks
    );

    // Update game state with attack result
    setGameState(prev => ({
      ...prev,
      playerAttacks: [...gameState.playerAttacks],
      computerBoard: { ...gameState.computerBoard },
      totalShots: { 
        ...prev.totalShots, 
        player: prev.totalShots.player + 1 
      },
      hits: { 
        ...prev.hits, 
        player: result.hit ? prev.hits.player + 1 : prev.hits.player
      }
    }));

    if (result.gameWon) {
      setGameState(prev => ({
        ...prev,
        phase: "gameOver",
        winner: "player"
      }));
      setBattleMessage("🎉 Victory! You sank all enemy ships!");
      return;
    }

    setBattleMessage(result.message);

    // If missed, switch to computer turn
    if (!result.hit) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentTurn: "computer"
        }));
        setBattleMessage("Computer's turn...");
        executeComputerTurn();
      }, 1500);
    }
  }, [gameState]);

  // Computer attacks player
  const executeComputerTurn = useCallback(() => {
    if (gameState.phase !== "battle") {
      return;
    }

    setTimeout(() => {
      const { position, result, newAIState } = makeComputerAttack(
        gameState.playerBoard,
        gameState.computerAttacks,
        aiState
      );

      setAiState(newAIState);

      // Update game state with computer attack
      setGameState(prev => ({
        ...prev,
        computerAttacks: [...gameState.computerAttacks],
        playerBoard: { ...gameState.playerBoard },
        totalShots: { 
          ...prev.totalShots, 
          computer: prev.totalShots.computer + 1 
        },
        hits: { 
          ...prev.hits, 
          computer: result.hit ? prev.hits.computer + 1 : prev.hits.computer
        }
      }));

      if (result.gameWon) {
        setGameState(prev => ({
          ...prev,
          phase: "gameOver",
          winner: "computer"
        }));
        setBattleMessage("💥 Defeat! The computer sank all your ships!");
        return;
      }

      const computerMessage = `Computer ${result.message.toLowerCase()} at ${String.fromCharCode(65 + position.col)}${position.row + 1}`;
      setBattleMessage(computerMessage);

      // If computer missed, switch back to player
      if (!result.hit) {
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            currentTurn: "player"
          }));
          setBattleMessage("Your turn! Click on the enemy grid to attack.");
        }, 2000);
      } else {
        // Computer continues if hit
        setTimeout(() => {
          executeComputerTurn();
        }, 1500);
      }
    }, 1000);
  }, [gameState, aiState]);

  // Reset the game
  const resetGame = useCallback(() => {
    const initialState = initializeTwoPlayerGame();
    
    // Initialize player ships (unplaced templates)
    const playerShips = Object.entries(SHIP_TYPES).map(([name, config]) =>
      createShipTemplate(name, config.size)
    );
    
    // Initialize computer ships (placed automatically)
    const computerShips = Object.entries(SHIP_TYPES).map(([name, config]) =>
      createShipTemplate(name, config.size)
    );

    setGameState({
      ...initialState,
      playerBoard: {
        ...initialState.playerBoard,
        ships: playerShips
      },
      computerBoard: {
        ...initialState.computerBoard,
        ships: placeComputerShips(computerShips)
      }
    });
    
    setAiState(initializeAI(difficulty));
  }, []);

  // Computed values
  const canStartBattle = useMemo(() => 
    allShipsPlaced(gameState.playerBoard.ships), 
    [gameState.playerBoard.ships]
  );

  const placedShips = useMemo(() => 
    gameState.playerBoard.ships.filter(ship => ship.isPlaced),
    [gameState.playerBoard.ships]
  );

  const unplacedShips = useMemo(() => 
    gameState.playerBoard.ships.filter(ship => !ship.isPlaced),
    [gameState.playerBoard.ships]
  );

  const gamePhase = gameState.phase;
  const currentTurn = gameState.currentTurn;

  return {
    gameState,
    gamePhase,
    currentTurn,
    canStartBattle,
    placedShips,
    unplacedShips,
    battleMessage,
    difficulty,
    
    // Actions
    placePlayerShip,
    removePlayerShip,
    autoPlaceShips,
    rotatePlayerShip,
    updateDifficulty,
    startBattle,
    attackComputer,
    resetGame,
  };
};