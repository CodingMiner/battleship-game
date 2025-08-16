import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import GameGrid from "./GameGrid";
import GameStatus from "./GameStatus";
import { gameData } from "../data/shipLayout";
import {
  createEmptyBoard,
  initializeShips,
  attackCell,
  validateShipLayout,
} from "../utils/gameLogic";
import type { GameState, Ship } from "../types";

const GameBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;

  padding: ${({ theme }) => theme.spacing.sm};
  gap: ${({ theme }) => theme.spacing.md};

  background-color: ${({ theme }) => theme.colors.background};

  overflow-x: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    padding: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.xl};
    justify-content: center;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: ${({ theme }) => theme.spacing.xl};
    gap: ${({ theme }) => theme.spacing.xxl};
  }

  @media (max-height: 600px) and (orientation: landscape) {
    padding: ${({ theme }) => theme.spacing.xs};
    gap: ${({ theme }) => theme.spacing.sm};
    justify-content: center;

    & > * {
      margin-bottom: ${({ theme }) => theme.spacing.xs};
    }
  }
`;

const GameTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin: 0;
  font-weight: bold;

  font-size: ${({ theme }) => theme.typography.mobile.title};
  line-height: 1.2;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    font-size: ${({ theme }) => theme.typography.tablet.title};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.title};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.title};
  }

  @media (max-height: 600px) and (orientation: landscape) {
    font-size: ${({ theme }) => theme.typography.mobile.subtitle};
  }
`;

const GameBoard: React.FC = () => {
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

  const handleCellClick = useCallback(
    (row: number, col: number) => {
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
    },
    [gameState]
  );

  const isGameDisabled = useMemo(() => {
    return gameState.gameStatus === "won";
  }, [gameState.gameStatus]);

  return (
    <GameBoardContainer>
      <GameTitle>Battleship Game</GameTitle>

      <GameStatus gameState={gameState} lastAction={lastAction} />

      <GameGrid
        board={gameState.board}
        onCellClick={handleCellClick}
        disabled={isGameDisabled}
      />
    </GameBoardContainer>
  );
};

export default GameBoard;
