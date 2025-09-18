import React from "react";
import styled from "styled-components";
import GameGrid from "./GameGrid";
import GameStatus from "./GameStatus";
import { useGameState } from "../hooks/useGameState";

const GameBoard: React.FC = () => {
  const {
    gameState,
    lastAction,
    isGameWon,
    handleAttack,
    handleRestart,
  } = useGameState();

  return (
    <GameBoardContainer>
      <GameTitle>Battleship Game</GameTitle>

      <GameStatus
        gameState={gameState}
        lastAction={lastAction}
        onRestart={handleRestart}
      />

      <GameGrid
        board={gameState.board}
        onCellClick={handleAttack}
        disabled={isGameWon}
      />
    </GameBoardContainer>
  );
};

export default GameBoard;

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
